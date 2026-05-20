import { useEffect, useState } from "react";
import { File_URL } from "../../setting/constant/app";
import { useAlert } from "../alert-context";
import DateTimePicker from "../ui/DateTimePicker";
import CommonModal from "../ui/CommonModal";
import QuillEditor from "react-quill-new";
import { findById, updateBanner } from "../../service/api/Banner";
import { useTranslation } from "react-i18next";
import type { BannerEditFormModalProps, BannerFormModalProp } from "../../type/banner.types";
import z from "zod";
import { createImageBannerSchema } from "../../validation/image.validation";
import { useForm } from "react-hook-form";

const BannerEditFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  bannerId,
}: BannerEditFormModalProps) => {
  const { t } = useTranslation();
  const bannerSchema = z
    .object({
      id: z.string(),
      name: z.string().min(1, t("banner.validate.nameRequired")),

      startDate: z.date({
        error: t("banner.validate.startDateRequired"),
      }),

      endDate: z.date({
        error: t("banner.validate.endDateRequired"),
      }),

      ctaLabel: z.string().optional(),
      description: z.string().optional(),
      bannerImage: z.any().optional(),
    })
    .superRefine((data, ctx) => {
      // nếu đã có preview (ảnh cũ từ backend) thì bỏ validate image
      if (preview) return;

      const imageValidation = createImageBannerSchema(t).safeParse(
        data.bannerImage,
      );

      if (!imageValidation.success) {
        imageValidation.error.issues.forEach((issue) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["bannerImage"],
            message: issue.message,
          });
        });
      }
    });
  type BannerForm = z.infer<typeof bannerSchema>;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<BannerForm>({
    mode: "onChange",
    defaultValues: {
      id: "",
      name: "",
      startDate: undefined,
      endDate: undefined,
      ctaLabel: "",
      description: "",
      bannerImage: null,
    },
  });
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!isOpen || !bannerId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await findById(bannerId);
        const data = res?.data?.data;
        reset({
          id: String(data.id) || "",
          name: data.name || "",
          startDate: data.startAt ? new Date(data.startAt) : undefined,
          endDate: data.endAt ? new Date(data.endAt) : undefined,
          ctaLabel: data.ctaLabel || "",
          description: data.description || "",
          bannerImage: null,
        });
        setPreview(data?.image?.url ? File_URL + data.image.url : null);
      } catch (err) {
        showAlert({
          title: t("banner.loadError"),
          type: "error",
        });
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen, bannerId]);

  const toOffsetDateTime = (date?: Date | null) => {
    if (!date) return null;

    const tzOffset = -date.getTimezoneOffset(); // phút
    const sign = tzOffset >= 0 ? "+" : "-";
    const pad = (n: number) => String(Math.abs(n)).padStart(2, "0");

    const hours = pad(Math.floor(Math.abs(tzOffset) / 60));
    const minutes = pad(Math.abs(tzOffset) % 60);

    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":00" +
      sign +
      hours +
      ":" +
      minutes
    );
  };

  const handleSave = async (data: BannerForm) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries({
          name: data.name,

          startAt:
            data.startDate instanceof Date
              ? toOffsetDateTime(data.startDate)
              : null,
          endAt:
            data.endDate instanceof Date
              ? toOffsetDateTime(data.endDate)
              : null,
          ctaLabel: data.ctaLabel,
          description: data.description,
          image: data.bannerImage,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ]),
      ) as BannerFormModalProp;
      await updateBanner(Number(data.id), cleanedData);
      showAlert({
        title: t("banner.createOrUpdate.updateSucess"),
        type: "success",
        autoClose: 3000,
      });
      reset();
      setPreview(null);

      onSuccess();
    } catch (err: any) {
      console.error("Edit error:", err);
      showAlert({
        title:
          err?.response?.data?.message ||
          t("banner.createOrUpdate.updateError"),
        type: "error",
        autoClose: 4000,
      });
    }
  };
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValue("bannerImage", file, {
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
  if (isOpen && loading) {
    return (
      <CommonModal
        isOpen={true}
        onClose={handleCancel}
        title={t("banner.createOrUpdate.titleEdit")}
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
      title={t("banner.createOrUpdate.titleEdit")}
      saveLabel={isValid ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      diabled={!isValid || isSubmitting}
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("banner.name")} *
          </label>
          <input
            type="text"
            placeholder={t("banner.createOrUpdate.enterName")}
            {...register("name")}
            className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("banner.startAt")} *
          </label>
          <DateTimePicker
            value={watch("startDate")}
            onChange={(date: any) => {
              setValue("startDate", date, {
                shouldValidate: true,
                shouldDirty: true,
              });

              trigger("startDate");
            }}
            minDate={new Date()}
            placeholder={t("banner.createOrUpdate.selectStartAt")}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("banner.endAt")} *
          </label>
          <DateTimePicker
            value={watch("endDate")}
            onChange={(date: any) => {
              setValue("endDate", date, {
                shouldValidate: true,
                shouldDirty: true,
              });

              trigger("endDate");
            }}
            minDate={
              watch("startDate")
                ? new Date(watch("startDate")!.getTime() + 60 * 1000)
                : undefined
            }
            placeholder={t("banner.createOrUpdate.selectEndAt")}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("banner.createOrUpdate.ctaLabel")}
          </label>
          <input
            type="text"
            {...register("ctaLabel")}
            placeholder={t("banner.createOrUpdate.enterCtaLabel")}
            className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("banner.createOrUpdate.description")}
          </label>
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
            modules={fullToolbar}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#253150]">
            {t("banner.thumbnail")} *
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
                    {t("banner.clickSelectImage")}
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
          {errors.bannerImage && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.bannerImage.message)}
            </p>
          )}
        </div>
      </div>
    </CommonModal>
  );
};
export default BannerEditFormModal;
