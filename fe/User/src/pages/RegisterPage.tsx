import { useState } from "react";
import { register } from "../service/api/Authenticate";
import { useAlert } from "../components/alert-context";
import { BASE_API } from "../setting/constant/app";
const LOGO_URL = "/image/logo/Screenshot From 2025-08-15 13-49-26.png"; // chỉnh đường dẫn nếu bạn đặt logo nơi khác
const BG_URL =
  "https://i.pinimg.com/1200x/72/fb/df/72fbdfa013d8fa9f9696181daf6b294b.jpg";
const BRAND = "#b08a66"; // màu chủ đạo theo logo

function SocialButton({
  provider,
}: {
  provider: "google" | "facebook";
}) {
  const isGoogle = provider === "google";
  const handleClick = () => {
    if (isGoogle) {
      window.location.href = `${BASE_API}/oauth2/authorization/google`;
    }
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        inline-flex items-center gap-2 rounded-full border border-gray-300
        bg-white px-4 py-2 text-sm shadow-sm transition
        hover:shadow active:translate-y-px
      "
      aria-label={`Sign up with ${isGoogle ? "Google" : "Facebook"}`}
    >
      {isGoogle ? (
        // Google icon
        <svg viewBox="0 0 48 48" className="h-4 w-4">
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303C33.887,31.912,29.332,35,24,35c-6.627,0-12-5.373-12-12
            s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.676,5.029,29.59,3,24,3C12.955,3,4,11.955,4,23
            s8.955,20,20,20s20-8.955,20-20C44,22.659,43.854,21.35,43.611,20.083z"
          />
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.817C14.454,16.045,18.855,12.5,24,12.5c3.059,0,5.842,1.154,7.961,3.039
            l5.657-5.657C34.676,5.029,29.59,3,24,3C15.325,3,7.983,8.088,6.306,14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24,43c5.241,0,10.01-2.007,13.567-5.268l-6.258-5.297C29.28,33.656,26.781,34.5,24,34.5
            c-5.314,0-9.857-3.567-11.483-8.391l-6.54,5.034C8.62,37.987,15.733,43,24,43z"
          />
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-1.258,3.912-4.629,6.889-8.736,7.435l0.013,0.098l6.258,5.297
            C35.525,38.889,44,33,44,23C44,22.659,43.854,21.35,43.611,20.083z"
          />
        </svg>
      ) : (
        // Facebook icon
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#1877F2]">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.096 4.388 23.093 10.125 24v-8.437H7.078v-3.49h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.49 0-1.953.926-1.953 1.875v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.093 24 18.096 24 12.073z" />
        </svg>
      )}
      <span className="whitespace-nowrap">
        {isGoogle ? "Google" : "Facebook"}
      </span>
    </button>
  );
}

export default function RegisterPage() {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) error = "Full name is required";
        break;

      case "phone":
        if (!value.trim()) error = "Phone number is required";
        else if (!/^\+?\d{9,12}$/.test(value)) error = "Invalid phone number";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email address";
        break;

      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 6)
          error = "Password must be at least 6 characters";
        break;

      case "confirmPassword":
        if (value !== formData.password) error = "Passwords do not match";
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  const [saving, setSaving] = useState(false);
  const parseFullName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);

    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setSaving(true);
    try {
      e.preventDefault();
      const { firstName, lastName } = parseFullName(formData.fullName);

      const payload = {
        firstName,
        lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.confirmPassword,
      };
      await register(payload);
      showAlert({
        title: "Đăng ký thành công!",
        type: "success",
        autoClose: 3000,
      });
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      showAlert({
        title: "Đăng ký thất bại. Vui lòng thử lại.",
        type: "error",
        autoClose: 3000,
      });
    } finally {
      setSaving(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };
  const isFormValid =
    Object.values(errors).every((e) => !e) &&
    Object.values(formData).every((v) => v.trim() !== "");
  const isSubmitDisabled = !isFormValid || saving;
  return (
    <main className="relative min-h-screen w-full pt-20 pb-16">
      {/* Background */}
      <img
        src={BG_URL}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />

      {/* Card */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">
        <div
          className="
            w-full rounded-[24px] bg-white p-6 shadow-2xl
            md:p-10 lg:grid lg:grid-cols-12 lg:gap-10
          "
          style={{ boxShadow: "0 12px 48px rgba(0,0,0,.28)" }}
        >
          {/* Logo left */}
          <div className="hidden lg:col-span-5 lg:flex lg:flex-col lg:items-center lg:justify-center">
            <img
              src={LOGO_URL}
              alt="A‑IN HOTEL"
              className="h-40 w-auto object-contain"
            />
          </div>

          {/* Form right */}
          <div className="lg:col-span-7">
            <h1 className="mb-6 text-2xl font-semibold text-gray-900">
              Register
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-1 block text-sm text-gray-700">
                  Fullname
                </span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full rounded-[14px] border px-4 py-3 outline-none
                ${errors.fullName ? "border-red-500" : "border-gray-300"}
                `}
                  placeholder="Nguyen Van A"
                  style={{ ["--brand" as any]: BRAND }}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-gray-700">
                  Phone number
                </span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full rounded-[14px] border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } bg-white px-4 py-3
                  outline-none placeholder:text-gray-400
                  focus:border-[var(--brand)]`}
                  placeholder="+8412345678"
                  style={{ ["--brand" as any]: BRAND }}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-gray-700">
                  Email address
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-[14px] border  ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } bg-white px-4 py-3
                    outline-none placeholder:text-gray-400
                    focus:border-[var(--brand)]`}
                  placeholder="you@example.com"
                  style={{ ["--brand" as any]: BRAND }}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-gray-700">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-[14px] border  ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } bg-white px-4 py-3
                    outline-none placeholder:text-gray-400
                    focus:border-[var(--brand)]`}
                  placeholder="••••••••"
                  style={{ ["--brand" as any]: BRAND }}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-gray-700">
                  Confirm password
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full rounded-[14px] border  ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } bg-white px-4 py-3
                    outline-none placeholder:text-gray-400
                    focus:border-[var(--brand)]`}
                  placeholder="••••••••"
                  style={{ ["--brand" as any]: BRAND }}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </label>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`
    w-full h-[52px] rounded-[14px]
    font-medium text-white
    flex items-center justify-center gap-2
    shadow transition
    ${
      isSubmitDisabled
        ? "cursor-not-allowed opacity-70"
        : "hover:brightness-105 active:translate-y-px"
    }
  `}
                style={{ backgroundColor: BRAND }}
              >
                {saving ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                      />
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create account</span>
                )}
              </button>

              <div className="mt-2 flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  {/* <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[var(--brand)] focus:ring-[var(--brand)]"
                    style={{ ["--brand" as any]: BRAND }}
                  />
                  <span className="text-gray-700">Remember me</span> */}
                </label>
                <a href="#" className="text-gray-500 hover:underline">
                  Forgot password?
                </a>
              </div>

              <div className="mt-3 flex items-center justify-center gap-4">
                <SocialButton provider="google" />
                <SocialButton provider="facebook" />
              </div>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/Login"
                  className="font-medium"
                  style={{ color: BRAND }}
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
