import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import BookingSummary from "./BookingSummary";
import RoomSearchFilter from "./RoomSearchFilter";

import { getTokens } from "../../../../util/auth";
import { getAllRoom } from "../../../../service/api/Room";
import { getAll } from "../../../../service/api/ExtraService";
import { getAllCategory } from "../../../../service/api/Category";
import { useTranslation } from "react-i18next";

const StepRoomSelection = ({ booking, onBack, onNext, onCancel }: any) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const { t } = useTranslation();
  const [extras, setExtras] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [roomType, setRoomType] = useState("");

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const hotelId = getTokens()?.hotelId;

  /* ===================== INIT LOAD ===================== */
  useEffect(() => {
    if (!hotelId) return;

    const fetchInit = async () => {
      setLoading(true);
      try {
        const [roomResp, extraResp, typeResp] = await Promise.all([
          getAllRoom({
            all: true,
            filter: `hotel.id==${hotelId} and status==3`,
          }),
          getAll({
            all: true,
            filter: "isActive==true and type==1 and price==0",
          }),
          getAllCategory({
            all: true,
            filter: "isActive==true and type==1",
          }),
        ]);

        setRooms(roomResp.data?.content || []);
        setExtras(extraResp.data?.content || []);
        setRoomTypes(typeResp?.content || []);
        setInitialized(true); // ✅ đánh dấu đã load xong
      } catch (error) {
        console.error("Init fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInit();
  }, [hotelId]);

  /* ===================== SEARCH & FILTER ===================== */
  useEffect(() => {
    if (!initialized) return; // ✅ CHẶN effect dưới
    if (!search && !roomType) return; // optional

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        let filters: string[] = [`hotel.id==${hotelId}`, `status==3`];

        if (roomType) {
          filters.push(`roomType.id==${roomType}`);
        }

        const params: any = {
          all: true,
          filter: filters.join(" and "),
        };

        if (search) {
          params.searchField = "roomName";
          params.searchValue = search;
        }

        const resp = await getAllRoom(params);
        setRooms(resp.data?.content || []);
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, roomType, initialized, hotelId]);

  /* ===================== SELECT ROOM ===================== */
  const toggleRoom = (roomWithData: any) => {
    setSelectedRooms((prev) => {
      const exists = prev.find((r) => r.id === roomWithData.id);

      if (exists && roomWithData._action === "remove") {
        return prev.filter((r) => r.id !== roomWithData.id);
      }

      if (exists) {
        return prev.map((r) => (r.id === roomWithData.id ? roomWithData : r));
      }

      return [...prev, roomWithData];
    });
  };

  const RoomSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold ">
          {t("roomSelection.title")}
        </h2>
        <p className="text-sm text-gray-500">
          {t("roomSelection.subtitle", {
            count: booking.selectDate?.adults || 2,
          })}
        </p>
      </div>

      <RoomSearchFilter
        filter={{ search, roomType }}
        roomTypes={roomTypes}
        disabled={loading}
        onChange={(key: string, value: string) => {
          if (key === "search") setSearch(value);
          if (key === "roomType") setRoomType(value);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <RoomSkeleton />
          ) : rooms.length === 0 ? (
            <p className="text-gray-500">{t("roomSelection.noRooms")}</p>
          ) : (
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                service={extras}
                bookingDate={booking.selectDate}
                packageType={booking.selectDate?.package}
                selected={selectedRooms.some((r) => r.id === room.id)}
                onSelect={toggleRoom}
              />
            ))
          )}
        </div>
        <div className="lg:sticky lg:top-6 h-fit">
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
      </div>

      <div className="mt-10 flex flex-col sm:flex-row sm:justify-between gap-4 ">
        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium
        text-red-600 border border-red-200 bg-red-50
        hover:bg-red-100 hover:border-red-300 transition"
        >
          {t("roomSelection.cancel")}
        </button>

        {/* BACK */}
        <button
        type="button"
        onClick={onBack}
        className="
          w-full sm:w-auto
          inline-flex items-center justify-center gap-2
          px-5 py-3
          rounded-xl
          bg-gray-100
          text-sm font-medium text-gray-700
          hover:bg-gray-200 transition"
      >
        {t("roomSelection.back")}
      </button>
      </div>
    </div>
  );
};

export default StepRoomSelection;
