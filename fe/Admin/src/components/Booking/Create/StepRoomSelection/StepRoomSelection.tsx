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
                let filters: string[] = [
                    `hotel.id==${hotelId}`,
                    `status==3`,
                ];

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
                return prev.map((r) =>
                    r.id === roomWithData.id ? roomWithData : r
                );
            }


            return [...prev, roomWithData];
        });
    };


    const RoomSkeleton = () => (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="h-32 bg-gray-200 rounded-lg animate-pulse"
                />
            ))}
        </div>
    );

    return (
        <div className="bg-gray-50">
            <h2 className="text-2xl font-semibold mb-1">{t("roomSelection.title")}</h2>
            <p className="text-sm text-gray-500">
                {t("roomSelection.subtitle", {
                    count: booking.selectDate?.adults || 2,
                })}
            </p>

            <RoomSearchFilter
                filter={{ search, roomType }}
                roomTypes={roomTypes}
                disabled={loading}
                onChange={(key: string, value: string) => {
                    if (key === "search") setSearch(value);
                    if (key === "roomType") setRoomType(value);
                }}
            />

            <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="col-span-2">
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
                                packageType={booking.selectDate?.package}
                                selected={selectedRooms.some(
                                    (r) => r.id === room.id
                                )}
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
                    onNext={() => onNext({ rooms: selectedRooms })}
                />
            </div>

            <div className="flex justify-between items-center mt-8">

                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg text-sm font-medium
            text-red-600 border border-red-200 bg-red-50 hover:bg-red-100
            hover:border-red-300 transition"
                >
                   {t("roomSelection.cancel")}
                </button>

                {/* BACK */}
                <button
                    onClick={onBack}
                    className="text-sm text-gray-500 hover:underline"
                >
                    {t("roomSelection.back")}
                </button>
            </div>

        </div>
    );
};

export default StepRoomSelection;
