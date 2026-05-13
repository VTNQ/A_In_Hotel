import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAlert } from "../components/alert-context";
import { forgotPassword, resetPassword } from "../service/api/Authenticate";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const LOGO_URL = "/image/logo/Screenshot From 2025-08-15 13-49-26.png";
  const BG_URL =
    "https://i.pinimg.com/1200x/72/fb/df/72fbdfa013d8fa9f9696181daf6b294b.jpg";

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isValid: isEmailValid, isSubmitting: isEmailSubmitting },
  } = useForm<any>({
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    watch,
    formState: { errors: resetErrors, isSubmitting: isResetSubmitting },
  } = useForm<any>({
    mode: "onBlur",
  });

  const password = watch("password");

  const { showAlert } = useAlert();

  const onEmailSubmit = async (data: any) => {
    try {
      await forgotPassword(data);
      setEmail(data.email);
      showAlert({
        title: "Gửi OTP thành công!",
        description: "Vui lòng kiểm tra email để lấy mã xác thực.",
        type: "success",
        autoClose: 3000,
      });
      setStep("otp");
    } catch (err) {
      showAlert({
        title: "Gửi OTP thất bại!",
        description: "Email không tồn tại hoặc đã có lỗi xảy ra.",
        type: "error",
        autoClose: 3000,
      });
      console.log(err);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const onVerifyAndReset = async (data: any) => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      showAlert({
        title: "Lỗi!",
        description: "Vui lòng nhập đầy đủ mã OTP.",
        type: "error",
      });
      return;
    }

    try {
      await resetPassword({
        email,
        otp: otpValue,
        newPassword: data.password,
      });
      showAlert({
        title: "Thành công!",
        description: "Mật khẩu của bạn đã được thay đổi.",
        type: "success",
        autoClose: 3000,
      });
      navigate("/login");
    } catch (err: any) {
      showAlert({
        title: "Lỗi!",
        description: err.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn.",
        type: "error",
        autoClose: 3000,
      });
    }
  };

  const resendOtp = async () => {
    try {
      await forgotPassword({ email });
      showAlert({
        title: "Đã gửi lại mã!",
        description: "Vui lòng kiểm tra email của bạn.",
        type: "success",
      });
    } catch (err) {
      showAlert({
        title: "Lỗi!",
        description: "Không thể gửi lại mã vào lúc này.",
        type: "error",
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src={BG_URL}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="relative z-10 mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <div
          className="w-full max-w-md sm:max-w-lg lg:max-w-4xl rounded-3xl bg-white p-6 sm:p-8 lg:p-12 shadow-2xl lg:grid lg:grid-cols-12 lg:gap-12"
          style={{ boxShadow: "0 12px 48px rgba(0,0,0,.28)" }}
        >
          <div className="hidden lg:col-span-5 lg:flex lg:items-center lg:justify-center">
            <img
              src={LOGO_URL}
              alt="A‑IN HOTEL"
              className="max-h-48 w-auto object-contain"
            />
          </div>

          <div className="lg:col-span-7 w-full">
            {step === "email" ? (
              <>
                <h1 className="mb-6 text-2xl sm:text-3xl font-semibold text-gray-900 text-center lg:text-left">
                  Forgot Password
                </h1>
                <p className="mb-8 text-gray-600 text-center lg:text-left">
                  Enter your email address and we'll send you an OTP code to reset your password.
                </p>
                <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-6">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-700">
                      Email address
                    </span>
                    <input
                      type="email"
                      {...registerEmail("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#b08a66] focus:ring-2 focus:ring-[#b08a66]/20 outline-none transition"
                      placeholder="you@example.com"
                    />
                    {emailErrors.email && (
                      <span className="text-sm text-red-500 mt-2 block">
                        {String(emailErrors.email.message)}
                      </span>
                    )}
                  </label>
                  <button
                    type="submit"
                    disabled={!isEmailValid || isEmailSubmitting}
                    className={`w-full rounded-xl px-4 py-3.5 font-semibold text-white shadow-lg transition-all 
                      ${isEmailSubmitting
                        ? "bg-[#b08a66]/80 cursor-not-allowed"
                        : "bg-[#b08a66] hover:bg-[#9a7858] active:scale-[0.98]"
                      }`}
                  >
                    {isEmailSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span>Sending OTP...</span>
                      </span>
                    ) : (
                      "Send Verification Code"
                    )}
                  </button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-sm font-medium text-[#b08a66] hover:underline"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h1 className="mb-6 text-2xl sm:text-3xl font-semibold text-gray-900 text-center lg:text-left">
                  Reset Password
                </h1>
                <p className="mb-8 text-gray-600 text-center lg:text-left">
                  We've sent a code to <span className="font-semibold text-gray-900">{email}</span>. <br />
                  Enter the code and your new password below.
                </p>

                <form onSubmit={handleResetSubmit(onVerifyAndReset)} className="space-y-6">
                  {/* OTP Inputs */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <ShieldCheck className="w-4 h-4 text-[#b08a66]" />
                      Verification Code
                    </label>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpRefs.current[idx] = el;
                          }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          className="w-full h-12 text-center text-xl font-bold rounded-xl border-2 border-gray-200 focus:border-[#b08a66] focus:ring-4 focus:ring-[#b08a66]/10 outline-none transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Lock className="w-4 h-4 text-[#b08a66]" />
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          {...registerReset("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                          })}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:border-[#b08a66] outline-none transition"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {resetErrors.password && (
                        <p className="text-xs text-red-500">{String(resetErrors.password.message)}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Lock className="w-4 h-4 text-[#b08a66]" />
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          {...registerReset("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) => value === password || "Passwords do not match",
                          })}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:border-[#b08a66] outline-none transition"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {resetErrors.confirmPassword && (
                        <p className="text-xs text-red-500">{String(resetErrors.confirmPassword.message)}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isResetSubmitting}
                    className={`w-full rounded-xl px-4 py-3.5 font-semibold text-white shadow-lg transition-all 
                      ${isResetSubmitting
                        ? "bg-[#b08a66]/80 cursor-not-allowed"
                        : "bg-[#b08a66] hover:bg-[#9a7858] active:scale-[0.98]"
                      }`}
                  >
                    {isResetSubmitting ? "Resetting Password..." : "Reset Password"}
                  </button>

                  <div className="text-center space-y-4 pt-2">
                    <p className="text-sm text-gray-500">
                      Didn't receive the code?{" "}
                      <button
                        type="button"
                        onClick={resendOtp}
                        className="font-semibold text-[#b08a66] hover:underline"
                      >
                        Resend OTP
                      </button>
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Change email address
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;


