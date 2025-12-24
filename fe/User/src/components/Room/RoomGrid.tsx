import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import { getRoom } from "../../service/api/Room";
import type { RoomResponse } from "../../type/room.types";
import { useBookingSearch } from "../../context/booking/BookingSearchContext";

interface RoomGridProps {
  onSelect: (room: RoomResponse) => void;
  onLoaded: (rooms: RoomResponse[]) => void;
}

const RoomGrid = ({ onSelect, onLoaded }: RoomGridProps) => {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const { search } = useBookingSearch();

  useEffect(() => {
    if (!search) return;

    const fetchRooms = async () => {
      const totalGuests = search.adults + search.children;

      const res = await getRoom({
        page: 1,
        size: 5,
        sort: "basePrice,asc",
        filter: `hotel.id==${search.hotelId};status==3;capacity>=${totalGuests}`,
      });

      const list = res.data?.content || [];
      setRooms(list);
      onLoaded(list); // 🔥 TRẢ ROOMS LÊN CHA
    };

    fetchRooms();
  }, [search]);

  return (
    <div className="space-y-6">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onClick={() => onSelect(room)}
        />
      ))}
    </div>
  );
};

export default RoomGrid;
