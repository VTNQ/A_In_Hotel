import { useEffect, useRef, useState } from "react";
import { Portal } from "./Portal";

type DateTimePickerProps = {
    value: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    minDate?: Date;
};

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

const formatDateTime = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
    ).padStart(2, "0")}`;

export default function DateTimePicker({
    value,
    onChange,
    minDate,
    placeholder = "Select date & time",
}: DateTimePickerProps) {

    const today = new Date();
    const [open, setOpen] = useState(false);

    const [year, setYear] = useState(value?.getFullYear() ?? today.getFullYear());
    const [month, setMonth] = useState(value?.getMonth() ?? today.getMonth());
    const [day, setDay] = useState<number | null>(value?.getDate() ?? null);

    const [hour, setHour] = useState(value?.getHours() ?? 0);
    const [minute, setMinute] = useState(value?.getMinutes() ?? 0);

    const inputRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);


    /* close on outside click */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                popupRef.current &&
                inputRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    /* calendar */
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const confirm = () => {
        if (!day) return;
        const d = new Date(year, month, day);
        d.setHours(hour, minute, 0, 0);
        if (minDate && d < minDate) return;
        onChange(d);
        setOpen(false);
    };

    const POPUP_HEIGHT = 420; // chiều cao ước lượng của popup

    const inputRect = inputRef.current?.getBoundingClientRect();

    let top = 0;

    if (inputRect) {
        const viewportHeight = window.innerHeight;

        const openUp =
            inputRect.bottom + POPUP_HEIGHT > viewportHeight;

        top = openUp
            ? inputRect.top - POPUP_HEIGHT - 8
            : inputRect.bottom + 8;

        // clamp để không vượt màn hình
        top = Math.max(8, Math.min(top, viewportHeight - POPUP_HEIGHT - 8));
    }


    return (
        <>
            {/* INPUT */}
            <div
                ref={inputRef}
                onClick={() => setOpen(true)}
                className="
          border border-gray-300 rounded-xl px-3 py-2
          bg-white cursor-pointer text-sm
          hover:border-[#4B62A0]
        "
            >
                {value ? (
                    <span className="text-gray-700">{formatDateTime(value)}</span>
                ) : (
                    <span className="text-gray-400">{placeholder}</span>
                )}
            </div>

            {open && inputRect && (
                <Portal>
                    <div
                        ref={popupRef}
                        className="
              fixed z-[99999] bg-white rounded-2xl
              shadow-[0_10px_40px_rgba(0,0,0,0.15)]
              w-[320px] p-4
            "
                        style={{
                            top,
                            left: inputRect.left,
                        }}
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex gap-2">
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    className="outline-none text-sm"
                                >
                                    {MONTHS.map((m, i) => (
                                        <option key={i} value={i}>{m}</option>
                                    ))}
                                </select>

                                <select
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className="outline-none text-sm"
                                >
                                    {Array.from({ length: 50 }, (_, i) =>
                                        today.getFullYear() - i
                                    ).map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* WEEK */}
                        <div className="grid grid-cols-7 text-xs text-gray-500 mb-1 text-center">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                                <div key={d}>{d}</div>
                            ))}
                        </div>

                        {/* DAYS */}
                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={i} />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const d = i + 1;
                                const currentDate = new Date(year, month, d);
                                currentDate.setHours(hour, minute, 0, 0);

                                const isDisabled =
                                    minDate && currentDate < minDate;

                                const active = d === day;

                                return (
                                    <div
                                        key={d}
                                        onClick={() => {
                                            if (isDisabled) return;
                                            setDay(d);
                                        }}
                                        className={`
                h-9 w-9 flex items-center justify-center rounded-lg text-sm
                ${isDisabled
                                                ? "text-gray-300 cursor-not-allowed"
                                                : "cursor-pointer hover:bg-gray-100"}
                ${active && !isDisabled ? "bg-[#4B62A0] text-white" : ""}
            `}
                                    >
                                        {d}
                                    </div>
                                );
                            })}

                        </div>

                        {/* TIME – STEPPER */}
                        {/* TIME – INPUT + STEPPER */}
                        <div className="flex justify-center items-center gap-6 mb-4">
                            {/* Hour */}
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={() => setHour(h => clamp(h + 1, 0, 23))}
                                    className="w-8 h-6 rounded hover:bg-gray-100"
                                >
                                    ▲
                                </button>

                                <input
                                    type="text"
                                    value={String(hour).padStart(2, "0")}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/\D/g, "");
                                        setHour(v === "" ? 0 : clamp(Number(v), 0, 23));
                                    }}
                                    onBlur={() => setHour(h => clamp(h, 0, 23))}
                                    className="
        w-12 h-10 text-center font-semibold
        border rounded-lg outline-none
        focus:ring-2 focus:ring-[#4B62A0]
      "
                                />

                                <button
                                    onClick={() => setHour(h => clamp(h - 1, 0, 23))}
                                    className="w-8 h-6 rounded hover:bg-gray-100"
                                >
                                    ▼
                                </button>
                            </div>

                            <span className="text-xl font-semibold">:</span>

                            {/* Minute */}
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={() => setMinute(m => clamp(m + 1, 0, 59))}
                                    className="w-8 h-6 rounded hover:bg-gray-100"
                                >
                                    ▲
                                </button>

                                <input
                                    type="text"
                                    value={String(minute).padStart(2, "0")}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/\D/g, "");
                                        setMinute(v === "" ? 0 : clamp(Number(v), 0, 59));
                                    }}
                                    onBlur={() => setMinute(m => clamp(m, 0, 59))}
                                    className="
        w-12 h-10 text-center font-semibold
        border rounded-lg outline-none
        focus:ring-2 focus:ring-[#4B62A0]
      "
                                />

                                <button
                                    onClick={() => setMinute(m => clamp(m - 1, 0, 59))}
                                    className="w-8 h-6 rounded hover:bg-gray-100"
                                >
                                    ▼
                                </button>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-3 py-1 text-sm rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirm}
                                className="px-4 py-1.5 text-sm rounded-lg bg-[#4B62A0] text-white"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
}
