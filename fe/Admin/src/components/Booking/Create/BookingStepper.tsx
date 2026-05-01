import { useTranslation } from "react-i18next";

const BookingStepper = ({ step }: { step: number }) => {
  const { t } = useTranslation();
  const steps = [
    t("booking.guestInfo"),
    t("booking.bookingDateTime"),
    t("booking.Rooms"),
    t("booking.Services"),
    t("booking.payment"),
  ];
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center md:flex-1 mb-4 md:mb-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0
          ${step >= i + 1 ? "bg-[#42578E] text-white" : "bg-gray-300 text-black"}`}
            >
              {i + 1}
            </div>
            <span className="ml-3 text-sm md:text-sm text-gray-700">{s}</span>
            {i < steps.length - 1 && (
              <div className="hidden md:block flex-1 h-px bg-gray-300 mx-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default BookingStepper;
