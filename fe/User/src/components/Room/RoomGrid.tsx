import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import { getRoom } from "../../service/api/Room";
import type { RoomResponse } from "../../type/room.types";
import { useBookingSearch } from "../../context/booking/BookingSearchContext";

interface RoomGridProps {
  page:number;
  onPageInfo:(totalPages:number)=>void;
  onSelect: (room: RoomResponse) => void;
  onLoaded: (rooms: RoomResponse[]) => void;
   selectedRoomId?: number;
}

const RoomGrid = ({ page,
  onPageInfo,
  onSelect, onLoaded,selectedRoomId }: RoomGridProps) => {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const { search } = useBookingSearch();

  useEffect(() => {
    if (!search) return;

    const fetchRooms = async () => {
      const totalGuests = search.adults + search.children;

      const res = await getRoom({
        page,
        size: 5,
        sort: "basePrice,asc",
        filter: `hotel.id==${search.hotelId};status==3;capacity>=${totalGuests}`,
      });

      const list = res.data?.content || [];
      setRooms(list);
      onLoaded(list);
      onPageInfo(res.data?.totalPages || 1) 
    };

    fetchRooms();
  }, [search,page]);

  return (
    <div className="space-y-6">
      {rooms.map((room) => (
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
