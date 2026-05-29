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
        {steps.map((s, i) => {
          const active = step >= i + 1;

          return (
            <div key={s} className="flex items-center md:flex-1 mb-4 md:mb-0">
              {/* STEP CIRCLE */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0
                ${
                  active
                    ? "bg-[#42578E] text-white dark:bg-blue-600"
                    : "bg-gray-300 text-black dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {i + 1}
              </div>

              {/* LABEL */}
              <span
                className={`ml-3 text-sm
                ${
                  active
                    ? "text-gray-700 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {s}
              </span>

              {/* CONNECTOR */}
              {i < steps.length - 1 && (
                <div className="hidden md:block flex-1 h-px bg-gray-300 dark:bg-gray-600 mx-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingStepper;