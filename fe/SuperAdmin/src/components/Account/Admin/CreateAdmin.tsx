import { useAlert } from "@/components/alert-context";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/ui/DatePickerField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select";
import UploadField from "@/components/ui/UploadField";
import { register } from "@/service/api/Authenticate";
import { format } from "date-fns";
import { GENDER_OPTIONS, type Gender, type SuperAdminForm } from "@/type/Account/SuperAdmin/SuperAdminForm";
import React, { useState } from "react";
import { Loader2 } from "lucide-react"; // spinner icon
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/Breadcrumb";

const CreateAdmin = () => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false); // ✅ state loading
  const [formData, setFormData] = useState<SuperAdminForm>({
    email: "",

    fullName: "",
    gender: "0",
    phone: "",
    birthday: undefined,
    image: null,
  });

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBirthDay = (d?: Date) => {
    setFormData((p) => ({ ...p, birthday: d }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true); // ✅ bật loading
      const registerDTO = {
        email: formData.email,
        idRole: 2,
        gender: formData.gender,
        fullName: formData.fullName,
        phone: formData.phone,
        birthday: formData.birthday
          ? format(formData.birthday, "yyyy-MM-dd")
          : null,
      };


      const response = await register(registerDTO, formData.image);

      showAlert({
        title: response.message,
        type: "success",
        autoClose: 4000,
      })
      setFormData({
        email: "",

        fullName: "",
        gender: "0",
        phone: "",
        birthday: undefined,
        image: null,
      })
    } catch (error: any) {
      showAlert({
        title: t("adminCreate.error"),
        description:
          error?.response?.data?.message ||
          t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setLoading(false); // ✅ tắt loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("adminCreate.title")}</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Breadcrumb
              items={[
                { label: t("adminCreate.breadcrumb.home"), href: "/Home" },
                { label: t("adminCreate.breadcrumb.admin"), href: "/Home/Admin" },
                { label: t("adminCreate.title") },
              ]}
            />
          </p>
        </div>
      </div>
      <div className="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-1">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <h3 className="text-lg font-semibold text-gray-800">{t("adminCreate.formTitle")}</h3>
          </div>
          <div className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <Label>{t("adminCreate.email")}</Label>
                <Input
                  name="email"
                  placeholder={t("adminCreate.emailPlaceholder")}
                  type="email"
                  value={formData.email}
                  onChange={handleTextChange}
                  className="mt-3"
                />
              </div>

              {/* Tên đầy đủ */}
              <div>
                <Label>{t("adminCreate.fullName")}</Label>
                <Input
                  name="fullName"
                  placeholder={t("adminCreate.fullNamePlaceholder")}
                  value={formData.fullName}
                  onChange={handleTextChange}
                  className="mt-3"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <Label>{t("adminCreate.phone")}</Label>
                <Input
                  name="phone"
                  placeholder={t("adminCreate.phonePlaceholder")}
                  value={formData.phone}
                  onChange={handleTextChange}
                  className="mt-3"
                />
              </div>

              {/* Ngày sinh */}
              <div>
                <Label>{t("adminCreate.birthday")}</Label>
                <DatePickerField
                  value={formData.birthday}
                  onChange={handleBirthDay}
                  className="mt-3"
                  placeholder={t("adminCreate.birthdayPlaceholder")}
                />
              </div>

              {/* Giới tính */}
              <div>
                <Label className="mb-3">{t("adminCreate.gender")}</Label>
                <SelectField
                isRequired={true}
                  items={GENDER_OPTIONS}
                  value={formData.gender}
                  onChange={(val) => {
                    setFormData((prev) => ({
                      ...prev,
                      gender: val as Gender,
                    }));
                  }}

                  placeholder={t("adminCreate.genderPlaceholder")}
                  getValue={(item) => item.value}
                  getLabel={(item) => t(item.labelKey)}
                  clearable={false}
                />
              </div>

              {/* Avatar */}
              <div>
                <Label>{t("adminCreate.avatar")}</Label>
                <UploadField
                  className="w-full mt-2"
                  value={formData.image}
                  onChange={(files) =>
                    setFormData((p) => ({
                      ...p,
                      image: files?.[0] ?? null,
                    }))
                  }
                />
              </div>

              {/* Submit button */}
              <Button type="submit" disabled={loading}>
                {loading ? (
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
