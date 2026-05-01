import { useEffect, useRef, useState } from "react";
import type { RoomsGuestsSelectProps } from "../../type/booking.types";
import { Minus, Plus, Users } from "lucide-react";
import { createPortal } from "react-dom";

const RoomGuestsSelect = ({ value, onChange }: RoomsGuestsSelectProps) => {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!value) return;
    setRooms(value.rooms ?? 1);
    setAdults(value.adults ?? 1);
    setChildren(value.children ?? 0);
  }, [value?.rooms, value?.adults, value?.children]);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapperRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      )
        return;

      setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const totalGuests = adults + children;

  const apply = () => {
    onChange?.({ rooms, adults, children });
    setOpen(false);
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
    value,
    onMinus,
    onPlus,
    min = 0,
  }: {
    label: string;
    value: number;
    onMinus: () => void;
    onPlus: () => void;
    min?: number;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={onMinus}
          disabled={value <= min}
          className="w-8 h-8 border rounded-full flex items-center justify-center disabled:opacity-40"
        >
          <Minus size={14} />
        </button>
        <span className="w-5 text-center">{value}</span>
        <button
          onClick={onPlus}
          className="w-8 h-8 border rounded-full flex items-center justify-center"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
  return (
    <div ref={wrapperRef} className="relative flex-1">
      <label className="text-xs text-gray-500 mb-1 block">
        Select rooms and guests
      </label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[56px] bg-white border border-[#866F56] rounded-xl px-4 flex items-center gap-3 "
      >
        <Users size={18} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">
          {rooms} Room, {totalGuests} Guests
        </span>
      </button>
      {open &&
        createPortal(
          isMobile ? (
            /* MOBILE FULLSCREEN */
            <div className="fixed inset-0 z-[999999] bg-black/40 flex items-end">
              <div
                ref={dropdownRef}
                className="bg-white w-full rounded-t-2xl p-6 space-y-6 animate-slideUp"
              >
                <h3 className="text-lg font-semibold text-center">
                  Select guests
                </h3>

                <Row
                  label="Rooms"
                  value={rooms}
                  min={1}
                  onMinus={() => setRooms((v) => Math.max(1, v - 1))}
                  onPlus={() => setRooms((v) => v + 1)}
                />

                <Row
                  label="Adults"
                  value={adults}
                  min={1}
                  onMinus={() => setAdults((v) => Math.max(1, v - 1))}
                  onPlus={() => setAdults((v) => v + 1)}
                />

                <Row
                  label="Children"
                  value={children}
                  min={0}
                  onMinus={() => setChildren((v) => Math.max(0, v - 1))}
                  onPlus={() => setChildren((v) => v + 1)}
                />

                <button
                  onClick={apply}
                  className="w-full py-3 bg-[#b38a58] text-white rounded-xl font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          ) : (
            /* DESKTOP DROPDOWN */
            <div
              ref={dropdownRef}
              style={getDropdownStyle()}
              className="z-[999999] bg-white border rounded-xl shadow-xl p-5 space-y-5"
            >
              <Row
                label="Rooms"
                value={rooms}
                min={1}
                onMinus={() => setRooms((v) => Math.max(1, v - 1))}
                onPlus={() => setRooms((v) => v + 1)}
              />

              <Row
                label="Adults"
                value={adults}
                min={1}
                onMinus={() => setAdults((v) => Math.max(1, v - 1))}
                onPlus={() => setAdults((v) => v + 1)}
              />

              <Row
                label="Children"
                value={children}
                min={0}
                onMinus={() => setChildren((v) => Math.max(0, v - 1))}
                onPlus={() => setChildren((v) => v + 1)}
              />

              <div className="flex justify-end pt-2">
                <button
                  onClick={apply}
                  className="px-4 py-2 bg-[#b38a58] text-white rounded-lg text-sm font-medium hover:bg-[#9a7748]"
                >
                  Apply
                </button>
              </div>
            </div>
          ),
          document.body,
        )}
    </div>
  );
};
export default RoomGuestsSelect;
