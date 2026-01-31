import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  value?: Date;
  onChange?: (d?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledDate?: (date: Date) => boolean;
  minDateTime?: Date;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 30, 45];

export default function DateTimePicker({
  value,
  onChange,
  placeholder,
  disabled,
  disabledDate,
  minDateTime,
}: Props) {
  const [open, setOpen] = useState(false);
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const isHourDisabled = (h: number) => {
    if (!minDateTime || !value) return false;
    if (!isSameDay(minDateTime, value)) return false;

    return h < minDateTime.getHours();
  };
  const isMinuteDisabled = (m: number) => {
    if (!minDateTime || !value) return false;
    if (!isSameDay(minDateTime, value)) return false;

    if (value.getHours() > minDateTime.getHours()) return false;

    return m <= minDateTime.getMinutes();
  };

 const update = (fn: (d: Date) => void) => {
  const next = value ? new Date(value) : new Date();
  fn(next);

 
  if (disabledDate?.(next)) return;

  // ⛔ BLOCK nếu nhỏ hơn minDateTime
  if (minDateTime && next < minDateTime) return;

  onChange?.(next);
};

  return (
    <Popover
      open={disabled ? false : open}
      onOpenChange={(v) => !disabled && setOpen(v)}
    >
      {/* ===== INPUT ===== */}
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center gap-2 rounded-xl border px-3 text-sm",
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:border-gray-300 focus:ring-2 focus:ring-blue-100",
          )}
        >
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span className={cn(!value && "text-gray-400")}>
            {value ? format(value, "dd/MM/yyyy HH:mm") : placeholder}
          </span>
        </button>
      </PopoverTrigger>

      {/* ===== POPUP ===== */}
      <PopoverContent  className="w-[300px] max-h-[380px] overflow-y-auto  space-y-4 p-4 custom-scrollbar" side="bottom" avoidCollisions={false} align="start">
        {/* DATE */}
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) =>
            d &&
            update((next) =>
              next.setFullYear(d.getFullYear(), d.getMonth(), d.getDate()),
            )
          }
          disabled={disabledDate}
          initialFocus
        />

        {/* TIME */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <Clock className="h-4 w-4" />
            Thời gian
          </div>

          {/* HOURS */}
          <div>
            <p className="mb-1 text-xs text-gray-500">Giờ</p>
            <div className="grid grid-cols-6 gap-1">
              {HOURS.map((h) => {
                const active = value?.getHours() === h;
                const disabledHour = isHourDisabled(h);

                return (
                  <button
                    key={h}
                    disabled={disabledHour}
                    onClick={() =>
                      !disabledHour && update((d) => d.setHours(h))
                    }
                    className={cn(
                      "rounded-md px-2 py-1 text-xs transition",
                      disabledHour
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : active
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700",
                    )}
                  >
                    {String(h).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MINUTES */}
          <div>
            <p className="mb-1 text-xs text-gray-500">Phút</p>
            <div className="grid grid-cols-4 gap-1">
              {MINUTES.map((m) => {
                const active = value?.getMinutes() === m;
                const disabledMinute = isMinuteDisabled(m);

                return (
                  <button
                    key={m}
                    disabled={disabledMinute}
                    onClick={() =>
                      !disabledMinute && update((d) => d.setMinutes(m))
                    }
                    className={cn(
                      "rounded-md px-2 py-1 text-xs transition",
                      disabledMinute
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : active
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700",
                    )}
                  >
                    {String(m).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between border-t pt-2">
          <button
            disabled={!value || disabled}
            onClick={() => onChange?.(undefined)}
            className={cn(
              "text-xs",
              value && !disabled
                ? "text-gray-500 hover:text-red-600"
                : "text-gray-300 cursor-not-allowed",
            )}
          >
            Xóa lựa chọn
          </button>

          <button
            onClick={() => setOpen(false)}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Đóng
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
