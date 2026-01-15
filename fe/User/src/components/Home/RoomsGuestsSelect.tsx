import { useEffect, useRef, useState } from "react";
import type { RoomsGuestsSelectProps } from "../../type/booking.types";
import { Minus, Plus, Users } from "lucide-react";
import { useClickOutside } from "../../hook/useClickOutside";

const RoomGuestsSelect = ({ value, onChange }: RoomsGuestsSelectProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapperRef, () => {
    setOpen(false);
  });

  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  useEffect(() => {
    if (!value) return;

    setRooms(value.rooms ?? 1);
    setAdults(value.adults ?? 1);
    setChildren(value.children ?? 0);
  }, [value?.rooms, value?.adults, value?.children]);
  const totalGuests = adults + children;

  const apply = () => {
    onChange?.({
      rooms,
      adults,
      children,
    });
    setOpen(false);
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
        className="w-full h-[56px] bg-white border border-[#866F56] rounded-xl px-4 flex items-center gap-3 text-left"
      >
        <Users size={18} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">
          {rooms} Room, {totalGuests} Guests
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg z-[9999] p-4 space-y-4">
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
      )}
    </div>
  );
};
export default RoomGuestsSelect;
