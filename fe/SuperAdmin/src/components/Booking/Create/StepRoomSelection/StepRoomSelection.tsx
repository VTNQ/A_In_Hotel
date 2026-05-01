import { getAllCategories } from "@/service/api/Categories";
import { getAllHotel } from "@/service/api/Hotel";
import { getRoom } from "@/service/api/Room";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RoomSearchFilter from "./RoomSearchFilter";
import RoomCard from "./RoomCard";
import { getAllFicilities } from "@/service/api/facilities";
import BookingSummary from "./BookingSummary";

const StepRoomSection = ({ booking, onBack, onNext, onCancel }: any) => {
  const { t } = useTranslation();
  const [hotels, setHotels] = useState<any[]>([]);

  const [extras, setExtras] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roomType, setRoomType] = useState("");

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const resp = await getAllHotel({
          all: true,
          filter: "status==1",
        });
        setHotels(resp?.data?.content || []);
      } catch (e) {
        console.error(e);
      }
    };

    fetchHotels();
  }, []);
  useEffect(() => {
    if (!hotelId) return;

    const fetchInit = async () => {
      setLoading(true);
      try {
        const [roomResp, extraResp, typeResp] = await Promise.all([
          getRoom({
            all: true,
            filter: `hotel.id==${hotelId} and status==3`,
          }),
          getAllFicilities({
            all: true,
            filter: "isActive==true and type==1 and extraCharge==0",
          }),
          getAllCategories({
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

        const resp = await getRoom(params);
        setRooms(resp.data?.content || []);
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, roomType, initialized, hotelId]);
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
    <div className="">
      <h2 className="text-2xl font-semibold mb-1">
        {t("roomSelection.title")}
      </h2>
      <p className="text-sm text-gray-500">
        {t("roomSelection.subtitle", {
          count: booking.selectDate?.adults || 2,
        })}
      </p>
      <RoomSearchFilter
        hotels={hotels}
        roomTypes={roomTypes}
        filter={{
          hotelId,
          search,
          roomType,
        }}
        disabled={!hotelId}
        onChange={(key: string, value: string | null) => {
          if (key === "hotelId") {
            setHotelId(value);
            setSelectedRooms([]);
     
            setSearch("");
            setRoomType("");
          }
          if (key === "search") setSearch(value || "");
          if (key === "roomType") setRoomType(value || "");
        }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="col-span-2 space-y-4">
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

        <BookingSummary
          rooms={selectedRooms}
          bookingDate={booking.selectDate}
          packageType={booking.selectDate?.package}
          guests={{
            adults: booking.selectDate?.adults,
            children: booking.selectDate?.children,
          }}
          onEditGuests={onBack}
          onNext={() => onNext({ rooms: selectedRooms,hotelId:hotelId })}
        />
      </div>
      <div className="flex justify-between items-center border-t pt-5">
        <button
          onClick={onCancel}
          className="
            px-4 py-2 rounded-lg text-sm font-medium
            text-gray-600 border border-gray-300 bg-white
            hover:bg-gray-50 transition
          "
        >
          {t("bookingDateTime.cancel")}
        </button>
          <button
            onClick={onBack}
            className="
              px-4 py-2 rounded-lg text-sm
              bg-gray-100 text-gray-700
              hover:bg-gray-200 transition
            "
          >
            {t("bookingDateTime.back")}
          </button>

      </div>
    </div>
  );
};
export default StepRoomSection;
