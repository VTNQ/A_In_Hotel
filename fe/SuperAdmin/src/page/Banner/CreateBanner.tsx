import { useState } from "react";
import { useAlert } from "../../components/alert-context";
import type { BannerForm } from "@/type/banner.types";
import { useTranslation } from "react-i18next";
import { createBanner } from "@/service/api/Banner";
import Breadcrumb from "@/components/Breadcrumb";
import { Input } from "@/components/ui/input";
import { isBefore, startOfToday } from "date-fns";
import QuillEditor from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import UploadField from "@/components/ui/UploadField";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DateTimePicker from "@/components/ui/DateTimePicker";
const CreateBanner = () => {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState<BannerForm>({
    title: "",
    startDate: undefined,
    endDate: undefined,
    cta: "",
    desc: "",
    bannerImage: null,
  });
  const { t } = useTranslation();
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    if (submitting) return;
    e.preventDefault();
    try {
      setSubmitting(true);
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
      const response = await createBanner(cleanedData);
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
    } catch (err: any) {
      showAlert({
        title: t("banner.createOrUpdate.createError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setSubmitting(false);
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
            name="title"
            placeholder={t("banner.createOrUpdate.enterName")}
            onChange={handleTextChange}
            value={formData.title}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("banner.startAt")} <span className="text-red-500">*</span>
          </label>
          <DateTimePicker
            value={formData.startDate}
            onChange={(d) => setFormData((p) => ({ ...p, startDate: d }))}
            disabledDate={(date) => isBefore(date, startOfToday())}
            placeholder={t("banner.createOrUpdate.selectStartAt")}
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("banner.endAt")} <span className="text-red-500">*</span>
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
        <div>
          <label className="text-sm font-medium">
            {t("banner.createOrUpdate.ctaLabel")}
          </label>
          <Input
            name="cta"
            placeholder={t("banner.createOrUpdate.enterCtaLabel")}
            onChange={handleTextChange}
            value={formData.cta}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("banner.createOrUpdate.description")}
          </label>
          <QuillEditor
            theme="snow"
            value={formData.desc}
            onChange={(v) => setFormData((f) => ({ ...f, desc: v }))}
            modules={fullToolbar}
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("banner.thumbnail")}</label>
          <UploadField
            className="w-full mt-2"
            value={formData.bannerImage}
            onChange={(files) =>
              setFormData((p) => ({ ...p, bannerImage: files?.[0] ?? null }))
            }
          />
        </div>
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => navigate("/Home/post/banner")}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} className="min-w-[140px]">
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
export default CreateBanner;
