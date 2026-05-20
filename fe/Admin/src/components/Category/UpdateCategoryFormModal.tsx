import { useEffect, useState } from "react";
import { useAlert } from "../alert-context";
import CommonModal from "../ui/CommonModal";
import { findById, updateCategory } from "../../service/api/Category";
import { useTranslation } from "react-i18next";
import {
  type CategoryFormData,
  type UpdateCategoryFormModalProps,
} from "../../type/category.types";
import { useForm } from "react-hook-form";

const UpdateCategoryFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  categoryId,
}: UpdateCategoryFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CategoryFormData>({
    mode: "onBlur",
    defaultValues: {
      id: "",
      name: "",
      type: "",
      description: "",
    },
  });
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!isOpen || !categoryId) return;

    const fetchCategory = async () => {
      setLoading(true)
      try {
        const res = await findById(categoryId);
        const data = res?.data?.data;

        reset({
          id: data?.id?.toString() || "",
          name: data?.name || "",
          type: data?.idType?.toString() || "",
          description: data?.description || "",
        });
      } catch (error) {
        showAlert({
          title: t("category.loadError"),
          type: "error",
        });
        onClose();
      }finally{
        setLoading(false)
      }
    };

    fetchCategory();
  }, [isOpen, categoryId]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries({
          name: data.name,
          type: data.type,
          description: data.description,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ]),
      ) as unknown as CategoryFormData;

      const response = await updateCategory(Number(data.id), cleanedData);
      const message =
        response?.data?.message || t("category.createOrUpdate.updateSucess");
      showAlert({
        title: message,
        type: "success",
        autoClose: 3000,
      });

      onSuccess?.();
      handleCancel();
    } catch (err: any) {
      console.error("Update error:", err);
      showAlert({
        title:
          err?.response?.data?.message ||
          t("category.createOrUpdate.updateError"),
        type: "error",
        autoClose: 4000,
      });
    }
  };
  const descriptionValue = watch("description");
  const handleCancel = () => {
    reset();
    onClose();
  };
  if (isOpen && loading) {
    return (
      <CommonModal
        isOpen={true}
        onClose={handleCancel}
        title={t("category.createOrUpdate.titleEdit")}
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
      onSave={handleSubmit(onSubmit)}
      title={t("category.createOrUpdate.titleEdit")}
      saveLabel={isSubmitting ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      width="w-[95vw] sm:w-[600px] lg:w-[800px]"
      diabled={!isValid || isSubmitting}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("category.name")} *
          </label>
          <input
            type="text"
            placeholder={t("category.createOrUpdate.enterName")}
            className="w-full border 
                        border-[#4B62A0] 
                        focus:border-[#3E5286] 
                        rounded-lg 
                        p-2.5
                        text-sm
                        sm:text-base
                        outline-none"
            {...register("name", {
              required: t("category.validate.nameRequired"),
              maxLength: {
                value: 100,
                message: t("category.validate.nameMaxLength"),
              },
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
           className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2.5 text-sm sm:text-base outline-none"
            {...register("type", {
              required: t("category.validate.typeRequired"),
            })}
          >
            <option value="">{t("category.createOrUpdate.selectType")}</option>
            <option value="1">{t("category.room")}</option>
            <option value="2">{t("category.service")}</option>
            <option value="3">{t("category.asset")}</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block mb-1 font-medium text-[#253150]">
            {t("category.createOrUpdate.description")}
          </label>
          <textarea
            {...register("description", {
              maxLength: {
                value: 255,
                message: t("category.validate.descriptionMax"),
              },
            })}
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
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{t("category.createOrUpdate.descriptionLimit")}</span>
            <span>{descriptionValue?.length || 0}/255</span>
          </div>
        </div>
      </div>
    </CommonModal>
  );
};

export default UpdateCategoryFormModal;
