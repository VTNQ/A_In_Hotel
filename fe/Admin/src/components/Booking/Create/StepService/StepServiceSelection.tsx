import { useEffect, useState } from "react";
import ServiceTabs from "./ServiceTabs";
import ServiceCard from "./ServiceCard";
import BookingSummary from "./BookingSumary";

import { getAll } from "../../../../service/api/ExtraService";
import { getAllCategory } from "../../../../service/api/Category";
import { getTokens } from "../../../../util/auth";
import { estimateServicePrice } from "../../../../util/estimateServicePrice";
import { useTranslation } from "react-i18next";

const StepServiceSelection = ({ booking, onBack, onNext, onCancel }: any) => {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const hotelId = getTokens()?.hotelId;
  useEffect(() => {
    if (!hotelId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        let filters = [
          `hotelId==${hotelId}`,
          `price>0`,
          `isActive==true`,
          `type==2`,
        ];

        if (category) {
          filters.push(`category.id==${category}`);
        }

        const [categoryResp, serviceResp] = await Promise.all([
          getAllCategory({
            all: true,
            filter: "isActive==true and type==2",
          }),
          getAll({
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
  }, [hotelId, category, search]);

  /* ===================== SELECT SERVICE ===================== */
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
    <div className="bg-gray-50 min-h-screen px-3 sm:px-6 py-4 sm:py-6">
      {/* HEADER */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">
          {" "}
          {t("serviceSelection.title")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("serviceSelection.subtitle")}
        </p>
      </div>

      {/* TABS */}
      <ServiceTabs
        value={category}
        categories={categories}
        disabled={loading}
        onChange={setCategory}
        search={search}
        onSearch={setSearch}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <ServiceSkeleton />
          ) : services.length === 0 ? (
            <p className="text-gray-500">{t("serviceSelection.noServices")}</p>
          ) : (
            services.map((service) => (
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

        {/* RIGHT */}
        <div className="lg:sticky lg:top-6 h-fit">
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
      </div>
      <div className="mt-10 flex flex-col sm:flex-row sm:justify-between gap-4 ">
        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium
            text-red-600 border border-red-200 bg-red-50 hover:bg-red-100
            hover:border-red-300 transition"
        >
          {t("serviceSelection.cancel")}
        </button>

        <button
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2
          px-5 py-3 rounded-xl
          bg-gray-100
          text-sm font-medium text-gray-700
          hover:bg-gray-200 transition"
        >
          {t("serviceSelection.back")}
        </button>
      </div>
    </div>
  );
};

export default StepServiceSelection;
