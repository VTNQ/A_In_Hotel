import { useEffect, useState } from "react";
import SelectHotelButton from "../common/SelectHotelButton";
import type { HotelResponse } from "../../type/hotel.types";
import { getHotel } from "../../service/api/Hotel";
import DateSelect from "../Home/DateSelect";
import RoomGuestsSelect from "../Home/RoomsGuestsSelect";
import { useBookingSearch } from "../../context/booking/BookingSearchContext";

const RoomFilterSideBar = () => {
  const [selectedHotel, setSelectedHotel] = useState<HotelResponse | null>(null);
  const [hotels, setHotels] = useState<HotelResponse[]>([]);
  const [dateRange, setDateRange] = useState<{
    checkIn: string | null;
    checkOut: string | null;
  }>({ checkIn: null, checkOut: null });
  const { setSearch } = useBookingSearch();
  const [guests, setGuests] = useState({
    rooms: 1,
    adults: 2,
    children: 0,
  });

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await getHotel({ all: true });
        const list = res?.content ?? [];
        setHotels(list);
        if (list.length > 0) setSelectedHotel(list[0]);
      } catch {
        console.error("failed to load hotel list");
      }
    };
    fetchHotel();
  }, []);
  const handleSearch = () => {
    if (!selectedHotel) {
      alert("Please select hotel");
      return;
    }

    if (!dateRange.checkIn || !dateRange.checkOut) {
      alert("Please select check-in & check-out date")
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

   

    window.location.reload();
    
  }

  return (
    <div className="space-y-6">
      {/* TOP FILTER CARD */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
        {/* Destination */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Destination
          </label>
          <div className="mt-2">
            <SelectHotelButton
              hotels={hotels}
              value={selectedHotel}
              onChange={setSelectedHotel}
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Select date
          </label>
          <div className="mt-2">
            <DateSelect value={dateRange} onChange={setDateRange} />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Select rooms and guests
          </label>
          <div className="mt-2">
            <RoomGuestsSelect value={guests} onChange={setGuests} />
          </div>
        </div>

        {/* Promo */}
        <button
          type="button"
          className="text-sm text-gray-500 flex items-center gap-2"
        >
          Have a promo code ?
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={handleSearch}
          className="w-full h-[44px] rounded-lg bg-[#9C7A55]
                     text-white font-medium hover:opacity-90 transition"
        >
          Search
        </button>
      </div>

      {/* BOTTOM FILTER CARD */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-[#8B735A] px-4 py-3 text-white font-medium text-sm">
          Filter results
        </div>

        <div className="p-4">
          <h4 className="font-medium mb-3 text-sm">Price Range</h4>

          {[
            { label: "$0 - $200", count: 200 },
            { label: "$200 - $500", count: 100 },
            { label: "$500 - $1,000", count: 15 },
            { label: "$1,000 - $2,000", count: 12 },
            { label: "$2,000 - $5,000", count: 230 },
          ].map((p, i) => (
            <label
              key={i}
              className="flex items-center justify-between text-sm mb-2 text-gray-600"
            >
              <span className="flex items-center gap-2">
                <input type="checkbox" />
                {p.label}
              </span>
              <span className="text-xs text-gray-400">{p.count}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomFilterSideBar;
