import { Baby, BedDouble, Calendar, Minus, Plus, User } from "lucide-react";
import RoomCard from "../components/RoomDetail/RoomCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { RoomResponse } from "../type/room.types";
import { getRoomById } from "../service/api/Room";
import { File_URL } from "../setting/constant/app";
import { GetAsset } from "../service/api/Asset";
import { useBookingSearch } from "../context/booking/BookingSearchContext";
import type { PriceType } from "../type/booking.types";
const RoomDetailPage = () => {
    const [openGallery, setOpenGallery] = useState(false);
    const { id } = useParams();
    const [roomv2, setRoomV2] = useState<RoomResponse | null>(null);
    const [amenities, setAmenities] = useState<any[]>([]);
    const fetchAmenities = async () => {
        try {
            const res = await GetAsset({
                all: true,
                filter: `room.id==${id}`
            })
            setAmenities(res.data.content || []);
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        if (!id) return;
        const fetchRoom = async () => {
            try {
                const res = await getRoomById(Number(id));
                if (res.data.data) {
                    setRoomV2(res.data.data);
                } else {
                    setRoomV2(null);
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchRoom();
        fetchAmenities();
    }, [id]);
    const { search } = useBookingSearch();
    const adults = search?.adults ?? 0;
    const children = search?.children ?? 0;
    const checkIn = search?.checkIn ?? "";
    const checkOut = search?.checkOut ?? "";
    const room = {
        name: "MINI ROOM",
        address: "Vo Nguyen Giap Street, Ngu Hanh Son, Da Nang",
        area: 20,
        defaultRate: 70000,
        images: [
            { url: "https://picsum.photos/800/500?1" },
            { url: "https://picsum.photos/800/500?2" },
            { url: "https://picsum.photos/800/500?3" },
            { url: "https://picsum.photos/800/500?3" },
        ],
        amenities: [
            "Air conditioning",
            "Smart TV with Netflix",
            "MiniBar",
            "Fee Wifi",
            "Wardrobe",
            "Work desk",
            "Private bathroom",
            "Hair dryer"
        ]
    }
    const remainImages = room.images.length - 3;
    const [activeIndex, setActiveIndex] = useState(0);
    const formatDate = (date?: string | null) => {
        if (!date) return "--/--/----";
        return new Date(date).toLocaleDateString("vi-VN");
    };
    const [PriceType, setPriceType] = useState<PriceType | null>(null);
    const [extraHours, setExtraHours] = useState(0);
    const calcNights = (checkIn?: string, checkOut?: string): number => {
        if (!checkIn || !checkOut) return 0;

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        const diff = end.getTime() - start.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };
    const nights = calcNights(checkIn, checkOut);
    const isMultiDay = nights > 1;
    const calculateTotal = () => {
        if (!roomv2 || !PriceType) {
            return {
                base: 0,
                service: 0,
                total: 0,
            };
        }
        let basePrice = 0;

        if (PriceType === "HOURLY") {
            basePrice =
                roomv2.hourlyBasePrice +
                extraHours * roomv2.hourlyAdditionalPrice;
        }

        if (PriceType === "OVERNIGHT") {
            basePrice = roomv2.overnightPrice;
        }

        if (PriceType == "DAILY") {
            basePrice = roomv2.defaultRate * Math.max(1, nights);
        }
        const serviceFee = basePrice * 0.1;

        return {
            base: basePrice,
            service: serviceFee,
            total: basePrice + serviceFee,
        };
    }
    const priceResult = calculateTotal();
    return (

        <>
            <div className="" style={{
                backgroundImage: "url('/image/724ed79d34d3b1706617f9c2e66ea6c1fffec304.png')",
            }}>
                <section className="relative left-1/2 -ml-[50vw] w-full overflow-hidden pt-[90px]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 max-w-7xl mx-auto">
                        <div
                            className="lg:col-span-2 h-[400px] rounded-xl overflow-hidden cursor-pointer"
                            onClick={() => setOpenGallery(true)}
                        >
                            <img
                                src={File_URL + roomv2?.images[0]?.url}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col gap-4 h-[400px]">
                            {roomv2?.images.slice(1, 3).map((img, i) => {
                                const isLast = i === 1 && roomv2?.images.length > 3;

                                return (
                                    <div
                                        key={i}
                                        className="relative flex-1 rounded-xl overflow-hidden cursor-pointer"
                                        onClick={() => setOpenGallery(true)}
                                    >
                                        <img
                                            src={File_URL + img.url}
                                            className="w-full h-full object-cover hover:scale-105 transition"
                                        />

                                        {isLast && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-3xl font-semibold">
                                                +{remainImages}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </section>
                <section className="max-w-7xl mx-auto px-4 pt-[30px] pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* ===== HEADER ===== */}
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    {roomv2?.roomName} <span className="text-base  text-gray-500 font-semibold">( {roomv2?.roomTypeName} )</span>
                                </h1>

                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                    <span>📍</span>
                                    {roomv2?.hotelAddress}
                                </p>
                            </div>

                            {/* ===== OVERVIEW ===== */}
                            <div className="space-y-3">
                                <h4 className="font-semibold">Overview</h4>

                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {roomv2?.note}
                                </p>


                            </div>

                            {/* ===== AMENITIES + POLICIES ===== */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                                {/* AMENITIES */}
                                <div className="bg-transparent border border-[#2B2B2B] rounded-xl p-5 h-fit">
                                    <h4 className="font-semibold mb-4">Amenities</h4>

                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
                                        {amenities.map((item) => (
                                            <li
                                                key={item.id}
                                                className="flex items-center gap-3"
                                            >
                                                <img
                                                    src={File_URL + item.thumbnail?.url}
                                                    alt={item.assetName}
                                                    className="w-4 h-4 object-contain"
                                                />
                                                <span>{item.assetName}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* POLICIES */}
                                <div className="bg-transparent border border-[#2B2B2B] rounded-xl p-5 max-h-[326px] overflow-y-auto">
                                    <h4 className="font-semibold mb-4">Property Policies</h4>

                                    <p className="text-xs text-gray-500 mb-3">
                                        Extra bed policies vary by room type. Please check the room details for more information.
                                        All children are welcome.
                                    </p>

                                    <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                                        <li>
                                            <strong>Infants (0–1 year old, including babies)</strong><br />
                                            Stay free of charge when using existing beds.
                                        </li>

                                        <li>
                                            <strong>Children (2–6 years old, including toddlers)</strong><br />
                                            Stay free of charge when using existing beds.
                                        </li>

                                        <li>
                                            <strong>Guests aged 7 years and above</strong><br />
                                            Considered as adults.
                                        </li>

                                        <li>
                                            Extra beds are available upon request and will incur an additional charge.
                                        </li>

                                        <li>
                                            For bookings of more than 5 rooms, additional policies may apply.
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>


                        {/* RIGHT – BOOKING */}
                        <div className="lg:sticky lg:top-[120px] h-fit bg-white">
                            <div className="rounded-xl p-5 shadow-sm space-y-5 ">

                                {/* ===== GUEST & BED INFO ===== */}
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            <span>Adult: {adults}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Baby size={16} />
                                            <span>Children: {children}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <BedDouble size={16} />
                                            <span>Double bed</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BedDouble size={16} />
                                            <span>Extra bed</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ===== DATE ===== */}
                                <div className="text-sm text-gray-700 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span>Check in</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} /> {formatDate(checkIn)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Check out</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} /> {formatDate(checkOut)}
                                        </span>
                                    </div>
                                </div>

                                <hr />

                                {/* ===== PRICE OPTIONS ===== */}
                                <div className="space-y-3">
                                    <label
                                        className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer
                                        ${isMultiDay ? "opacity-50 pointer-events-none" : ""}`}
                                    >
                                        <input type="radio"
                                            name="price"
                                            disabled={isMultiDay}
                                            checked={PriceType === "HOURLY"}
                                            className="accent-[#b38a58]"
                                            onChange={() => {
                                                setPriceType("HOURLY");
                                                setExtraHours(0);
                                            }} />
                                        <div>
                                            <p className="text-xs text-gray-500">2 giờ đầu</p>
                                            <p className="font-semibold text-[#b38a58]">{roomv2?.hourlyBasePrice} đ</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer
                                        ${isMultiDay ? "opacity-50 pointer-events-none" : ""}`}>
                                        <input type="radio"
                                            name="price"
                                            disabled={isMultiDay}
                                            checked={PriceType === "OVERNIGHT"}
                                            onChange={() => {
                                                setPriceType("OVERNIGHT");
                                                setExtraHours(0);
                                            }} className="accent-[#b38a58]" />
                                        <div>
                                            <p className="text-xs text-gray-500">Qua đêm (sau 22h)</p>
                                            <p className="font-semibold text-[#b38a58]">{roomv2?.overnightPrice} đ</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">
                                        <input type="radio" name="price" checked={PriceType === "DAILY"}
                                            onChange={() => {
                                                setPriceType("DAILY");
                                                setExtraHours(0);
                                            }} className="accent-[#b38a58]" />
                                        <div>
                                            <p className="text-xs text-gray-500">Giá phòng ngày đêm</p>
                                            <p className="font-semibold text-[#b38a58]">{roomv2?.defaultRate} đ</p>
                                        </div>
                                    </label>
                                </div>

                                {/* ===== EXTRA HOURS ===== */}
                                <div className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm
                                        ${PriceType !== "HOURLY"
                                        ? "opacity-50 pointer-events-none bg-gray-100"
                                        : "bg-gray-50"}`}>
                                    <span>Thêm giờ nghỉ +{roomv2?.hourlyAdditionalPrice}/h</span>

                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setExtraHours(Math.max(0, extraHours - 1))} className="w-6 h-6 rounded-full border flex items-center justify-center">
                                            <Minus size={14} />
                                        </button>
                                        <span>{extraHours}</span>
                                        <button  onClick={() => setExtraHours(extraHours + 1)} className="w-6 h-6 rounded-full border flex items-center justify-center">
                                            <Plus size={14} />
                                        </button>
                                        <span className="ml-1">giờ</span>
                                    </div>
                                </div>

                                {/* ===== TOTAL ===== */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>{nights} night</span>
                                        <span>{priceResult.base.toLocaleString()} vnd</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Service (*10%)</span>
                                        <span>{priceResult.service.toLocaleString()} vnd</span>
                                    </div>
                                </div>

                                <div className="flex justify-between font-semibold border-t pt-3">
                                    <span>Total Cost</span>
                                    <span>{priceResult.total.toLocaleString()} vnd</span>
                                </div>

                                {/* ===== BUTTON ===== */}
                                <button className="w-full bg-[#b38a58] text-white py-2 rounded-lg">
                                    Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="relative left-1/2 -ml-[50vw] w-full overflow-hidden">
                    <div className="w-screen">
                        <iframe
                            className="w-full h-[320px] border-0"
                            loading="lazy"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                                room.address
                            )}&output=embed`}
                        />
                    </div>
                </section>
                <section className="relative left-1/2 -ml-[50vw] w-full overflow-hidden bg-[#fdfcf9] py-14">
                    <div className="w-screen">
                        <div className="max-w-7xl mx-auto px-4">
                            <h4 className="font-semibold mb-8">Rooms</h4>

                            <div className="bg-[#F2F2F2] rounded-xl shadow-sm p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <RoomCard title="STANDARD" price="250,000" />
                                    <RoomCard title="STANDARD" price="250,000" />
                                    <RoomCard title="SUPERIOR" price="280,000" />
                                    <RoomCard title="DELUXE" price="300,000" />
                                </div>
                                <div className="flex flex-col items-center mt-10 text-gray-600 cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full border font-bold border-gray-300 flex items-center justify-center group-hover:bg-gray-100 transition">
                                        ↓
                                    </div>
                                    <span className="mt-2 text-sm text-[#1A1A1A] font-medium group-hover:text-gray-800">
                                        See More Rooms
                                    </span>
                                </div>
                            </div>



                        </div>
                    </div>
                </section>
            </div>
            {openGallery && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">

                    {/* CLOSE */}
                    <button
                        className="absolute top-6 right-6 text-white text-3xl z-50"
                        onClick={() => setOpenGallery(false)}
                    >
                        ✕
                    </button>

                    {/* MAIN IMAGE */}
                    <div className="flex flex-col items-center w-full max-w-6xl px-6">

                        <img
                            src={room.images[activeIndex].url}
                            className="max-h-[80vh] w-auto object-contain rounded-xl mb-6 transition-all"
                        />

                        {/* THUMBNAILS */}
                        <div className="flex gap-3 overflow-x-auto max-w-full pb-2">
                            {room.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img.url}
                                    onClick={() => setActiveIndex(i)}
                                    className={`
              h-20 w-28 object-cover rounded-lg cursor-pointer transition
              ${i === activeIndex
                                            ? "ring-2 ring-white opacity-100"
                                            : "opacity-50 hover:opacity-90"}
            `}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}






        </>
    );
}
export default RoomDetailPage;