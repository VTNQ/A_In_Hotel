import { BookingStep, type BookingStepProps } from "@/type/booking.types";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const BookingStepper = ({ currentStep }: BookingStepProps) => {
  const { t } = useTranslation();
  const steps = [
    { step: BookingStep.GuestInfo, label: t("booking.guestInfo") },
    { step: BookingStep.DateTime, label: t("booking.bookingDateTime") },
    { step: BookingStep.Room, label: t("booking.Rooms") },
    { step: BookingStep.Services, label: t("booking.Services") },
    { step: BookingStep.Payment, label: t("booking.Payment") },
  ];
  return (
    <div className="flex items-center gap-4">
      {steps.map((s, index) => (
        <div key={s.step} className="flex items-center gap-2">
          <div
            className={clsx(
              "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
              currentStep >= s.step
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-400",
            )}
          >
            {s.step}
          </div>
          <span
            className={clsx(
              "text-sm",
              currentStep >= s.step
                ? "text-indigo-500 font-medium"
                : "text-gray-500",
            )}
          >
            {s.label}
          </span>

          {index < steps.length - 1 && (
            <div className="w-10 h-px bg-gray-300 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
};
export default BookingStepper;