import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getRoom } from "../../service/api/Room";
import type { RoomResponse } from "../../type/room.types";
import { File_URL } from "../../setting/constant/app";

interface Props {
    roomGrid: RoomResponse[];
}

const CARD_WIDTH = 260; // đúng như hình

const ExploreOtherRooms = ({ roomGrid }: Props) => {
    const [rooms, setRooms] = useState<RoomResponse[]>([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const fetchAllRooms = async () => {
            const res = await getRoom({
                all:true,
              
                filter: "status==3",
            });

            const allRooms: RoomResponse[] = res.data?.content || [];
            const gridIds = roomGrid.map((r) => r.id);
            console.log(gridIds);
          
            // ❌ loại room đã xuất hiện trong RoomGrid
            const exploreRooms = allRooms.filter(
                (r) => !gridIds.includes(r.id)
            );
            setRooms(exploreRooms);
        };

        fetchAllRooms();
    }, [roomGrid]);

    if (!rooms.length) return null;

    const maxIndex = Math.max(0, rooms.length - 4);

    return (
        <div className="bg-[#E9DCCB] rounded-xl px-8 py-10">
            <div className="flex gap-10 items-start">

                {/* ===== LEFT TEXT ===== */}
                <div className="w-48 shrink-0">
                    <h3 className="text-[40px] font-semibold text-[#7b5b3e] leading-tight">
                        Explore
                        <br />
                        other
                        <br />
                        room
                        <br />
                        options
                    </h3>
                </div>

                {/* ===== SLIDER ===== */}
                <div className="relative flex-1 overflow-hidden">

                    {/* TRACK */}
                    <div
                        className="flex gap-4 transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${index * (CARD_WIDTH + 16)}px)`,
                        }}
                    >
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                className="relative w-[382px] h-[485px] rounded-xl overflow-hidden shadow-sm"
                            >
                                {/* IMAGE */}
                                <img
                                    src={File_URL + room.images[0]?.url}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* GRADIENT OVERLAY */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            "linear-gradient(to top, #F6F3F0 0%, rgba(255,255,255,0.3) 40%)",
                                    }}
                                />

                                {/* CONTENT */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h4 className="text-sm font-semibold uppercase leading-snug text-[#6b4e2e]">
                                        {room.roomName}
                                    </h4>

                                    <p className="text-xs text-gray-600 mb-3">
                                        A IN RIVERSIDE
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-green-600 cursor-pointer">
                                            View room details
                                        </span>

                                        <button className="bg-[#b38a58] text-white text-xs px-4 py-1.5 rounded">
                                            Booking
                                        </button>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>

                    {/* ← BUTTON */}
                    {index > 0 && (
                        <button
                            onClick={() => setIndex(index - 1)}
                            className="absolute left-0 top-1/2 -translate-y-1/2
                         bg-white/80 rounded-full p-2 shadow"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    {/* → BUTTON */}
                    {index < maxIndex && (
                        <button
                            onClick={() => setIndex(index + 1)}
                            className="absolute right-0 top-1/2 -translate-y-1/2
                         bg-white/80 rounded-full p-2 shadow"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}

                    {/* DOTS */}
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                            <span
                                key={i}
                                className={`w-2 h-2 rounded-full transition
                  ${i === index ? "bg-[#7b5b3e]" : "bg-[#cbb9a3]"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExploreOtherRooms;
