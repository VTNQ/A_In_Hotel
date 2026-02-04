import CalendarRange from "@/components/ui/CalenderRange";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import BookingDetailsPanel from "./BookingDetailsPanel";

const StepBookingDateTime = ({ data, onBack, onNext, onCancel }: any) => {
  const { t } = useTranslation();

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
  const nights = useMemo(() => {
    if (!form.checkInDate || !form.checkOutDate) return 0;
    const start = new Date(form.checkInDate);
    const end = new Date(form.checkOutDate);
    return Math.max(
      0,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
  }, [form.checkInDate, form.checkOutDate]);

  const isValid = Boolean(form.checkInDate && form.checkOutDate );
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {t("bookingDateTime.title")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("bookingDateTime.step")}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 border rounded-xl p-4 bg-white">
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
      <div className="flex justify-between items-center border-t pt-5">
        <button
          onClick={onCancel}
          className="
            px-4 py-2 rounded-lg text-sm font-medium
            text-gray-600 border border-gray-300 bg-white
            hover:bg-gray-50 transition
          "
        >
          {t("bookingDateTime.cancel")}
        </button>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="
              px-4 py-2 rounded-lg text-sm
              bg-gray-100 text-gray-700
              hover:bg-gray-200 transition
            "
          >
            {t("bookingDateTime.back")}
          </button>

          <button
            disabled={!isValid}
            onClick={() => onNext({ ...form, nights })}
            className={`
              px-5 py-2 rounded-lg text-sm font-medium transition
              ${
                isValid
                  ? "bg-indigo-500 text-white hover:bg-indigo-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {t("bookingDateTime.next")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default StepBookingDateTime;
