import { Check } from "lucide-react";
import { BookingPackages } from "../../type/booking.types";

const BookingPackage = ({ value, onChange }: any) => {
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-6 space-y-4">
      <label className="text-xs uppercase tracking-[0.1em] text-gray-400 block">
        Booking Package
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BookingPackages.map((pkg) => {
          const Icon = pkg.icon;
          const isActive = value === pkg.id;
          return (
            <button
              key={pkg.id}
              onClick={() => onChange(pkg.id)}
              className={`flex flex-col items-start p-4 rounded-lg transition-all text-left
                        ${
                          isActive
                            ? "border-2 border-black bg-blue-50"
                            : "border border-outline-variant hover:border-black"
                        }`}
            >
              <div className="flex justify-between w-full mb-2">
                <Icon
                  size={20}
                  className={isActive ? "text-black" : "text-gray-400"}
                />
                <div
                  className={`w-5 h-5 flex items-center justify-center rounded-full transition-all
  ${isActive ? "bg-black text-white" : "bg-transparent text-transparent"}`}
                >
                  <Check size={12} />
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${isActive ? "text-black" : "text-gray-400"}`}
              >
                {pkg.title}
              </span>
              <span className="text-xs text-[rgb(87,95,103)] mt-1">{pkg.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default BookingPackage;
