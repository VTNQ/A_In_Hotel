import React, { useEffect, useState } from "react";
import Clock from "./Clock";
import SideSlats from "./SideSlats";
import { login } from "../../service/api/Authenticate";
import { saveTokens } from "../../util/auth";
import { useNavigate } from "react-router-dom";
import { AlertModal, type AlertType } from "../AlertModal";


export default function Login() {
  const [email, setEmail] = useState("");
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
    if (!isFilled) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }
    try {
      const response = await login(email, password);
      console.log(response);
      if (response.data.role === "SUPERADMIN") {
        setSuccess("Đăng nhập thành công!");
        saveTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          accessTokenAt: response.data.accessTokenExpiryAt,
          refreshTokenAt: response.data.refreshTokenExpiryAt,
        })
      } else {
        setError("Bạn không có quyền truy cập hệ thống.");
      }
    } catch (err) {
      console.log(err);
      setError("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  }
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
      navigate("/Home");
    }
  };
  return (
    // + thêm padding-top để chừa chỗ cho logo
    <div className="relative min-h-screen bg-[#EBEBEB] flex items-center justify-center overflow-hidden pt-48 md:pt-56">
      <SideSlats />
      <Clock />
      {/* Logo cố định trên giữa, không chặn click */}
      <header className="fixed bottom-[80vh] left-[98vh] -translate-x-1/2 z-40 pointer-events-none">
        <img src="/Group 1.png" alt="A-IN HOTEL" className="h-[150px] md:h-[177px] w-[380.908px] " />
      </header>

      {/* SCENE */}
      <div className="relative w-full max-w-6xl flex justify-center">

        {/* Ghế (trái, giữa theo chiều dọc) */}
        <img
          src="/Layer_1.png"
          alt="chair"
          className="absolute left-20 md:left-2 top-1/2 -translate-y-1/2 w-[260px] md:w-[320px] z-20 select-none pointer-events-none"
        />

        {/* Bàn */}
        <div className="relative w-[900px] max-w-[92vw] h-[100px] z-10">
          <div className="absolute left-0 right-0 top-0 h-6 bg-[#5677ef] rounded"></div>
          <div className="absolute left-[80px] top-[22px] h-5 w-[120px] bg-[#11243d] rounded"></div>
          <div className="absolute right-[80px] top-[22px] h-5 w-[120px] bg-[#11243d] rounded"></div>

          <div className="absolute left-[140px] top-6 w-2 h-[200px] bg-[#b9c9ff] rotate-8 rounded"></div>
          <div className="absolute left-[240px] top-6 w-2 h-[200px] bg-[#b9c9ff] -rotate-8 rounded"></div>
          <div className="absolute left-[170px] top-[150px] w-[120px] h-3 bg-[#b9c9ff] rounded"></div>

          <div className="absolute right-[240px] top-6 w-2 h-[200px] bg-[#b9c9ff] rotate-8 rounded"></div>
          <div className="absolute right-[140px] top-6 w-2 h-[200px] bg-[#b9c9ff] -rotate-8 rounded"></div>
          <div className="absolute right-[170px] top-[150px] w-[120px] h-3 bg-[#b9c9ff] rounded"></div>

          {/* Form: hạ xuống chút để cách logo hơn */}
          <div className="absolute -top-[220px] md:-top-[284px] left-1/2 -translate-x-1/2 z-30 w-[360px] md:w-[420px]">
            <div className="bg-white border border-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,.08)]
             p-5 transition-colors focus-within:border-black mt-[2vh]">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-medium text-slate-700">User email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none   focus:ring-1 focus:ring-[#42578E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none   focus:ring-1 focus:ring-[#42578E]"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" className="h-4 w-4 text-indigo-600 border-slate-300" />
                    Remember password
                  </label>
                  <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
                </div>
                <button type="submit" className={`w-full rounded-md py-2 font-semibold text-white transition-colors ${isFilled
                  ? "bg-[#4B62A0] hover:bg-[#3c4e7f]"
                  : "bg-[#7C7C7C] cursor-not-allowed"
                  }`}>
                  Login
                </button>
              </form>
              <AlertModal
                open={modalOpen}
                onOpenChange={handleModalOpenChange}
                type={modalCfg?.type ?? "info"}
                title={modalCfg?.title ?? ""}
                description={modalCfg?.description}
                closable
                autoClose={modalCfg?.type === "success" ? 1600 : undefined} // tự đóng sau 1.6s nếu thành công
                primaryAction={{
                  label: "OK",
                  autoFocus: true,
                }}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
