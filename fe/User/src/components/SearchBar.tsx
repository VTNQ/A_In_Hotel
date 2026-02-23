import { useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import DateSelect from "./Home/DateSelect";
import type { HotelResponse } from "../type/hotel.types";
import { getHotel } from "../service/api/Hotel";
import RoomGuestsSelect from "./Home/RoomsGuestsSelect";

import { useBookingSearch } from "../context/booking/BookingSearchContext";
import { useClickOutside } from "../hook/useClickOutside";

export default function SearchBar() {
  const [hotels, setHotels] = useState<HotelResponse[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<HotelResponse | null>(
    null,
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
      const res = await getHotel({ all: true, filter: "status==1" });

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
    <div className="relative z-50 w-full">
      <div className="bg-[#F6F3F0] rounded-2xl shadow-xl p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1 relative z-[100]" ref={selectRef}>
            <label className="text-xs text-gray-500 mb-1 block">
              Destination
            </label>
            <button
              onClick={() => setOpenHotel(!openHotel)}
              className="w-full h-[52px] bg-white border border-[#866F56] rounded-xl px-4
            flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <MapPin size={18} className="text-gray-500 shrink-0" />
                <span className="truncate text-sm font-medium">
                  {selectedHotel?.name ?? "Select hotel"}
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`text-gray-500 transition-transform duration-200 ${
                  openHotel ? "rotate-180" : ""
                }`}
              />
            </button>
            {openHotel && (
              <div className="absolute left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg z-[9999] max-h-60 overflow-y-auto">
                {hotels.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setSelectedHotel(h);
                      setOpenHotel(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100"
                  >
                    <div className="text-sm font-medium">{h.name}</div>
                    <div className="text-xs text-gray-500">{h.address}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1">
            <DateSelect value={dateRange} onChange={(v) => setDateRange(v)} />
          </div>
          <div className="flex-1">
            <RoomGuestsSelect value={guests} onChange={(v) => setGuests(v)} />
          </div>
          <div className="w-full lg:w-auto">
            <button
              onClick={handleSearch}
              className="
      w-full
      lg:w-[140px]
      h-[52px]
      bg-[#866F56]
      text-white
      rounded-xl
      font-semibold
      text-sm
      tracking-wide
      hover:bg-[#6f5a45]
      transition-all duration-300
      shadow-md
    "
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
