import { useMemo, useState } from "react"
import CalendarRange from "../../ui/CalenderRange";
import BookingDetailsPanel from "./BookingDetailsPanel";
import { useTranslation } from "react-i18next";

const StepBookingDateTime = ({ data, onBack, onNext, onCancel }: any) => {
    const [form, setForm] = useState({
        checkInDate: "",
        checkOutDate: "",
        checkInTime: "14:00",
        checkOutTime: "12:00",
        package: "1",
        adults: 2,
        children: 0,
        ...data,
    });
    const { t } = useTranslation();
    const nights = useMemo(() => {
        if (!form.checkInDate || !form.checkOutDate) return 0;
        const start = new Date(form.checkInDate);
        const end = new Date(form.checkOutDate);
        return Math.max(
            0,
            Math.ceil(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            )
        );
    }, [form.checkInDate, form.checkOutDate]);
    const isValid =
        form.checkInDate &&
        form.checkOutDate &&
        nights > 0;

    return (
        <div className="bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                       {t("bookingDateTime.title")}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {t("bookingDateTime.step")}
                    </p>
                </div>

            </div>
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm">
                    <CalendarRange
                        value={{
                            start: form.checkInDate,
                            end: form.checkOutDate,
                        }}
                        onChange={(range) =>
                            setForm((p: any) => ({
                                ...p,
                                checkInDate: range.start,
                                checkOutDate: range.end,
                            }))
                        }
                    />

                </div>
                <BookingDetailsPanel
                    form={form}
                    nights={nights}

                    onChange={(key: any, value: any) =>
                        setForm((p: any) => ({ ...p, [key]: value }))
                    }
                />
            </div>
            <div className="flex justify-between items-center mt-6">
                {/* CANCEL - NGOÀI, BÊN TRÁI */}
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg text-sm font-medium 
                    text-red-600 border border-red-200 bg-red-50
                    hover:bg-red-100 hover:border-red-300 transition"
                >
                     {t("bookingDateTime.cancel")}
                </button>
                {/* BACK + NEXT - NHÓM RIÊNG */}
                <div className="flex gap-3">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 rounded-lg 
                bg-[#F2F2F2] text-[#4B4B4B]"
                    >
                        {t("bookingDateTime.back")}
                    </button>

                    <button
                        disabled={!isValid}
                        onClick={() => onNext({ ...form, nights })}
                        className={`px-5 py-2 rounded-lg transition
                ${isValid
                                ? "bg-[#42578E] text-white hover:bg-[#536DB2]"
                                : "bg-gray-300 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                       {t("bookingDateTime.next")}
                    </button>
                </div>
            </div>

        </div>
    )
}
export default StepBookingDateTime;