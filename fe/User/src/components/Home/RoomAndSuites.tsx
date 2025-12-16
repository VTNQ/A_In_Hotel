import { useEffect, useState } from "react";
import { type RoomResponse } from "../../type/room.types";
import { getRepresentativeRoomsOfHotels } from "../../service/api/Room";
import { File_URL } from "../../setting/constant/app";

const RoomAndSuites = () => {
    const [roomData, setRoomData] = useState<RoomResponse[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getRepresentativeRoomsOfHotels();
                setRoomData(response.data.data || [])
            } catch (err) {
                console.log(err)
            }
        }
        fetchData();
    }, [])
    return (
        <section className="w-full py-20 ">
            <div className="mx-auto max-w-7xl px-6">
                <h2 className="text-center text-3xl md:text-4xl font-dmserif font-medium text-[#4B3F30] mb-12">
                    Room And Suites
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {roomData.map((room) => (
                        <div
                            key={room.id}
                            className="relative overflow-hidden rounded-2xl group"
                        >
                            <img
                                src={File_URL+room.images[0]?.url}
                                alt={room.images[0]?.altText}
                                className="h-[280px] md:h-[320px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                            <div className="absolute bottom-4 left-5 text-white">
                                <p className="text-sm md:text-base font-medium">
                                    {room.hotelName}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
export default RoomAndSuites;