import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import BookingSummary from "./BookingSummary";
import RoomSearchFilter from "./RoomSearchFilter";

import { getTokens } from "../../../../util/auth";
import { getAllRoom } from "../../../../service/api/Room";
import { getAll } from "../../../../service/api/ExtraService";
import { getAllCategory } from "../../../../service/api/Category";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

const StepRoomSelection = ({ booking, onBack, onNext, onCancel }: any) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const { t } = useTranslation();
  const [extras, setExtras] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roomType, setRoomType] = useState("");

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const hotelId = getTokens()?.hotelId;
  const {
    watch,
    setValue,
    handleSubmit,
  } = useForm<any>({
    mode: "onChange",
    defaultValues: {
      rooms: booking.rooms || [],
    },
  });
  const selectedRooms = watch("rooms");
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
            filter: "isActive==true and type==1 and extraCharge==0",
          }),
          getAllCategory({
            all: true,
            filter: "isActive==true and type==1",
          }),
        ]);

        setRooms(roomResp.data?.content || []);
        setExtras(extraResp.data?.content || []);
        setRoomTypes(typeResp.data.content || []);
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
    const exists = selectedRooms.find((r: any) => r.id === roomWithData.id);

    let updatedRooms = [...selectedRooms];

    if (exists && roomWithData._action === "remove") {
      updatedRooms = updatedRooms.filter((r: any) => r.id !== roomWithData.id);
    } else if (exists) {
      updatedRooms = updatedRooms.map((r: any) =>
        r.id === roomWithData.id ? roomWithData : r,
      );
    } else {
      updatedRooms.push(roomWithData);
    }

    setValue("rooms", updatedRooms, {
      shouldValidate: true,
    });
  };

  const RoomSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );
  const hasSelectedRoom = selectedRooms.length > 0;
  const totalGuests =
    (booking.selectDate?.adults || 0) + (booking.selectDate?.children || 0);
  const totalCapacity = selectedRooms.reduce(
    (sum: number, room: any) => sum + (room.capacity || 0),
    0,
  );
  const capacityValid = totalCapacity >= totalGuests;

  const submit = () => {
    if (!hasSelectedRoom || !capacityValid) return;

    onNext({
      rooms: selectedRooms,
    });
  };
    const roomError =
    !hasSelectedRoom
      ? t("roomSelection.validation.selectRoom")
      : !capacityValid
      ? t("roomSelection.validation.capacity")
      : "";

 return (
  <div className="">

    {/* HEADER */}
    <div className="mb-4 sm:mb-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
        {t("roomSelection.title")}
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t("roomSelection.subtitle", {
          count: booking.selectDate?.adults || 2,
        })}
      </p>
    </div>

    {/* FILTER */}
    <RoomSearchFilter
      filter={{ search, roomType }}
      roomTypes={roomTypes}
      disabled={loading}
      onChange={(key: string, value: string) => {
        if (key === "search") setSearch(value);
        if (key === "roomType") setRoomType(value);
      }}
    />

    {/* CONTENT */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

      {/* ROOMS LIST */}
      <div className="lg:col-span-2 space-y-4">

        {loading ? (
          <RoomSkeleton />
        ) : rooms.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            {t("roomSelection.noRooms")}
          </p>
        ) : (
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              service={extras}
              bookingDate={booking.selectDate}
              packageType={booking.selectDate?.package}
              selected={selectedRooms.some((r: any) => r.id === room.id)}
              onSelect={toggleRoom}
            />
          ))
        )}

        {/* ERROR */}
        {roomError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3
            dark:bg-red-500/10 dark:border-red-500/30">
            <p className="text-sm text-red-500 dark:text-red-400">
              {roomError}
            </p>
          </div>
        )}
      </div>

      {/* SUMMARY */}
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
          onNext={handleSubmit(submit)}
        />
      </div>
    </div>

    {/* ACTIONS */}
    <div className="mt-10 flex flex-col sm:flex-row sm:justify-between gap-4">

      <button
        onClick={onCancel}
        className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium
        text-red-600 border border-red-200 bg-red-50
        hover:bg-red-100 hover:border-red-300 transition
        dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30
        dark:hover:bg-red-500/20"
      >
        {t("roomSelection.cancel")}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="
          w-full sm:w-auto inline-flex items-center justify-center gap-2
          px-5 py-3 rounded-xl text-sm font-medium
          bg-gray-100 text-gray-700 hover:bg-gray-200 transition
          dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700
        "
      >
        {t("roomSelection.back")}
      </button>

    </div>
  </div>
);
};

export default StepRoomSelection;
