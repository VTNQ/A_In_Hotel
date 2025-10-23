import  { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { AlertModal, type AlertType } from "../AlertModal";
import SideSlats from "../Login/SideSlats";
import Clock from "../Login/Clock";


export default function ResetPassword() {
    const [email, setEmail] = useState("");

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalCfg, setModalCfg] = useState<{
        type: AlertType;
        title: string;
        description?: string;
    } | null>(null);

  
    const handleModalOpenChange = (open: boolean) => {
        setModalOpen(open);
        if (!open && modalCfg?.type === "success") {
            navigate("/Home");
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
                            <form className="space-y-4" >
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
                                <div className="flex gap-3 mt-3">
                                    <button
                                        type="submit"
                                        className={`w-full rounded-md py-2 font-semibold text-white transition-colors bg-[#4B62A0] hover:bg-[#3c4e7f]
                                            }`}
                                    >
                                        Send
                                    </button>
                                    <button
                                        type="button"
                                        className="w-1/2 rounded-md py-2 font-semibold text-white transition-colors bg-[#B8916F] hover:bg-[#A37957]"
                                        onClick={() => alert("Đi đến trang đăng nhập")}
                                    >
                                        Login
                                    </button>
                                </div>

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
                        <div className="p-[1.6px] rounded-2xl md:border-none" style={{
                            backgroundImage: `
      linear-gradient(108.52deg, #B2DCFE 0.55%, #154686 98.39%),
      linear-gradient(250.95deg, rgba(86, 154, 243, 0) 0%, rgba(29, 79, 188, 0.2) 100%)
    `
                        }}>
                            {/* Lớp trong: form trắng */}
                            <div className="bg-[#EEF0F7] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,.08)] p-5 transition-colors">
                                <form className="space-y-4" >
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

                        <button
                            type="submit"
                            className={`w-1/2 rounded-md py-2 font-semibold text-white transition-colors bg-[#4B62A0] hover:bg-[#3c4e7f]
                                }`}
                        >
                            Send
                        </button>

                        <button
                            type="button"
                            className="w-1/2 rounded-md py-2 font-semibold text-white transition-colors bg-[#B8916F] hover:bg-[#A37957]"
                            onClick={() => alert("Đi đến trang đăng nhập")}
                        >
                            Login
                        </button>
                    </div>


                </div>

            </div>
        </div>
    );
}
