"use client";

import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { DateRangeProps } from "../../type/booking.types";
import CalendarUI from "../ui/CalenderUI";
import { useTranslation } from "react-i18next";

export default function DateSelect({ value, onChange }: DateRangeProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        wrapperRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setCheckIn(value?.checkIn ?? null);
    setCheckOut(value?.checkOut ?? null);
  }, [value?.checkIn, value?.checkOut]);

  const onSelectDate = (date: string) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    if (date >= checkIn) {
      setCheckOut(date);
    }
  };

  const apply = () => {
    if (!checkIn || !checkOut) {
      alert(t("search.alerts.selectBothDates"));
      return;
    }
    onChange?.({ checkIn, checkOut });
    setOpen(false);
  };

  /* Position dropdown */
 const getDropdownStyle = () => {
  if (!wrapperRef.current) return {};

  const rect = wrapperRef.current.getBoundingClientRect();
  const isDesktop = window.innerWidth >= 1024;

  const DESKTOP_WIDTH = 660; // chỉnh theo ý bạn (700–800 đẹp nhất)

  const width = isDesktop ? DESKTOP_WIDTH : rect.width;

  let left = rect.left + window.scrollX;

  // Nếu desktop → căn giữa theo input
  if (isDesktop) {
    left = rect.left + window.scrollX - (DESKTOP_WIDTH - rect.width) / 2;
  }

  const maxLeft =
    window.innerWidth - width - 16; // 16px padding an toàn

  left = Math.min(left, maxLeft);
  left = Math.max(left, 16); // chống tràn trái

  return {
    position: "absolute" as const,
    top: rect.bottom + window.scrollY + 8,
    left,
    width,
    zIndex: 999999,
  };
};

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <label className="text-xs text-gray-500 mb-1 block">{t("search.selectDate")}</label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[56px] bg-white border border-[#866F56] rounded-xl px-4 flex items-center gap-3"
      >
        <Calendar size={18} className="text-gray-500" />
        <span className="text-sm">
          {checkIn && checkOut
            ? `${checkIn} → ${checkOut}`
            : t("search.placeholder.date")}
        </span>
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={getDropdownStyle()}
            className="z-[999999] bg-white border rounded-xl shadow-xl p-4"
          >
            {/* HEADER */}
            <div className="flex justify-between mb-4 text-sm font-medium">
              <div className={checkOut ? "text-gray-400" : "text-[#b38a58]"}>
                {t("search.checkIn")}
                <div className="text-xs text-gray-500">
                  {checkIn ?? t("search.selectDate")}
                </div>
              </div>

              <div className={!checkIn ? "text-gray-400" : "text-[#b38a58]"}>
                {t("search.checkOut")}
                <div className="text-xs text-gray-500">
                  {checkOut ?? t("search.selectDate")}
                </div>
              </div>
            </div>

            <CalendarUI
              selectedDates={[checkIn, checkOut].filter(Boolean) as string[]}
              onSelect={onSelectDate}
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-gray-500"
              >
                {t("search.cancel")}
              </button>
              <button
                onClick={apply}
                className="px-4 py-2 bg-[#b38a58] text-white rounded-lg text-sm font-medium hover:bg-[#9a7748]"
              >
                {t("search.apply")}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
