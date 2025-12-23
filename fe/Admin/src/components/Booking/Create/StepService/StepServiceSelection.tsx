import { useEffect, useState } from "react";
import ServiceTabs from "./ServiceTabs";
import ServiceCard from "./ServiceCard";
import BookingSummary from "./BookingSumary";
import { getAll } from "../../../../service/api/ExtraService";
import { getTokens } from "../../../../util/auth";
import { getAllCategory } from "../../../../service/api/Category";
import { estimateServicePrice } from "../../../../util/estimateServicePrice";


const StepServiceSelection = ({
  booking,
  onBack,
  onNext,
}: any) => {
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const getCategories = async () => {
    try {
      const response = await getAllCategory({
        all: true,
        filter: "isActive==true and type==2"
      });
      setCategories(response?.content || [])
    } catch (err) {
      console.log(err)
    }
  }
  const fetchData = async () => {
    try {
      let filters: string[] = [];
      filters.push(`hotelId==${getTokens()?.hotelId}`);
      filters.push(`price>0`);
      filters.push(`isActive==true`);
      if (category) {
        filters.push(`category.id==${category}`)
      }
      const filterQuery = filters.join(" and ");
      const response = await getAll({
        all: true,
        ...(filterQuery ? { filter: filterQuery } : {}),
      });
      setServices(response.data?.content || [])
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {

    fetchData();
    getCategories();
  }, [])

  const toggleService = (service: any) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) return prev.filter((s) => s.id !== service.id);
      return [...prev, service];
    });
  };
  useEffect(() => {
    const timer = setTimeout(async () => {
      fetchData();
      getCategories();
    }, 400)
    return () => clearTimeout(timer);
  }, [category])


  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Enhance Your Stay</h2>
        <p className="text-sm text-gray-500 mt-1">
          Customize your experience with our exclusive add-ons and packages.
        </p>
      </div>

      {/* TABS */}
      <ServiceTabs value={category} onChange={setCategory} categories={categories} />

      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* LEFT */}
        <div className="col-span-2 space-y-4">
          {services.map((service: any) => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={selectedServices.some(
                (s) => s.id === service.id
              )}
              onToggle={() => toggleService(service)}
              booking={booking}
            />
          ))}
        </div>

        {/* RIGHT */}
        <BookingSummary
          booking={booking}
          services={selectedServices}
          onBack={onBack}
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
  );
};

export default StepServiceSelection;
