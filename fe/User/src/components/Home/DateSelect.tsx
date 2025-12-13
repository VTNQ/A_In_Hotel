import { Calendar } from "lucide-react";
import { useState } from "react";
import type { DateRangeProps } from "../../type/booking.types";
import CalendarUI from "../ui/CalenderUI";

export default function DateSelect({ value, onChange }: DateRangeProps) {
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<string | null>(
    value?.checkIn ?? null
  );
  const [checkOut, setCheckOut] = useState<string | null>(
    value?.checkOut ?? null
  );

  const onSelectDate = (date: string) => {
    // chọn lại từ đầu
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    // chọn checkout
    if (date >= checkIn) {
      setCheckOut(date);
    }
  };

  const apply = () => {
    if (!checkIn || !checkOut) {
      alert("Please select both Check-in and Check-out");
      return;
    }
    onChange?.({ checkIn, checkOut });
    setOpen(false);
  };

  return (
    <div className="relative flex-1">
      <label className="text-xs text-gray-500 mb-1 block">
        Select date
      </label>

      {/* BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[56px] bg-white border border-[#866F56] rounded-xl px-4 flex items-center gap-3"
      >
        <Calendar size={18} className="text-gray-500" />
        <span className="text-sm">
          {checkIn && checkOut
            ? `${checkIn} → ${checkOut}`
            : "Check-in → Check-out"}
        </span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute left-0 mt-2 bg-white border rounded-xl shadow-lg z-[9999] p-4 w-[720px]">
          
          {/* HEADER CHECK-IN / CHECK-OUT */}
          <div className="flex justify-between mb-4 text-sm font-medium">
            <div className={checkOut ? "text-gray-400" : "text-[#b38a58]"}>
              Check-in
              <div className="text-xs text-gray-500">
                {checkIn ?? "Select date"}
              </div>
            </div>

            <div className={!checkIn ? "text-gray-400" : "text-[#b38a58]"}>
              Check-out
              <div className="text-xs text-gray-500">
                {checkOut ?? "Select date"}
              </div>
            </div>
          </div>

          {/* CALENDAR */}
          <CalendarUI
            selectedDates={[checkIn, checkOut].filter(Boolean) as string[]}
            onSelect={onSelectDate}
          />

          {/* ACTION */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={apply}
              className="px-4 py-2 bg-[#b38a58] text-white rounded-lg text-sm font-medium hover:bg-[#9a7748]"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
