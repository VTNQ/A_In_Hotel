import { useEffect, useRef, useState } from "react";
import type { RoomResponse } from "../type/room.types";

import RoomHero from "../components/Room/RoomHero";
import RoomFilterSideBar from "../components/Room/RoomFilterSidebar";
import RoomGrid from "../components/Room/RoomGrid";
import ExploreOtherRooms from "../components/Room/ExploreOtherRooms";
import RoomDetail from "../components/Room/RoomDetail";
import { useTranslation } from "react-i18next";

const RoomPage = () => {
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);

  const [roomGrid, setRoomGrid] = useState<RoomResponse[]>([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [assets, setAssets] = useState<string[]>([]);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // RESET WHEN FILTER CHANGES
  useEffect(() => {
    setPage(1);
    setRoomGrid([]);
  }, [priceRanges, roomTypes, assets]);

  // INFINITE SCROLL
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && !loading && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [loading, page, totalPages]);

  return (
    <div className="bg-[#FBF7F2] min-h-screen">
      <RoomHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* FILTER */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 self-start">
            <RoomFilterSideBar
              priceRanges={priceRanges}
              onPriceChange={setPriceRanges}
              roomTypes={roomTypes}
              onRoomTypeChange={setRoomTypes}
              assets={assets}
              onAssetsChange={setAssets}
            />
          </div>

          {/* ROOM GRID */}
          <div className="lg:col-span-6 space-y-6 ml-5">
            <RoomGrid
              page={page}
              priceRange={priceRanges}
              roomTypes={roomTypes}
              assets={assets}
              selectedRoomId={selectedRoom?.id}
              roomGrid={roomGrid}
              onSelect={setSelectedRoom}
              onPageInfo={setTotalPages}
              onLoading={setLoading}
              onLoaded={(rooms, reset) => {
                setRoomGrid((prev) => (reset ? rooms : [...prev, ...rooms]));
              }}
            />

            {/* LOADING */}
            {loading && (
              <div className="grid grid-cols-1 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-3xl overflow-hidden bg-white shadow-sm"
                  >
                    {/* IMAGE */}
                    <div className="h-64 bg-gray-200" />

                    {/* CONTENT */}
                    <div className="p-5 space-y-4">
                      <div className="h-5 w-2/3 bg-gray-200 rounded" />

                      <div className="h-4 w-full bg-gray-100 rounded" />

                      <div className="h-4 w-5/6 bg-gray-100 rounded" />

                      <div className="flex justify-between items-center pt-3">
                        <div className="h-6 w-24 bg-gray-200 rounded" />

                        <div className="h-10 w-28 bg-gray-200 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* LOAD MORE TRIGGER */}
            <div ref={loadMoreRef} className="h-10" />

            {/* END */}
            {!loading && page >= totalPages && roomGrid.length > 0 && (
              <div className="text-center py-10">
                <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
                  {t("room.loaded.title")}
                </p>
                <p className="text-gray-500 mt-2">{t("room.loaded.noRooms")}</p>
              </div>
            )}
          </div>

          {/* ROOM DETAIL */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 self-start">
            <RoomDetail room={selectedRoom} />
          </div>
        </div>
      </div>

      {/* EXPLORE */}
      {roomGrid.length > 0 && <ExploreOtherRooms roomGrid={roomGrid} />}
    </div>
  );
};

export default RoomPage;
