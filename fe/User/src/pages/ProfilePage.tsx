import { Eye, EyeOff, Lock, LogOut, Pencil, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import type { accountProfile, ChangePasswordFormValues } from "../type/user.type";
import { useEffect, useState } from "react";
import { getProfile, updateProfile, changePassword } from "../service/api/Authenticate";
import { useAlert } from "../components/alert-context";
import { File_URL } from "../setting/constant/app";
import { clearTokens } from "../util/auth";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showAlert } = useAlert();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<accountProfile & { avatar: FileList }>({
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    watch: watchPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<ChangePasswordFormValues>({
    mode: "onBlur",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword:""
    },
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const values = watch();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await getProfile();
        reset({
          firstName: profile?.data?.firstName || "",
          lastName: profile?.data?.lastName || "",
          email: profile?.data?.email || "",
          phone: profile?.data?.phoneNumber || "",
        });
        setAvatarPreview(File_URL + profile?.data?.image?.url || "");
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);
  const navigate = useNavigate();
  const avatarRegister = register("avatar", {
    validate: {
      fileSize: (files) => {
        if (!files?.[0]) return true;

        return (
          files[0].size <= 2 * 1024 * 1024 || "Avatar must be smaller than 2MB"
        );
      },

      fileType: (files) => {
        if (!files?.[0]) return true;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        return (
          allowedTypes.includes(files[0].type) || "Only JPG, PNG, WEBP allowed"
        );
      },
    },
  });
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  const onSubmit = async (data: accountProfile & { avatar: FileList }) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        image: data.avatar[0],
      };
      await updateProfile(payload);
      setEditing(false);
      showAlert({
        title: "Cập nhật thành công!",
        type: "success",
        autoClose: 3000,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onChangePasswordSubmit = async (data: any) => {
    try {
      await changePassword({
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      showAlert({
        title: "Đổi mật khẩu thành công!",
        type: "success",
        autoClose: 3000,
      });
      setIsChangingPassword(false);
      resetPasswordForm();
    } catch (err: any) {
      showAlert({
        title: "Đổi mật khẩu thất bại!",
        description: err.response?.data?.message || "Mật khẩu cũ không chính xác.",
        type: "error",
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="bg-[#F6F3F0]">
      <div className="max-w-[1280px] mx-auto py-[120px] ">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <aside className="md:col-span-3 space-y-10">
            <div className="flex flex-col items-start gap-4">
              <div className="relative group w-32 h-32">
                <div
                  className="w-full h-full border border-[rgba(113,121,118)]/20
    p-1 rounded-2xl bg-white shadow-sm overflow-hidden"
                >
                  <img
                    className="w-full h-full object-cover rounded-xl"
                    src={
                      avatarPreview ||
                      "https://ui-avatars.com/api/?name=User&background=0D9488&color=fff"
                    }
                  />
                </div>

                {editing && (
                  <>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-1 rounded-xl bg-black/40
        opacity-0 group-hover:opacity-100 transition-all
        flex items-center justify-center cursor-pointer"
                    >
                      <span className="text-white text-sm font-medium text-center px-2">
                        Change Avatar
                      </span>
                    </label>

                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      {...avatarRegister}
                      onChange={(e) => {
                        avatarRegister.onChange(e);

                        const file = e.target.files?.[0];

                        if (file) {
                          setAvatarPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </>
                )}
              </div>
              <div>
                <h2 className="text-[24px] leading-6 font-headline font-normal text-[rgb(1,38,31)]">
                  {values.firstName?.split(" ")[0]}
                </h2>
                <span className="font-serif text-[rgb(149,72,36)] uppercase tracking-widest">
                  Village Member
                </span>
              </div>
              <nav className="flex flex-col border-l border-[rgb(113,121,118)]/10">
                <a
                  className="px-6 py-4 border-l-2 border-[rgb(1,38,31)] text-[rgb(1,38,31)]
                font-bold bg-[rgb(251,242,237)] transition-all"
                >
                  Profile
                </a>
                <a
                  className="px-6 py-4 border-l-2 border-transparent text-[rgb(1,38,31)]
                  hover:text-[rgb(1,38,31)] hover:bg-[rgb(251,242,237)] transition-all"
                >
                  Bookings
                </a>
                <a
                  className="px-6 py-4 border-l-2 border-transparent text-[rgb(1,38,31)]
                  hover:text-[rgb(1,38,31)] hover:bg-[rgb(251,242,237)] transition-all"
                >
                  Rewards
                </a>
                <a
                  className="px-6 py-4 border-l-2 border-transparent text-[rgb(1,38,31)]
                  hover:text-[rgb(1,38,31)] hover:bg-[rgb(251,242,237)] transition-all"
                >
                  Settings
                </a>
                <div className="pt-8 mt-8 border-t border-[rgb(113,121,118)]/10">
                  <button
                    onClick={()=>{
                      clearTokens();
                      navigate("/");
                    }}
                    className="px-6 py-4 text-[rgb(186,26,26)] font-serif tracking-widest
                    hover:opacity-70 transition-all flex items-center gap-2 "
                  >
                    <LogOut /> Logout
                  </button>
                </div>
              </nav>
            </div>
          </aside>
          <section className="md:col-span-9">
            <header className="space-y-5">
              <h1
                className="text-[48px] leading-3 font-normal text-[rgb(1,38,31)]"
                style={{ letterSpacing: "-0.02em" }}
              >
                Welcome back, {values.firstName}.
              </h1>
              <p className="font-serif text-[rgb(65,72,70)] max-w-2xl">
                You have been part of our village community since 2022. Explore
                your upcoming stays or manage your personal architectural
                preferences below.
              </p>
            </header>
            <form onSubmit={handleSubmit(onSubmit)} className="py-20">
              <div
                className="flex flex-col md:flex-row md:items-end md:justify-between gap-4
    border-b border-[rgb(113,121,118)]/20 pb-6"
              >
                <div>
                  <h3 className="text-[rgb(1,38,31)] text-[28px] font-normal">
                    Personal Information
                  </h3>

                  <p className="text-[rgb(65,72,70)] font-serif mt-2">
                    Manage your personal details and contact information.
                  </p>
                </div>

                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="h-11 px-5 bg-[rgb(1,38,31)] text-white rounded-xl
        hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Pencil size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        reset();
                        setEditing(false);
                      }}
                      className="h-11 px-5 border border-[rgb(113,121,118)]/20 rounded-xl
          bg-white hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="h-11 px-5 bg-[rgb(1,38,31)] text-white rounded-xl
          hover:opacity-90 transition-all flex items-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <Save size={16} />
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                {/* Full Name */}
                {/* First Name */}
                <div
                  className="bg-white border border-[rgb(113,121,118)]/10 rounded-2xl
  p-6 shadow-sm"
                >
                  <label
                    className="block text-[12px] tracking-[0.2em] uppercase
    text-[rgb(65,72,70)] mb-3"
                  >
                    First Name
                  </label>

                  {editing ? (
                    <>
                      <input
                        type="text"
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                        className="w-full h-12 px-4 rounded-xl border
        border-[rgb(113,121,118)]/20 bg-[#faf8f6]
        outline-none focus:border-[rgb(149,72,36)]
        transition-all"
                      />

                      {errors.firstName && (
                        <p className="text-sm text-red-500 mt-2">
                          {errors.firstName.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[18px] text-[rgb(30,27,24)] font-medium">
                      {values.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div
                  className="bg-white border border-[rgb(113,121,118)]/10 rounded-2xl
  p-6 shadow-sm"
                >
                  <label
                    className="block text-[12px] tracking-[0.2em] uppercase
    text-[rgb(65,72,70)] mb-3"
                  >
                    Last Name
                  </label>

                  {editing ? (
                    <>
                      <input
                        type="text"
                        {...register("lastName", {
                          required: "Last name is required",
                        })}
                        className="w-full h-12 px-4 rounded-xl border
        border-[rgb(113,121,118)]/20 bg-[#faf8f6]
        outline-none focus:border-[rgb(149,72,36)]
        transition-all"
                      />

                      {errors.lastName && (
                        <p className="text-sm text-red-500 mt-2">
                          {errors.lastName.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[18px] text-[rgb(30,27,24)] font-medium">
                      {values.lastName}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div
                  className="bg-white border border-[rgb(113,121,118)]/10 rounded-2xl
      p-6 shadow-sm"
                >
                  <label
                    className="block text-[12px] tracking-[0.2em] uppercase
        text-[rgb(65,72,70)] mb-3"
                  >
                    Email Address
                  </label>

                  {editing ? (
                    <>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          },
                        })}
                        className="w-full h-12 px-4 rounded-xl border
            border-[rgb(113,121,118)]/20 bg-[#faf8f6]
            outline-none focus:border-[rgb(149,72,36)]
            transition-all"
                      />

                      {errors.email && (
                        <p className="text-sm text-red-500 mt-2">
                          {errors.email.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[18px] text-[rgb(30,27,24)] font-medium break-all">
                      {values.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div
                  className=" bg-white border border-[rgb(113,121,118)]/10
      rounded-2xl p-6 shadow-sm"
                >
                  <label
                    className="block text-[12px] tracking-[0.2em] uppercase
        text-[rgb(65,72,70)] mb-3"
                  >
                    Phone Number
                  </label>

                  {editing ? (
                    <>
                      <input
                        type="text"
                        {...register("phone", {
                          required: "Phone number is required",
                        })}
                        className="w-full h-12 px-4 rounded-xl border
            border-[rgb(113,121,118)]/20 bg-[#faf8f6]
            outline-none focus:border-[rgb(149,72,36)]
            transition-all"
                      />

                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-2">
                          {errors.phone.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[18px] text-[rgb(30,27,24)] font-medium">
                      {values.phone}
                    </p>
                  )}
                </div>
              </div>
            </form>

            {/* Security Section */}
            <div className="py-10 border-t border-[rgb(113,121,118)]/10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[rgb(113,121,118)]/20 pb-6">
                <div>
                  <h3 className="text-[rgb(1,38,31)] text-[28px] font-normal">Security</h3>
                  <p className="text-[rgb(65,72,70)] font-serif mt-2">
                    Update your password to keep your account secure.
                  </p>
                </div>

                {!isChangingPassword ? (
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(true)}
                    className="h-11 px-5 border border-[rgb(1,38,31)] text-[rgb(1,38,31)] rounded-xl
                    hover:bg-[rgb(1,38,31)] hover:text-white transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Lock size={16} />
                    Change Password
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        resetPasswordForm();
                      }}
                      className="h-11 px-5 border border-[rgb(113,121,118)]/20 rounded-xl
                      bg-white hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>

                    <button
                      form="password-form"
                      type="submit"
                      disabled={isPasswordSubmitting}
                      className="h-11 px-5 bg-[rgb(1,38,31)] text-white rounded-xl
                      hover:opacity-90 transition-all flex items-center gap-2
                      disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <Save size={16} />
                      {isPasswordSubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                )}
              </div>

              {isChangingPassword && (
                <form id="password-form" onSubmit={handlePasswordSubmit(onChangePasswordSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                  {/* Old Password */}
                  <div className="bg-white border border-[rgb(113,121,118)]/10 rounded-2xl p-6 shadow-sm">
                    <label className="block text-[12px] tracking-[0.2em] uppercase text-[rgb(65,72,70)] mb-3">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        {...registerPassword("oldPassword", {
                          required: "Current password is required",
                        })}
                        className="w-full h-12 px-4 rounded-xl border border-[rgb(113,121,118)]/20 bg-[#faf8f6] outline-none focus:border-[rgb(149,72,36)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordErrors.oldPassword && (
                      <p className="text-sm text-red-500 mt-2">{String(passwordErrors.oldPassword.message)}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="bg-white border border-[rgb(113,121,118)]/10 rounded-2xl p-6 shadow-sm">
                    <label className="block text-[12px] tracking-[0.2em] uppercase text-[rgb(65,72,70)] mb-3">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        {...registerPassword("newPassword", {
                          required: "New password is required",
                          minLength: { value: 6, message: "Password must be at least 6 characters" },
                        })}
                        className="w-full h-12 px-4 rounded-xl border border-[rgb(113,121,118)]/20 bg-[#faf8f6] outline-none focus:border-[rgb(149,72,36)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-red-500 mt-2">{String(passwordErrors.newPassword.message)}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="bg-white border border-[rgb(113,121,118)]/10 rounded-2xl p-6 shadow-sm">
                    <label className="block text-[12px] tracking-[0.2em] uppercase text-[rgb(65,72,70)] mb-3">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...registerPassword("confirmPassword", {
                          required: "Please confirm your new password",
                          validate: (val: string) => {
                            if (watchPassword("newPassword") !== val) {
                              return "Your passwords do no match";
                            }
                          },
                        })}
                        className="w-full h-12 px-4 rounded-xl border border-[rgb(113,121,118)]/20 bg-[#faf8f6] outline-none focus:border-[rgb(149,72,36)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-2">{String(passwordErrors.confirmPassword.message)}</p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
