import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import DateSelect from "./Home/DateSelect";
import type { HotelResponse } from "../type/hotel.types";
import { getHotel } from "../service/api/Hotel";
import RoomGuestsSelect from "./Home/RoomsGuestsSelect";

import { useBookingSearch } from "../context/booking/BookingSearchContext";
import { useClickOutside } from "../hook/useClickOutside";

export default function SearchBar() {
  const [hotels, setHotels] = useState<HotelResponse[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<HotelResponse | null>(
    null
  );
  const [openHotel, setOpenHotel] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);

  useClickOutside(selectRef, () => {
    setOpenHotel(false);
  });
  const { setSearch } = useBookingSearch();
  const [dateRange, setDateRange] = useState<{
    checkIn: string | null;
    checkOut: string | null;
  }>({
    checkIn: null,
    checkOut: null,
  });
  const [guests, setGuests] = useState({
    rooms: 1,
    adults: 2,
    children: 0,
  });
  const fetchHotel = async () => {
    try {
      const res = await getHotel({ all: true });

      const list = res?.content ?? [];
      setHotels(list);

      if (list.length > 0) {
        setSelectedHotel(list[0]);
      }
    } catch (error: any) {
      console.error("failed to load hotel list");
    }
  };
  useEffect(() => {
    fetchHotel();
  }, []);
  const handleSearch = () => {
    if (!selectedHotel) {
      alert("Please select hotel");
      return;
    }

    if (!dateRange.checkIn || !dateRange.checkOut) {
      alert("Please select check-in & check-out date");
      return;
    }

    setSearch({
      hotelId: selectedHotel.id,
      checkIn: dateRange.checkIn!,
      checkOut: dateRange.checkOut!,
      rooms: guests.rooms,
      adults: guests.adults,
      children: guests.children,
    });

    window.location.href = "/Room";
  };
  return (
    <div className="relative z-50 w-full bg-[#F6F3F0] backdrop-blur-md py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center gap-4">
          <div className="relative flex-1" ref={selectRef}>
            <label className="text-xs text-gray-500 mb-1 block">
              Destination
            </label>
            <button
              type="button"
              onClick={() => setOpenHotel((v) => !v)}
              className="w-full h-[56px] bg-white border border-[#866F56] outline-none rounded-xl px-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <MapPin size={18} className="text-gray-500 shrink-0" />
                <span className="font-medium text-sm text-gray-800 truncate">
                  {selectedHotel ? selectedHotel.name : "Select hotel"}
                </span>
              </div>

              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  openHotel ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown: tên + địa chỉ */}
            {openHotel && (
              <div className="absolute left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg z-[9999] overflow-hidden">
                {hotels.map((h) => {
                  const isSelected = selectedHotel?.id === h.id;

                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        setSelectedHotel(h);
                        setOpenHotel(false);
                      }}
                      className={`w-full text-left px-4 py-3 transition
              ${isSelected ? "bg-[#F6F3F0]" : "hover:bg-gray-100"}
            `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm text-gray-800">
                            {h.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {h.address}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <DateSelect value={dateRange} onChange={(v) => setDateRange(v)} />
          <RoomGuestsSelect
            value={guests}
            onChange={(val) => {
              setGuests(val);
            }}
          />
          <div className="w-[220px] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={14} />
              <span>Have a promo code ?</span>
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="h-[56px] bg-[#b38a58] text-white rounded-xl font-semibold hover:bg-[#9a7748]"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
