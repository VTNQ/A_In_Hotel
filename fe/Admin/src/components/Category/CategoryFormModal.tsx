import { useState } from "react";
import { useAlert } from "../alert-context";
import CommonModal from "../ui/CommonModal";
import { addCategory } from "../../service/api/Category";
import { useTranslation } from "react-i18next";
import type { CategoryFormModalProps } from "../../type/category.types";

const CategoryFormModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CategoryFormModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    type: "",
    description: "",
  });
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validateField = (name: string, value: any) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) {
          error = t("category.validate.nameRequired");
        } else if (value.length > 100) {
          error = t("category.validate.nameMax");
        }
        break;
      case "type":
        if (!value) {
          error = t("category.validate.typeRequired");
        }
        break;
      case "description":
        if (value && value.length > 255) {
          error = t("category.validate.descriptionMax");
        }
        break;
    }
    setErrors((prev)=>({...prev,[name]:error}))
  };
  const handleBlur = (
    e:React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  )=>{
    const { name, value} = e.target;
    validateField(name,value);
  }
  const validateAll = ()=>{
    const newErrors = {
        name:"",
        type:"",
        description:""
    }
    if(!formData.name.trim()){
        newErrors.name = t("category.validate.nameRequired")
    }else if(formData.name.length > 100){
        newErrors.name = t("category.validate.nameMax");
    }
    if(!formData.type){
        newErrors.type = t("category.validate.typeRequired");
    }

    if(formData.description && formData.description.length > 255){
        newErrors.description = t("category.validate.descriptionMax")
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some((e)=>e)
  }
  const handleSave = async () => {
    if(!validateAll()) return;
    setLoading(true);
    try {
      const cleanedData = Object.fromEntries(
        Object.entries({
          name: formData.name,
          type: formData.type,
          description: formData.description,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ]),
      );
      const response = await addCategory(cleanedData);
      showAlert({
        title:
          response?.data?.message || t("category.createOrUpdate.createSucess"),
        type: "success",
        autoClose: 3000,
      });
      setFormData({
        name: "",
        type: "",
        description: "",
      });
      onSuccess();
    } catch (err: any) {
      console.error("Create error:", err);
      showAlert({
        title:
          err?.response?.data?.message ||
          t("category.createOrUpdate.createError"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setFormData({
      name: "",
      type: "",
      description: "",
    });
    onClose();
  };
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={t("category.createOrUpdate.titleCreate")}
      onsubmit={loading}
      onSave={handleSave}
      saveLabel={loading ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      width="w-[95vw] sm:w-[600px] lg:w-[800px]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("category.name")} *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("category.createOrUpdate.enterName")}
            className="w-full border 
                        border-[#4B62A0] 
                        focus:border-[#3E5286] 
                        rounded-lg 
                        p-2.5
                        text-sm
                        sm:text-base
                        outline-none"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {t("category.createOrUpdate.nameLimit")}
          </p>
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("category.type")} *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border 
                        border-[#4B62A0] 
                        focus:border-[#3E5286] 
                        rounded-lg 
                        p-2.5
                        text-sm
                        sm:text-base
                        outline-none"
            required
          >
            <option value="">{t("category.createOrUpdate.selectType")}</option>
            <option value="1">{t("category.room")}</option>
            <option value="2">{t("category.service")}</option>
            <option value="3">{t("category.asset")}</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type}</p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block mb-1 font-medium text-[#253150]">
            {t("category.createOrUpdate.description")}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("category.createOrUpdate.enterDescription")}
            className="w-full border 
                        border-[#4B62A0] 
                        focus:border-[#3E5286] 
                        rounded-lg 
                        p-2.5
                        text-sm
                        sm:text-base
                        outline-none"
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{t("category.createOrUpdate.descriptionLimit")}</span>
            <span>{formData.description?.length || 0}/255</span>
          </div>
        </div>
      </div>
    </CommonModal>
  );
};
export default CategoryFormModal;
