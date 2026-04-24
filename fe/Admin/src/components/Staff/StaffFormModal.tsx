import { useState } from "react";
import CommonModal from "../ui/CommonModal";
import { useAlert } from "../alert-context";
import { create } from "../../service/api/Staff";
import CustomDatePicker from "../ui/CustomDatePicker";
import { useTranslation } from "react-i18next";
import type { StaffFormModalProps } from "../../type/staff.types";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const StaffFormModal = ({
  isOpen,
  onClose,
  onSuccess,
}: StaffFormModalProps) => {
  const { t } = useTranslation();

  const staffSchema = z.object({
    fullName: z.string().trim().min(1, t("staff.validate.fullNameRequired")),
    email: z
      .string()
      .trim()
      .min(1, t("staff.validate.emailRequired"))
      .email(t("staff.validate.emailInvalid")),
    gender: z.string(),

    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[0-9]{9,11}$/.test(val),
        t("staff.validate.phoneInvalid"),
      ),

    role: z.string(),

    birthday: z.date({
      error: t("staff.validate.birthdayRequired"),
    }),
  });
  type StaffForm = z.infer<typeof staffSchema>;
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<StaffForm>({
    resolver: zodResolver(staffSchema),
    mode:"onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      gender: "0",
      phone: "",
      role: "3",
      birthday: undefined,
    },
  });

  const { showAlert } = useAlert();

  const handleSave = async (data: StaffForm) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries({
          email: data?.email,
          fullName: data.fullName,
          gender: data.gender,
          phone: data.phone,
          idRole: data.role,
          birthday: data.birthday
            ? data.birthday.toISOString().split("T")[0]
            : null,
          isActive: true,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ]),
      );
      const response = await create(cleanedData);
      const message = response?.data?.message || t("staff.createSucess");

      showAlert({
        title: message,
        type: "success",
        autoClose: 3000,
      });
      reset();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Create error:", err);
      showAlert({
        title: err?.response?.data?.message || t("staff.createError"),
        type: "error",
        autoClose: 4000,
      });
    }
  };
  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={t("staff.create.titleCreate")}
      onSave={handleSubmit(handleSave)}
      saveLabel={isSubmitting ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      width="w-[95vw] sm:w-[90vw] lg:w-[700px]"
      diabled={!isValid || isSubmitting}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("staff.fullName")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("fullName")}
            placeholder={t("staff.create.enterFullName")}
            className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("email")}
            placeholder="Enter Email"
            className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-[15px] font-semibold text-gray-700 mb-1">
            {t("staff.gender")} <span className="text-red-500">*</span>
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-2">
            {/* MALE */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="0"
                checked={watch("gender") === "0"}
                {...register("gender")}
                className="hidden peer"
              />

              {/* Custom radio */}
              <span
                className="
          h-4 w-4 rounded-full border
          border-gray-400 
          peer-checked:border-[#42578E]
          peer-checked:bg-[#42578E]
          transition
        "
              ></span>

              <span
                className="
          text-gray-700 
          peer-checked:text-[#42578E]
        "
              >
                {t("staff.create.male")}
              </span>
            </label>

            {/* FEMALE */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="1"
                checked={watch("gender") === "1"}
                {...register("gender")}
                className="hidden peer"
              />

              {/* Custom radio */}
              <span
                className="
          h-4 w-4 rounded-full border
          border-gray-400 
          peer-checked:border-[#42578E]
          peer-checked:bg-[rgb(66,87,142)]
          transition
        "
              ></span>

              <span
                className="
          text-gray-700 
          peer-checked:text-[#42578E]
        "
              >
                {t("staff.create.female")}
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("staff.phone")}
          </label>
          <input
            type="text"
            {...register("phone")}
            placeholder={t("staff.create.enterphone")}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("staff.dob")} <span className="text-red-500">*</span>
          </label>
          <Controller
            name="birthday"
            control={control}
            render={({ field }) => (
              <CustomDatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder={t("staff.create.selectDate")}
              />
            )}
          />
          {errors.birthday && (
            <p className="text-red-500 text-sm">{errors.birthday.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("staff.role")} <span className="text-red-500">*</span>
          </label>
          <select
            {...register("role")}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            <option value="3">{t("staff.create.receiption")}</option>
            <option value="4">Marketing</option>
          </select>
        </div>
      </div>
    </CommonModal>
  );
};
export default StaffFormModal;
