import ChangePasswordModal from "@/components/Account/ChangePasswordModal";
import { useAlert } from "@/components/alert-context";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/ui/DatePickerField";
import { Input } from "@/components/ui/input";
import { getProfile, updateProfile } from "@/service/api/Authenticate";
import { File_URL } from "@/setting/constant/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

const EditProfilePage = () => {
  const { t } = useTranslation();
  const profileSchema = z.object({
    fullName: z.string().min(1, t("profile.validation.fullNameRequired")),

    phone: z.string().min(1, t("profile.validation.phoneRequired")),
    birthDate: z.date().optional(),
    gender: z.string(),
    avatar: z.any().optional(),
    createdAt: z.any().optional(),
  });
  const [isChangePassword, setIsChagePassword] = useState(false);
  type ProfileFormValues = z.infer<typeof profileSchema>;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      gender: "0",
    },
  });
  const gender = watch("gender");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!validTypes.includes(file.type)) {
      showAlert({
        title: "Only JPG, PNG or GIF allowed",
        type: "error",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showAlert({
        title: "Max file size is 2MB",
        type: "error",
      });
      return;
    }

    setAvatarFile(file);

    setValue("avatar", file);

    const previewUrl = URL.createObjectURL(file);

    setAvatarPreview(previewUrl);
  };
  const handleSave = async (data: ProfileFormValues) => {
    try {
      const payload = {
        fullName: data.fullName,
        phone: data.phone,
        birthday: data.birthDate
          ? data.birthDate.toISOString().split("T")[0]
          : null,
        gender: Number(data.gender),
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
    }
  };
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await getProfile();

      const profile = response?.data?.data;

      reset({
        fullName: profile?.fullName || "",
        phone: profile?.phone || "",
        gender: String(profile?.gender ?? "0"),
        birthDate: profile?.birthDate ? new Date(profile.birthDate) : undefined,
        createdAt: profile?.createdAt
          ? new Date(profile.createdAt).toLocaleDateString("vi-VN")
          : undefined,
      });

      setAvatarPreview(profile?.image?.url || null);

      setAvatarFile(null);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">{t("profile.loading")}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("profile.title")}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("profile.personalInfo")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />

                <div
                  onClick={handleAvatarClick}
                  className="relative group w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden cursor-pointer hover:border-[#6C80C2] transition"
                >
                  {avatarPreview ? (
                    <img
                      src={
                        avatarPreview.startsWith("blob:")
                          ? avatarPreview
                          : File_URL + avatarPreview
                      }
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  {/* Overlay */}
                  <div
                    className="absolute inset-0 bg-black/30 opacity-0
                    group-hover:opacity-100 transition flex items-center justify-center"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-2 text-center">
                  {t("profile.avatarNote1")} <br />
                  {t("profile.avatarNote2")}
                </p>
              </div>

              {/* Form */}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("profile.fullName")}
                  </label>

                  <Input
                    type="text"
                    className="h-11"
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("profile.phone")}
                  </label>

                  <Input
                    placeholder="Nhập số điện thoại"
                    type="text"
                    className="h-11"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("profile.birthday")}
                  </label>

                  <Controller
                    control={control}
                    name="birthDate"
                    render={({ field }) => (
                      <DatePickerField
                        placeholder="Chọn ngày sinh"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                {/* Gender */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    {t("profile.gender")}
                  </label>

                  <div className="flex items-center gap-6 h-11">
                    {/* Male */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="0"
                        {...register("gender")}
                        className="hidden peer"
                      />

                      <div
                        className="w-5 h-5 rounded-full border-2
                        border-gray-300 flex items-center justify-center
                        peer-checked:border-indigo-500 transition"
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full bg-indigo-500 transition ${
                            gender === "0" ? "scale-100" : "scale-0"
                          }`}
                        />
                      </div>

                      <span className="text-sm text-gray-700">
                        {t("profile.male")}
                      </span>
                    </label>

                    {/* Female */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="1"
                        {...register("gender")}
                        className="hidden peer"
                      />

                      <div
                        className="w-5 h-5 rounded-full border-2
                        border-gray-300 flex items-center justify-center
                        peer-checked:border-indigo-500 transition"
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full bg-indigo-500 transition ${
                            gender === "1" ? "scale-100" : "scale-0"
                          }`}
                        />
                      </div>

                      <span className="text-sm text-gray-700">
                        {t("profile.female")}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
              <Button
                onClick={handleSubmit(handleSave)}
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? t("profile.updating") : t("profile.update")}
              </Button>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {t("profile.security")}
              </h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">
                  {" "}
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
                  {" "}
                  {t("profile.role")}
                </p>
                <p className="font-medium text-gray-700">SuperAdmin</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase text-xs">
                  {t("profile.createdDate")}
                </p>
                <p className="font-medium text-gray-700">
                  {watch("createdAt")}
                </p>
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
    </div>
  );
};

export default EditProfilePage;
