import { useBookingSearch } from "../../context/booking/BookingSearchContext";
import { estimateServicePrice } from "../../util/estimateServicePrice";

const BookingServiceCard = ({ service, selected, onToggle }: any) => {
  const { search } = useBookingSearch();
  const estimate = estimateServicePrice(service, search?.totalPrice || 0);
  return (
    <>
      <div
        className="bg-white border border-[#dee2e6] rounded-xl overflow-hidden flex flex-col
            md:flex-row group transition-all hover:border-[rgb(0,89,187)]/30"
      >
        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={service?.icon?.url || "https://via.placeholder.com/300"}
            alt={service?.icon?.altText}
          />
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-sans text-[rgb(24,28,32)]">
                {service?.serviceName}
              </h3>
              <span className="font-sans text-[rgb(0,89,187)]">
                {service.extraCharge?.toLocaleString()}%
              </span>
            </div>
            <p className="text-[14px] line-clamp-1 font-normal  text-[rgb(87,95,103)] mb-4">
              {service?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span
              className="text-[12px] line-clamp-1 font-medium font-sans italic"
              style={{ letterSpacing: "0.02em" }}
            >
              Ước tính: {estimate.toFixed(2)}
            </span>
            <button
              onClick={onToggle}
              className={`px-6 py-2 rounded-lg font-sans transition-colors flex items-center gap-2
    ${
      selected
        ? "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed"
        : "border border-[rgb(0,89,187)] text-[rgb(0,89,187)] hover:bg-[rgb(0,89,187)]/5"
    }
  `}
            >
              {selected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}

              {selected ? "Đã thêm" : "Chọn dịch vụ"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default BookingServiceCard;
