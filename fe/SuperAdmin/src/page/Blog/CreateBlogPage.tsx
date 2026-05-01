import Breadcrumb from "@/components/Breadcrumb";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import QuillEditor from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import UploadField from "@/components/ui/UploadField";
import { useAlert } from "@/components/alert-context";
import { createBlog } from "@/service/api/Blog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { createImageBlogSchema } from "@/validation/image.validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateBlogPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const blogSchema = z.object({
    title: z.string().min(1, t("blog.validate.titleRequired")),
    category: z.string().min(1, t("blog.validate.categoryRequired")),
    description: z.string().optional(),
    content: z
      .string()
      .optional()
      ,
    status: z.string(),
    image: createImageBlogSchema(t),
  });
  type FormData = z.infer<typeof blogSchema>;
  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(blogSchema),
    mode: "all",
    defaultValues: {
      title: "",
      category: "",
      description: "",
      content: "",
      status: "2",
      image: null,
    },
  });

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
  const { showAlert } = useAlert();
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
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      const cleanedData = Object.fromEntries(
        Object.entries({
          title: data.title,
          category: data.category,
          description: data.description,
          content: data.content,
          status: data.status,
          image: data.image,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ]),
      );
      const response = await createBlog(cleanedData);
      showAlert({
        title: response?.data?.message,
        type: "success",
        autoClose: 4000,
      });
      reset({
        title: "",
        category: "",
        description: "",
        content: "",
        status: "",
        image: null,
      });
    } catch (err: any) {
      showAlert({
        title: t("blog.createOrUpdate.createError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("blog.createOrUpdate.titleCreate")}
        </h1>
        <Breadcrumb
          items={[
            { label: t("common.home"), href: "/Home" },
            { label: t("sidebar.blog"), href: "/Home/banner" },
            { label: t("blog.createOrUpdate.titleCreate") },
          ]}
        />
      </div>
      <div className="rounded-xl border bg-white p-6 space-y-6">
        <div>
          <label className="text-sm font-medium">
            {t("blog.name")} <span className="text-red-500">*</span>
          </label>
          <Input
            name="title"
            placeholder={t("blog.createOrUpdate.enterTitle")}
            onChange={(e)=>{
              setValue("title", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              trigger("title");
            }}
            value={watch("title")}
            className="mt-1"
          />
           {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("blog.category")} <span className="text-red-500">*</span>
          </label>
          <SelectField
            items={categories}
            value={watch("category")}
            onChange={(v) => {
              setValue("category", String(v), {
                shouldValidate: true,
                shouldDirty: true,
              });
              trigger("category");
            }}
            isRequired={true}
            placeholder={t("blog.createOrUpdate.selectCategory")}
            getValue={(i) => String(i.id)}
            getLabel={(i) => i.name}
          />
           {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("common.status")}
            <span className="text-red-500">*</span>
          </label>
          <SelectField
            items={[
              { value: "1", label: t("blog.draft") },
              { value: "2", label: t("blog.published") },
            ]}
            value={watch("status")}
            placeholder={t("blog.createOrUpdate.selectStatus")}
            onChange={(v) =>{
              setValue("status", String(v), {
                shouldValidate: true,
                shouldDirty: true,
              });
              trigger("status");
            }}
            isRequired={true}
            getValue={(i) => String(i.value)}
            getLabel={(i) => i.label}
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("blog.description")}</label>
          <QuillEditor
            theme="snow"
            value={watch("description")}
            onChange={(v) => {
              setValue("description", v, {
                shouldValidate: true,
                shouldDirty: true,
              });
              trigger("description");
            }}
            modules={fullToolbar}
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("blog.content")}</label>
          <QuillEditor
            theme="snow"
            value={watch("content")}
            onChange={(v) => {
              setValue("content", v, {
                shouldValidate: true,
                shouldDirty: true,
              });
              trigger("content");
            }}
            modules={fullToolbar}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">{t("blog.thumbnail")}</label>
          <UploadField
            className="w-full mt-2"
            value={watch("image")}
            onChange={(files) =>{
              setValue("image", files?.[0] ?? null, {
                shouldValidate: true,
                shouldDirty: true,
              });
              trigger("image");
            }
            }
          />
        </div>
        {errors.image && (
            <p className="text-red-500 text-sm mt-1">{String(errors.image.message)}</p>
        )}
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => navigate("/Home/post/blog")}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || !isValid}
            className="min-w-[140px]"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                {t("common.saving")}
              </span>
            ) : (
              t("common.save")
            )}
          </Button>
        </div>
      </div>
         
    </div>
  );
};
export default CreateBlogPage;
