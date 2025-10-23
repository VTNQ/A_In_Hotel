import React, { useState } from "react";
import logo from "/logo.png";
import { FiUser, FiLock, FiEyeOff, FiEye } from "react-icons/fi";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
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
            width={300}
            height={300}
            className="mx-auto mb-4 opacity-90 text-left"
          />

          <h2 className="text-4xl mr-12   font-semibold text-[#3C2A1A] mb-8">
            Welcome to A- In hotel
          </h2>

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

            {/* Password */}
            <div>
              <label className="block text-sm text-[#866F56] mb-1 font-[600]">
                Password
              </label>
              <div className="flex items-center w-full h-10 px-3 py-1 rounded-lg border border border-[#F6F3F0] bg-transparent focus-within:ring-2 focus-within:ring-[#B8916F] transition duration-200">
                <FiLock className="w-5 h-5 text-[#4B3A28] mr-2 flex-shrink-0" />
                <input
                type="text"
                  placeholder="Enter password"
                  className={`w-full bg-transparent text-sm text-[#4B3A28] outline-none placeholder-[#4B3A28]/60 ${showPassword ? "show-password" : "hide-password"}`}
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-22 text-[#4B3A28] hover:text-[#B8916F] transition"
              >
                {showPassword ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <FiEye className="w-5 h-5" />
                )}
              </button>
              </div>

              <div className="flex justify-between items-center mt-2 text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#4B3A28] text-sm">
                  <input
                    type="checkbox"
                    className="
      w-5 h-5
      appearance-none
      border border-[#B8916F]
      rounded-md
      bg-transparent
      checked:bg-[#B8916F]
      checked:border-[#B8916F]
      relative
      transition
      cursor-pointer
      focus:ring-2 focus:ring-[#B8916F]/30
      before:content-['']
      before:absolute before:top-[3px] before:left-[7px]
      before:w-[6px] before:h-[11px]
      before:border-r-[2px] before:border-b-[2px] before:border-white
      before:rotate-45
      checked:before:block
      before:hidden
    "
                  />
                  Remember me
                </label>

                <a
                  href="#"
                  className="text-[#B8916F] hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-4 bg-[#B8916F]/90 text-white font-semibold rounded-md hover:bg-[#A37957] transition-all duration-200 shadow-[0_4px_12px_rgba(184,145,111,0.3)]"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* ========================== MOBILE FORM ========================== */}
      <div className="block md:hidden w-[90%] max-w-[360px]  rounded-2xl  p-6 ">
        <div className="text-left mb-6">
          <img
            src={logo}
            alt="A In Hotel Logo"
            width={120}
            height={120}

          />
          <h2 className="text-xl font-semibold text-[#383838] mb-1 mt-2 ml-2">
            Welcome to A- In hotel
          </h2>
          <div className="w-full h-[1px] bg-[#7C7C7C]"></div>
        </div>

        <form className="space-y-4">
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
          <div>
            <label className="block text-sm text-[#5A4229] mb-1">
              Password
            </label>
            <div className="relative flex items-center w-full h-10 px-3 py-1 rounded-md border border-[#E4D4BE] bg-white focus-within:ring-2 focus-within:ring-[#B8916F] transition duration-200">
              <FiLock className="w-5 h-5 text-[#4B3A28] mr-2 flex-shrink-0" />

              {/* Input password */}
              <input
                type="text"
                placeholder="Enter your password"
                className={`w-full bg-transparent text-sm text-[#4B3A28] outline-none placeholder-[#4B3A28]/60 ${showPassword ? "show-password" : "hide-password"
                  }`}
              />
              {/* Icon con mắt */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#4B3A28] hover:text-[#B8916F] transition"
              >
                {showPassword ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <FiEye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex justify-between items-center mt-2 text-xs">
              <label className="flex items-center gap-1 text-[#866F56]">
                <input
                  type="checkbox"
                  className="   w-5 h-5
      appearance-none
      border border-[#B8916F]
      rounded-md
      bg-transparent
      checked:bg-[#B8916F]
      checked:border-[#B8916F]
      relative
      transition
      cursor-pointer
      focus:ring-2 focus:ring-[#B8916F]/30
      before:content-['']
      before:absolute before:top-[2px] before:left-[7px]
      before:w-[6px] before:h-[11px]
      before:border-r-[2px] before:border-b-[2px] before:border-white
      before:rotate-45
      checked:before:block
      before:hidden"
                />
                Remember password
              </label>
              <a
                href="#"
                className="text-[#B8916F] hover:underline transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 bg-[#B8916F] text-white font-semibold rounded-md hover:bg-[#A37957] transition-all duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
