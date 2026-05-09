import { useEffect, useState } from "react";
import { BookingSteps } from "../type/booking.types";
import GuestInfo from "../components/booking/GuestInfo";
import { ArrowRight, X } from "lucide-react";
import ScheduleTab from "../components/booking/ScheduleTab";
import BookingServiceStep from "../components/booking/BookingServiceStep";
import BookingPaymentStep from "../components/booking/BookingPaymentStep";
import useBooking from "../hook/useBooking";
import { useAlert } from "../components/alert-context";
import { useNavigate } from "react-router-dom";
import { useBookingSearch } from "../context/booking/BookingSearchContext";
import { createBooking } from "../service/api/bookings";

const BookingPage = () => {
  const { booking, updateBooking, clearBooking } = useBooking();

  const { search, clearSearch } = useBookingSearch();
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState({
    checkInDate: search?.checkIn,
    checkOutDate: search?.checkOut,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    package: search?.priceType,
  });
  const [guest, setGuest] = useState(booking.guest || {});
  const [payment, setPayment] = useState(booking.payment || {});
  const [currentStep, setCurrentStep] = useState(booking.step || 0);
  const expiredAt = Number(booking?.countdown?.expiredAt);

  const getInitialTime = () => {
    if (!Number.isFinite(expiredAt)) return 15 * 60;

    const diff = expiredAt - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime);

  // ========================
  // AUTO EXPIRE BOOKING
  // ========================

  useEffect(() => {
    if (!Number.isFinite(expiredAt)) return;

    const timer = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((expiredAt - Date.now()) / 1000),
      );

      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        resetAllState();
        navigate("/");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiredAt]);
  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "15:00";

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  // 👉 schedule (controlled)

  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const resetAllState = () => {
    clearBooking();
    clearSearch();

    setGuest({});
    setPayment({});
    setServices([]);

    setSchedule({
      checkInDate: "",
      checkOutDate: "",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      package: "1",
    });

    setCurrentStep(0);
    setTimeLeft(15 * 60);
  };
  const handleCancel = () => {
    showAlert({
      type: "warning",
      title: "Cancel booking?",
      description:
        "Your current booking progress will be lost if you continue.",

      primaryAction: {
        label: "Yes, cancel",
        onClick: () => {
          resetAllState();
          navigate("/");
        },
      },

      secondaryAction: {
        label: "No, keep booking",
        onClick: () => {},
      },
    });
  };
  const nextStep = async () => {
    if (!validateStep()) return;
    if (currentStep === BookingSteps.length - 1) {
      await handleSubmit();
      return;
    }
    updateBooking({
      guest,
      selectDate: schedule,
      services,
      payment,
    });

    setCurrentStep((prev) => {
      const next = prev + 1;

      updateBooking({
        step: next,
      });

      return next;
    });
  };
  const isNextDisabled = () => {
    if (currentStep === 0) {
      return (
        !guest?.firstName ||
        !guest?.lastName ||
        !guest?.phone ||
        !guest?.email ||
        !guest?.idNumber
      );
    }
    if (currentStep === 1) {
      return !schedule?.checkInDate || !schedule?.checkOutDate;
    }
    return false;
  };
  const prevStep = () => {
    setCurrentStep((prev) => {
      const next = Math.max(prev - 1, 0);
      updateBooking({ step: next });
      return next;
    });
  };

  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const payload = buildBookingPayload();
      const response = await createBooking(payload);

      showAlert({
        title: response?.data?.message || "Booking created successfully.",
        type: "success",
        autoClose: 3000,
      });

      clearBooking();
      clearSearch();
      navigate("/");
    } catch (err: any) {
      console.log(err);

      showAlert({
        title: err?.response?.data?.message || "Booking failed.",
        type: "error",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  const buildBookingPayload = () => {
    // ===== NIGHTS =====

    // ===== BASE PRICE =====
    const basePrice = Number(search?.totalPrice || 0);

    // ===== ROOM DETAILS =====
    const roomDetails = search?.roomId
      ? [
          {
            roomId: search.roomId,
            price: basePrice,
          },
        ]
      : [];

    // ===== SERVICE DETAILS =====
    const serviceDetails = (services || []).map((s: any) => {
      const percent = Number(s.extraCharge || 0);
      const price = (basePrice * percent) / 100;

      return {
        extraServiceId: s.id,
        price: Number(price.toFixed(2)),
      };
    });

    // ===== SERVICES TOTAL =====
    const servicesTotal = serviceDetails.reduce(
      (sum: number, s: any) => sum + Number(s.price || 0),
      0,
    );

    // ===== TOTAL =====
    const originalTotal = Number((basePrice + servicesTotal).toFixed(2));

    // ===== PAID AMOUNT (50%) =====
    const paidAmount = Number((originalTotal * 0.5).toFixed(2));

    // ===== RETURN PAYLOAD =====
    return {
      // ===== GUEST =====
      guestName: guest?.firstName,
      surname: guest?.lastName,
      email: guest?.email,
      phoneNumber: guest?.phone,

      guestType: guest?.guestType ?? 1,
      numberOfGuests: guest?.adults ?? 1,
      note: guest?.note,
      idNumber: guest?.idNumber,

      // ===== AMOUNT =====
      originalAmount: originalTotal,
      voucherCode: payment?.voucherCode || "",
      discountAmount: payment?.discountAmount || 0,
      totalPrice: Math.max(0, originalTotal - (payment?.discountAmount || 0)),

      // ===== PAYMENT =====
      payment: {
        paidAmount,
        paymentMethod: payment?.method || "card",
        paymentType: 1,
        notes: payment?.note || "",
      },

      // ===== DATE =====
      checkInDate: schedule?.checkInDate,
      checkInTime: schedule?.checkInTime,
      checkOutDate: schedule?.checkOutDate,
      checkOutTime: schedule?.checkOutTime,

      // ===== PACKAGE =====
      bookingPackage: schedule?.package,

      // ===== DETAILS =====
      bookingDetail: [...roomDetails, ...serviceDetails],
    };
  };
  const validateStep = () => {
    switch (currentStep) {
      case 0: // Guest
        if (
          !guest?.firstName ||
          !guest?.lastName ||
          !guest?.phone ||
          !guest?.email ||
          !guest?.idNumber
        ) {
          showAlert({
            type: "error",
            title: "Vui lòng nhập đầy đủ thông tin khách",
          });
          return false;
        }
        return true;

      case 1: // Schedule
        if (!schedule?.checkInDate || !schedule?.checkOutDate) {
          showAlert({
            type: "error",
            title: "Vui lòng chọn ngày nhận và trả phòng",
          });
          return false;
        }
        if (!schedule?.checkInTime || !schedule?.checkOutTime) {
          showAlert({
            type: "error",
            title: "Vui lòng chọn giờ nhận và trả phòng",
          });
          return false;
        }
        return true;

      case 2: // Services (optional thì cho qua)
        return true;

      case 3: // Payment (tuỳ bạn validate thêm)
        return true;

      default:
        return true;
    }
  };
  const getStepStatus = (i: number, currentStep: number) => {
    if (i < currentStep) return "done";
    if (i === currentStep) return "active";
    return "todo";
  };

  return (
    <>
      <div className="min-h-screen bg-[#FBF7F2] p-6">
        <div className="flex-grow pt-24 pb-32 px-4 md:px-8 max-w-5xl mx-auto w-full">
          <div className="mb-12">
            <div className="flex justify-between items-center text-sm">
              {BookingSteps.map((step, i) => (
                <div
                  key={step}
                  className="flex items-center justify-center flex-1"
                >
                  {/* STEP */}
                  <div className="flex flex-col items-center min-w-[70px]">
                    {(() => {
                      const status = getStepStatus(i, currentStep);

                      return (
                        <div
                          className={`w-9 h-9 flex items-center justify-center rounded-full border-2 font-bold shadow transition
        ${
          status === "active"
            ? "bg-[#f9f6f2] text-[#181c20] border-[#717786]"
            : status === "done"
              ? "bg-[rgb(24,28,32)] text-white border-white"
              : "text-gray-400 border-outline-variant"
        }`}
                        >
                          {status === "done" ? "✓" : i + 1}
                        </div>
                      );
                    })()}

                    <span
                      className={`mt-2 text-[12px] uppercase leading-none tracking-[0.02em] font-medium text-center whitespace-nowrap
    ${
      i < currentStep
        ? "text-on-surface  font-semibold"
        : i === currentStep
          ? "text-on-surface font-semibold"
          : "text-gray-400"
    }`}
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
            {currentStep === 0 && (
              <GuestInfo data={guest} onChange={setGuest} />
            )}
            {currentStep === 1 && (
              <ScheduleTab data={schedule} onChange={setSchedule} />
            )}
            {currentStep === 2 && (
              <BookingServiceStep
                data={services}
                onChange={setServices}
                booking={schedule}
              />
            )}
            {currentStep === 3 && (
              <BookingPaymentStep
                data={payment}
                onChange={setPayment}
                schedule={schedule}
                services={services}
              />
            )}
          </div>
        </div>
      </div>
      <div
        className="bg-white/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex justify-between items-center h-20 px-8 w-full 
        z-40 fixed bottom-0 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
      >
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border border-outline-variant 
             text-secondary font-button text-button hover:bg-surface-container transition-colors active:scale-95 duration-150"
        >
          <X size={18} />
          Hủy đặt phòng
        </button>
        <div className="flex items-center gap-6">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300
        text-gray-600 font-medium hover:bg-gray-100 transition-colors active:scale-95"
            >
              Back
            </button>
          )}
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
            disabled={isNextDisabled() || loading}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg text-[14px] font-semibold transition
    ${
      isNextDisabled() || loading
        ? "opacity-50 cursor-not-allowed bg-gray-200"
        : "bg-[#f9f6f2] border border-[#717786] active:scale-90 shadow-md"
    }`}
          >
            {loading
              ? "Processing..."
              : currentStep === BookingSteps.length - 1
                ? "Finish"
                : "Next"}
            <ArrowRight size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
    </>
  );
};
export default BookingPage;
