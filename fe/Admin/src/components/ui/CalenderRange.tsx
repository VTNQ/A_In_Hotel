import { useState } from "react";
import type { CalendarRangeProps } from "../../type/booking.types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Month from "./Month";
const CalendarRange = ({ value, onChange }: CalendarRangeProps) => {
    const [baseMonth, setBaseMonth] = useState(new Date(2023, 9)); // Oct 2023
    const toDateString = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };
    const clearDates = () => {
        onChange({ start: undefined, end: undefined });
    };

    const isSame = (val?: string, d?: Date) =>
        val && d && val === toDateString(d);

    const isInRange = (d: Date) => {
        if (!value.start || !value.end) return false;
        const v = toDateString(d);
        return v > value.start && v < value.end;
    };

    const handleSelect = (d: Date) => {
        const selected = toDateString(d);

        // chọn mới
        if (!value.start || value.end) {
            onChange({ start: selected, end: undefined });
            return;
        }

        // chọn ngày nhỏ hơn start → reset
        if (selected < value.start) {
            onChange({ start: selected, end: undefined });
            return;
        }

        // chọn end
        onChange({ start: value.start, end: selected });
    };

    const nights =
        value.start && value.end
            ? Math.ceil(
                (new Date(value.end).getTime() -
                    new Date(value.start).getTime()) /
                (1000 * 60 * 60 * 24)
            )
            : 0;

    return (
        <div className="rounded-xl p-4 bg-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b py-3 border-gray-200">
                <h3 className="font-semibold text-gray-800">
                    Select Dates
                </h3>
                <div className="flex items-center gap-3">
                    {nights > 0 && (
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                            Total: {nights} Nights
                        </span>
                    )}

                    {(value.start || value.end) && (
                        <button
                            onClick={clearDates}
                            className="text-xs text-red-500 hover:underline"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Month navigation */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() =>
                        setBaseMonth(
                            new Date(
                                baseMonth.getFullYear(),
                                baseMonth.getMonth() - 1
                            )
                        )
                    }
                >
                    <ChevronLeft />
                </button>

                <div className="flex gap-24 font-medium text-sm">
                    <span>
                        {baseMonth.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                    <span>
                        {new Date(
                            baseMonth.getFullYear(),
                            baseMonth.getMonth() + 1
                        ).toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                </div>

                <button
                    onClick={() =>
                        setBaseMonth(
                            new Date(
                                baseMonth.getFullYear(),
                                baseMonth.getMonth() + 1
                            )
                        )
                    }
                >
                    <ChevronRight />
                </button>
            </div>

            {/* Calendars */}
            <div className="grid grid-cols-2 gap-10">
                <Month
                    month={baseMonth}
                    value={value}
                    onSelect={handleSelect}
                    isSame={isSame}
                    isInRange={isInRange}
                />
                <Month
                    month={
                        new Date(
                            baseMonth.getFullYear(),
                            baseMonth.getMonth() + 1
                        )
                    }
                    value={value}
                    onSelect={handleSelect}
                    isSame={isSame}
                    isInRange={isInRange}
                />
            </div>
        </div>
    );
};



export default CalendarRange;