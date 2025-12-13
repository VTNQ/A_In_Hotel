import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";

import { getRoom } from "../../service/api/Room";
import type { RoomResponse } from "../../type/room.types";



const RoomGrid = () => {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const fetchRoom = async () => {
    const raw = localStorage.getItem("booking_search");
    if (!raw) return null;

    const search = JSON.parse(raw);
    const totalGuests = search.adults + search.children;
    const res = await getRoom({
      page: 1,
      size: 5,
      sort: "basePrice,asc",
      filter: `hotelId==${search.hotelId};status==3;capacity>=${totalGuests}`,
    })

    setRooms(res.data?.content || []);
    console.log(res)

  }

  useEffect(()=>{
    fetchRoom();
  },[])
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard  room={room} />
      ))}
    </div>
  );
}
export default RoomGrid;