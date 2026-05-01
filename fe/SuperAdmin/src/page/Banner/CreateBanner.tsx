
import { useAlert } from "../../components/alert-context";
import { useTranslation } from "react-i18next";
import { createBanner } from "@/service/api/Banner";
import Breadcrumb from "@/components/Breadcrumb";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { isBefore, isValid, startOfToday } from "date-fns";
import QuillEditor from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import z from "zod";
import UploadField from "@/components/ui/UploadField";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DateTimePicker from "@/components/ui/DateTimePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { createImageBannerSchema } from "@/validation/image.validation";
const CreateBanner = () => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const bannerSchema = z
    .object({
      name: z.string().trim().min(1, t("banner.validate.nameRequired")),

      startDate: z.date({
        error: t("banner.validate.startDateRequired"),
      }),

      endDate: z.date({
        error: t("banner.validate.endDateRequired"),
      }),

      ctaLabel: z.string().optional(),

      description: z.string().optional(),

      bannerImage: createImageBannerSchema(t),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: t("banner.validate.endDateInvalid"),
      path: ["endDate"],
    });

  type BannerForm = z.input<typeof bannerSchema>;
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<BannerForm>({
    mode: "onChange",
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      name: "",
      startDate: undefined,
      endDate: undefined,
      ctaLabel: "",
      description: "",
      bannerImage: null,
    },
  });

  const navigate = useNavigate();
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
  const onSubmit = async (data: BannerForm) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries({
          name: data.name,
          startAt: toOffsetDateTime(data.startDate),
          endAt: toOffsetDateTime(data.endDate),
          ctaLabel: data.ctaLabel,
          description: data.description,
          image: data.bannerImage,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ]),
      );
      const response = await createBanner(cleanedData);
      showAlert({
        title: response?.data?.message,
        type: "success",
        autoClose: 4000,
      });
      reset();
    } catch (err: any) {
      showAlert({
        title: t("banner.createOrUpdate.createError"),
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
          {t("banner.createOrUpdate.titleCreate")}
        </h1>
        <Breadcrumb
          items={[
            { label: t("common.home"), href: "/Home" },
            { label: t("sidebar.banner"), href: "/Home/banner" },
            { label: t("banner.createOrUpdate.titleCreate") },
          ]}
        />
      </div>
      <div className="rounded-xl border bg-white p-6 space-y-6">
        <div>
          <label className="text-sm font-medium">
            {t("banner.name")} <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder={t("banner.createOrUpdate.enterName")}
            onChange={(e: any) => {
              setValue("name", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            value={watch("name")}
            className="mt-1"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("banner.startAt")} <span className="text-red-500">*</span>
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
            disabledDate={(date) => isBefore(date, startOfToday())}
            placeholder={t("banner.createOrUpdate.selectStartAt")}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("banner.endAt")} <span className="text-red-500">*</span>
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
            minDateTime={watch("startDate")}
            disabledDate={(date) =>
              !watch("startDate") ? false : date <= watch("startDate")
            }
            placeholder={t("banner.createOrUpdate.selectEndAt")}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("banner.createOrUpdate.ctaLabel")}
          </label>
          <Input
            name="cta"
            placeholder={t("banner.createOrUpdate.enterCtaLabel")}
            onChange={(e) => {
              setValue("ctaLabel", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              trigger("ctaLabel");
            }}
            value={watch("ctaLabel")}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("banner.createOrUpdate.description")}
          </label>
          <QuillEditor
            theme="snow"
            value={watch("description")}
            onChange={(e) => {
              setValue("description", e, {
                shouldValidate: true,
                shouldDirty: true,
              });
              trigger("description");
            }}
            modules={fullToolbar}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">{t("banner.thumbnail")}</label>
          <UploadField
            className="w-full mt-2"
            value={watch("bannerImage")}
            onChange={(files) =>{
              setValue("bannerImage", files?.[0] ?? null, {
                shouldValidate: true,
                shouldDirty: true,
              })
              trigger("bannerImage");
            }
            }
          />
          {errors.bannerImage && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.bannerImage.message)}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            variant="outline"
            onClick={() => navigate("/Home/post/banner")}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting || !isValid} className="min-w-[140px]">
            {isSubmitting ? (
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
export default CreateBanner;
