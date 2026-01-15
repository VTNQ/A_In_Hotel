import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import { getRoom } from "../../service/api/Room";
import type { RoomGridProps, RoomResponse } from "../../type/room.types";
import { useBookingSearch } from "../../context/booking/BookingSearchContext";
import RoomCardSkeleton from "./RoomCardSkeleton";
const RoomGrid = ({
  page,
  onPageInfo,
  onSelect,
  onLoaded,
  selectedRoomId,
  priceRange,
}: RoomGridProps) => {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { search } = useBookingSearch();
const buildPriceFilter = (ranges: string[]) => {
  if (!ranges.length) return "";

  return ranges
    .map(r => {
      const [min, max] = r.split("-").map(Number);
      return `(basePrice>=${min};basePrice<=${max})`;
    })
    .join(",");
};
  useEffect(() => {
    if (!search) return;

    let mounted = true;

    const fetchRooms = async () => {
      try {
        setLoading(true);
        setRooms([]);

        const totalGuests = (search?.adults ?? 0) + (search?.children ?? 0);
        let filter =
         `hotel.id==${search.hotelId};status==3;capacity>=${totalGuests}`;
         const priceFilter = buildPriceFilter(priceRange);
         if(priceFilter){
          filter+= `;(${priceFilter})`
         }
        const res = await getRoom({
          page,
          size: 5,
          sort: "basePrice,asc",
          filter,
        });

        if (!mounted) return;

        const list = res.data?.content || [];
        setRooms(list);
        onLoaded(list);
        onPageInfo(res.data?.totalPages || 1);
      } catch (err) {
        console.error("Fetch rooms failed", err);
        setRooms([]);
        onPageInfo(1);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRooms();

    return () => {
      mounted = false;
    };
  }, [search, page,priceRange]);

  return (
    <div className="space-y-6">
      {loading &&
        Array.from({ length: 5 }).map((_, i) => <RoomCardSkeleton key={i} />)}
      {!loading && rooms.length === 0 && (
        <div className="py-10 text-center text-sm text-gray-500">
          No rooms found
        </div>
      )}
      {!loading &&
        rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            isSelected={room.id === selectedRoomId}
            onClick={() => onSelect(room)}
          />
        ))}
    </div>
  );
};

export default RoomGrid;
