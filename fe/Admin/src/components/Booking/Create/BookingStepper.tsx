import { useTranslation } from "react-i18next";


const BookingStepper = ({ step }: { step: number }) => {
    const {t} = useTranslation();
const steps = [t("booking.guestInfo"),t("booking.bookingDateTime"), t("booking.Rooms"),t("booking.Services"), t("booking.payment")];
    return(
         <div className="flex mb-6">
        {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
          ${step >= i + 1 ? "bg-[#42578E] text-white" : "bg-gray-300"}`}
                >
                    {i + 1}
                </div>
                <span className="ml-2 text-sm">{s}</span>
                {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-300 mx-4" />}
            </div>
        ))}
    </div>
    )
}
export default BookingStepper;