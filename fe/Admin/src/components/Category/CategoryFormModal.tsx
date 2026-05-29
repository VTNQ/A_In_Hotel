import { useAlert } from "../alert-context";
import CommonModal from "../ui/CommonModal";
import { addCategory } from "../../service/api/Category";
import { useTranslation } from "react-i18next";
import type {
  CategoryFormData,
  CategoryFormModalProps,
} from "../../type/category.types";
import { useForm } from "react-hook-form";
const CategoryFormModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CategoryFormModalProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CategoryFormData>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      type: "",
      description: "",
    },
  });
  const { showAlert } = useAlert();

  const onsubmit = async (data: CategoryFormData) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries({
          name: data.name?.toString().trim() === "" ? null : data.name,
          type: data.type?.toString().trim() === "" ? null : data.type,
          description:
            data.description?.toString().trim() === ""
              ? null
              : data.description,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ]),
      ) as unknown as CategoryFormData;
      const response = await addCategory(cleanedData);
      showAlert({
        title:
          response?.data?.message || t("category.createOrUpdate.createSucess"),
        type: "success",
        autoClose: 3000,
      });
      reset();
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
    }
  };
  const handleCancel = () => {
    reset();
    onClose();
  };
  const descriptionValue = watch("description");

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={t("category.createOrUpdate.titleCreate")}
      onsubmit={!isValid}
      onSave={handleSubmit(onsubmit)}
      saveLabel={isSubmitting ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      width="w-[95vw] sm:w-[600px] lg:w-[800px]"
      diabled={!isValid || isSubmitting}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
            {t("category.name")} *
          </label>
          <input
            type="text"
            placeholder={t("category.createOrUpdate.enterName")}
           className=" w-full rounded-lg px-3 py-2.5 sm:py-2 
           outline-none border border-[#4B62A0] 
           dark:border-slate-700 bg-white 
           dark:bg-slate-900 text-gray-700 dark:text-gray-100 
           placeholder:text-gray-400 dark:placeholder:text-slate-500 
           focus:ring-2 focus:ring-[#4B62A0] transition-colors "
            {...register("name", {
              required: t("category.validate.nameRequired"),
              maxLength: {
                value: 100,
                message: t("category.validate.nameMaxLength"),
              },
            })}
          />
          {errors.name && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {t("category.createOrUpdate.nameLimit")}
          </p>
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
            {t("category.type")} *
          </label>
          <select
           className=" w-full rounded-lg px-3 py-2.5 sm:py-2 outline-none border border-[#4B62A0] dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-[#4B62A0] transition-colors "
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
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
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
              className=" w-full rounded-lg px-3 py-2.5 sm:py-2 
           outline-none border border-[#4B62A0] 
           dark:border-slate-700 bg-white 
           dark:bg-slate-900 text-gray-700 dark:text-gray-100 
           placeholder:text-gray-400 dark:placeholder:text-slate-500 
           focus:ring-2 focus:ring-[#4B62A0] transition-colors "
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
          <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mt-1">
            <span>{t("category.createOrUpdate.descriptionLimit")}</span>
            <span>{descriptionValue?.length || 0}/255</span>
          </div>
        </div>
      </div>
    </CommonModal>
  );
};
export default CategoryFormModal;
