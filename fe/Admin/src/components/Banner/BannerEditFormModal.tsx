import { useEffect, useState } from "react";
import { File_URL } from "../../setting/constant/app";
import { useAlert } from "../alert-context";
import DateTimePicker from "../ui/DateTimePicker";
import CommonModal from "../ui/CommonModal";
import QuillEditor from "react-quill-new";
import { findById, updateBanner } from "../../service/api/Banner";
import { useTranslation } from "react-i18next";
import type { BannerEditFormModalProps } from "../../type/banner.types";

const BannerEditFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  bannerId,
}: BannerEditFormModalProps) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    ctaLabel: "",
    description: "",
    bannerImage: null as File | null,
  });
  const [errors, setErrors] = useState({
    name: "",
    startDate: "",
    endDate: "",
    bannerImage: "",
  });

  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!isOpen || !bannerId) return;
    setLoading(true);
    findById(bannerId)
      .then((res) => {
        const data = res?.data?.data;
        setFormData({
          id: data.id || "",
          name: data.name || "",
          startDate: data.startAt ? new Date(data.startAt) : null,
          endDate: data.endAt ? new Date(data.endAt) : null,
          ctaLabel: data.ctaLabel || "",
          description: data.description || "",
          bannerImage: null,
        });
        setPreview(File_URL + data.image?.url || null);
      })
      .catch(() => {
        showAlert({
          title: t("banner.loadError"),
          type: "error",
        });
        onClose();
      })
      .finally(() => setLoading(false));
  }, [isOpen, bannerId]);
  const validateField = (name: string, value: any) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value?.trim()) {
          error = t("banner.validate.nameRequired");
        }
        break;
      case "startDate":
        if (!value) {
          error = t("banner.validate.startDateRequired");
        }
        break;
      case "endDate":
        if (!value) {
          error = t("banner.validate.endDateRequired");
        } else if (formData.startDate && value <= formData.startDate) {
          error = t("banner.validate.endDateInvalid");
        }
        break;
      case "bannerImage":
        if (!value) {
          error = t("banner.validate.imageRequired");
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  const validateAll = () => {
    const newErrors = {
      name: "",
      startDate: "",
      endDate: "",
      bannerImage: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = t("banner.validate.nameRequired");
    }

    if (!formData.startDate) {
      newErrors.startDate = t("banner.validate.startDateRequired");
    }

    if (!formData.endDate) {
      newErrors.endDate = t("banner.validate.endDateRequired");
    } else if (formData.startDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = t("banner.validate.endDateInvalid");
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((e) => e);
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
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  const handleSave = async () => {
    if (!validateAll()) return;
    setSaving(true);
    try {
      const cleanedData = Object.fromEntries(
        Object.entries({
          name: formData.name,
          startAt: toOffsetDateTime(formData.startDate),
          endAt: toOffsetDateTime(formData.endDate),
          ctaLabel: formData.ctaLabel,
          description: formData.description,
          image: formData.bannerImage,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ]),
      );
      await updateBanner(bannerId, cleanedData);
      showAlert({
        title: t("banner.createOrUpdate.updateSucess"),
        type: "success",
        autoClose: 3000,
      });
      setFormData({
        id: "",
        name: "",
        startDate: null as Date | null,
        endDate: null as Date | null,
        ctaLabel: "",
        description: "",
        bannerImage: null as File | null,
      });

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
    } finally {
      setSaving(false);
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
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024;
    if (!file) {
      setErrors((prev) => ({
        ...prev,
        bannerImage: t("banner.validate.imageRequired"),
      }));
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        bannerImage: t("banner.validate.imageInvalid"),
      }));
      return;
    }
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        bannerImage: t("banner.validate.imageTooLarge"),
      }));
      return;
    }
    setPreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, bannerImage: file }));

    setErrors((prev) => ({
      ...prev,
      bannerImage: "",
    }));
  };
  const handleCancel = () => {
    setFormData({
      id: "",
      name: "",
      startDate: null as Date | null,
      endDate: null as Date | null,
      ctaLabel: "",
      description: "",
      bannerImage: null as File | null,
    });
    setErrors({
      name: "",
      startDate: "",
      endDate: "",
      bannerImage: "",
    })
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
  const isFormValid = ()=>{
    const newErrors = {
      name: "",
      startDate: "",
      endDate: "",
      bannerImage: "",
    };
     if (!formData.name?.trim()) {
      newErrors.name = t("banner.validate.nameRequired");
    }
    if (!formData.startDate) {
      newErrors.startDate = t("banner.validate.startDateRequired");
    }
    if (!formData.endDate) {
      newErrors.endDate = t("banner.validate.endDateRequired");
    } else if (formData.startDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = t("banner.validate.endDateInvalid");
    }
 
    return !Object.values(newErrors).some((e) => e);
  }
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleCancel}
      onsubmit={saving}
      onSave={handleSave}
      title={t("banner.createOrUpdate.titleEdit")}
      saveLabel={saving ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      diabled={!isFormValid() || saving}
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("banner.name")} *
          </label>
          <input
            type="text"
            name="name"
            placeholder={t("banner.createOrUpdate.enterName")}
            value={formData.name}
            onBlur={handleBlur}
            onChange={handleChange}
            className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("banner.startAt")} *
          </label>
          <DateTimePicker
            value={formData.startDate}
            onChange={(date) => {
              setFormData((prev) => ({
                ...prev,
                startDate: date,
                endDate:
                  prev.endDate && date && prev.endDate <= date
                    ? null
                    : prev.endDate,
              }));

              validateField("startDate", date);
            }}
            minDate={new Date()}
            placeholder={t("banner.createOrUpdate.selectStartAt")}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("banner.endAt")} *
          </label>
          <DateTimePicker
            value={formData.endDate}
            onChange={(date) => {
              setFormData((prev) => ({ ...prev, endDate: date }));
              validateField("endDate", date);
            }}
            minDate={
              formData.startDate
                ? new Date(formData.startDate.getTime() + 60 * 1000) // +1 phút
                : undefined
            }
            placeholder={t("banner.createOrUpdate.selectEndAt")}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("banner.createOrUpdate.ctaLabel")}
          </label>
          <input
            type="text"
            name="ctaLabel"
            placeholder={t("banner.createOrUpdate.enterCtaLabel")}
            value={formData.ctaLabel}
            onChange={handleChange}
            className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("banner.createOrUpdate.description")}
          </label>
          <QuillEditor
            theme="snow"
            value={formData.description}
            onChange={(v) => setFormData((f) => ({ ...f, description: v }))}
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
            <p className="text-red-500 text-sm mt-1">{errors.bannerImage}</p>
          )}
        </div>
      </div>
    </CommonModal>
  );
};
export default BannerEditFormModal;
