import { ReceiptText, ShieldCheck } from "lucide-react";
import { useBookingSearch } from "../../context/booking/BookingSearchContext";
import { useEffect, useState } from "react";
import { getRoomById } from "../../service/api/Room";
import { formatBookingDateRange } from "../../util/formatDate";
import { estimateServicePrice } from "../../util/estimateServicePrice";

const BookingSummaryService = ({ data, nights, services }: any) => {
  const { search } = useBookingSearch();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await getRoomById(search?.roomId || 0);
        setRoom(response.data.data || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (search?.roomId) {
      fetchData();
    }
  }, [search?.roomId]);
  const servicesWithPrice = (services || []).map((s: any) => ({
    ...s,
    estimated: estimateServicePrice(s, search?.totalPrice || 0),
  }));

  const servicesTotal = servicesWithPrice.reduce(
    (sum: number, s: any) => sum + s.estimated,
    0,
  );
  const total = (search?.totalPrice || 0) + servicesTotal;
  if (loading) {
    return (
      <div className="lg:col-span-5 sticky top-24">
        <div className="bg-white border border-[#dee2e6] rounded-xl p-6 animate-pulse">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="lg:col-span-5 sticky top-24">
      <div className="bg-white border border-[#dee2e6] rounded-xl p-6">
        <h2 className="font-sans text-on-surface mb-6 flex items-center gap-2">
          <ReceiptText size={20} className="text-primary" />
          Booking Summary
        </h2>
        <div className="space-y-4 border-b border-outline-variant pb-6 mb-6">
          <div className="flex justify-between">
            <span className="text-[rgb(87,95,103)]">Loại phòng</span>
            <span className="font-bold">{room?.roomTypeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[rgb(87,95,103)]">Ngày lưu trú</span>
            <span className="font-bold">
              {" "}
              {formatBookingDateRange(
                data.checkInDate,
                data.checkOutDate,
                nights,
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[rgb(87,95,103)]">Số khách</span>
            <span className="font-bold">
              {search?.adults} Người lớn, {search?.children} Trẻ em
            </span>
          </div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-[14px] line-clamp-1 font-normal">
            <span className="text-[rgb(87,95,103)]">
              Tiền phòng ({nights} đêm)
            </span>
            <span>{search?.totalPrice}₫</span>
          </div>
          {services.map((service: any) => (
            <div
              key={service.id}
              className="flex justify-between items-center text-[14px] line-clamp-1 font-normal"
            >
              <span className="text-[rgb(87,95,103)]">
                {service.serviceName}
              </span>
              <span>{service.extraCharge?.toLocaleString()}%</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-[rgb(193,198,215)]">
          <span className="font-sans text-on-surface">Tổng tiền</span>
          <span className="text-[28px] line-clamp-1 font-semibold text-primary">
            {total.toLocaleString()}₫
          </span>
        </div>
      </div>
      <div className="bg-blue-50 border border-outline-variant rounded-xl p-4 flex gap-3 mt-4">
        <ShieldCheck size={20} />
        <div>
          <p className="text-xs font-semibold uppercase">
            Best Price Guaranteed
          </p>
          <p className="text-sm text-gray-500">
            No hidden fees or surprise charges at check-out.
          </p>
        </div>
      </div>
    </div>
  );
};
export default BookingSummaryService;
