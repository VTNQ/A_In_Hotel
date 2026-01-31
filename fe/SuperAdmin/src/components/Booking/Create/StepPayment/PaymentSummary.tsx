import { useTranslation } from "react-i18next";
import { File_URL } from "../../../../setting/constant/app";
import { useEffect, useState } from "react";
import { getHotelById } from "../../../../service/api/Hotel";

const PaymentSummary = ({ booking }: any) => {
  const rooms = booking.rooms || [];
  const services = booking.services || [];
  const [hotelInfo, setHotelInfo] = useState<{
    thumbnail?:string;
    name?:string;
    rating?:number;
    reviews?:number | string;
  } | null>(null);
  const { t } = useTranslation();
  const nights = booking.selectDate?.nights || 0;

  // Tổng tiền phòng (multi-room)
  const roomTotal = rooms.reduce(
    (sum: number, room: any) =>
      sum + Number(room.price || 0) * nights,
    0
  );

  // Tổng tiền dịch vụ (đã được FE tính sẵn)
  const servicesTotal = services.reduce(
    (sum: number, s: any) => sum + Number(s.price || 0),
    0
  );
  useEffect(()=>{
      const fetchData = async()=>{
     
        if(!booking?.hotelId) return;
        try{
          const res = await getHotelById(booking?.hotelId);
          setHotelInfo({
            thumbnail: res?.data?.thumbnail?.url,
            name:res?.data?.name
          });

        }catch(e){
          console.error("Fetch hotel failed",e)
        }
      }
      fetchData();
  },[])

  const totalEstimate =
    booking.totalEstimate ?? roomTotal + servicesTotal;


  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm sticky top-6 overflow-hidden">
      {/* ================= HOTEL HEADER ================= */}
      <div className="relative h-40">
        <img
          src={
            hotelInfo?.thumbnail
              ? File_URL + hotelInfo.thumbnail
              : "/default.webp"  }
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <h3 className="font-semibold text-lg text-white">
            {hotelInfo?.name || "Grand Hotel & Spa"}
          </h3>
          <p className="text-sm text-white/90">
            ⭐ {hotelInfo?.rating || 0.0} ({hotelInfo?.reviews || "0 reviews"})
          </p>
        </div>
      </div>

      {/* ================= CHECK-IN / CHECK-OUT ================= */}
      <div className="flex items-start px-5 py-4 text-sm">
        {/* CHECK-IN */}
        <div className="flex-[3] pr-4">
          <p className="text-gray-400 text-xs">{t("payment.summary.checkIn")}</p>
          <p className="font-medium text-gray-800">
            {booking.selectDate?.checkInLabel ||
              booking.selectDate?.checkInDate}
          </p>
          <p className="text-xs text-gray-400">
            {booking.selectDate?.checkInTime || "14:00"}
          </p>
        </div>

        {/* Divider */}
        <div className="self-stretch w-px bg-gray-300" />

        {/* CHECK-OUT */}
        <div className="flex-[2] pl-4">
          <p className="text-gray-400 text-xs">{t("payment.summary.checkOut")}</p>
          <p className="font-medium text-gray-800">
            {booking.selectDate?.checkOutLabel ||
              booking.selectDate?.checkOutDate}
          </p>
          <p className="text-xs text-gray-400">
            {booking.selectDate?.checkOutTime || "12:00"}
          </p>
        </div>
      </div>

      {/* ================= ROOMS ================= */}
      <div className="px-5 py-4 space-y-4">
        {rooms.map((room: any) => (
          <div key={room.id} className="flex gap-3">
            <img
              src={File_URL + room?.images?.[0]?.url}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {room.roomName}
              </p>
              <p className="text-sm text-gray-500">
                {t("payment.summary.guests", { count: booking.guest?.adults || 2 })}
                ·
                {t("payment.summary.nights", { count: nights })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PRICE BREAKDOWN ================= */}
      <div className="border-t border-gray-200 px-5 py-4 text-sm space-y-2">
        {/* ROOMS PRICE */}
        {rooms.map((room: any) => (
          <div key={room.id} className="flex justify-between">
            <span className="text-gray-600">
              {room.roomName} ({nights} nights)
            </span>
            <span className="font-medium">
              ${(Number(room.price) * nights).toFixed(2)}
            </span>
          </div>
        ))}

        {/* SERVICES */}
        {services.length > 0 && (
          <>
            <div className="h-px bg-gray-100 my-2" />
            {services.map((s: any) => (
              <div
                key={s.extraServiceId || s.id}
                className="flex justify-between"
              >
                <span className="text-gray-600">
                  {s.serviceName}
                </span>
                <span className="font-medium">
                  ${Number(s.price).toFixed(2)}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ================= TOTAL ================= */}
      <div className="border-t border-gray-200 px-5 py-4 flex justify-between items-center">
        <span className="font-semibold text-gray-900">
          {t("payment.summary.total")}
        </span>
        <span className="text-xl font-bold text-indigo-600">
          ${Number(totalEstimate).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default PaymentSummary;
