// src/pages/LoginPage.tsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AlertModal, type AlertType } from "../components/AlertModal";
import { saveTokens } from "../util/auth";
import { login } from "../service/api/Authenticate";
import { useAlert } from "../components/alert-context";

const LOGO_URL = "/image/logo/Screenshot From 2025-08-15 13-49-26.png"; // <- thay bằng đường dẫn logo bạn host (VD: /assets/ain-logo.png)
const BG_URL =
  "https://i.pinimg.com/1200x/72/fb/df/72fbdfa013d8fa9f9696181daf6b294b.jpg"; // ảnh nền bạn gửi

function SocialButton({
  provider,
  onClick,
}: {
  provider: "google" | "facebook";
  onClick?: () => void;
}) {
  const isGoogle = provider === "google";
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex items-center gap-2 rounded-full border border-gray-300
        bg-white px-4 py-2 text-sm shadow-sm transition
        hover:shadow active:translate-y-px
      "
      aria-label={`Sign in with ${isGoogle ? "Google" : "Facebook"}`}
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

export default function LoginPage() {
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFilled = email.trim() !== "" && password.trim() !== "";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFilled || loading) return;

    setLoading(true);

    try {
      const response = await login(email, password);

      if (response.data.role === "USER") {
        saveTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          accessTokenAt: response.data.accessTokenExpiryAt,
          refreshTokenAt: response.data.refreshTokenExpiryAt,
        });

        showAlert({
          title: "Đăng nhập thành công!",
          type: "success",
          autoClose: 3000,
        });
        navigate("/")
      } else {
        showAlert({
          title: "Bạn không có quyền truy cập hệ thống.",
          type: "error",
          autoClose: 3000,
        });
      }
    } catch (err) {
      showAlert({
        title:"Đăng nhập thất bại. Vui lòng thử lại.",
        type: "error",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full">
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
            <h1 className="mb-6 text-2xl font-semibold text-gray-900">Login</h1>

            <form className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm text-gray-700">
                  Email address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full rounded-[14px] border border-gray-300 bg-white px-4 py-3
                    outline-none placeholder:text-gray-400
                    focus:border-[#b08a66]
                  "
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-gray-700">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full rounded-[14px] border border-gray-300 bg-white px-4 py-3
                    outline-none placeholder:text-gray-400
                    focus:border-[#b08a66]
                  "
                  placeholder="••••••••"
                />
              </label>

              <button
                type="submit"
                disabled={!isFilled || loading}
                onClick={handleLogin}
                className={`
    w-full rounded-[14px] px-4 py-3 font-medium text-white
    shadow transition
    ${
      loading
        ? "bg-[#b08a66]/80 cursor-not-allowed"
        : "bg-[#b08a66] hover:brightness-105 active:translate-y-px"
    }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    {/* Spinner */}
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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

                    <span>Signing in...</span>
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>

              <div className="mt-2 flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#b08a66] focus:ring-[#b08a66]"
                  />
                  <span className="text-gray-700">Remember me</span>
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
                Don’t have an account?{" "}
                <NavLink
                  to="/Register"
                  className="font-medium text-[#b08a66] hover:underline"
                >
                  Sign up
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
