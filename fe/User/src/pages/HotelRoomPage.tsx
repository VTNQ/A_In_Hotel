import { useParams } from "react-router-dom";
import RoomHero from "../components/Room/RoomHero";
import { useEffect, useState } from "react";

import { getRoomTypeByHotel } from "../service/api/RoomType";
import type { RooTypeResponse } from "../type/roomType.types";
import { File_URL } from "../setting/constant/app";


const HotelRoomPage = () => {
    const { id } = useParams();

    const [rooms, setRooms] = useState<RooTypeResponse[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getRoomTypeByHotel(Number(id));
                setRooms(res.data.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);
    const RoomSkeleton = () => (
        <div className="relative animate-pulse">
            <div className="h-[520px] w-[70%] bg-gray-300 rounded-2xl ml-auto" />

            <div className="absolute top-1/2 -translate-y-1/2 left-0 
            w-full max-w-[520px] bg-[#F6F3F0] p-10 space-y-4">

                <div className="h-6 w-1/2 bg-gray-300 rounded" />
                <div className="h-4 w-full bg-gray-300 rounded" />
                <div className="h-4 w-4/5 bg-gray-300 rounded" />

                <div className="grid grid-cols-3 gap-3 mt-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-300 rounded" />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <RoomHero />
            <section
                className="relative py-24 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/image/724ed79d34d3b1706617f9c2e66ea6c1fffec304.png')",
                }}
            >
                <div className="mx-auto max-w-7xl space-y-32 px-6">
                    {loading ? (
                        <>
                            <RoomSkeleton />
                            <RoomSkeleton />
                        </>
                    ) : (
                        rooms.map((room, index) => {
                            const reverse = index % 2 !== 0;

                            return (
                                <div key={room.id} className="relative">
                                    {/* IMAGE */}
                                    <div
                                        className={`w-full lg:w-[70%] overflow-hidden rounded-2xl ${reverse ? "" : "ml-auto"}`}
                                    >
                                        <img
                                            src={File_URL + room.roomImage?.url}
                                            alt={room.roomImage?.altText}
                                            className="h-[520px] w-full object-cover"
                                        />
                                    </div>

                                    {/* CARD */}
                                    <div
                                        className={`absolute top-1/2 -translate-y-1/2 w-full max-w-[520px] 
                                            bg-[#F6F3F0] p-10 ${reverse ? "right-0" : "left-0"}`}
                                    >
                                        <h3 className="mb-4 font-montserrat font-normal text-2xl text-[#2f2a25]">
                                            {room.name}
                                        </h3>

                                        <p className="mb-6 text-sm font-montserrat leading-relaxed text-gray-600 line-clamp-2">
                                            {room.description}
                                        </p>

                                        {/* FEATURES */}
                                        <ul className="mb-6 grid grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-700">
                                            {room.assets.map((asset, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                >
                                                    {/* ICON */}
                                                    <img
                                                        src={File_URL + asset.thumbnail?.url}
                                                        alt={asset.assetName}
                                                        className="h-4 w-4 object-contain"
                                                    />

                                                    {/* TEXT */}
                                                    <span>{asset.assetName}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* ACTION */}
                                        <div className="flex items-center justify-between border-t border-[#E4DBD1] pt-4">
                                            <a
                                                href="#"
                                                className="text-xs tracking-widest text-gray-500 hover:text-[#bfa383]"
                                            >
                                                DETAILS →
                                            </a>

                                            <button className="rounded-md bg-[#bfa383] px-7 py-2 text-xs tracking-widest text-white hover:bg-[#a88b6a] transition">
                                                BOOK NOW
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })

                    )}

                </div>
            </section>


        </>

    )
}
export default HotelRoomPage;