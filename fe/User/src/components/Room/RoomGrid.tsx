import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";

import { getRoom } from "../../service/api/Room";
import type { RoomResponse } from "../../type/room.types";
import { useBookingSearch } from "../../context/booking/BookingSearchContext";



const RoomGrid = () => {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const { search } = useBookingSearch();
 
  useEffect(() => {
    if (!search) return;

    const fetchRoom = async () => {
      const totalGuests = search.adults + search.children;

      const res = await getRoom({
        page: 1,
        size: 5,
        sort: "basePrice,asc",
        filter: `hotel.id==${search.hotelId};status==3;capacity>=${totalGuests}`,
      });
      console.log(search)
      setRooms(res.data?.content || []);

      console.log(res)
    };

    fetchRoom();
  }, [search]);
  return (
    <div className="space-y-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>

  );
}
export default RoomGrid;