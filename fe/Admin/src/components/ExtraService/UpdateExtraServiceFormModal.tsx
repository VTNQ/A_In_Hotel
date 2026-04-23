import React, { useEffect, useState } from "react";
import { useAlert } from "../alert-context";
import CommonModal from "../ui/CommonModal";
import { findById, updateExtraService } from "../../service/api/ExtraService";
import { getAllCategory } from "../../service/api/Category";
import { File_URL } from "../../setting/constant/app";
import { useTranslation } from "react-i18next";
import type { UpdateExtraServiceFormModalProps } from "../../type/extraService.types";
import z from "zod";
import { createImageExtraServiceSchema } from "../../validation/image.validation";
import { useForm } from "react-hook-form";

const UpdateExtraServiceFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  serviceId,
}: UpdateExtraServiceFormModalProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const extraServiceSchema = z
    .object({
      id: z.string(),
      serviceName: z
        .string()
        .min(1, t("extraService.validate.serviceNameRequired")),

      categoryId: z
        .string()
        .min(1, t("extraService.validate.categoryRequired")),

      description: z.string().optional(),

      note: z.string().optional(),

      extraCharge: z
        .string()
        .min(1, t("extraService.validate.extraChargeRequired"))
        .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
          message: t("extraService.validate.extraChargeInvalid"),
        }),
      image: z.any().optional(),
    })
    .superRefine((data, ctx) => {
      // nếu đã có preview (ảnh cũ từ backend) thì bỏ validate image
      if (preview) return;

      const imageValidation = createImageExtraServiceSchema(t).safeParse(
        data.image,
      );

      if (!imageValidation.success) {
        imageValidation.error.issues.forEach((issue) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["image"],
            message: issue.message,
          });
        });
      }
    });
  type FormData = z.infer<typeof extraServiceSchema>;
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      id: "",
      serviceName: "",
      categoryId: "",
      description: "",
      note: "",
      extraCharge: "",
      image: null,
    },
  });
  useEffect(() => {
    if (!isOpen || !serviceId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchCategories();
        const res = await findById(serviceId);
        const data = res?.data?.data;
        reset({
          id: data?.id?.toString() || "",
          serviceName: data?.serviceName || "",
          categoryId: data?.categoryId?.toString() || "",
          description: data?.description || "",
          note: data?.note || "",
          extraCharge: data?.extraCharge?.toString() || "",
          image: null,
        });

        setPreview(data?.icon?.url ? File_URL + data.icon.url : null);
      } catch (error) {
        showAlert({
          title: t("extraService.createOrUpdate.loadError"),
          type: "error",
        });

        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen, serviceId]);

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

  const onSubmit = async (data: FormData) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries({
          serviceName: data.serviceName.trim(),
          categoryId: Number(data.categoryId),
          description: data?.description?.trim(),
          note: data?.note?.trim(),
          extraCharge: data.extraCharge,
          image: data.image,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ]),
      );

      const response = await updateExtraService(Number(data.id), cleanedData);
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
    }
  };
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setValue("image", file, {
      shouldValidate: true,
    });

    clearErrors("image");
    setPreview(URL.createObjectURL(file));
  };
  const handleCancel = () => {
    reset();
    setPreview(null);
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
      onSave={handleSubmit(onSubmit)}
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
          {errors.image?.message && (
            <p className="text-red-500 text-sm mt-2">
              {String(errors.image.message)}
            </p>
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
            {...register("serviceName")}
            placeholder="Enter service name"
            className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
          />
          {errors.serviceName && (
            <p className="text-red-500 text-sm">{errors.serviceName.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("extraService.description")}
          </label>
          <textarea
            {...register("description")}
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
            {...register("categoryId")}
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
          {errors.categoryId && (
            <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("extraService.extraCharge")} *
          </label>
          <input
            type="number"
            {...register("extraCharge")}
            placeholder="Enter service extra charge"
            className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
            min={0}
          />
          {errors.extraCharge && (
            <p className="text-red-500 text-sm">{errors.extraCharge.message}</p>
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
export default UpdateExtraServiceFormModal;
