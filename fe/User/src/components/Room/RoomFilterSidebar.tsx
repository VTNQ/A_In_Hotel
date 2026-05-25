import { useEffect, useState } from "react";
import SelectHotelButton from "../common/SelectHotelButton";
import type { HotelResponse } from "../../type/hotel.types";
import { getHotel } from "../../service/api/Hotel";
import DateSelect from "../Home/DateSelect";
import RoomGuestsSelect from "../Home/RoomsGuestsSelect";
import { useBookingSearch } from "../../context/booking/BookingSearchContext";
import type { RoomFilterSideBarProps } from "../../type/common";
import { useTranslation } from "react-i18next";
import { Check, Filter, DollarSign, BedDouble, Sparkles, Search } from "lucide-react";
import { getCategories } from "../../service/api/Category";
import { GetAsset } from "../../service/api/Asset";

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
  roomTypes,
  onRoomTypeChange,
  assets,
  onAssetsChange,
}: RoomFilterSideBarProps) => {
  const { t } = useTranslation();
  const { search, setSearch } = useBookingSearch();
  const [selectedHotel, setSelectedHotel] = useState<HotelResponse | null>(
    null,
  );
  const [categories,setCategories] = useState<any[]>([]);
  const [assetOptions, setAssetOptions] = useState<any[]>([]);
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
  const fetchCategories = async ()=>{
    try{
      const res = await getCategories({all:true});
      const list = res?.data?.content ?? [];
      setCategories(list);
    }catch(err){
       console.error(t("search.alerts.loadFailed"));
    }
  }

  const fetchAssets = async () => {
    try {
      const res = await GetAsset({ all: true });
      const list = res?.data?.content ?? [];
      setAssetOptions(list);
    } catch (err) {
      console.error(t("search.alerts.loadFailed"));
    }
  };
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
        console.error(t("search.alerts.loadFailed"));
      }
    };
    
    fetchHotel();
  }, [search?.hotelId]);
  useEffect(()=>{
    fetchCategories();
    fetchAssets();
  },[])
  useEffect(() => {
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
      alert(t("search.alerts.selectHotel"));
      return;
    }

    if (!dateRange.checkIn || !dateRange.checkOut) {
      alert(t("search.alerts.selectDate"));
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
    });
  };

  return (
    <div className="space-y-6 w-full lg:w-[320px]">
      {/* TOP CARD */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#f0ece6] space-y-5 relative overflow-hidden">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-[#9C7A55]/5 blur-2xl pointer-events-none"></div>

        <div className="relative z-20">
          <label className="text-xs text-gray-500 mb-1 block">
            {t("search.destination")}
          </label>
          <SelectHotelButton
            hotels={hotels}
            value={selectedHotel}
            onChange={setSelectedHotel}
          />
        </div>

        <div className="relative z-10">
          <DateSelect value={dateRange} onChange={setDateRange} />
        </div>

        <div className="relative z-0">
          <RoomGuestsSelect value={guests} onChange={setGuests} />
        </div>

        <button
          onClick={handleSearch}
          className="w-full h-[48px] mt-4 rounded-xl bg-gradient-to-r from-[#9C7A55] to-[#8B6D4C] text-white font-medium
          hover:from-[#8B6D4C] hover:to-[#7A5F42] active:scale-[0.98] transition-all shadow-lg shadow-[#9C7A55]/30 flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <Search className="w-4 h-4 relative z-10" />
          <span className="relative z-10">{t("search.search")}</span>
        </button>
      </div>
      {/* FILTERS CONTAINER */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="bg-[#9C7A55] px-6 py-4 text-white flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span className="font-semibold">{t("room.filter.results") || "Filter Options"}</span>
        </div>

        {/* PRICE FILTER */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4 text-[#9C7A55]">
            <DollarSign className="w-4 h-4" />
            <h4 className="font-semibold text-sm">{t("room.filter.priceRange")}</h4>
          </div>
          <div className="space-y-2">
            {PRICE_OPTIONS.map((p) => {
              const checked = priceRanges.includes(p.value);
              return (
                <label
                  key={p.value}
                  className="group flex items-center justify-between cursor-pointer p-2.5 hover:bg-[#FBF7F2] rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200
                      ${checked ? "bg-[#9C7A55] border-[#9C7A55]" : "border-gray-300 group-hover:border-[#9C7A55]"}`}>
                      <Check className={`w-3.5 h-3.5 text-white transition-opacity duration-200 ${checked ? "opacity-100" : "opacity-0"}`} strokeWidth={3} />
                    </div>
                    <span className={`text-sm transition-colors ${checked ? "text-[#9C7A55] font-semibold" : "text-gray-600 font-medium"}`}>
                      {p.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">{p.count}</span>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checked}
                    onChange={() =>
                      onPriceChange(
                        checked
                          ? priceRanges.filter((v) => v !== p.value)
                          : [...priceRanges, p.value],
                      )
                    }
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div className="h-[1px] bg-gray-100 mx-6"></div>

        {/* ROOM TYPE FILTER */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4 text-[#9C7A55]">
            <BedDouble className="w-4 h-4" />
            <h4 className="font-semibold text-sm">Room Type</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((p) => {
              const checked = roomTypes.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() =>
                    onRoomTypeChange(
                      checked
                        ? roomTypes.filter((v) => v !== p.id)
                        : [...roomTypes, p.id],
                    )
                  }
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border
                    ${checked 
                      ? "bg-[#9C7A55] border-[#9C7A55] text-white shadow-md shadow-[#9C7A55]/20" 
                      : "bg-white border-gray-200 text-gray-600 hover:border-[#9C7A55] hover:text-[#9C7A55]"
                    }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-[1px] bg-gray-100 mx-6"></div>

        {/* ASSETS FILTER */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4 text-[#9C7A55]">
            <Sparkles className="w-4 h-4" />
            <h4 className="font-semibold text-sm">Assets</h4>
          </div>
          <div className="space-y-2">
            {assetOptions.map((p) => {
              const checked = assets.includes(p.id);
              return (
                <label
                  key={p.id}
                  className="group flex items-center justify-between cursor-pointer p-2.5 hover:bg-[#FBF7F2] rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200
                      ${checked ? "bg-[#9C7A55] border-[#9C7A55]" : "border-gray-300 group-hover:border-[#9C7A55]"}`}>
                      <Check className={`w-3.5 h-3.5 text-white transition-opacity duration-200 ${checked ? "opacity-100" : "opacity-0"}`} strokeWidth={3} />
                    </div>
                    <span className={`text-sm transition-colors ${checked ? "text-[#9C7A55] font-semibold" : "text-gray-600 font-medium"}`}>
                      {p.assetName}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checked}
                    onChange={() =>
                      onAssetsChange(
                        checked
                          ? assets.filter((v) => v !== p.id)
                          : [...assets, p.id],
                      )
                    }
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomFilterSideBar;
