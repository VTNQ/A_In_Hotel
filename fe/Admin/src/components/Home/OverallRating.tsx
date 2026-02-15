import { useEffect, useState } from "react";
import type { RatingData } from "../../type/Statistics.types";
import { MoreHorizontal } from "lucide-react";

const OverallRating = ({ data }: { data: RatingData }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 200); // delay nhẹ cho đẹp

    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { label: "Facilities", value: data.facilities },
    { label: "Cleanliness", value: data.cleanliness },
    { label: "Services", value: data.services },
    { label: "Comfort", value: data.comfort },
    { label: "Location", value: data.location },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Overall rating
        </h3>
        <MoreHorizontal className="text-gray-400" size={18} />
      </div>

      {/* Average */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#CAD2E7] text-black px-4 py-2 rounded-xl text-2xl font-semibold">
          {data.average}
          <span className="text-gray-500 text-base font-medium">/5</span>
        </div>

        <span className="text-[#707070] text-sm font-semibold">
          {data.totalReviews} reviewer
        </span>
      </div>

      {/* Categories */}
      <div className="space-y-5">
        {categories.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-[#707070] text-sm font-semibold">
                {item.label}
              </span>
              <span className="text-[#707070] text-sm font-semibold">
                {item.value}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#32416B] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#EEF0F7] h-2 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animate
                    ? `${(item.value / 5) * 100}%`
                    : "0%",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverallRating;