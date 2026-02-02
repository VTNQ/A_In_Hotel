import { useAlert } from "@/components/alert-context";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/ui/DatePickerField";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { getAllHotel } from "@/service/api/Hotel";
import { createStaff } from "@/service/api/Staff";
import type { StaffForm } from "@/type/Staff.type";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CreateStaffPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StaffForm>({
    email: "",
    fullName: "",
    gender: "0",
    phone: "",
    birthday: undefined,
    idRole: "3",
    hotelId: "",
  });
  const [loading, setLoading] = useState(false);
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    fetchHotels();
  }, []);
  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const cleanedData = Object.fromEntries(
        Object.entries({
          email: formData.email,
          fullName: formData.fullName,
          gender: formData.gender,
          phone: formData.phone,
          idRole: formData.idRole,
          hotelId: formData.hotelId,
          birthday: formData.birthday
            ? formData.birthday.toISOString().split("T")[0]
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
      setFormData({
        email: "",
        fullName: "",
        gender: "0",
        phone: "",
        birthday: undefined,
        idRole: "3",
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
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">
              {t("staff.fullName")}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <Input
              name="fullName"
              placeholder={t("staff.create.enterFullName")}
              onChange={handleChange}
              value={formData.fullName}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Email
              <span className="ml-1 text-red-500">*</span>
            </label>
            <Input
              name="email"
              placeholder={t("staff.create.enterEmail")}
              onChange={handleChange}
              value={formData.email}
              className="mt-1"
            />
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
                  name="gender"
                  value="0"
                  checked={formData.gender === "0"}
                  onChange={handleChange}
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
                  name="gender"
                  value="1"
                  checked={formData.gender === "1"}
                  onChange={handleChange}
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
              name="phone"
              placeholder={t("staff.create.enterphone")}
              onChange={handleChange}
              value={formData.phone}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              {t("staff.dob")}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <DatePickerField
              value={formData.birthday}
              onChange={(d?: Date) =>
                setFormData((p) => ({ ...p, birthday: d }))
              }
              className="mt-1"
              placeholder={t("staff.birthdayPlaceholder")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {t("staff.role")}
              <span className="ml-1 text-red-500">*</span>
            </label>

            <SelectField
              isRequired
              items={[
                { value: "3", label: t("staff.create.receiption") },
                { value: "4", label: "Marketing" },
              ]}
              value={formData.idRole}
              onChange={(v) => setFormData((p) => ({ ...p, idRole: v }))}
              size="sm"
              fullWidth
              getValue={(i) => i.value}
              getLabel={(i) => i.label}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            {t("staff.hotel")}
            <span className="ml-1 text-red-500">*</span>
          </label>
          <SelectField
            isRequired
            items={hotels}
            value={formData.hotelId}
            placeholder={t("staff.selectHotel")}
            onChange={(v) => setFormData((p) => ({ ...p, hotelId: v }))}
            size="sm"
            fullWidth
            getValue={(i) => String(i.id)}
            getLabel={(i: any) => i.name}
          />
        </div>
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => navigate("/Home/staff")}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="min-w-[140px]"
          >
            {loading ? (
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
