import { type BannerEditProps, type BannerForm } from "@/type/banner.types";
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
const BannerEditModal: React.FC<BannerEditProps> = ({
  open,
  bannerId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BannerForm>({
    title: "",
    startDate: undefined,
    endDate: undefined,
    cta: "",
    desc: "",
    bannerImage: null,
  });
  const { t } = useTranslation();
  const [defaultPreview, setDefaultPreview] = useState<string>(
    "/placeholder-image.png",
  );

  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!open || !bannerId) return;
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await findById(bannerId);
        const b = response?.data;

        setFormData({
          title: b?.name ?? "",
          startDate: b?.startAt ? new Date(b.startAt) : undefined,
          endDate: b?.endAt ? new Date(b.endAt) : undefined,
          cta: b?.ctaLabel ?? "",
          desc: b?.description ?? "",
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
  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const cleanedData = Object.fromEntries(
        Object.entries({
          name: formData.title,
          startAt: toOffsetDateTime(formData.startDate),
          endAt: toOffsetDateTime(formData.endDate),
          ctaLabel: formData.cta,
          description: formData.desc,
          image: formData.bannerImage,
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
      setFormData({
        title: "",
        startDate: undefined,
        endDate: undefined,
        cta: "",
        desc: "",
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
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setFormData({
      title: "",
      startDate: undefined,
      endDate: undefined,
      cta: "",
      desc: "",
      bannerImage: null,
    });
    onClose();
  };
  const handleBannerImage = (files: File[] | null) =>
    setFormData((p) => ({ ...p, bannerImage: files?.[0] ?? null }));
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
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                {/* CTA */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("banner.createOrUpdate.ctaLabel")}
                  </label>
                  <Input
                    name="cta"
                    value={formData.cta}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                {/* START DATE */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("banner.startAt")} *
                  </label>
                  <DateTimePicker
                    value={formData.startDate}
                    onChange={(d) =>
                      setFormData((p) => ({ ...p, startDate: d }))
                    }
                    disabledDate={(date) => isBefore(date, startOfToday())}
                    placeholder={t("banner.createOrUpdate.selectStartAt")}
                  />
                </div>

                {/* END DATE */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("banner.endAt")} *
                  </label>
                  <DateTimePicker
                    value={formData.endDate}
                    minDateTime={formData.startDate}
                    onChange={(d) => setFormData((p) => ({ ...p, endDate: d }))}
                    disabledDate={(date) =>
                      !formData.startDate ? false : date <= formData.startDate
                    }
                    placeholder={t("banner.createOrUpdate.selectEndAt")}
                  />
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
                    value={formData.desc}
                    onChange={(v) => setFormData((f) => ({ ...f, desc: v }))}
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
              </div>
            </div>

            {/* FOOTER */}
            <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                {t("common.cancel")}
              </Button>

              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? t("common.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default BannerEditModal;
