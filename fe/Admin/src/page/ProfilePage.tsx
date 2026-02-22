import { Camera, IdCard, Mail, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getProfile, updateProfile } from "../service/api/Authenticate";
import { useAlert } from "../components/alert-context";
import { File_URL } from "../setting/constant/app";
import ChangePasswordModal from "../components/Authentication/ChangePasswordModal";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [isChangePassword, setIsChagePassword] = useState(false);
  const { t } = useTranslation();
  const [formData, setFormData] = useState<any>({
    staffCode: "",
    email: "",
    fullName: "",
    phone: "",
    isActive: false,
    birthday: "",
    createdAt: "",
    gender: "",
    hotelName: "",
  });
  const { showAlert } = useAlert();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, PNG or GIF allowed");
      return;
    }

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Max file size is 2MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      const profile = response.data.data;

      setFormData({
        staffCode: profile.staffCode || "",
        email: profile.email || "",
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        isActive: profile.isActive || false,
        birthday: profile.birthday || "",
        hotelName: profile.hotelName || "",
        gender: profile.gender || "",
        createdAt: profile.createdAt || "",
      });
      setAvatarPreview(profile.image?.url || null);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [uploading, setUploading] = useState(false);
  const handleSave = async () => {
    try {
      setUploading(true);
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        birthday: formData.birthday,
        gender: formData.gender,
        image: avatarFile,
      };
      const response = await updateProfile(payload);
      showAlert({
        title: response.data.message,
        type: "success",
        autoClose: 3000,
      });
      fetchProfile();
      setAvatarFile(null);
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#6C80C2] rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">{t("profile.loading")}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-700">
          {t("profile.title")}
        </h1>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                {t("profile.personalInfo")}
              </h2>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  formData.isActive
                    ? "bg-[#EEF1FB] text-[#6C80C2]"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {formData.isActive
                  ? t("profile.active")
                  : t("profile.inactive")}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center">
                {/* Hidden input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAvatarChange}
                />

                {/* Avatar Box */}
                <div
                  onClick={handleAvatarClick}
                  className="relative w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-[#6C80C2] transition flex items-center justify-center overflow-hidden"
                >
                  {avatarPreview ? (
                    <img
                      src={File_URL + avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-6 h-6 text-gray-400" />
                  )}

                  {/* Overlay icon */}
                  <div className="absolute bottom-2 right-2 bg-[#6C80C2] p-1 rounded-full">
                    <Camera className="w-3 h-3 text-white" />
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-2 text-center">
                  {t("profile.avatarNote1")} <br />
                  {t("profile.avatarNote2")}
                </p>
              </div>
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-[#253150] mb-1">
                    {t("profile.staffCode")}
                  </label>

                  <div className="relative">
                    {/* Icon */}
                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    {/* Input */}
                    <input
                      type="text"
                      name="staffCode"
                      value={formData.staffCode}
                      disabled
                      className="w-full
                      pl-10 pr-3 py-2
                      text-sm rounded-lg
                      border border-gray-200
                      bg-gray-50 text-gray-500
                      cursor-not-allowed disabled:bg-gray-100
                      disabled:text-gray-400 disabled:border-gray-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#253150] mb-1">
                    {t("profile.email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      value={formData.email}
                      name="email"
                      disabled
                      className="
                         w-full
                         pl-10 pr-3 py-2
                         text-sm
                         rounded-lg
                         border border-gray-200
                         bg-gray-50
                         text-gray-50
                         cursor-not-allowed
                         disabled:bg-gray-100
                         disabled:text-gray-400
                         disabled:border-gray-200
                         "
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#253150] mb-1">
                    {t("profile.fullName")}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    onChange={handleChange}
                    disabled={uploading}
                    value={formData.fullName}
                    className="w-full border border-gray-200 outline-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6C80C2] focus:border-[#6C80C2]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t("profile.phone")}
                  </label>
                  <input
                    type="text"
                    name="phone"
                    disabled={uploading}
                    onChange={handleChange}
                    value={formData.phone}
                    className="w-full border outline-none border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6C80C2] focus:border-[#6C80C2]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t("profile.birthday")}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="birthday"
                      disabled={uploading}
                      onChange={handleChange}
                      value={formData.birthday}
                      className="w-full border outline-none border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6C80C2] focus:border-[#6C80C2]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t("profile.gender")}
                  </label>
                  <select
                    value={formData.gender}
                    name="gender"
                    onChange={handleChange}
                    disabled={uploading}
                    className="w-full border outline-none border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6C80C2] focus:border-[#6C80C2]"
                  >
                    <option value="0">{t("profile.male")}</option>
                    <option value="1">{t("profile.female")}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
              <button className="text-gray-600 text-sm font-medium hover:text-gray-800">
                {t("common.discard")}
              </button>
              <button
                onClick={handleSave}
                disabled={uploading}
                className={`
    flex items-center gap-2
    bg-[#6C80C2] text-white px-5 py-2 rounded-lg
    text-sm font-medium transition
    ${uploading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#5A6EB3]"}
  `}
              >
                {uploading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {uploading ? t("profile.updating") : t("profile.update")}
              </button>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            {/* Header có border bottom */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {t("profile.security")}
              </h2>
            </div>

            {/* Content */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">
                  {t("profile.changePassword")}
                </p>
                <p className="text-sm text-gray-500">
                  {t("profile.securityDesc")}
                </p>
              </div>

              <button
                onClick={() => setIsChagePassword(true)}
                className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                {t("profile.changePassword")}
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="border-b border-gray-200 pb-4 mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                {t("profile.accountDetails")}
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-400 uppercase text-xs">
                  {t("profile.role")}
                </p>
                <p className="font-medium text-gray-700">
                  System Administrator
                </p>
              </div>
              <div>
                <p className="text-gray-400 uppercase text-xs">
                  {t("profile.assignedHotel")}
                </p>
                <p className="font-medium text-gray-700">
                  {formData.hotelName}
                </p>
              </div>

              <div>
                <p className="text-gray-400 uppercase text-xs">
                  {t("profile.createdDate")}
                </p>
                <p className="font-medium text-gray-700">
                  {" "}
                  {formData.createdAt
                    ? new Date(formData.createdAt).toLocaleDateString("vi-VN")
                    : ""}
                </p>
              </div>
              <div className="bg-[#EEF1FB] text-[#6C80C2] text-xs p-3 rounded-lg">
                {t("profile.roleNote")}
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {t("profile.twoFactor")}
              </h2>
            </div>

            {/* Content */}
            <div className="px-6 py-6 flex items-start gap-4">
              {/* Icon box */}
              <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>

              {/* Text content */}
              <div className="space-y-2">
                <p className="font-semibold text-gray-800">
                  {t("profile.notEnabled")}
                </p>

                <p className="text-sm text-gray-500">
                  {t("profile.twoFactorDesc")}
                </p>

                <button className="text-[#6C80C2] text-sm font-semibold hover:underline">
                  {t("profile.enable2fa")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal
        open={isChangePassword}
        onClose={() => setIsChagePassword(false)}
        onSubmit={() => fetchProfile()}
      />
    </div>
  );
};
export default ProfilePage;
