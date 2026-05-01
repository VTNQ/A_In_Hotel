import { type BannerEditProps } from "@/type/banner.types";
import { useAlert } from "../alert-context";
import { useEffect, useState } from "react";
import { findById, updateBanner } from "@/service/api/Banner";
import { File_URL } from "@/setting/constant/app";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import QuillEditor from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import DateTimePicker from "../ui/DateTimePicker";
import { isBefore, startOfToday } from "date-fns";
import UploadField from "../ui/UploadField";
import { Button } from "../ui/button";
import z from "zod";
import { createImageBannerSchema } from "@/validation/image.validation";
import { useForm } from "react-hook-form";
const BannerEditModal: React.FC<BannerEditProps> = ({
  open,
  bannerId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();

  const { t } = useTranslation();
  const [defaultPreview, setDefaultPreview] = useState<string>(
    "/placeholder-image.png",
  );
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
      if (defaultPreview) return;

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
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!open || !bannerId) return;
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await findById(bannerId);
        const b = response?.data;

        reset({
          name: b?.name ?? "",
          startDate: b?.startAt ? new Date(b.startAt) : undefined,
          endDate: b?.endAt ? new Date(b.endAt) : undefined,
          ctaLabel: b?.ctaLabel ?? "",
          description: b?.description ?? "",
          bannerImage: null, // ban đầu chưa có file mới
        });
        setDefaultPreview(File_URL + b?.image?.url);
      } catch (err: any) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [open, bannerId]);
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
  const onSubmitForm = async (data: BannerForm) => {
    
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
      const response = await updateBanner(cleanedData, bannerId ?? 0);
      showAlert({
        title: response?.data?.message,
        type: "success",
        autoClose: 4000,
      });
      reset({
        name: "",
        startDate: undefined,
        endDate: undefined,
        ctaLabel: "",
        description: "",
        bannerImage: null,
      });
      onSubmit();
      onClose();
    } catch (err: any) {
      showAlert({
        title: t("banner.createOrUpdate.updateError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
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
  const handleClose = () => {
    reset({
      name: "",
      startDate: undefined,
      endDate: undefined,
      ctaLabel: "",
      description: "",
      bannerImage: null,
    });
    onClose();
  };
  const handleBannerImage = (files: File[] | null) =>
    setValue("bannerImage", files?.[0] ?? null);
  if (!open || !bannerId) return <></>;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[96vh] p-0 rounded-2xl overflow-y-auto">
        {/* HEADER */}
        <DialogHeader className="px-6 py-4 border-b bg-gray-50">
          <DialogTitle className="text-lg font-semibold">
            {t("banner.createOrUpdate.titleEdit")}
          </DialogTitle>
        </DialogHeader>

        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* BODY SCROLL */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* TOP GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TITLE */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("banner.name")} *
                  </label>
                  <Input
                    value={watch("name")}
                    onChange={(e) => {
                      setValue("name", e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      trigger("name");
                    }}
                    className="h-11"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("banner.createOrUpdate.ctaLabel")}
                  </label>
                  <Input
                    value={watch("ctaLabel")}
                    onChange={(e) => {
                      setValue("ctaLabel", e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      trigger("ctaLabel");
                    }}
                    className="h-11"
                  />
                </div>

                {/* START DATE */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
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
                    disabledDate={(date) => isBefore(date, startOfToday())}
                    placeholder={t("banner.createOrUpdate.selectStartAt")}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                {/* END DATE */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
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
                    minDateTime={watch("startDate")}
                    disabledDate={(date) =>
                      !watch("startDate") ? false : date <= watch("startDate")
                    }
                    placeholder={t("banner.createOrUpdate.selectEndAt")}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("banner.createOrUpdate.description")}
                </label>
                <div className="border rounded-lg overflow-hidden">
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
                    className="min-h-[200px]"
                  />
                </div>
              </div>

              {/* IMAGE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("banner.thumbnail")}
                </label>
                <UploadField
                  className="w-full"
                  defaultPreviewUrl={defaultPreview}
                  onChange={handleBannerImage}
                />
                {errors.bannerImage && (
                  <p className="text-red-500 text-sm">
                    {String(errors.bannerImage.message)}
                  </p>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t("common.cancel")}
              </Button>

              <Button onClick={handleSubmit(onSubmitForm)} disabled={isSubmitting || !isValid}>
                {isSubmitting ? t("common.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default BannerEditModal;
