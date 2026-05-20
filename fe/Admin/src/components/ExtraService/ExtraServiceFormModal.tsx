import { useEffect, useState } from "react";
import CommonModal from "../ui/CommonModal";
import { addExtraService } from "../../service/api/ExtraService";
import { useAlert } from "../alert-context";
import { getAllCategory } from "../../service/api/Category";
import { useTranslation } from "react-i18next";
import type { ExtraServiceFormModalProps } from "../../type/extraService.types";
import { z } from "zod";
import { createImageExtraServiceSchema } from "../../validation/image.validation";
import { useForm } from "react-hook-form";
const ExtraServiceFormModal = ({
  isOpen,
  onClose,
  onSuccess,
}: ExtraServiceFormModalProps) => {
  const { t } = useTranslation();
  const [previewIcon, setPreviewIcon] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const [categories, setCategories] = useState<any[]>([]);
  const extraServiceSchema = z.object({
    serviceName: z
      .string()
      .min(1, t("extraService.validate.serviceNameRequired")),

    categoryId: z.string().min(1, t("extraService.validate.categoryRequired")),

    description: z.string().optional(),

    note: z.string().optional(),

    extraCharge: z
      .string()
      .min(1, t("extraService.validate.extraChargeRequired"))
      .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
        message: t("extraService.validate.extraChargeInvalid"),
      }),
    image: createImageExtraServiceSchema(t),
  });
  type FormData = z.infer<typeof extraServiceSchema>;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      serviceName: "",
      categoryId: "",
      description: "",
      note: "",
      extraCharge: "",
      image: null,
    },
  });
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValue("image", file, {
      shouldValidate: true,
    });
    if (file) {
      setPreviewIcon(URL.createObjectURL(file));
    }
  };
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategory({
        all: true,
        filter: "isActive==1 and type==2",
      });
      setCategories(res.data.content || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [isOpen]);

  const handleCancel = () => {
    reset();
    setPreviewIcon(null);
    onClose();
  };
  const handleSave = async (data: FormData) => {
    try {
      const payload = {
        serviceName: data.serviceName.trim(),
        categoryId: Number(data.categoryId),
        description: data.description?.trim(),
        isActive: true,
        note: data.note?.trim(),
        extraCharge: data.extraCharge,
        image: data.image,
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
      reset();

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
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={t("extraService.createOrUpdate.titleCreate")}
      onSave={handleSubmit(handleSave)}
      saveLabel={isSubmitting ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      width="w-[95vw] sm:w-[90vw] lg:w-[900px]"
      diabled={!isValid || isSubmitting}
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
        {errors.image?.message && (
          <p className="text-red-500 text-sm mt-2">
            {String(errors.image.message)}
          </p>
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
            {...register("serviceName")}
            placeholder={t("extraService.createOrUpdate.namePlaceHolder")}
            className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
          />
          {errors.serviceName && (
            <p className="text-red-500 mt-1">{errors.serviceName.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("extraService.description")}
          </label>
          <textarea
            {...register("description")}
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
            {...register("categoryId")}
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
            <p className="text-red-500 mt-1">{errors.categoryId.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("extraService.extraCharge")}*
          </label>
          <input
            type="number"
            {...register("extraCharge")}
            placeholder="Enter service extra charge"
            className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
            min={0}
          />
          {errors.extraCharge && (
            <p className="text-red-500 mt-1">{errors.extraCharge.message}</p>
          )}
        </div>
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("extraService.note")}
          </label>
          <textarea
            {...register("note")}
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
