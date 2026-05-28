import { useAlert } from "@/components/alert-context";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/ui/DatePickerField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select";
import UploadField from "@/components/ui/UploadField";
import { register as registerAccount } from "@/service/api/Authenticate";
import { format } from "date-fns";
import {
  GENDER_OPTIONS,
  type Gender,
  type SuperAdminForm,
} from "@/type/Account/SuperAdmin/SuperAdminForm";
import  { useState } from "react";
import { Loader2 } from "lucide-react"; // spinner icon
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/Breadcrumb";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateChildSuperAdmin = () => {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState<SuperAdminForm>({
    email: "",
    fullName: "",
    gender: "0",
    phone: "",
    birthday: undefined,
    image: null,
  });
  const { t } = useTranslation();
  const schema = z.object({
    email: z
      .string()
      .min(1, t("childSuperAdmin.validation.emailRequired"))
      .email(t("childSuperAdmin.validation.emailInvalid")),

    fullName: z.string().min(1, t("childSuperAdmin.validation.fullNameRequired")),

    phone: z
      .string()
      .min(1, t("childSuperAdmin.validation.phoneRequired"))
      .regex(/^(0|\+84)[0-9]{9,10}$/, t("childSuperAdmin.validation.phoneInvalid")),

    birthday: z
      .date({
        error: t("childSuperAdmin.validation.birthdayRequired"),
      })
      .optional(),

    gender: z.string().min(1, t("childSuperAdmin.validation.genderRequired")),

    image: z.any().refine((file) => !!file, {
      message: t("childSuperAdmin.validation.imageRequired"),
    }),
  });
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
      fullName: "",
      gender: "0",
      phone: "",
      birthday: undefined,
      image: null,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const registerDTO = {
        email: data.email,
        idRole: 5,
        gender: data.gender,
        fullName: data.fullName,
        phone: data.phone,
        birthday: data.birthday ? format(data.birthday, "yyyy-MM-dd") : null,
      };

      const response = await registerAccount(registerDTO, data.image);

      showAlert({
        title: response.message,
        type: "success",
        autoClose: 4000,
      });
      setFormData({
        email: "",
        fullName: "",
        gender: "0",
        phone: "",
        birthday: undefined,
        image: null,
      });
    } catch (error: any) {
      showAlert({
        title: t("childSuperAdmin.create.error"),
        description: error?.response?.data?.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    }
  };

 return (
  <div className="min-h-screen bg-gray-50 p-6 dark:bg-neutral-950">
    <div className="mx-auto mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {t("childSuperAdmin.title")}
        </h1>

        <Breadcrumb
          items={[
            { label: t("childSuperAdmin.breadcrumb.home"), href: "/Home" },
            {
              label: t("childSuperAdmin.breadcrumb.Child"),
              href: "/Home/ChildSuperAdmin",
            },
            { label: t("adminCreate.title") },
          ]}
        />
      </div>
    </div>

    <div className="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-1">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t("childSuperAdmin.form.info")}
          </h3>
        </div>

        {/* BODY */}
        <div className="p-6">
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email */}
            <div>
              <Label className="dark:text-gray-200">
                {t("common.email")}
              </Label>

              <Input
                placeholder={t("childSuperAdmin.form.emailPlaceholder")}
                type="email"
                {...register("email")}
                className="mt-3 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-gray-500"
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <Label className="dark:text-gray-200">
                {t("common.fullName")}
              </Label>

              <Input
                placeholder={t("childSuperAdmin.form.fullNamePlaceholder")}
                {...register("fullName")}
                className="mt-3 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-gray-500"
              />

              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label className="dark:text-gray-200">
                {t("common.phone")}
              </Label>

              <Input
                placeholder={t("childSuperAdmin.form.phonePlaceholder")}
                {...register("phone")}
                className="mt-3 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-gray-500"
              />

              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Birthday */}
            <div>
              <Label className="dark:text-gray-200">
                {t("common.birthday")}
              </Label>

              <Controller
                control={control}
                name="birthday"
                render={({ field }) => (
                  <DatePickerField
                    value={field.value}
                    onChange={field.onChange}
                    className="mt-3"
                    placeholder={t("adminCreate.birthdayPlaceholder")}
                  />
                )}
              />

              {errors.birthday && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.birthday.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <Label className="mb-3 dark:text-gray-200">
                {t("common.gender")}
              </Label>

              <SelectField
                isRequired={true}
                items={GENDER_OPTIONS}
                value={formData.gender}
                onChange={(val) => {
                  setFormData((prev) => ({
                    ...prev,
                    gender: val as Gender,
                  }));

                  setValue("gender", String(val), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                placeholder={t(
                  "childSuperAdmin.form.genderPlaceholder",
                )}
                getValue={(item) => item.value}
                getLabel={(item) => t(item.labelKey)}
                clearable={false}
              />

              {errors.gender && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Avatar */}
            <div>
              <Label className="dark:text-gray-200">
                {t("common.avatar")}
              </Label>

              <Controller
                control={control}
                name="image"
                render={() => (
                  <UploadField
                    className="mt-2 w-full"
                    value={watch("image")}
                    onChange={(files) =>
                      setValue("image", files?.[0] ?? null, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  />
                )}
              />

              {errors.image && (
                <p className="mt-1 text-xs text-red-500">
                  {String(errors.image.message)}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="dark:border-neutral-700"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("common.saving")}
                </span>
              ) : (
                t("common.save")
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
};

export default CreateChildSuperAdmin;
