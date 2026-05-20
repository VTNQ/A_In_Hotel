import { useEffect, useState } from "react";
import { useAlert } from "../alert-context";
import { findById, updateBlog } from "../../service/api/Blog";
import { File_URL } from "../../setting/constant/app";
import CommonModal from "../ui/CommonModal";
import QuillEditor from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useTranslation } from "react-i18next";
import type { BlogForm, UpdateBlogFormModalProps } from "../../type/blog.types";
import z from "zod";
import { createImageBlogSchema } from "../../validation/image.validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const BlogEditFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  blogId,
}: UpdateBlogFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const blogSchema = z
    .object({
      id: z.string().optional(),
      title: z.string().min(1, t("blog.validate.titleRequired")),
      category: z.string().min(1, t("blog.validate.categoryRequired")),
      description: z.string().optional(),
      content: z
        .string()
        .refine((val) => val.replace(/<(.|\n)*?>/g, "").trim().length > 0, {
          message: t("blog.validate.contentRequired"),
        }),
      status: z.string(),
      image: z.any().optional(),
    })
    .superRefine((data, ctx) => {
      // nếu đã có preview (ảnh cũ từ backend) thì bỏ validate image
      if (preview) return;

      const imageValidation = createImageBlogSchema(t).safeParse(data.image);

      if (!imageValidation.success) {
        imageValidation.error.issues.forEach((issue) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["image"],
            message: issue.message,
          });
        });
      }
    });
  type FormData = z.infer<typeof blogSchema>;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(blogSchema),
    mode: "onChange",
    defaultValues: {
      id: "",
      title: "",
      category: "",
      description: "",
      content: "",
      status: "2",
      image: null,
    },
  });

  const { showAlert } = useAlert();
  const categories = [
    { id: "1", name: t("blog.blogCategories.newsUpdates") },
    { id: "2", name: t("blog.blogCategories.offersPromotions") },
    { id: "3", name: t("blog.blogCategories.travelGuides") },
    { id: "4", name: t("blog.blogCategories.localFood") },
    { id: "5", name: t("blog.blogCategories.bookingTips") },
    { id: "6", name: t("blog.blogCategories.hotelServices") },
    { id: "7", name: t("blog.blogCategories.eventsActivities") },
    { id: "8", name: t("blog.blogCategories.nearbyAttractions") },
    { id: "9", name: t("blog.blogCategories.travelTips") },
    { id: "10", name: t("blog.blogCategories.guestExperiences") },
  ];
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!isOpen || !blogId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await findById(blogId);
        const data = res?.data?.data;
        reset({
          id: data.id?.toString() || "",
          title: data.title || "",
          category: data.categoryId?.toString() || "",
          description: data.description || "",
          content: data.content || "",
          status: data.status?.toString() || "",
          image: null,
        });
        setPreview(File_URL + data.image?.url || null);
      } catch (error) {
        showAlert({
          title: t("blog.loadError"),
          type: "error",
        });
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen, blogId]);

  const fullToolbar = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],

      [{ header: 1 }, { header: 2 }],
      [{ font: [] }],
      [{ size: [] }],

      [{ color: [] }, { background: [] }],

      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],

      ["link", "image"],

      ["blockquote", "code-block"],

      [{ indent: "-1" }, { indent: "+1" }],

      ["clean"],
    ],
  };
  const fullToolbarDescription = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],

      [{ header: 1 }, { header: 2 }],
      [{ font: [] }],
      [{ size: [] }],

      [{ color: [] }, { background: [] }],

      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],

      ["blockquote", "code-block"],

      [{ indent: "-1" }, { indent: "+1" }],

      ["clean"],
    ],
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValue("image", file, {
      shouldValidate: true,
    });
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleCancel = () => {
    reset();
    setPreview(null);
    onClose();
  };
  const handleSave = async (data: FormData) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries({
          title: data.title,
          category: data.category?.toString(),
          description: data.description,
          content: data.content,
          status: data.status,
          image: data.image,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ]),
      ) as BlogForm;
      await updateBlog(Number(data.id), cleanedData);
      const message = t("blog.createOrUpdate.updateSucess");
      showAlert({
        title: message,
        type: "success",
        autoClose: 3000,
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Update error:", err);
      showAlert({
        title:
          err?.response?.data?.message || t("blog.createOrUpdate.updateError"),
        type: "error",
        autoClose: 4000,
      });
    }
  };
  if (isOpen && loading) {
    return (
      <CommonModal
        isOpen={true}
        onClose={handleCancel}
        title={t("blog.createOrUpdate.titleEdit")}
        saveLabel={t("common.saveButton")}
        cancelLabel={t("common.cancelButton")}
      >
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-[#2E3A8C] border-t-transparent rounded-full" />
        </div>
      </CommonModal>
    );
  }

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleCancel}
      onSave={handleSubmit(handleSave)}
      title={t("blog.createOrUpdate.titleEdit")}
      saveLabel={isSubmitting ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      diabled={!isValid || isSubmitting}
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("blog.name")} *
          </label>
          <input
            type="text"
            placeholder={t("blog.createOrUpdate.enterTitle")}
            {...register("title")}
            className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("blog.category")} *
          </label>
          <select
            {...register("category")}
            className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
          >
            <option value="">{t("blog.createOrUpdate.selectCategory")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
        <div>
          <label className="font-medium">{t("common.status")}*</label>
          <select
            {...register("status")}
            className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
          >
            <option value="1">{t("blog.draft")}</option>
            <option value="2">{t("blog.published")}</option>
            <option value="3">{t("blog.archived")}</option>
          </select>
        </div>
        <div>
          <label className="font-medium">{t("blog.description")}</label>
          <QuillEditor
            theme="snow"
            value={watch("description")}
            onChange={(value) => {
              setValue("description", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            onBlur={() => {
              trigger("description");
            }}
            modules={fullToolbarDescription}
          />
        </div>

        <div>
          <label className="font-medium">{t("blog.content")}</label>
          <QuillEditor
            theme="snow"
            value={watch("content")}
            onChange={(value) => {
              setValue("content", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            modules={fullToolbar}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#253150]">
            {t("blog.thumbnail")} *
          </label>

          <div
            className="border-2 border-dashed border-[#AFC0E2] hover:border-[#4B62A0] transition 
                        rounded-xl bg-[#F6F8FC] cursor-pointer flex flex-col items-center justify-center py-10 text-center"
            onClick={() => document.getElementById("thumbnailInput")?.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg shadow"
              />
            ) : (
              <>
                <div className="text-gray-400 flex flex-col items-center">
                  <img
                    src="/defaultImage.png"
                    className="w-[167px] h-[117px] opacity-60"
                    alt=""
                  />
                  <p className="text-gray-500 text-sm">
                    {t("blog.createOrUpdate.clickSelectImages")}
                  </p>
                </div>
              </>
            )}
          </div>

          <input
            id="thumbnailInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>
    </CommonModal>
  );
};
export default BlogEditFormModal;
