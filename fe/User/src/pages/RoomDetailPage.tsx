import { Baby, Calendar, Minus, Plus, User } from "lucide-react";
import RoomCard from "../components/RoomDetail/RoomCard";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { RoomResponse } from "../type/room.types";
import { getRoom, getRoomById } from "../service/api/Room";
import { File_URL } from "../setting/constant/app";
import { GetAsset } from "../service/api/Asset";
import { useBookingSearch } from "../context/booking/BookingSearchContext";
import type { PriceType } from "../type/booking.types";
import RoomCardSkeleton from "../components/RoomDetail/RoomCardSkeleton";
import RoomGallerySkeleton from "../components/RoomDetail/RoomGallerySkeleton";
import AmenitiesSkeleton from "../components/RoomDetail/AmenitiesSkeleton";
import BookingBoxSkeleton from "../components/RoomDetail/BookingBoxSkeleton";
import { useTranslation } from "react-i18next";
import type { PromotionResponse } from "../type/promotion.type";
import { getPromotions } from "../service/api/Promotion";

const RoomDetailPage = () => {
  const { t } = useTranslation();
  const [openGallery, setOpenGallery] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingRoomDetail, setLoadingRoomDetail] = useState(true);
  const [promotion, setPromotion] = useState<PromotionResponse | null>(null);

  const { id } = useParams();
  const { setSearch } = useBookingSearch();
  const [roomv2, setRoomV2] = useState<RoomResponse | null>(null);
  const [amenities, setAmenities] = useState<any[]>([]);
  const fetchAmenities = async () => {
    try {
      const res = await GetAsset({
        all: true,
        filter: `room.id==${id}`,
      });
      setAmenities(res.data.content || []);
    } catch (err) {
      console.log(err);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (!roomv2?.idRoomType) return;
    const fetchPromotion = async () => {
      try {
        const res = await getPromotions({ all: true });

        const promotions = res?.data?.content || [];

        const now = new Date();

        const activePromotion = promotions.find((p: PromotionResponse) => {
          const start = new Date(p.startDate);

          const end = new Date(p.endDate);

          const matchRoomType = p.promotionRoomTypeResponses?.some(
            (r) => r.roomTypeId === roomv2.idRoomType,
          );

          return p.isActive && start <= now && end >= now && matchRoomType;
        });
        setPromotion(activePromotion || null);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPromotion();
  }, [roomv2]);
  const calculatePromotionPrice = (price: number) => {
    if (!promotion) return price;

    // percent
    if (promotion.type === 1) {
      return price - (price * promotion.value) / 100;
    }

    // fixed
    if (promotion.type === 2) {
      return price - promotion.value;
    }

    return price;
  };
  useEffect(() => {
    if (!id) return;
    const fetchRoom = async () => {
      try {
        setLoadingRoomDetail(true);
        const res = await getRoomById(Number(id));
        if (res.data.data) {
          setRoomV2(res.data.data);
        } else {
          setRoomV2(null);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingRoomDetail(false);
      }
    };
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
      "Hair dryer",
    ],
  };
  const remainImages = room.images.length - 3;
  const [activeIndex, setActiveIndex] = useState(0);
  const formatDate = (date?: string | null) => {
    if (!date) return "--/--/----";
    return new Date(date).toLocaleDateString("vi-VN");
  };
  const [otherRooms, setOtherRooms] = useState<RoomResponse[]>([]);

  const fetchOtherRooms = async (hotelId: number, currentRoomId: number) => {
    try {
      setLoadingRooms(true);
      const res = await getRoom({
        filter: `hotel.id==${hotelId} and id!=${currentRoomId} and status==3`,
      });
      const rooms = res.data.content || [];
      setOtherRooms(rooms.filter((r: any) => r.id !== currentRoomId));
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRooms(false);
    }
  };
  useEffect(() => {
    if (!roomv2) return;

    fetchOtherRooms(roomv2.hotelId, roomv2.id);
  }, [roomv2]);
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
  const calculateTotal = () => {
    if (!roomv2 || !PriceType) {
      return {
        base: 0,
        service: 0,
        total: 0,
      };
    }
    let basePrice = 0;

    if (PriceType === "1") {
      const hourlyPrice = calculatePromotionPrice(roomv2.hourlyBasePrice);
      basePrice = hourlyPrice + extraHours * roomv2.hourlyAdditionalPrice;
    }

    if (PriceType === "2") {
      basePrice = calculatePromotionPrice(roomv2.overnightPrice);
    }

    if (PriceType == "3") {
      basePrice =
        calculatePromotionPrice(roomv2.defaultRate) * Math.max(nights, 1);
    }
    const serviceFee = basePrice * 0.1;

    return {
      base: basePrice,
      service: serviceFee,
      total: basePrice,
    };
  };
  const priceResult = calculateTotal();
  const handleBooking = () => {
    if (!roomv2 || !PriceType) {
      alert(t("roomDetail.booking.alerts.selectPriceType"));
      return;
    }

    if (!search) {
      alert(t("roomDetail.booking.alerts.missingSearchInfo"));
      return;
    }

    setSearch({
      ...search, // giữ hotelId, dates, guests
      roomId: roomv2.id,
      priceType: PriceType,
      totalPrice: priceResult.total,
    });

    navigate("/booking");
  };

  return (
    <>
      <div className="bg-[#f6f3ee] min-h-screen overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-[780px] bg-gradient-to-b 
              from-[#b38a58]/15 via-[#b38a58]/5 to-transparent pointer-events-none"
        />
        <section className="relative z-10 pt-[90px]">
          {loadingRoomDetail ? (
            <RoomGallerySkeleton />
          ) : (
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[620px]">
                <div
                  className="lg:col-span-3 relative rounded-[30px] overflow-hidden
                              group cursor-pointer shadow-2xl"
                  onClick={() => {
                    setActiveIndex(0);
                    setOpenGallery(true);
                  }}
                >
                  <img
                    loading="lazy"
                    src={File_URL + roomv2?.images[0]?.url}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-10 left-10 text-white">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10  backdrop-blur-md border border-white/20 mb-4">
                      <span className="uppercase tracking-[4px] text-xs font-semibold">
                        {roomv2?.roomTypeName}
                      </span>
                    </div>
                    <h1 className="text-5xl font-black leading-tight mb-3">
                      {roomv2?.roomName}
                    </h1>
                  </div>
                  <p className="text-white/80 text-lg max-w-xl">
                    📍 {roomv2?.hotelAddress}
                  </p>
                </div>
              </div>
              <div className="lg:col-span-2 flex flex-col gap-4">
                {roomv2?.images.slice(1, 3).map((img, i) => {
                  const isLast = i === 1 && roomv2?.images.length > 3;
                  return (
                    <div
                      key={i}
                      className="relative flex-1 rounded-[28px] overflow-hidden group cursor-pointer
                        shadow-xl"
                      onClick={() => {
                        setActiveIndex(i + 1);
                        setOpenGallery(true);
                      }}
                    >
                      <img
                        loading="lazy"
                        src={File_URL + img.url}
                        className="w-full h-full object-cover group-hover:scale-110
                        transition duration-700"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-500" />
                      {isLast && (
                        <div
                          className="absolute inset-0 bg-black/55 backdrop-blur-sm flex flex-col items-center
                          justify-center text-white"
                        >
                          <h2 className="text-5xl font-black">
                            +{remainImages}
                          </h2>
                          <p className="uppercase tracking-[5px] text-xs mt-2">
                            {t("roomDetail.moreImages")}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
        <section className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[30px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-10 rounded-full bg-[#b38a58]" />
                    <h2 className="text-3xl font-black text-gray-900">
                      {t("roomDetail.overview")}
                    </h2>
                  </div>

                  <p className="text-gray-600 leading-[2] text-[15px]">
                    {roomv2?.note || t("roomDetail.noOverview")}
                  </p>
                </div>
                <div className="bg-white rounded-[30px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-10 rounded-full bg-[#b38a58]" />
                    <h2 className="text-3xl font-black text-gray-900">
                      {t("roomDetail.amenities")}
                    </h2>
                  </div>
                  {loadingRoomDetail ? (
                    <AmenitiesSkeleton />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {amenities.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-[#faf7f2] hover:bg-[#f3ece3] transition-all duration-300"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                            <img
                              loading="lazy"
                              src={File_URL + item.thumbnail?.url}
                              className="w-6 h-6 object-contain"
                            />
                          </div>

                          <span className="font-semibold text-gray-800">
                            {item.assetName}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-[30px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-10 rounded-full bg-[#b38a58]" />
                    <h2 className="text-3xl font-black text-gray-900">
                      {t("roomDetail.policies.title")}
                    </h2>
                  </div>
                  <div className="space-y-5">
                    {[
                      t("roomDetail.policies.infantsStay"),
                      t("roomDetail.policies.childrenStay"),
                      t("roomDetail.policies.guests7AsAdult"),
                      t("roomDetail.policies.extraBed"),
                      t("roomDetail.policies.moreThan5Rooms"),
                    ].map((policy, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 p-5 rounded-2xl bg-[#faf7f2]"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#b38a58] text-white flex items-center justify-center font-bold shrink-0">
                          {idx + 1}
                        </div>

                        <p className="text-gray-700 leading-relaxed">
                          {policy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="sticky top-[120px]">
                  {loadingRoomDetail ? (
                    <BookingBoxSkeleton />
                  ) : (
                    <div className="rounded-[35px] overflow-hidden bg-white/85 backdrop-blur-xl border border-white shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
                      <div className="bg-gradient-to-r from-[#b38a58] to-[#8f6b43] p-8 text-white">
                        <p className="uppercase tracking-[5px] text-xs text-white/70 mb-2">
                          {t("roomDetail.bookingSummary")}
                        </p>
                        <h2 className="text-4xl font-black">
                          {priceResult.total.toLocaleString()}đ
                        </h2>
                        <p className="text-white/70 mt-2">
                          {t("roomDetail.booking.totalCost")}
                        </p>
                      </div>
                      <div className="p-7 space-y-7">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-[#faf7f2] rounded-2xl p-5">
                            <div className="flex items-center gap-3 text-gray-600 mb-3">
                              <User size={18} className="text-[#b38a58]" />
                              <span>{t("roomDetail.booking.adult")}</span>
                            </div>

                            <h3 className="text-3xl font-black text-gray-900">
                              {adults}
                            </h3>
                          </div>
                          <div className="bg-[#faf7f2] rounded-2xl p-5">
                            <div className="flex items-center gap-3 text-gray-600 mb-3">
                              <Baby size={18} className="text-[#b38a58]" />
                              <span>{t("roomDetail.booking.children")}</span>
                            </div>

                            <h3 className="text-3xl font-black text-gray-900">
                              {children}
                            </h3>
                          </div>
                        </div>
                        <div className="rounded-3xl overflow-hidden border border-gray-100">
                          <div className="grid grid-cols-2">
                            <div className="p-5 bg-[#faf7f2]">
                              <p className="text-xs uppercase tracking-[3px] text-gray-400 mb-2">
                                {t("roomDetail.booking.checkIn")}
                              </p>
                              <div className="flex items-center gap-2 font-bold">
                                <Calendar size={15} />
                                {formatDate(checkIn)}
                              </div>
                            </div>
                            <div className="p-5">
                              <p className="text-xs uppercase tracking-[3px] text-gray-400 mb-2">
                                {t("roomDetail.booking.checkOut")}
                              </p>

                              <div className="flex items-center gap-2 font-bold">
                                <Calendar size={15} />
                                {formatDate(checkOut)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="font-black text-xl text-gray-900">
                            {t("roomDetail.rentalType")}
                          </h3>
                          {[
                            {
                              key: "1",
                              label: t(
                                "roomDetail.booking.priceOptions.twoHours",
                              ),
                              price: roomv2?.hourlyBasePrice,
                            },
                            {
                              key: "2",
                              label: t(
                                "roomDetail.booking.priceOptions.overnight",
                              ),
                              price: roomv2?.overnightPrice,
                            },
                            {
                              key: "3",
                              label: t("roomDetail.booking.priceOptions.daily"),
                              price: roomv2?.defaultRate,
                            },
                          ].map((item) => {
                            const finalPrice = calculatePromotionPrice(
                              item.price || 0,
                            );
                            return (
                              <label
                                key={item.key}
                                className={`flex items-center justify-between rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300 ${
                                  PriceType === item.key
                                    ? "border-[#b38a58] bg-[#b38a58]/5 shadow-md"
                                    : "border-gray-100 hover:border-[#b38a58]/30"
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <input
                                    type="radio"
                                    checked={PriceType === item.key}
                                    onChange={() => {
                                      setPriceType(item.key as PriceType);
                                      setExtraHours(0);
                                    }}
                                    className="w-5 h-5 accent-[#b38a58]"
                                  />

                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      {item.label}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="font-black text-xl text-[#b38a58]">
                                    {finalPrice.toLocaleString()}đ
                                  </span>

                                  {/* OLD PRICE */}
                                  {promotion && (
                                    <span className="text-sm text-gray-400 line-through">
                                      {item.price?.toLocaleString()}đ
                                    </span>
                                  )}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                        <div
                          className={`rounded-2xl p-5 transition-all ${
                            PriceType !== "1"
                              ? "bg-gray-100 opacity-50 pointer-events-none"
                              : "bg-[#faf7f2]"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold text-gray-900">
                                {t("roomDetail.booking.extraHours")}
                              </p>
                              <p className="text-sm text-[#b38a58] mt-1">
                                +
                                {roomv2?.hourlyAdditionalPrice?.toLocaleString()}
                                đ / {t("roomDetail.booking.hour")}
                              </p>
                            </div>
                            <div
                              className="flex items-center gap-3 bg-white rounded-full
                            p-2 shadow-sm"
                            >
                              <button
                                onClick={() =>
                                  setExtraHours(Math.max(0, extraHours - 1))
                                }
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                              >
                                <Minus size={15} />
                              </button>
                              <span className="font-black w-5 text-center">
                                {extraHours}
                              </span>
                              <button
                                onClick={() => setExtraHours(extraHours + 1)}
                                className="w-8 h-8 rounded-full bg-[#b38a58] text-white flex items-center justify-center"
                              >
                                <Plus size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 border-t border-gray-100 pt-5">
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>
                              {nights} {t("roomDetail.booking.night")}
                            </span>
                            <div className="flex flex-col items-end">
                              <span>{priceResult.base.toLocaleString()}đ</span>
                              {promotion && PriceType === "3" && (
                                <span className="text-xs text-gray-400 line-through">
                                  {(
                                    (roomv2?.defaultRate || 0) *
                                    Math.max(1, nights)
                                  ).toLocaleString()}
                                  đ
                                </span>
                              )}
                              {promotion && PriceType === "2" && (
                                <span className="text-xs text-gray-400 line-through">
                                  {roomv2?.overnightPrice?.toLocaleString()}đ
                                </span>
                              )}
                              {promotion && PriceType === "1" && (
                                <span className="text-xs text-gray-400 line-through">
                                  {(
                                    (roomv2?.hourlyBasePrice || 0) +
                                    extraHours *
                                      (roomv2?.hourlyAdditionalPrice || 0)
                                  ).toLocaleString()}
                                  đ
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-lg font-bold text-gray-900">
                              {t("roomDetail.booking.totalCost")}
                            </span>

                            <span className="text-3xl font-black text-[#b38a58]">
                              {priceResult.total.toLocaleString()}đ
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleBooking}
                          className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#b38a58] to-[#8f6b43] text-white text-lg font-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl"
                        >
                          {t("roomDetail.booking.button")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative z-10 py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="overflow-hidden rounded-[35px] shadow-2xl">
              <iframe
                className="w-full h-[400px] border-0"
                loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  roomv2?.hotelAddress || "",
                )}&output=embed`}
              />
            </div>
          </div>
        </section>
        <section className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="uppercase tracking-[4px] text-[#b38a58] text-sm font-bold mb-2">
                  Recommendation
                </p>

                <h2 className="text-4xl font-black text-gray-900">
                  {t("roomDetail.rooms")}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {loadingRooms
                ? Array.from({ length: 4 }).map((_, i) => (
                    <RoomCardSkeleton key={i} />
                  ))
                : otherRooms
                    .slice(0, 4)
                    .map((room) => (
                      <RoomCard
                        key={room.id}
                        id={room.id}
                        title={room.roomName}
                        roomTypeName={room.roomTypeName}
                        price={room.defaultRate}
                        image={room.images?.[0]?.url}
                        size={room.area}
                        guests={room.capacity}
                      
                        bed={t("roomDetail.booking.doubleBed")}
                        description={room.note}
                      />
                    ))}
            </div>
          </div>
        </section>
        {openGallery && (
          <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center">
            {/* CLOSE */}
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition"
              onClick={() => setOpenGallery(false)}
            >
              ✕
            </button>

            <div className="w-full max-w-7xl px-6 flex flex-col items-center">
              {/* MAIN */}
              <div className="h-[75vh] flex items-center justify-center mb-8">
                <img
                  loading="lazy"
                  src={File_URL + roomv2?.images?.[activeIndex]?.url}
                  className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                />
              </div>

              {/* THUMB */}
              <div className="flex gap-4 overflow-x-auto pb-3">
                {roomv2?.images.map((img, i) => (
                  <img
                    key={i}
                    loading="lazy"
                    src={File_URL + img.url}
                    onClick={() => setActiveIndex(i)}
                    className={`h-24 w-36 rounded-2xl object-cover cursor-pointer transition-all duration-300 ${
                      i === activeIndex
                        ? "ring-4 ring-white scale-105 opacity-100"
                        : "opacity-40 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default RoomDetailPage;
