import { useState } from "react";
import { BookingSteps } from "../type/booking.types";
import GuestInfo from "../components/booking/GuestInfo";
import { ArrowRight, X } from "lucide-react";
import ScheduleTab from "../components/booking/ScheduleTab";
import BookingServiceStep from "../components/booking/BookingServiceStep";
import BookingPaymentStep from "../components/booking/BookingPaymentStep";

const BookingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const formatTime = (seconds: any) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  const nextStep = () => {
    if (currentStep < BookingSteps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <div className="min-h-screen bg-[#FBF7F2] p-6">
        <div className="flex-grow pt-24 pb-32 px-4 md:px-8 max-w-5xl mx-auto w-full">
          <div className="mb-12">
            <div className="flex justify-between items-center text-sm">
              {BookingSteps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center flex-1"
                >
                  {/* STEP */}
                  <div className="flex flex-col items-center min-w-[70px]">
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-full border-2 font-bold shadow
      ${
        i === currentStep
          ? "bg-[#f9f6f2] text-[#181c20] border-[#717786]"
          : "text-gray-500 border-outline-variant"
      }`}
                    >
                      {i + 1}
                    </div>

                    <span
                      className={`mt-2 text-[12px] uppercase leading-none tracking-[0.02em] font-medium text-center whitespace-nowrap
  ${i === currentStep ? "text-on-surface font-semibold" : "text-gray-400"}`}
                    >
                      {step}
                    </span>
                  </div>
                  {i !== BookingSteps.length - 1 && (
                    <div
                      className={`relative ${
                        i === BookingSteps.length - 2 ? "flex-[2]" : "flex-1"
                      }`}
                    >
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-gray-300 ${i === BookingSteps.length - 2 ? "w-[150%]" : ""}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 flex w-[94%] items-center justify-center gap-3 py-3 px-6 rounded-xl border border-outline-variant bg-[#f9f6f2] shadow-sm">
            <span>Your booking is held for:</span>
            <strong className="font-semibold">{formatTime(timeLeft)}</strong>
          </div>
          <div className=" p-6">
            {currentStep === 0 && <GuestInfo />}
            {currentStep === 1 && <ScheduleTab/>}
            {currentStep === 2 && <BookingServiceStep />}
            {currentStep ===3 && <BookingPaymentStep/>}
            </div>
        </div>
      </div>
      <div
        className="bg-white/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex justify-between items-center h-20 px-8 w-full 
        z-40 fixed bottom-0 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
      >
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-lg border border-outline-variant 
             text-secondary font-button text-button hover:bg-surface-container transition-colors active:scale-95 duration-150"
        >
          <X size={18} />
          Hủy đặt phòng
        </button>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex gap-4 text-gray-400 dark:text-gray-500 font-sans text-sm font-medium">
            {BookingSteps.map((step, i) => (
              <>
                <span
                  className={
                    i === currentStep
                      ? "text-on-surface dark:text-white font-bold"
                      : ""
                  }
                >
                  {step}
                </span>
              </>
            ))}
          </div>
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-8 py-3 rounded-lg  text-[#181c20] text-[14px]
                line-clamp-1 font-semibold font-sans  transition-colors
                active:scale-90 duration-150 shadow-md bg-[#f9f6f2] border border-[#717786]
              "
          >
            {currentStep === BookingSteps.length - 1 ? "Finish" : "Next"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </>
  );
};
export default BookingPage;
