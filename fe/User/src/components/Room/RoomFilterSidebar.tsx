import { useEffect, useState } from "react";
import SelectHotelButton from "../common/SelectHotelButton";
import type { HotelResponse } from "../../type/hotel.types";
import { getHotel } from "../../service/api/Hotel";
import DateSelect from "../Home/DateSelect";
import RoomGuestsSelect from "../Home/RoomsGuestsSelect";
import { useBookingSearch } from "../../context/booking/BookingSearchContext";
import type { RoomFilterSideBarProps } from "../../type/common";

const PRICE_OPTIONS = [
  { label: "$0 - $200", value: "0-200", count: 200 },
  { label: "$200 - $500", value: "200-500", count: 100 },
  { label: "$500 - $1,000", value: "500-1000", count: 15 },
  { label: "$1,000 - $2,000", value: "1000-2000", count: 12 },
  { label: "$2,000 - $5,000", value: "2000-5000", count: 230 },
];

const RoomFilterSideBar = ({
  priceRanges,
  onPriceChange,
}: RoomFilterSideBarProps) => {
  const { search, setSearch } = useBookingSearch();
  const [selectedHotel, setSelectedHotel] = useState<HotelResponse | null>(
    null
  );
  const [hotels, setHotels] = useState<HotelResponse[]>([]);

  const [dateRange, setDateRange] = useState<{
    checkIn: string | null;
    checkOut: string | null;
  }>({ checkIn: null, checkOut: null });

  const [guests, setGuests] = useState({
    rooms: 1,
    adults: 2,
    children: 0,
  });
  const TIME_OPTIONS = [
    { label: "2 Giờ đầu", value: "HOURLY" },
    { label: "Qua đêm", value: "OVERNIGHT" },
    { label: "Ngày đêm", value: "DAILY" },
  ];
  const [timeTypes, setTimeTypes] = useState<string[]>([]);
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await getHotel({ all: true, filter: "status==1" });
        const list = res?.content ?? [];
        setHotels(list);
        if (search?.hotelId) {
          const found = list.find((h) => h.id === Number(search.hotelId));
          setSelectedHotel(found || null);
        }
      } catch {
        console.error("failed to load hotel list");
      }
    };
    fetchHotel();
  }, [search?.hotelId]);
  useEffect(() => {
    console.log(search?.checkIn);
    setDateRange({
      checkIn: search?.checkIn || null,
      checkOut: search?.checkOut || null,
    });
  }, [search?.checkIn, search?.checkOut]);
  useEffect(() => {
    setGuests({
      rooms: search?.rooms ?? 1,
      adults: search?.adults ?? 2,
      children: search?.children ?? 0,
    });
  }, [search?.rooms, search?.adults, search?.children]);
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
      checkIn: dateRange.checkIn,
      checkOut: dateRange.checkOut,
      rooms: guests.rooms,
      adults: guests.adults,
      children: guests.children,
      priceRanges,
      timeTypes,
    });
  };

  return (
    <div className="space-y-6">
      {/* TOP CARD */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Destination
          </label>
          <SelectHotelButton
            hotels={hotels}
            value={selectedHotel}
            onChange={setSelectedHotel}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Select date
          </label>
          <DateSelect value={dateRange} onChange={setDateRange} />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Select rooms and guests
          </label>
          <RoomGuestsSelect value={guests} onChange={setGuests} />
        </div>

        <button
          onClick={handleSearch}
          className="w-full h-[44px] rounded-lg bg-[#9C7A55] text-white font-medium"
        >
          Search
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="bg-[#8B735A] px-4 py-3 text-white text-sm font-medium">
          Thời gian thuê
        </div>
        <div className="p-4">
          {TIME_OPTIONS.map((p) => (
            <label
              key={p.value}
              className="flex items-center justify-between text-sm mb-2"
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={priceRanges.includes(p.value)}
                  onChange={() =>
                    setTimeTypes((prev) =>
                      prev.includes(p.value)
                        ? prev.filter((v) => v !== p.value)
                        : [...prev, p.value]
                    )
                  }
                />
                {p.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* PRICE FILTER */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="bg-[#8B735A] px-4 py-3 text-white text-sm font-medium">
          Filter results
        </div>

        <div className="p-4">
          <h4 className="font-medium mb-3 text-sm">Price Range</h4>

          {PRICE_OPTIONS.map((p) => (
            <label
              key={p.value}
              className="flex items-center justify-between text-sm mb-2"
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={priceRanges.includes(p.value)}
                  onChange={() =>
                    onPriceChange(
                      priceRanges.includes(p.value)
                        ? priceRanges.filter((v) => v !== p.value)
                        : [...priceRanges, p.value]
                    )
                  }
                />
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
