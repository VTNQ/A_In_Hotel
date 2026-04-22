import { useEffect, useState } from "react";
import CommonModal from "../ui/CommonModal";
import { addExtraService } from "../../service/api/ExtraService";
import { useAlert } from "../alert-context";
import { getAllCategory } from "../../service/api/Category";
import { useTranslation } from "react-i18next";
import type { ExtraServiceFormModalProps } from "../../type/extraService.types";

const ExtraServiceFormModal = ({
  isOpen,
  onClose,
  onSuccess,
}: ExtraServiceFormModalProps) => {
  const [errors, setErrors] = useState<any>({});
  const [formData, setFormData] = useState({
    serviceName: "",
    categoryId: "",
    description: "",
    note: "",
    priceType: "1",
    extraCharge: "",
    image: null as File | null,
  });
  const { t } = useTranslation();
  const [previewIcon, setPreviewIcon] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const [categories, setCategories] = useState<any[]>([]);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategory({
        all: true,
        filter: "isActive==1 and type==2",
      });
      setCategories(res.content || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [isOpen]);
  const validateField = (name: string, value: any) => {
    let error = "";
    switch (name) {
      case "serviceName":
        if (!value.trim()) {
          error = t("extraService.validate.serviceNameRequired");
        }
        break;
      case "categoryId":
        if (!value) {
          error = t("extraService.validate.categoryRequired");
        }
        break;
      case "extraCharge":
        if (!value) {
          error = t("extraService.validate.extraChargeRequired");
        } else if (isNaN(Number(value)) || Number(value) < 0) {
          error = t("extraService.validate.extraChargeInvalid");
        }
        break;
    }
    return error;
  };
  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev: any) => ({
      ...prev,
      [name]: error,
    }));
  };
  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.serviceName.trim()) {
      newErrors.serviceName = t("extraService.validate.serviceNameRequired");
    }

    if (!formData.categoryId) {
      newErrors.categoryId = t("extraService.validate.categoryRequired");
    }
    if (!formData.extraCharge) {
      newErrors.extraCharge = t("extraService.validate.extraChargeRequired");
    } else if (
      isNaN(Number(formData.extraCharge)) ||
      Number(formData.extraCharge) < 0
    ) {
      newErrors.extraCharge = t("extraService.validate.extraChargeInvalid");
    }

    if (!formData.image) {
      newErrors.image = t("extraService.validate.imageRequired");
    } else {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (formData.image.size > maxSize) {
        newErrors.image = t("extraService.validate.imageTooLarge");
      } else if (!allowedTypes.includes(formData.image.type)) {
        newErrors.image = t("extraService.validate.imageInvalidType");
      }
    }
    return newErrors;
  };
  // ✅ Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (file.size > maxSize) {
      setErrors((prev: any) => ({
        ...prev,
        image: t("extraService.validate.imageTooLarge"),
      }));
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev: any) => ({
        ...prev,
        image: t("extraService.validate.imageInvalidType"),
      }));
      return;
    }
    setErrors((prev: any) => ({ ...prev, image: "" }));
    setFormData((prev) => ({ ...prev, image: file }));
    setPreviewIcon(URL.createObjectURL(file));
  };
  const handleCancel = () => {
    setFormData({
      serviceName: "",
      categoryId: "",
      description: "",
      note: "",
      priceType: "1",
      extraCharge: "",
      image: null,
    });
    setErrors({});
    setPreviewIcon(null);
    onClose();
  };
  const handleSave = async () => {
    const validationErros = validateForm();
    if (Object.keys(validationErros).length > 0) {
      setErrors(validationErros);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const payload = {
        serviceName: formData.serviceName.trim(),
        categoryId: Number(formData.categoryId),
        description: formData.description.trim(),
        isActive: true,
        note: formData.note.trim(),
        extraCharge: formData.extraCharge,
        image: formData.image,
        type: 2,
      };
      const response = await addExtraService(payload);
      const message =
        response?.data?.message ||
        t("extraService.createOrUpdate.createSucess");

      showAlert({
        title: message,
        type: "success",
        autoClose: 3000,
      });

      // Reset form và callback
      setFormData({
        serviceName: "",
        categoryId: "",
        description: "",
        note: "",
        priceType: "1",
        extraCharge: "",
        image: null,
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Create error:", err);
      showAlert({
        title:
          err?.response?.data?.message ||
          t("extraService.createOrUpdate.createError"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setSaving(false);
    }
  };
  if (isOpen && loading) {
    return (
      <CommonModal
        isOpen={true}
        onClose={handleCancel}
        title={t("extraService.createOrUpdate.titleCreate")}
        saveLabel={t("common.saveButton")}
        cancelLabel={t("common.cancelButton")}
      >
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-[#2E3A8C] border-t-transparent rounded-full" />
        </div>
      </CommonModal>
    );
  }
  const isFormValid = () => {
    const errors = validateForm();
    return Object.keys(errors).length === 0;
  };
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={t("extraService.createOrUpdate.titleCreate")}
      onSave={handleSave}
      saveLabel={saving ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      width="w-[95vw] sm:w-[90vw] lg:w-[900px]"
      diabled={!isFormValid() || saving}
    >
      <div className="mb-6 flex flex-col lg:items-start ">
        <label className="block mb-2 font-medium text-[#253150]">
          {t("extraService.createOrUpdate.icon")}
        </label>

        <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-[#EEF0F7] border border-[#4B62A0] rounded-xl overflow-hidden cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleIconChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          {previewIcon ? (
            <img
              src={previewIcon}
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <img
              src="https://backoffice-uat.affina.com.vn/assets/images/ffc6ce5b09395834f6c02a056de78121.png"
              className="w-full h-full object-cover absolute inset-0"
            />
          )}
        </div>
        {errors.image && (
          <p className="text-red-500 text-sm mt-2">{errors.image}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Service Name */}
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("extraService.name")} *
          </label>
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("extraService.createOrUpdate.namePlaceHolder")}
            className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
          />
          {errors.serviceName && (
            <p className="text-red-500 mt-1">{errors.serviceName}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("extraService.description")}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t(
              "extraService.createOrUpdate.descriptionPlaceHolder",
            )}
            className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
            rows={1}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("extraService.category")} *
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
          >
            <option value="">
              {t("extraService.createOrUpdate.defaultCategory")}
            </option>
            {categories.length > 0 ? (
              categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))
            ) : (
              <option disabled>{t("common.loading")}</option>
            )}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 mt-1">{errors.categoryId}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("extraService.extraCharge")}*
          </label>
          <input
            type="number"
            name="extraCharge"
            value={formData.extraCharge}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter service extra charge"
            className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
            min={0}
          />
          {errors.extraCharge && (
            <p className="text-red-500 mt-1">{errors.extraCharge}</p>
          )}
        </div>
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("extraService.note")}
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder={t("common.notePlaceholder")}
            className="w-full border border-[#253150] focus:border-[#3E5286] bg-[#EEF0F7] rounded-lg p-2 outline-none"
            rows={2}
          />
        </div>
      </div>
    </CommonModal>
  );
};

export default ExtraServiceFormModal;
