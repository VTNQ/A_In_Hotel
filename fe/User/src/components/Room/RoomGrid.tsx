import { useEffect, useRef, useState } from "react";
import RoomCard from "./RoomCard";
import { getRoom } from "../../service/api/Room";
import type { RoomGridProps, RoomResponse } from "../../type/room.types";
import { useBookingSearch } from "../../context/booking/BookingSearchContext";
import RoomCardSkeleton from "./RoomCardSkeleton";
import { useTranslation } from "react-i18next";
import { Hotel, Loader2, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
const RoomGrid = ({
  page,
  onPageInfo,
  onSelect,
  onLoaded,
  selectedRoomId,
  priceRange,
  roomTypes,
  assets,
  roomGrid,
  onLoading,
}: RoomGridProps) => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const lastFilterRef = useRef("");
  const [initialLoading, setInitialLoading] = useState(true);
  const { search } = useBookingSearch();
  const buildPriceFilter = (ranges: string[]) => {
    if (!ranges.length) return "";

    return ranges
      .map((r) => {
        const [min, max] = r.split("-").map(Number);
        return `(basePrice>=${min};basePrice<=${max})`;
      })
      .join(",");
  };
  const buildAssetsFilter = (assets: string[]) => {
    if (!assets.length) return "";
    return assets.map((id) => `assets.id==${id}`).join(";");
  };
  const buildRoomTypesFilter = (amenities: string[]) => {
    if (!amenities.length) return "";
    return amenities.map((id) => `roomType.id==${id}`).join(";");
  };
  useEffect(() => {
    if (!search) return;

    let mounted = true;

    const fetchRooms = async () => {
      try {
        setLoading(true);
        setRooms([]);

        const totalGuests = (search?.adults ?? 0) + (search?.children ?? 0);
        let filter = `hotel.id==${search.hotelId};status==3;capacity>=${totalGuests}`;

        const priceFilter = buildPriceFilter(priceRange);
        if (priceFilter) {
          filter += `;(${priceFilter})`;
        }

        const roomTypesFilter = buildRoomTypesFilter(roomTypes);
        if (roomTypesFilter) {
          filter += `;(${roomTypesFilter})`;
        }

        const assetsFilter = buildAssetsFilter(assets);
        if (assetsFilter) {
          filter += `;(${assetsFilter})`;
        }

        const isFilterChanged = lastFilterRef.current !== filter;
        if (isFilterChanged) {
          setRooms([]);
          onLoaded([], true);
          lastFilterRef.current = filter;
        }

        const res = await getRoom({
          page,
          size: 5,
          sort: "basePrice,asc",
          filter,
        });

        if (!mounted) return;

        const list = res.data?.content || [];
        setRooms((prev) => {
          const merged =
            page === 1 || isFilterChanged
              ? list
              : [
                  ...prev,
                  ...list.filter(
                    (r: RoomResponse) => !prev.some((pr) => pr.id === r.id),
                  ),
                ];
          onLoaded(merged, page === 1 || isFilterChanged);
          return merged;
        });

        onPageInfo(res.data?.totalPages || 1);
      } catch (err) {
        console.error("Fetch rooms failed", err);
        if (mounted) {
          setRooms([]);
          onLoaded([], true);
          onPageInfo(1);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialLoading(false);
          onLoading(false);
        }
      }
    };

    fetchRooms();

    return () => {
      mounted = false;
    };
  }, [search, page, priceRange, roomTypes, assets]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {initialLoading && (
        <div className="space-y-5">
          {Array.from({
            length: 5,
          }).map((_, i) => (
            <RoomCardSkeleton key={i} />
          ))}
        </div>
      )}
      {!loading && rooms.length === 0 && !initialLoading && (
        <div
          className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-16
      text-center"
        >
          <div
            className="w-20 h-20 rounded-full bg-[#f5efe7] flex items-center justify-center
          mx-auto mb-5"
          >
            <Hotel size={28} className="text-[#b38a58]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            {t("room.grid.noRooms")}
          </h3>
          <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto leading-relaxed">
            {t("room.grid.tryAnotherFilter")}
          </p>
        </div>
      )}
      <AnimatePresence mode="popLayout">
        <div className="space-y-5">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.35,
                delay: index * 0.06,
              }}
            >
              <RoomCard
                room={room}
                isSelected={room.id === selectedRoomId}
                onClick={() => onSelect(room)}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
      {loading && !initialLoading && rooms.length > 0 && (
        <div className="flex justify-center py-10">
          <div
            className="
                  relative overflow-hidden
                  flex items-center gap-4
                  rounded-2xl
                  border border-[#e8dccd]
                  bg-gradient-to-r from-white via-[#fffaf5] to-white
                  px-6 py-4
                   shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                   backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse" />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#f8f1e8]">
              <Loader2 size={20} className="animate-spin text-[#b38a58]" />
              <div
                className="
                    absolute inset-0
                    rounded-full
                    border border-[#d6b892]
                    animate-ping opacity-30"
              />
            </div>
            <div className="relative">
              <p className="text-sm font-semibold text-gray-800">
                {t("room.loading.title")}
              </p>

              <p className="text-xs text-gray-500 mt-0.5">
                {t("room.loading.subtitle")}
              </p>
            </div>
          </div>
        </div>
      )}
      {!loading && rooms.length > 0 && roomGrid.length === rooms.length && (
        <div className="flex justify-center py-12">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full bg-[#b38a58]/20
                  blur-2xl"
            />
            <div
              className="relative flex items-center gap-3
                    px-6 py-3 rounded-full border border-[#eadfce] bg-white/90
                    backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
            >
              <div
                className="
              flex items-center justify-center
              w-9 h-9
              rounded-full
              bg-[#f5efe7]"
              >
                <Sparkles size={18} className="text-[#b38a58]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#b38a58]">
                  {t("room.loaded.title")}
                </p>

                <p className="text-xs text-gray-500">
                  {t("room.loaded.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomGrid;
