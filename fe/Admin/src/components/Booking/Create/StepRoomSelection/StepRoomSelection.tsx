import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import BookingSummary from "./BookingSummary";
import { getTokens } from "../../../../util/auth";
import { getAllRoom } from "../../../../service/api/Room";
import { getAll } from "../../../../service/api/ExtraService";

const StepRoomSelection = ({ booking, onBack, onNext }: any) => {
    const [rooms, setRooms] = useState<any[]>([])
    const [data, setData] =useState<any[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    useEffect(() => {
        const fetchData = async () => {

            try {
                let filters: string[] = [];

                filters.push(`hotel.id==${getTokens()?.hotelId}`)
                const filterQuery = filters.join(" and ");
                const params = {
                    page: 1,
                    size: 10,

                    ...(filterQuery ? { filter: filterQuery } : {})
                };
                const resp = await getAllRoom(params);
                const respExtra = await getAll({
                    all:true,
                    filter:"isActive==true and type==1 and price==0"
                })
                setRooms(resp.data?.content || []);
                setData(respExtra.data?.content || [])
            } catch (err: any) {
                console.error("Fetch error:", err);

            }
        };
        fetchData();
    }, [])
    return (
        <div className="bg-white  rounded-xl p-4 shadow-sm">
            <h2 className="text-2xl font-semibold">Select Your Room</h2>
            <p className="text-sm text-gray-500 mt-1">
                Available rooms · 2 Guests
            </p>
            <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="col-span-2 space-y-5">
                    {rooms.map((room) => (
                        <RoomCard
                            service={data}
                            key={room.id}
                            room={room}
                            packageType={booking.selectDate?.package}
                            selected={selectedRoom?.id === room.id}
                            onSelect={() => setSelectedRoom(room)}
                        />
                    ))}
                </div>
                <BookingSummary
                    room={selectedRoom}
                    bookingDate={booking.selectDate}
                     packageType={booking.selectDate?.package}
                    guests={{
                        adults: booking.selectDate?.adults,
                        children: booking.selectDate?.children,
                    }}
                    onEditGuests={onBack}
                    onNext={() => onNext({ room: selectedRoom })}
                />
                <button
                    onClick={onBack}
                    className="mt-8 text-sm text-gray-500 hover:underline"
                >
                    ← Back to Dates & Time
                </button>
            </div>
        </div>
    )
}
export default StepRoomSelection;