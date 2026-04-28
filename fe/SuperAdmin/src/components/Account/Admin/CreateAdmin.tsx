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
} from "@/type/Account/SuperAdmin/SuperAdminForm";
import { Loader2 } from "lucide-react"; // spinner icon
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/Breadcrumb";
import z from "zod";
import { createImageAdminSchema } from "@/validation/image.validation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateAdmin = () => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();

  const adminSchema = z.object({
    email: z
      .string()
      .min(1, t("admin.validation.emailRequired"))
      .email(t("admin.validation.emailInvalid")),

    fullName: z.string().min(1, t("admin.validation.fullNameRequired")),

    phone: z
      .string()
      .min(1, t("admin.validation.phoneRequired"))
      .regex(/^(0|\+84)[0-9]{9,10}$/, t("admin.validation.phoneInvalid")),
    birthday: z
      .date({
        error: t("admin.validation.birthdayRequired"),
      })
      .optional()
      .refine((value) => !!value, {
        message: t("admin.validation.birthdayRequired"),
      }),

    gender: z.string().min(1, t("admin.validation.genderRequired")),
    image: createImageAdminSchema(t),
  });
  type FormData = z.infer<typeof adminSchema>;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(adminSchema),
    mode: "all",
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      birthday: undefined,
      gender: "0",
      image: null,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const registerDTO = {
        email: data.email,
        idRole: 2,
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
      reset({
        email: "",

        fullName: "",
        gender: "0",
        phone: "",
        birthday: undefined,
        image: null,
      });
    } catch (error: any) {
      showAlert({
        title: t("adminCreate.error"),
        description: error?.response?.data?.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("adminCreate.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            <Breadcrumb
              items={[
                { label: t("adminCreate.breadcrumb.home"), href: "/Home" },
                {
                  label: t("adminCreate.breadcrumb.admin"),
                  href: "/Home/Admin",
                },
                { label: t("adminCreate.title") },
              ]}
            />
          </p>
        </div>
      </div>
      <div className="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-1">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {t("adminCreate.formTitle")}
            </h3>
          </div>
          <div className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div>
                <Label>{t("adminCreate.email")}</Label>
                <Input
                  placeholder={t("adminCreate.emailPlaceholder")}
                  type="email"
                  {...register("email")}
                  className="mt-3"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Tên đầy đủ */}
              <div>
                <Label>{t("adminCreate.fullName")}</Label>
                <Input
                  placeholder={t("adminCreate.fullNamePlaceholder")}
                  {...register("fullName")}
                  className="mt-3"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <Label>{t("adminCreate.phone")}</Label>
                <Input
                  placeholder={t("adminCreate.phonePlaceholder")}
                  {...register("phone")}
                  className="mt-3"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Ngày sinh */}
              <div>
                <Label>{t("adminCreate.birthday")}</Label>
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
                  <p className="text-red-500 text-xs mt-1">
                    {errors.birthday.message}
                  </p>
                )}
              </div>

              {/* Giới tính */}
              <div>
                <Label className="mb-3">{t("adminCreate.gender")}</Label>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <SelectField
                      isRequired
                      items={GENDER_OPTIONS}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      placeholder={t("adminCreate.genderPlaceholder")}
                      getValue={(item) => item.value}
                      getLabel={(item) => t(item.labelKey)}
                      clearable={false}
                    />
                  )}
                />

                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Avatar */}
              <div>
                <Label>{t("adminCreate.avatar")}</Label>
                <Controller
                  control={control}
                  name="image"
                  render={() => (
                    <UploadField
                      className="w-full mt-2"
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
                  <p className="text-red-500 text-xs mt-1">
                    {String(errors.image.message)}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <Button type="submit" disabled={isSubmitting || !isValid}>
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

export default CreateAdmin;
