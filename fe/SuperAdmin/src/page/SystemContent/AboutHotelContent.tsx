import { useAlert } from "@/components/alert-context";
import {
  getSystemContentByKey,
  updateSystemContent,
} from "@/service/api/SystemContent";
import { File_URL } from "@/setting/constant/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

const AboutHotelContent = () => {
  const { t } = useTranslation();

  const aboutHotelSchema = z.object({
    id: z.string().optional(),
    title: z
      .string()
      .trim()
      .min(1, t("systemContent.aboutHotel.validate.titleRequired"))
      .min(3, t("systemContent.aboutHotel.validate.titleMinLength"))
      .max(150, t("systemContent.aboutHotel.validate.titleMaxLength")),

    description: z
      .string()
      .trim()
      .min(1, t("systemContent.aboutHotel.validate.descriptionRequired"))
      .min(10, t("systemContent.aboutHotel.validate.descriptionMinLength"))
      .max(2000, t("systemContent.aboutHotel.validate.descriptionMaxLength")),

    ctaText: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || val.length <= 100, {
        message: t("systemContent.aboutHotel.validate.ctaMaxLength"),
      }),

    image: z
      .any()
      .optional()
      .refine((file) => !file || file instanceof File, {
        message: t("systemContent.aboutHotel.validate.imageInvalid"),
      })
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        message: t("systemContent.aboutHotel.validate.imageTooLarge"),
      })
      .refine(
        (file) =>
          !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
        {
          message: t("systemContent.aboutHotel.validate.imageInvalidType"),
        },
      ),
  });
  type AboutHotelContentForm = z.infer<typeof aboutHotelSchema>;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<AboutHotelContentForm>({
    resolver: zodResolver(aboutHotelSchema),
    mode: "onBlur",
    defaultValues: {
      id: "",
      title: "",
      description: "",
      ctaText: "",
      image: null,
    },
  });
  const [preview, setPreview] = useState<string>("");
  const { showAlert } = useAlert();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSystemContentByKey(1);
        const data = response.data.data;

        reset({
          id: String(data.id),
          description: data.description || "",
          ctaText: data.ctaText || "",
          title: data.title || "",
          image: null,
        });

        setPreview(
          data.backgroundImage?.url ? File_URL + data.backgroundImage.url : "",
        );
      } catch (err: any) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    setValue("image", file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  const onSubmit = async (data: AboutHotelContentForm) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        ctaText: data.ctaText,
        image: data.image,
      };
      const response = await updateSystemContent(Number(data.id), payload);
      const message =
        response?.data?.message || t("systemContent.aboutHotel.form.success");
      showAlert({
        title: message,
        type: "success",
        autoClose: 3000,
      });
    } catch (err: any) {
      console.error("Update error:", err);
      showAlert({
        title:
          err?.response?.data?.message ||
          t("systemContent.aboutHotel.form.error"),
        type: "error",
        autoClose: 4000,
      });
    }
  };
  console.log(errors)
  return (
    <div className="p-6 bg-gray-50 dark:bg-neutral-950 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100">
          {t("systemContent.aboutHotel.title")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t("systemContent.breadcrumb.systemManagement")} /{" "}
          {t("systemContent.breadcrumb.systemContent")} /{" "}
          <span className="text-blue-600 dark:text-blue-400">
            {t("systemContent.aboutHotel.title")}
          </span>
        </p>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border dark:border-neutral-800">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-neutral-800">
          <h2 className="font-medium text-gray-900 dark:text-neutral-100">
            {t("systemContent.aboutHotel.editTitle")}
          </h2>
          <span className="text-xs text-gray-400">
            {t("systemContent.lastUpdated")}
          </span>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              {t("systemContent.aboutHotel.form.title")}{" "}
              <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                T
              </span>
              <input
                type="text"
                {...register("title")}
                placeholder={t(
                  "systemContent.aboutHotel.form.titlePlaceholder",
                )}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-md text-sm
                 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-1">
              {t("systemContent.aboutHotel.form.titleHint")}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              {t("systemContent.aboutHotel.form.description")}{" "}
              <span className="text-red-500">*</span>
            </label>

            <textarea
              {...register("description")}
              rows={8}
              placeholder={t(
                "systemContent.aboutHotel.form.descriptionPlaceholder",
              )}
              className="w-full border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-md p-3 text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {t("systemContent.aboutHotel.form.descriptionHint")}
            </p>
          </div>

          {/* CTA + Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CTA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                {t("systemContent.aboutHotel.form.cta")}
              </label>
              <input
                type="text"
                {...register("ctaText")}
                placeholder={t("systemContent.aboutHotel.form.ctaPlaceholder")}
                className="w-full border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.ctaText && (
                <p className="text-red-500 text-sm">{errors.ctaText.message}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {t("systemContent.aboutHotel.form.ctaHint")}
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                {t("systemContent.aboutHotel.form.image")}
              </label>

              <div className="flex gap-4 items-start">
                {/* Preview Image */}
                {preview && (
                  <div className="w-[140px] h-[140px] rounded-md overflow-hidden border dark:border-neutral-700">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Upload Box */}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-md h-[140px] w-full cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 dark:bg-neutral-800/50 transition">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/gif"
                    onChange={handleImageChange}
                  />
                  <span className="text-blue-600 text-sm">
                    {t("systemContent.upload")}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {t("systemContent.uploadHint")}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-neutral-800">
            <button className="px-4 py-2 rounded-md border dark:border-neutral-700 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
              {t("common.cancel")}
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !isValid}
              className={`
    px-4 py-2 rounded-md text-white transition
    ${
      isSubmitting || !isValid
        ? "bg-gray-400 cursor-not-allowed opacity-70"
        : "bg-blue-600 hover:bg-blue-700"
    }
  `}
            >
              {isSubmitting ? t("common.saving") : t("common.saveChanges")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHotelContent;
