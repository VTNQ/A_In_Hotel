import { useState } from "react";
import type { RoomResponse } from "../type/room.types";
import RoomHero from "../components/Room/RoomHero";
import Navbar from "../components/Navbar";
import RoomFilterSideBar from "../components/Room/RoomFilterSidebar";
import RoomGrid from "../components/Room/RoomGrid";
import Pagination from "../components/Room/Pagination";
import RoomDetail from "../components/Room/RoomDetail";
import ExploreOtherRooms from "../components/Room/ExploreOtherRooms";

const RoomPage = () => {
    const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);
    const [roomGrid, setRoomGrid] = useState<RoomResponse[]>([]);

    return (
        <>
            <Navbar />
            <div className="bg-[#FBF7F2] min-h-screen">
                <RoomHero />

                <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

                    {/* ===== TOP SECTION ===== */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* FILTER */}
                        <div className="lg:col-span-3">
                            <RoomFilterSideBar />
                        </div>

                        {/* ROOM GRID */}
                        <div className="lg:col-span-6 space-y-6">
                            <RoomGrid
                                onSelect={setSelectedRoom}
                                onLoaded={setRoomGrid}
                            />
                            <Pagination />
                        </div>

                        {/* ROOM DETAIL */}
                        <div className="lg:col-span-3 space-y-6">
                            <RoomDetail room={selectedRoom} />
                        </div>

                    </div>

                    {/* ===== EXPLORE SECTION (FULL WIDTH) ===== */}


                </div>
                {roomGrid.length > 0 && (
                    <ExploreOtherRooms roomGrid={roomGrid} />
                )}

            </div>
        </>
    );
};

export default RoomPage;
