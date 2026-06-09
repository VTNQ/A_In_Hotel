import { useEffect, useMemo, useState } from "react";
import { useBookingSearch } from "../../context/booking/BookingSearchContext";
import BookingServiceCard from "./BookingServiceCard";
import BookingSummaryService from "./BookingSummaryService";
import { getExtraService } from "../../service/api/ExtraService";
import ServiceBookingSkeleton from "../ui/ServiceBookingSkeleton";
import { useTranslation } from "react-i18next";

const BookingServiceStep = ({ data, onChange,booking }: any) => {
  const { t } = useTranslation();
  const { search } = useBookingSearch();
  const [services, setServices] = useState<any[]>([]);
  
    const nights = useMemo(() => {
      if (!booking.checkInDate || !booking.checkOutDate) return 0;
      const start = new Date(booking.checkInDate);
      const end = new Date(booking.checkOutDate);
      return Math.max(
        0,
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
      );
    }, [booking.checkInDate, booking.checkOutDate]);
  
  const [loading, setLoading] = useState(false);
  const handleToggle = (service: any) => {
    onChange((prev: any) => {
      const exists = prev.find((s: any) => s.id === service.id);

      if (exists) {
        return prev.filter((s: any) => s.id !== service.id); // remove
      }

      return [...prev, service]; // add
    });
  };
  useEffect(() => {
    if (!search?.hotelId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        let filters = [
          `hotelId==${search.hotelId}`,
          `extraCharge>0`,
          `isActive==true`,
          `type==2`,
        ];

        const serviceResp = await getExtraService({
          all: true,
          filter: filters.join(";"),
        });
        setServices(serviceResp.data?.content || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search?.hotelId]);
  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-on-surface">
            {t("booking.services.title")}
          </h2>
          <p className="text-gray-500 text-sm">
            {t("booking.services.subtitle")}
          </p>
        </div>
        <div className="space-y-4">
          {loading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <ServiceBookingSkeleton key={i} />
              ))}
            </>
          ) : services.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              {t("booking.services.noServices")}
            </div>
          ) : (
            services.map((service) => {
              const isSelected = data.some((s: any) => s.id === service.id);

              return (
                <BookingServiceCard
                  key={service.id}
                  service={service}
                  selected={isSelected}
                  onToggle={() => handleToggle(service)}
                />
              );
            })
          )}
        </div>
      </div>
      <BookingSummaryService nights={nights} data={booking} services={data} />
    </div>
  );
};
export default BookingServiceStep;
