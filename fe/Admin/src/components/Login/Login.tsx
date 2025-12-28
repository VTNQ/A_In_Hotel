import React, { useEffect, useState } from "react";
import Clock from "./Clock";
import SideSlats from "./SideSlats";
import { login } from "../../service/api/Authenticate";
import { saveTokens } from "../../util/auth";
import { useNavigate } from "react-router-dom";
import { AlertModal, type AlertType } from "../AlertModal";
export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isFilled = email.trim() !== "" && password.trim() !== "";
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCfg, setModalCfg] = useState<{
    type: AlertType;
    title: string;
    description?: string;
  } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFilled || loading) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await login(email, password);

      if (response.data.role === "ADMIN") {
        saveTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          accessTokenAt: response.data.accessTokenExpiryAt,
          refreshTokenAt: response.data.refreshTokenExpiryAt,
          hotelId: response.data.hotelId,
        });

        setSuccess("Đăng nhập thành công!");
      } else {
        setError("Bạn không có quyền truy cập hệ thống.");
      }
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      setModalCfg({
        type: "error",
        title: "Lỗi",
        description: error,
      });
      setModalOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setModalCfg({
        type: "success",
        title: "Thành công",
        description: success,
      });
      setModalOpen(true);
    }
  }, [success]);
  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open && modalCfg?.type === "success") {
      navigate("/Dashboard");
    }
  };
  return (
    // + thêm padding-top để chừa chỗ cho logo
    <div className="relative min-h-screen bg-white md:bg-[#EBEBEB] flex items-center justify-center overflow-hidden pt-48 md:pt-56">
      <SideSlats />
      <Clock />
      {/* Logo cố định trên giữa, không chặn click */}
      <header className="fixed left-[45%] bottom-[72%] md:bottom-[84%] md:left-[48%] -translate-x-1/2 z-40 pointer-events-none">
        <img
          src="/logo.png"
          alt="A-IN HOTEL"
          className="h-[120%] md:h-[100px] w-auto"
        />

      </header>

      {/* SCENE */}
      <div className="relative w-full max-w-6xl flex justify-center">

        {/* Ghế (trái, giữa theo chiều dọc) */}
        <img
          src="/Layer_1.png"
          alt="chair"
          className="absolute left-20 md:left-2 top-1/2 -translate-y-1/2 w-[260px] md:w-[320px] z-20 select-none pointer-events-none hidden md:block"
        />

        {/* Bàn */}
        <div className="relative w-[56rem] max-w-[92vw] h-24 z-10">
          {/* Mặt bàn */}
          <div className="absolute left-0 right-0 top-0 h-6 bg-[#5677ef] rounded  hidden md:block"></div>

          {/* Thanh đen dưới mặt bàn */}
          <div className="absolute left-39 z-10 top-5 h-5 w-30 bg-[#11243d] rounded  hidden md:block"></div>
          <div className="absolute right-19 z-10 top-5 h-5 w-30 bg-[#11243d] rounded  hidden md:block"></div>

          {/* Chân trái */}
          {/* Chân trái (dùng hình) */}
          <div className="absolute left-40 top-5 w-36 h-52  hidden md:block">
            {/* Thanh chéo trái */}
            <img
              src="/Rectangle 17.png"
              alt="left leg"
              className="absolute top-0 left-1 h-full object-contain  origin-top"
            />
            {/* Thanh chéo phải */}
            <img
              src="/Rectangle 18.png"
              alt="right leg"
              className="absolute top-0 right-8 h-full object-contain  origin-top"
            />
            {/* Thanh ngang */}
            <img
              src="/Rectangle 16.png"
              alt="cross bar"
              className="absolute top-36 left-5 right-0 w-18 h-2 object-contain"
            />
          </div>


          {/* Chân phải */}
          {/* Chân phải (dùng hình) */}
          <div className="absolute  right-36 top-8 w-36 h-52  hidden md:block">
            {/* Thanh chéo trái */}
            <img
              src="/Rectangle 17.png"
              alt="right leg left-bar"
              className="absolute top-0 left-24 h-full object-contain  origin-top"
            />
            {/* Thanh chéo phải */}
            <img
              src="/Rectangle 18.png"
              alt="right leg right-bar"
              className="absolute top-0 left-37 h-full object-contain origin-top"
            />
            {/* Thanh ngang */}
            <img
              src="/Rectangle 16.png"
              alt="cross bar"
              className="absolute top-36 left-29 w-18  h-2 object-contain"
            />
          </div>


          {/* Form nằm trên bàn */}
          <div className="hidden md:block absolute -top-56 md:-top-78 left-1/2 -translate-x-1/2 z-30 w-80 md:w-[26rem]">
            <div className="bg-white border border-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,.08)]
      p-5 transition-colors focus-within:border-black mt-[2vh] ">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    User email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" className="h-4 w-4 text-indigo-600 border-slate-300" />
                    Remember password
                  </label>
                  <a href="/register" className="text-sm text-indigo-600 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <button
                  type="submit"
                  disabled={!isFilled || loading}
                  onClick={handleLogin}
                  className={`relative w-full h-[40px] rounded-md py-2 font-semibold text-white transition-colors ${!isFilled || loading
                      ? "bg-[#7C7C7C] cursor-not-allowed"
                      : "bg-[#4B62A0] hover:bg-[#3c4e7f]"}`}
                >
                  {/* Text */}
                  <span
                    className={`transition-opacity duration-200 ${loading ? "opacity-0" : "opacity-100"
                      }`}
                  >
                    Login
                  </span>

                  {/* Spinner */}
                  {loading && (
                    <span className="absolute inset-0 flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4 animate-spin text-white"
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
                      <span>Logging in...</span>
                    </span>
                  )}
                </button>

              </form>
              <AlertModal
                open={modalOpen}
                onOpenChange={handleModalOpenChange}
                type={modalCfg?.type ?? "info"}
                title={modalCfg?.title ?? ""}
                description={modalCfg?.description}
                closable
                autoClose={modalCfg?.type === "success" ? 1600 : undefined}
                primaryAction={{
                  label: "OK",
                  autoFocus: true,
                }}
              />
            </div>
          </div>
          <div className="block md:hidden absolute -top-40 md:-top-78 left-1/2 -translate-x-1/2 z-30 w-full">
            {/* Lớp ngoài: gradient border */}
            {/* Khung gradient */}
            <div
              className="p-[1.6px] rounded-2xl md:border-none"
              style={{
                backgroundImage: `
      linear-gradient(108.52deg, #B2DCFE 0.55%, #154686 98.39%),
      linear-gradient(250.95deg, rgba(86, 154, 243, 0) 0%, rgba(29, 79, 188, 0.2) 100%)
    `,
              }}
            >
              {/* Box trắng */}
              <div className="bg-[#EEF0F7] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,.08)] p-5 transition-colors">

                <form className="space-y-4" onSubmit={handleLogin}>
                  <div>
                    <label className="block text-sm font-medium text-[#42578E]">
                      User email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your Email"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#42578E]">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-slate-600 relative">
                      <input
                        type="checkbox"
                        className="peer appearance-none h-4 w-4 border-2 border-[#154686] rounded-sm cursor-pointer 
                     bg-transparent checked:bg-[#154686] checked:border-[#154686] transition-all duration-150"
                      />
                      {/* Check icon */}
                      <svg
                        className="absolute left-[2%] top-[22%] w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z"
                        />
                      </svg>

                      Remember password
                    </label>

                    <a href="/register" className="text-sm text-[#007AFF] hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                </form>
              </div>
            </div>

            {/* NÚT LOGIN — HOÀN TOÀN BÊN NGOÀI BOX XANH */}
            <button
              type="submit"
              disabled={!isFilled || loading}
              onClick={handleLogin}
              className={`relative w-full h-[40px] mt-4 rounded-md py-2 font-semibold text-white transition-colors
    ${!isFilled || loading
                  ? "bg-[#7C7C7C] cursor-not-allowed"
                  : "bg-[#4B62A0] hover:bg-[#3c4e7f]"
                }`}
            >
              {/* Text */}
              <span
                className={`transition-opacity duration-200 ${loading ? "opacity-0" : "opacity-100"
                  }`}
              >
                Login
              </span>

              {/* Spinner */}
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin text-white"
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
                  <span>Logging in...</span>
                </span>
              )}
            </button>

          </div>


        </div>

      </div>
    </div>
  );
}
