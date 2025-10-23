import React, { useState } from "react";
import logo from "/resetPassword.png";
import logoMobile from "/logo.png";
import { FiUser, FiLock, FiEyeOff, FiEye } from "react-icons/fi";

const ResetPasswordForm = () => {
    return (
        <div className="relative w-full h-screen flex items-center justify-center">
            {/* ========================== DESKTOP FORM ========================== */}
            <div
                className="
    hidden 
     absolute right-[2%] top-[50%] -translate-y-1/2
    md:flex flex-col items-center justify-center
    w-[580px] h-[700px]
    rounded-[25px]
    shadow-[0_8px_25px_rgba(0,0,0,0.1)]
    overflow-hidden
    backdrop-blur-[20px]
  "
                style={{
                    background: "#A78B6B33",     // Giữ nguyên màu nền
                    border: "5px solid #C4BEBE", // 👉 Viền màu cố định
                    borderRadius: "25px",
                }}
            >
                <div className="w-full px-[33px] pt-[130px] pb-[200px] text-center">
                    <img
                        src={logo}
                        alt="A In Hotel Logo"
                        width={50}
                        height={50}
                        className="mx-auto mb-4 opacity-90 "
                    />

                    <h2 className="text-xl   font-semibold text-[#3C2A1A] mb-8 text-center">
                        RESETING ADMIN PASSWORD
                    </h2>
                    <p className="text-sm text-[#5A4229] mb-10 font-[400]" style={{ fontWeight: '400' }}>
                        We will send you instructions by email. <br />
                        Email: ......@ainhotel.vn
                    </p>

                    <form className="max-w-[420px] mx-auto space-y-5 text-left">
                        {/* Email */}
                        <div>
                            <label className="block text-sm text-[#866F56]  mb-1 font-[600]">
                                User email
                            </label>
                            <div className="flex items-center w-full h-10 px-3 py-1 rounded-lg border border-[#F6F3F0] bg-transparent focus-within:ring-2 focus-within:ring-[#B8916F] transition duration-200">
                                <FiUser className="w-5 h-5 text-[#4B3A28] mr-2 flex-shrink-0" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-transparent text-sm text-[#4B3A28] outline-none placeholder-[#4B3A28]/60"
                                />
                            </div>
                        </div>


                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="w-1/2 py-2 border border-[#B8916F] text-[#4B3A28] font-semibold rounded-md hover:bg-[#B8916F]/10 transition-all duration-200"
                            >
                                Send
                            </button>
                            <button
                                type="button"
                                className="w-1/2 py-2 bg-[#B8916F] text-white font-semibold rounded-md hover:bg-[#A37957] transition-all duration-200"
                                onClick={() => alert('Đi tới trang đăng nhập')}
                            >
                                Login
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* ========================== MOBILE FORM ========================== */}
            <div className="block md:hidden w-[109%] max-w-[383px]  rounded-2xl  p-6 ">
                <div className="text-left mb-6 mt-29">
                    <img
                        src={logoMobile}
                        alt="A In Hotel Logo"
                        width={150}
                        height={150}

                    />
                    <h2 className="text-xl font-semibold text-[#383838] mb-1 mt-2 ml-2">
                        Welcome to A- In hotel
                    </h2>
                    <div className="w-full h-[1px] bg-[#7C7C7C] my-2"></div>
                    <p className="text-sm text-[#636363] text-center">
                        We will send you instructions by email.
                        <br />
                        Email: .....@ainhotel.vn
                    </p>
                    <div className="flex justify-center my-4">
                        <img
                            src={logo}
                            alt="A In Hotel Logo"
                            width={50}
                            height={50}

                        />
                    </div>

                </div>

                <form className="space-y-4">
                <h3 className="text-[#6E5235] font-[500] text-lg mb-2">
          RESETING ADMIN PASSWORD
        </h3>
                    {/* Email */}
                    <div>
                        <label className="block text-sm text-[#5A4229] mb-1">
                            User email
                        </label>
                        <div className="flex items-center w-full h-10 px-3 py-1 rounded-md border border-[#E4D4BE] bg-white focus-within:ring-2 focus-within:ring-[#B8916F] transition duration-200">
                            <FiUser className="w-4 h-4 text-[#4B3A28] mr-2 flex-shrink-0" />
                            <input
                                type="email"
                                placeholder="Placeholder"
                                className="w-full bg-transparent text-sm text-[#4B3A28] outline-none placeholder-[#4B3A28]/60"
                            />
                        </div>
                    </div>

                    {/* Password */}
                 

                    {/* Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="w-1/2 py-2 border border-[#B8916F] text-[#4B3A28] font-semibold rounded-md hover:bg-[#B8916F]/10 transition-all duration-200"
                        >
                            Send
                        </button>
                        <button
                            type="button"
                            className="w-1/2 py-2 bg-[#B8916F] text-white font-semibold rounded-md hover:bg-[#A37957] transition-all duration-200"
                            onClick={() => alert('Đi tới trang đăng nhập')}
                        >
                            Login
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
