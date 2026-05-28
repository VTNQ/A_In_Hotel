import type { BlogEditProps } from "@/type/blog.types";
import { useAlert } from "../alert-context";
import { useEffect, useState } from "react";
import QuillEditor from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useTranslation } from "react-i18next";
import { findById, updateBlog } from "@/service/api/Blog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { SelectField } from "../ui/select";
import UploadField from "../ui/UploadField";
import { Button } from "../ui/button";
import { File_URL } from "@/setting/constant/app";
import z, { string } from "zod";
import { createImageBlogSchema } from "@/validation/image.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const EditBlog: React.FC<BlogEditProps> = ({
  open,
  blogId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();

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

  const [defaultPreview, setDefaultPreview] = useState<string>(
    "/placeholder-image.png",
  );

  const [fetching, setFetching] = useState(false);

  const blogSchema = z
    .object({
      id: z.string().optional(),
      title: z.string().min(1, t("blog.validate.titleRequired")),
      category: z.string().min(1, t("blog.validate.categoryRequired")),
      description: z.string().optional(),
      content: z.string().optional(),
      status: z.string(),
      image: z.any().optional(),
    })
    .superRefine((data, ctx) => {
      if (defaultPreview) return;

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
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting, isValid },
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

  useEffect(() => {
    if (!open || !blogId) return;

    const fetchData = async () => {
      setFetching(true);

      try {
        const response = await findById(blogId);
        const b = response?.data?.data;

        reset({
          title: b.title || "",
          category: b.categoryId ? String(b.categoryId) : "",
          description: b.description || "",
          content: b.content || "",
          status: b.status ? String(b.status) : "",
          image: null,
        });

        setDefaultPreview(File_URL + b?.image?.url);
      } catch (err: any) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [open, blogId]);

  const handleBannerImage = (files: File[] | null) => {
    const file = files?.[0] ?? null;

    setValue("image", file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (file) {
      setDefaultPreview(URL.createObjectURL(file));
    }
  };

  const onSubmitForm = async (data: FormData) => {
    try {
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

      const response = await updateBlog(blogId ?? 0, cleanedData);

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

      onSubmit();
      onClose();
    } catch (err: any) {
      showAlert({
        title: t("blog.createOrUpdate.updateError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    }
  };

  const handleClose = () => {
    reset({
      title: "",
      category: "",
      description: "",
      content: "",
      status: "",
      image: null,
    });

    onClose();
  };

  if (!open || !blogId) return <></>;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="
          w-[95vw]
          sm:max-w-4xl
          max-h-[90vh]
          p-0
          rounded-2xl
          overflow-hidden
          bg-white
          dark:bg-neutral-950
          border
          border-slate-200
          dark:border-neutral-800
        "
      >
        {/* HEADER */}
        <DialogHeader
          className="
            px-6
            py-4
            border-b
            border-slate-200
            dark:border-neutral-800
            bg-slate-50
            dark:bg-neutral-900
          "
        >
          <DialogTitle
            className="
              text-lg
              font-semibold
              text-slate-900
              dark:text-slate-100
            "
          >
            {t("blog.createOrUpdate.titleEdit")}
          </DialogTitle>
        </DialogHeader>

        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="
                w-8
                h-8
                border-4
                border-slate-200
                dark:border-neutral-700
                border-t-slate-600
                dark:border-t-slate-300
                rounded-full
                animate-spin
              "
            />
          </div>
        ) : (
          <>
            {/* BODY */}
            <div
              className="
                px-6
                py-6
                overflow-y-auto
                max-h-[70vh]
                space-y-6
                bg-white
                dark:bg-neutral-950
              "
            >
              {/* TOP GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TITLE */}
                <div className="space-y-2">
                  <label
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    {t("blog.name")} *
                  </label>

                  <Input
                    name="title"
                    value={watch("title")}
                    onChange={(e) => {
                      setValue("title", e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });

                      trigger("title");
                    }}
                    className="
                      h-11
                      bg-white
                      dark:bg-neutral-900
                      border-slate-200
                      dark:border-neutral-800
                      text-slate-900
                      dark:text-slate-100
                    "
                  />

                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* STATUS */}
                <div className="space-y-2">
                  <SelectField
                    label={t("common.status")}
                    items={[
                      { value: "1", label: t("blog.draft") },
                      { value: "2", label: t("blog.published") },
                    ]}
                    value={watch("status")}
                    onChange={(v) => {
                      setValue("status", string().parse(v), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });

                      trigger("status");
                    }}
                    isRequired
                    getValue={(i) => String(i.value)}
                    getLabel={(i) => i.label}
                  />
                </div>

                {/* CATEGORY */}
                <div className="md:col-span-2 space-y-2">
                  <SelectField
                    label={t("blog.category")}
                    items={categories}
                    value={watch("category")}
                    onChange={(v) => {
                      setValue("category", String(v), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });

                      trigger("category");
                    }}
                    isRequired
                    getValue={(i) => String(i.id)}
                    getLabel={(i) => i.name}
                  />

                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label
                  className="
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  {t("blog.description")}
                </label>

                <div
                  className="
                    border
                    rounded-lg
                    overflow-hidden
                    bg-white
                    dark:bg-neutral-900
                    border-slate-200
                    dark:border-neutral-800
                  "
                >
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
                    className="
                      min-h-[180px]
                      dark:text-slate-100
                    "
                  />
                </div>
              </div>

              {/* CONTENT */}
              <div className="space-y-2">
                <label
                  className="
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  {t("blog.content")}
                </label>

                <div
                  className="
                    border
                    rounded-lg
                    overflow-hidden
                    bg-white
                    dark:bg-neutral-900
                    border-slate-200
                    dark:border-neutral-800
                  "
                >
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
                    className="
                      min-h-[250px]
                      dark:text-slate-100
                      dark:border-neutral-800
                    "
                  />
                </div>
              </div>

              {/* IMAGE */}
              <div className="space-y-2">
                <label
                  className="
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  {t("banner.thumbnail")}
                </label>

                <UploadField
                  className="w-full"
                  defaultPreviewUrl={defaultPreview}
                  onChange={handleBannerImage}
                />
              </div>
            </div>

            {/* FOOTER */}
            <DialogFooter
              className="
                px-6
                py-4
                border-t
                border-slate-200
                dark:border-neutral-800
                bg-slate-50
                dark:bg-neutral-900
                flex
                justify-end
                gap-3
              "
            >
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="
                  border-slate-200
                  dark:border-neutral-800
                  dark:bg-neutral-950
                  dark:text-slate-200
                  dark:hover:bg-neutral-900
                "
              >
                {t("common.cancel")}
              </Button>

              <Button
                onClick={handleSubmit(onSubmitForm)}
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? t("common.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBlog;