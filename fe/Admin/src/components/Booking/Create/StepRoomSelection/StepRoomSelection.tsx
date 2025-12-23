import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import BookingSummary from "./BookingSummary";
import { getTokens } from "../../../../util/auth";
import { getAllRoom } from "../../../../service/api/Room";
import { getAll } from "../../../../service/api/ExtraService";
import { getAllCategory } from "../../../../service/api/Category";
import RoomSearchFilter from "./RoomSearchFilter";

const StepRoomSelection = ({ booking, onBack, onNext }: any) => {
    const [rooms, setRooms] = useState<any[]>([])
    const [data, setData] = useState<any[]>([]);
    const [selectedRooms, setSelectedRooms] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [roomTypes, setRoomTypes] = useState<any[]>([]);
    const [roomType, setRoomType] = useState("");
    useEffect(() => {
        const fetchData = async () => {

            try {
                let filters: string[] = [];

                filters.push(`hotel.id==${getTokens()?.hotelId}`)
                filters.push(`status==3`)

                const filterQuery = filters.join(" and ");
                const params = {
                    all: true,
                    ...(filterQuery ? { filter: filterQuery } : {}),

                };
                const resp = await getAllRoom(params);
                const respExtra = await getAll({
                    all: true,
                    filter: "isActive==true and type==1 and price==0"
                });
                const responseRoomType = await getAllCategory({
                    all: true,
                    filter: "isActive==true and type==1"
                });
                setRoomTypes(responseRoomType?.content || [])
                setRooms(resp.data?.content || []);
                setData(respExtra.data?.content || [])
            } catch (err: any) {
                console.error("Fetch error:", err);

            }
        };
        fetchData();
    }, []);
    const toggleRoom = (room: any) => {
        setSelectedRooms((prev) => {
            const exists = prev.find((r) => r.id === room.id);
            if (exists) {
                return prev.filter((r) => r.id !== room.id);
            }
            return [...prev, room];
        });
    };
    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                let filters: string[] = [];

                filters.push(`hotel.id==${getTokens()?.hotelId}`);
                filters.push(`status==3`);

                if (roomType) {
                    filters.push(`roomType.id==${roomType}`);
                }

                const filterQuery = filters.join(" and ");

                const params: any = {
                    all: true,
                    ...(filterQuery ? { filter: filterQuery } : {}),
                    ...(search
                        ? {
                            searchField: "roomName",
                            searchValue: search,
                        }
                        : {}),
                };

                const resp = await getAllRoom(params);

                const respExtra = await getAll({
                    all: true,
                    filter: "isActive==true and type==1 and price==0",
                });

                setRooms(resp.data?.content || []);
                setData(respExtra.data?.content || []);
            } catch (err) {
                console.error("Fetch room error:", err);
            }
        }, 400); // debounce 400ms

        return () => clearTimeout(timer);
    }, [search, roomType]);

    return (
        <div className="bg-gray-50">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-2xl font-semibold">Select Your Room</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Available rooms · 2 Guests
                    </p>
                </div>

            </div>
            <div className="grid grid-cols-1 gap-2">
                <RoomSearchFilter
                    filter={{ search, roomType }}
                    roomTypes={roomTypes}
                    onChange={(key: string, value: string) => {
                        if (key === "search") setSearch(value);
                        if (key === "roomType") setRoomType(value);
                    }}
                />
                <div className="grid grid-cols-3 gap-6 mt-6">
                    <div className="col-span-2 space-y-5">
                        {rooms.map((room) => (
                            <RoomCard
                                service={data}
                                key={room.id}
                                room={room}
                                packageType={booking.selectDate?.package}
                                selected={selectedRooms.some(r => r.id === room.id)}
                               onSelect={(roomWithPrice: any) => toggleRoom(roomWithPrice)}
                            />
                        ))}
                    </div>
                    <BookingSummary
                        rooms={selectedRooms}
                        bookingDate={booking.selectDate}
                        packageType={booking.selectDate?.package}
                        guests={{
                            adults: booking.selectDate?.adults,
                            children: booking.selectDate?.children,
                        }}
                        onEditGuests={onBack}
                        onNext={() => onNext({ rooms: selectedRooms })}
                    />

                </div>
                <div className="flex justify-start gap-3 mt-6">
                    <button
                        onClick={onBack}
                        className="mt-8 text-sm text-gray-500 hover:underline"
                    >
                        ← Back to Dates & Time
                    </button>
                </div>

            </div>
        </div>

    )
}
export default StepRoomSelection;