import { useEffect, useRef, useState } from "react";
import type { RoomsGuestsSelectProps } from "../../type/booking.types";
import { Minus, Plus, Users, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

const RoomGuestsSelect = ({ value, onChange }: RoomsGuestsSelectProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
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



  const rooms = value?.rooms ?? 1;
  const adults = value?.adults ?? 1;
  const children = value?.children ?? 0;
  const totalGuests = adults + children;

  const updateValue = (updates: Partial<{ rooms: number; adults: number; children: number }>) => {
    onChange?.({
      rooms,
      adults,
      children,
      ...updates
    });
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const getDropdownStyle = () => {
    if (!wrapperRef.current) return {};
    const rect = wrapperRef.current.getBoundingClientRect();
    return {
      position: "absolute" as const,
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width,
    };
  };

  const Row = ({
    label,
    val,
    onMinus,
    onPlus,
    min = 0,
  }: {
    label: string;
    val: number;
    onMinus: () => void;
    onPlus: () => void;
    min?: number;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      <div className="flex items-center gap-4">
        <button
          onClick={onMinus}
          disabled={val <= min}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#9C7A55] hover:text-[#9C7A55] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors"
        >
          <Minus size={14} strokeWidth={2.5} />
        </button>
        <span className="w-4 text-center font-semibold text-gray-800">{val}</span>
        <button
          onClick={onPlus}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#9C7A55] hover:text-[#9C7A55] transition-colors"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <label className="text-xs font-medium text-gray-500 mb-1.5 block">
        {t("search.selectRoomsGuests")}
      </label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full h-[56px] bg-white border ${open ? "border-[#9C7A55] ring-1 ring-[#9C7A55]" : "border-gray-200"} rounded-xl px-4 flex items-center justify-between hover:border-[#9C7A55] transition-all`}
      >
        <div className="flex items-center gap-3">
          <Users size={18} className="text-[#9C7A55]" />
          <span className="text-sm  text-gray-800">
            {rooms} {t("search.room")}, {totalGuests} {t("search.guest")}
          </span>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open &&
        createPortal(
          isMobile ? (
            <div className="fixed inset-0 z-[999999] bg-black/40 flex items-end animate-fadeIn">
              <div
                ref={dropdownRef}
                className="bg-white w-full rounded-t-3xl p-6 space-y-6 animate-slideUp shadow-[0_-8px_30px_rgb(0,0,0,0.12)]"
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <h3 className="text-lg font-bold text-center text-gray-800">
                  {t("search.selectRoomsGuests")}
                </h3>

                <div className="space-y-6">
                  <Row
                    label={t("search.room")}
                    val={rooms}
                    min={1}
                    onMinus={() => updateValue({ rooms: Math.max(1, rooms - 1) })}
                    onPlus={() => updateValue({ rooms: rooms + 1 })}
                  />
                  <div className="h-[1px] bg-gray-100 w-full"></div>
                  <Row
                    label={t("search.adult")}
                    val={adults}
                    min={1}
                    onMinus={() => updateValue({ adults: Math.max(1, adults - 1) })}
                    onPlus={() => updateValue({ adults: adults + 1 })}
                  />
                  <div className="h-[1px] bg-gray-100 w-full"></div>
                  <Row
                    label={t("search.child")}
                    val={children}
                    min={0}
                    onMinus={() => updateValue({ children: Math.max(0, children - 1) })}
                    onPlus={() => updateValue({ children: children + 1 })}
                  />
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="w-full py-4 mt-4 bg-gradient-to-r from-[#9C7A55] to-[#8B6D4C] text-white rounded-xl font-semibold shadow-lg shadow-[#9C7A55]/20 active:scale-[0.98] transition-transform"
                >
                  {t("search.apply") || "Done"}
                </button>
              </div>
            </div>
          ) : (
            <div
              ref={dropdownRef}
              style={getDropdownStyle()}
              className="z-[999999] bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 space-y-5"
            >
              <Row
                label={t("search.room")}
                val={rooms}
                min={1}
                onMinus={() => updateValue({ rooms: Math.max(1, rooms - 1) })}
                onPlus={() => updateValue({ rooms: rooms + 1 })}
              />
              <div className="h-[1px] bg-gray-50 w-full"></div>
              <Row
                label={t("search.adult")}
                val={adults}
                min={1}
                onMinus={() => updateValue({ adults: Math.max(1, adults - 1) })}
                onPlus={() => updateValue({ adults: adults + 1 })}
              />
              <div className="h-[1px] bg-gray-50 w-full"></div>
              <Row
                label={t("search.child")}
                val={children}
                min={0}
                onMinus={() => updateValue({ children: Math.max(0, children - 1) })}
                onPlus={() => updateValue({ children: children + 1 })}
              />
            </div>
          ),
          document.body,
        )}
    </div>
  );
};

export default RoomGuestsSelect;
