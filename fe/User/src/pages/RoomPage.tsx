import { useState } from "react";
import type { RoomResponse } from "../type/room.types";
import RoomHero from "../components/Room/RoomHero";

import RoomFilterSideBar from "../components/Room/RoomFilterSidebar";
import RoomGrid from "../components/Room/RoomGrid";
import ExploreOtherRooms from "../components/Room/ExploreOtherRooms";
import RoomPagination from "../components/Room/RoomPagination";
import RoomDetail from "../components/Room/RoomDetail";

const RoomPage = () => {
    const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);
    const [roomGrid, setRoomGrid] = useState<RoomResponse[]>([]);
    const [page,setPage]= useState(1);
    const [totalPages,setTotalPages] = useState(1);
    
    return (
        <>           
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
                                page={page}
                                onPageInfo={setTotalPages}
                                onSelect={setSelectedRoom}
                                onLoaded={setRoomGrid}
                                selectedRoomId={selectedRoom?.id}
                            />
                            <RoomPagination
                                page={page}
                                totalPages={totalPages}
                                onChange={setPage}
                            />
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
