import { MapPin, ShieldCheck } from "lucide-react";
import { useBookingSearch } from "../../context/booking/BookingSearchContext";
import { useEffect, useState } from "react";
import { getRoomById } from "../../service/api/Room";
import { formatBookingDateRange } from "../../util/formatDate";
import { useTranslation } from "react-i18next";
const BookingSummarySchedule = ({ data,nights }: any) => {
  const { t } = useTranslation();
  const { search } = useBookingSearch();
  const [room, setRoom] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search?.roomId) return; // ✅ tránh gọi API sai

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRoomById(search.roomId || 0);
        setRoom(response?.data?.data || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search?.roomId]);
  if (loading) {
    return (
      <aside className="lg:col-span-5">
        <div className="bg-white border rounded-xl p-6 animate-pulse">
          <div className="h-40 bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 w-1/2 mb-2" />
          <div className="h-4 bg-gray-200 w-1/3" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="lg:col-span-5">
      <div className=" top-24 space-y-6">
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
          <div className="h-48 w-full relative">
            <img
              src={`${room?.images[0]?.url || "https://lh3.googleusercontent.com/aida-public/AB6AXuD2iBSVkCjjNe6zg2pIvfZ5bhBQxGR6uTNnExcDlgnb5P1gv7xNQgYHBX87pZTHPLdAVBfisRCLCKbCnoskRQRGbbqhtBKImJdgq-UJA3YUVQmzhxqRGYakQFewUdjDqpE_NiOTK33ZnBINAAnBDgRNRn3UeFAK-CNe6Zg77uU5uUWMIxNNF37UiVAgLPIamIr5l6Vm3uyaCMAgGxAE0HKrvZUp6AF32JKZfOuONBdHjphPX19yqc6E7gnCn99CxPuQFH5sXV4Vl7FV"}`}
              alt="Room"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-[rgb(249,246,242)] text-[rgb(24,28,32)] font-medium px-3 py-1 rounded-full text-xs shadow">
              {t("booking.staySummary.selected")}
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-on-surface">
                     {room?.roomName || t("booking.staySummary.loading")}
              </h3>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <MapPin size={16} />
                <span>{t("booking.staySummary.floorInfo")}</span>
              </div>
            </div>
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[rgb(87,95,103)] text-[14px] line-clamp-1 font-normal font-sans">
                  {t("booking.staySummary.dates")}
                </span>
                <span className="font-sans font-semibold text-[rgb(24,28,32)] text-[14px] line-clamp-1">
                  {formatBookingDateRange(
                    data?.checkInDate,
                    data?.checkOutDate,
                    nights,
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[rgb(87,95,103)] text-[14px] line-clamp-1 font-normal font-sans">
                  {t("booking.staySummary.guests")}
                </span>
                <span className="font-sans font-semibold text-[rgb(24,28,32)] text-[14px] line-clamp-1">
                  {search?.adults} {t("booking.staySummary.adults")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[rgb(87,95,103)] text-[14px] line-clamp-1 font-normal font-sans">
                  {t("booking.staySummary.duration")}
                </span>
                <span className="font-sans font-semibold text-[rgb(24,28,32)] text-[14px] line-clamp-1">
                  {nights} {t("booking.staySummary.nights")}
                </span>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[rgb(87,95,103)] text-[14px] line-clamp-1 font-normal font-sans">
                    {t("booking.staySummary.roomRate")}
                  </span>
                  <span className="font-sans font-semibold text-[rgb(24,28,32)] text-[14px] line-clamp-1">
                    {search?.totalPrice?.toLocaleString()} {t("common.vnd")}
                  </span>
                </div>

                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>{t("booking.staySummary.total")}</span>
                  <span className="text-lg">
                    {((search?.totalPrice || 0) * nights).toLocaleString()} {t("common.vnd")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-outline-variant rounded-xl p-4 flex gap-3">
          <ShieldCheck size={20} />
          <div>
            <p className="text-xs font-semibold uppercase">
              {t("booking.staySummary.bestPriceTitle")}
            </p>
            <p className="text-sm text-gray-500">
              {t("booking.staySummary.bestPriceDesc")}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default BookingSummarySchedule;
