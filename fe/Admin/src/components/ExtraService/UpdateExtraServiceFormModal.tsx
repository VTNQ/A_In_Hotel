import { useEffect, useState } from "react";
import { useAlert } from "../alert-context";
import CommonModal from "../ui/CommonModal";
import { findById, updateExtraService } from "../../service/api/ExtraService";
import { getAllCategory } from "../../service/api/Category";
import { File_URL } from "../../setting/constant/app";
import { useTranslation } from "react-i18next";
import type { UpdateExtraServiceFormModalProps } from "../../type/extraService.types";

const UpdateExtraServiceFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  serviceId,
}: UpdateExtraServiceFormModalProps) => {
  const [formData, setFormData] = useState({
    id: "",
    serviceName: "",
    categoryId: "",
    description: "",
    note: "",
    priceType: "1",
    extraCharge: "",
    image: null as File | null,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  useEffect(() => {
    if (!isOpen || !serviceId) return;
    setLoading(true);
    fetchCategories();
    findById(serviceId)
      .then((res) => {
        const data = res?.data?.data;

        setFormData({
          id: data?.id || "",
          serviceName: data?.serviceName || "",
          categoryId: data?.categoryId || "",
          description: data?.description || "",
          note: data?.note || "",
          priceType: data?.priceTypeId || "",
          image: null,
          extraCharge: data?.extraCharge || "",
        });
        setPreview(File_URL + data.icon?.url || null);
      })
      .catch(() => {
        showAlert({
          title: "Failed to load extra service information!",
          type: "error",
        });
        onClose();
      })
      .finally(() => setLoading(false));
  }, [isOpen, serviceId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const fetchCategories = async () => {
    try {
      const res = await getAllCategory({
        all: true,
        filter: "isActive==1 and type==2",
      });
      setCategories(res.content || []);
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpdate = async () => {
    setSaving(true);
    try {
      const cleanedData = Object.fromEntries(
        Object.entries({
          serviceName: formData.serviceName.trim(),
          categoryId: Number(formData.categoryId),
          description: formData.description.trim(),
          note: formData.note.trim(),
          extraCharge: formData.extraCharge,
          image: formData.image,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ]),
      );

      const response = await updateExtraService(
        Number(formData.id),
        cleanedData,
      );
      const message =
        response?.data?.message ||
        t("extraService.createOrUpdate.updateSuccess");

      showAlert({
        title: message,
        type: "success",
        autoClose: 3000,
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Update error:", err);
      showAlert({
        title:
          err?.response?.data?.message ||
          t("extraService.createOrUpdate.updateError"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setSaving(false);
    }
  };
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleCancel = () => {
    setFormData({
      id: "",
      serviceName: "",
      categoryId: "",
      description: "",
      note: "",
      priceType: "1",
      extraCharge: "",
      image: null,
    });
    onClose();
  };
  if (isOpen && loading) {
    return (
      <CommonModal
        isOpen={true}
        onClose={handleCancel}
        title={t("extraService.createOrUpdate.titleEdit")}
        saveLabel={t("common.saveButton")}
        cancelLabel={t("common.cancelButton")}
        width="w-[95vw] sm:w-[90vw] lg:w-[900px]"
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
      title={t("extraService.createOrUpdate.titleEdit")}
      onSave={handleUpdate}
      saveLabel={saving ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      width="w-[95vw] sm:w-[90vw] lg:w-[900px]"
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

          {preview ? (
            <img
              src={preview}
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <img
              src="https://backoffice-uat.affina.com.vn/assets/images/ffc6ce5b09395834f6c02a056de78121.png"
              className="w-full h-full object-cover absolute inset-0"
            />
          )}
        </div>
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
            placeholder="Enter service name"
            className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("extraService.description")}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Short description"
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
            className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
            required
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
        </div>
 
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("extraService.extraCharge")} *
          </label>
          <input
            type="number"
            name="extraCharge"
            value={formData.extraCharge}
            onChange={handleChange}
            placeholder="Enter service extra charge"
            className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
            min={0}
            required
          />
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
export default UpdateExtraServiceFormModal;
