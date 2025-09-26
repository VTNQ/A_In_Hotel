import React, { useEffect, useState } from "react";
import Clock from "./Clock";
import SideSlats from "./SideSlats";
import { useNavigate } from "react-router-dom";
import { AlertModal, type AlertType } from "../AlertModal";
import { register } from "@/service/api/Authenticate";



export default function Register() {

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [phone, setPhone] = useState("");

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isFilled = email.trim() !== "";
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCfg, setModalCfg] = useState<{
    type: AlertType;
    title: string;
    description?: string;
  } | null>(null);


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
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFilled) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }
    const registerDto = {
      email: email,
      idRole: 1,
      gender: gender,
      fullName: fullName,
      phone: phone
    }
    try {
      const response = await register(registerDto);

      setSuccess(`${response.data.message}`)
      setEmail("");
      setFullName("");
      setGender("MALE");
      setPhone("");
    } catch (err) {
      console.log(err);
      setError("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  }
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

    }
  };
  return (
    // + thêm padding-top để chừa chỗ cho logo
    <div className="relative min-h-screen bg-[#EBEBEB] flex items-center justify-center overflow-hidden pt-48 md:pt-56">
      <SideSlats />
      <Clock />
      {/* Logo cố định trên giữa, không chặn click */}
      <header className="fixed bottom-[89vh] left-[98vh] -translate-x-1/2 z-40 pointer-events-none">
        <img
          src="/Group 1.png"
          alt="A-IN HOTEL"
          className="h-[50px] md:h-[100px] w-auto"
        />

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
        <div className="relative w-[56rem] max-w-[92vw] h-24 z-10 top-11">
          {/* Mặt bàn */}
          <div className="absolute left-0 right-0 top-0 h-6 bg-[#5677ef] rounded"></div>

          {/* Thanh đen dưới mặt bàn */}
          <div className="absolute left-39 z-10 top-5 h-5 w-30 bg-[#11243d] rounded"></div>
          <div className="absolute right-19 z-10 top-5 h-5 w-30 bg-[#11243d] rounded"></div>

          {/* Chân trái */}
          {/* Chân trái (dùng hình) */}
          <div className="absolute left-40 top-5 w-36 h-52">
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
          <div className="absolute  right-36 top-8 w-36 h-52">
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
          <div className="absolute -top-56 md:-top-107 left-1/2 -translate-x-1/2 z-30 w-80 md:w-[26rem]">
            <div className="bg-white border border-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,.08)]
      p-5 transition-colors focus-within:border-black mt-[2vh]">
              <form className="space-y-4" onSubmit={handleRegister}>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Họ và tên</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Giới tính</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Số điện thoại</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <a href="/login" className="text-sm text-indigo-600 hover:underline">
                    Already have an account? Login
                  </a>
                </div>


                <button
                  type="submit"
                  className={`w-full rounded-md py-2 font-semibold text-white transition-colors ${isFilled
                    ? "bg-[#4B62A0] hover:bg-[#3c4e7f]"
                    : "bg-[#7C7C7C] cursor-not-allowed"
                    }`}
                >
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
                autoClose={modalCfg?.type === "success" ? 1600 : undefined}
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
