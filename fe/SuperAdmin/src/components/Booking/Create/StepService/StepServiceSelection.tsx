import { getAllCategories } from "@/service/api/Categories";
import { getAllFicilities } from "@/service/api/facilities";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ServiceFilter from "./ServiceFilter";
import ServiceCard from "./ServiceCard";
import BookingSummary from "./BookingSummary";
import { estimateServicePrice } from "@/util/estimateServicePrice";

const StepServiceSelection = ({ booking, onBack, onNext,onCancel }: any) => {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const { t } = useTranslation();
  console.log(booking)
  useEffect(() => {
    
    if (!booking?.hotelId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        let filters = [
          `hotelId==${booking?.hotelId}`,
          `price>0`,
          `isActive==true`,
          `type==2`,
        ];
        if (category) {
          filters.push(`category.id==${category}`);
        }
        const [categoryResp, serviceResp] = await Promise.all([
          getAllCategories({
            all: true,
            filter: "isActive==true and type==2",
          }),
          getAllFicilities({
            all: true,
            filter: filters.join(" and "),
            searchValue: search,
          }),
        ]);

        setCategories(categoryResp?.content || []);
        setServices(serviceResp.data?.content || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [booking?.hotelId, search, category]);
  const toggleService = (service: any) => {
    setSelectedServices((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service],
    );
  };
  const ServiceSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-28 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );
  return (
    <div className=" min-h-screen p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          {" "}
          {t("serviceSelection.title")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("serviceSelection.subtitle")}
        </p>
      </div>
      <ServiceFilter
        value={category}
        categories={categories}
        disabled={loading}
        onChange={setCategory}
        search={search}
        onSearch={setSearch}
      />
      <div className="grid grid-cols-1  sm:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
             <ServiceSkeleton />
          ): services.length === 0 ? (
             <p className="text-gray-500">{t("serviceSelection.noServices")}</p>
          ):(
            services.map((service)=>(
              <ServiceCard
              key={service.id}
                service={service}
                booking={booking}
                selected={selectedServices.some((s) => s.id === service.id)}
                onToggle={() => toggleService(service)}
              />
            ))
          )}
        </div>
          <BookingSummary
          booking={booking}
          services={selectedServices}
          onNext={() =>
            onNext({
              services: selectedServices.map((s) => ({
                extraServiceId: s.id,
                unit: s.unit,
                price: estimateServicePrice(s, booking),
                serviceName: s.serviceName ?? s.name,
              })),
            })
          }
        />
      </div>
       <div className="flex justify-between items-center pt-5">
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
export default StepServiceSelection;
