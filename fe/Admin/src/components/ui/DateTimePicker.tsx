import { useEffect, useMemo, useRef, useState } from "react";
import { Portal } from "./Portal";

type DateTimePickerProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date; // min theo cả date+time
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const formatDateTime = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;

const sameYMD = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function DateTimePicker({
  value,
  onChange,
  minDate,
  placeholder = "Select date & time",
}: DateTimePickerProps) {
  const inputRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  // ====== INTERNAL "now" (cập nhật khi mở popup để luôn đúng) ======
  const [now, setNow] = useState(() => new Date());

  // ====== DRAFT STATE (hiển thị trong popup) ======
  const init = useMemo(() => value ?? new Date(), [value]);

  const [year, setYear] = useState(init.getFullYear());
  const [month, setMonth] = useState(init.getMonth());
  const [day, setDay] = useState<number | null>(init.getDate());
  const [hour, setHour] = useState(init.getHours());
  const [minute, setMinute] = useState(init.getMinutes());

  // Sync draft khi value thay đổi từ ngoài
  useEffect(() => {
    if (!value) return;
    setYear(value.getFullYear());
    setMonth(value.getMonth());
    setDay(value.getDate());
    setHour(value.getHours());
    setMinute(value.getMinutes());
  }, [value]);

  // Click ngoài để đóng
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

  // Khi mở popup: cập nhật now + nếu chưa có value thì set draft = now
  const openPopup = () => {
    const n = new Date();
    setNow(n);

    if (!value) {
      setYear(n.getFullYear());
      setMonth(n.getMonth());
      setDay(n.getDate());
      setHour(n.getHours());
      setMinute(n.getMinutes());
    }
    setOpen(true);
  };

  // Calendar layout
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // ====== Helper build draft date ======
  const buildDraft = (yy = year, mm = month, dd = day, hh = hour, mi = minute) => {
    if (!dd) return null;
    const d = new Date(yy, mm, dd, hh, mi, 0, 0);
    return d;
  };

  // ====== Rule: nếu chọn hôm nay => time >= now ======
  const isTodaySelected = useMemo(() => {
    if (!day) return false;
    return sameYMD(new Date(year, month, day), now);
  }, [year, month, day, now]);

  // ====== min constraints for hour/minute ======
  // 1) constraint từ "today rule"
  const todayMinHour = isTodaySelected ? now.getHours() : 0;
  const todayMinMinute =
    isTodaySelected && hour === now.getHours() ? now.getMinutes() : 0;

  // 2) constraint từ minDate (nếu minDate cùng ngày đang chọn)
  const isMinDateSameDay = useMemo(() => {
    if (!minDate || !day) return false;
    return sameYMD(new Date(year, month, day), minDate);
  }, [minDate, year, month, day]);

  const minDateMinHour = isMinDateSameDay && minDate ? minDate.getHours() : 0;
  const minDateMinMinute =
    isMinDateSameDay && minDate && hour === minDate.getHours()
      ? minDate.getMinutes()
      : 0;

  // final min hour/minute = max của 2 rule
  const minHour = Math.max(todayMinHour, minDateMinHour);
  const minMinute = Math.max(todayMinMinute, minDateMinMinute);

  // Nếu user đổi day/month/year làm hour/minute bị < min => auto kéo lên min
  useEffect(() => {
    setHour((h) => clamp(h, minHour, 23));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minHour]);

  useEffect(() => {
    setMinute((m) => clamp(m, minMinute, 59));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minMinute]);

  // Disable day theo minDate (cả time)
  const isDayDisabled = (dNum: number) => {
    if (!minDate) return false;
    // so sánh tại thời điểm minHour/minMinute (để đúng logic hạn chế theo giờ)
    const tmp = new Date(year, month, dNum, 23, 59, 59, 999);
    return tmp < minDate; // cả ngày đó kết thúc vẫn < minDate => disable
  };

  const confirm = () => {
    const d = buildDraft();
    if (!d) return;

    // Check minDate (cả date+time)
    if (minDate && d < minDate) return;

    // Check today rule: nếu là hôm nay thì d >= now
    // (đã clamp hour/minute rồi, nhưng check lại cho chắc)
    if (sameYMD(d, now) && d < now) return;

    onChange(d);
    setOpen(false);
  };

  // Position popup
  const POPUP_HEIGHT = 420;
  const rect = inputRef.current?.getBoundingClientRect();
  let top = 0;

  if (rect) {
    const vh = window.innerHeight;
    const openUp = rect.bottom + POPUP_HEIGHT > vh;
    top = openUp ? rect.top - POPUP_HEIGHT - 8 : rect.bottom + 8;
    top = Math.max(8, Math.min(top, vh - POPUP_HEIGHT - 8));
  }

  return (
    <>
      {/* INPUT */}
      <div
        ref={inputRef}
        onClick={openPopup}
        className="border border-gray-300 rounded-xl px-3 py-2 bg-white cursor-pointer text-sm hover:border-[#4B62A0]"
      >
        {value ? (
          <span className="text-gray-700">{formatDateTime(value)}</span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>

      {open && rect && (
        <Portal>
          <div
            ref={popupRef}
            className="fixed z-[99999] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] w-[320px] p-4"
            style={{ top, left: rect.left }}
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
                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* WEEK */}
            <div className="grid grid-cols-7 text-xs text-gray-500 mb-1 text-center">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d}>{d}</div>)}
            </div>

            {/* DAYS */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {Array.from({ length: firstDay }).map((_, i) => <div key={i} />)}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dNum = i + 1;
                const disabled = isDayDisabled(dNum);
                const active = dNum === day;

                return (
                  <div
                    key={dNum}
                    onClick={() => {
                      if (disabled) return;
                      setDay(dNum);
                    }}
                    className={`
                      h-9 w-9 flex items-center justify-center rounded-lg text-sm
                      ${disabled ? "text-gray-300 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}
                      ${active && !disabled ? "bg-[#4B62A0] text-white" : ""}
                    `}
                  >
                    {dNum}
                  </div>
                );
              })}
            </div>

            {/* TIME */}
            <div className="flex justify-center items-center gap-6 mb-4">
              {/* HOUR */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setHour((h) => clamp(h + 1, minHour, 23))}
                  className="w-8 h-6 rounded hover:bg-gray-100"
                >
                  ▲
                </button>

                <input
                  type="text"
                  value={String(hour).padStart(2, "0")}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    const n = raw === "" ? minHour : Number(raw);
                    setHour(clamp(n, minHour, 23));
                  }}
                  className="w-12 h-10 text-center font-semibold border rounded-lg outline-none focus:ring-2 focus:ring-[#4B62A0]"
                />

                <button
                  onClick={() => setHour((h) => clamp(h - 1, minHour, 23))}
                  className="w-8 h-6 rounded hover:bg-gray-100"
                >
                  ▼
                </button>
              </div>

              <span className="text-xl font-semibold">:</span>

              {/* MINUTE */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setMinute((m) => clamp(m + 1, minMinute, 59))}
                  className="w-8 h-6 rounded hover:bg-gray-100"
                >
                  ▲
                </button>

                <input
                  type="text"
                  value={String(minute).padStart(2, "0")}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    const n = raw === "" ? minMinute : Number(raw);
                    setMinute(clamp(n, minMinute, 59));
                  }}
                  className="w-12 h-10 text-center font-semibold border rounded-lg outline-none focus:ring-2 focus:ring-[#4B62A0]"
                />

                <button
                  onClick={() => setMinute((m) => clamp(m - 1, minMinute, 59))}
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
