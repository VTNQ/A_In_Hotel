import { useAlert } from "@/components/alert-context";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/ui/DatePickerField";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { getAllHotel } from "@/service/api/Hotel";
import { createStaff } from "@/service/api/Staff";
import type { StaffForm } from "@/type/Staff.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import z from "zod";

const CreateStaffPage = () => {
  const { t } = useTranslation();
  const staffSchema = z.object({
    fullName: z.string().trim().min(1, t("staff.validate.fullNameRequired")),
    hotelId: z.string().trim().min(1, t("staff.validate.hotelRequired")),
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
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      gender: "0",
      phone: "",
      hotelId: "",
      role: "3",
      birthday: undefined,
    },
  });
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const { showAlert } = useAlert();
  const fetchHotels = async () => {
    try {
      const response = await getAllHotel({
        all: true,
        filter: "status==1",
      });
      setHotels(response.data.content);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);
  const onSubmit = async (data: StaffForm) => {
    try {
    
      const cleanedData = Object.fromEntries(
        Object.entries({
          email: data.email,
          fullName: data.fullName,
          gender: data.gender,
          phone: data.phone,
          idRole: data.role,
          hotelId: data.hotelId,
          birthday: data.birthday
            ? data.birthday.toISOString().split("T")[0]
            : null,
          isActive: true,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ]),
      );
      const response = await createStaff(cleanedData);
      const message = response?.data?.message || t("staff.createSucess");

      showAlert({
        title: message,
        type: "success",
        autoClose: 3000,
      });
      reset({
        email: "",
        fullName: "",
        gender: "0",
        phone: "",
        birthday: undefined,
        role: "3",
        hotelId: "",
      });
    } catch (err: any) {
      showAlert({
        title: err?.response?.data?.message || t("staff.createError"),
        type: "error",
        autoClose: 4000,
      });
    }
  };
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("staff.create.titleCreate")}
        </h1>
        <Breadcrumb
          items={[
            { label: t("common.home"), href: "/Home" },
            { label: t("staff.title"), href: "/Home/staff" },
            { label: t("staff.create.titleCreate") },
          ]}
        />
      </div>
      <div className="rounded-xl border bg-white p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">
              {t("staff.fullName")}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <Input
              placeholder={t("staff.create.enterFullName")}
              {...register("fullName")}
              className="mt-1"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">
              Email
              <span className="ml-1 text-red-500">*</span>
            </label>
            <Input
              placeholder={t("staff.create.enterEmail")}
              {...register("email")}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("staff.gender")}
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-3">
              {/* ===== MALE ===== */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  value="0"
                  checked={watch("gender") === "0"}
                  {...register("gender")}
                  className="sr-only peer"
                />

                <span
                  className="h-4 w-4 rounded-full
                  border border-gray-300
                  bg-white transition
                  peer-checked:bg-indigo-500
                  peer-checked:border-indigo-500
                  group-hover:border-gray-400"
                />

                <span
                  className="text-sm text-gray-600
                  peer-checked:text-gray-900"
                >
                  {t("staff.create.male")}
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  value="1"
                  checked={watch("gender") === "1"}
                  {...register("gender")}
                  className="sr-only peer"
                />

                <span
                  className="h-4 w-4 rounded-full
                  border border-gray-300 bg-white
                  transition peer-checked:bg-indigo-500
                  peer-checked:border-indigo-500
                  group-hover:border-gray-400"
                />

                <span className="text-sm text-gray-600 peer-checked:text-gray-900">
                  {t("staff.create.female")}
                </span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">
              {t("staff.phone")}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <Input
              placeholder={t("staff.create.enterphone")}
              {...register("phone")}
              className="mt-1"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">
              {t("staff.dob")}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <DatePickerField
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("staff.birthdayPlaceholder")}
                />
              )}
            />
            {errors.birthday && (
              <p className="text-red-500 text-sm">{errors.birthday.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {t("staff.role")}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <SelectField
                  isRequired
                  items={[
                    { value: "3", label: t("staff.create.receiption") },
                    { value: "4", label: "Marketing" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  size="sm"
                  fullWidth
                  getValue={(i) => i.value}
                  getLabel={(i) => i.label}
                />
              )}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            {t("staff.hotel")}
            <span className="ml-1 text-red-500">*</span>
          </label>
          <Controller
            name="hotelId"
            control={control}
            render={({ field }) => (
              <SelectField
                isRequired
                items={hotels}
                value={field.value}
                placeholder={t("staff.selectHotel")}
                onChange={field.onChange}
                size="sm"
                fullWidth
                getValue={(i) => String(i.id)}
                getLabel={(i: any) => i.name}
              />
            )}
          />
        </div>
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => navigate("/Home/staff")}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || !isValid}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
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
export default CreateStaffPage;
