import { useEffect, useState } from "react";
import type { facilitiesResponse } from "../../type/facilities.types";
import { File_URL } from "../../setting/constant/app";
import { getFacilities } from "../../service/api/facilities";

export default function FacilitiesSection() {
  const [data, setData] = useState<facilitiesResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getFacilities();
      setData(response?.data.data || []);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="w-full bg-[#fcfaf8] py-12 px-4 sm:py-16 lg:py-20  text-center">
      {/* Title top */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-dmserif font-bold text-[#2b3a67] mb-8 sm:mb-12">
        Facilities & services
      </h2>

      {/* Box with border */}
      <div
        className="max-w-6xl mx-auto border sm:border-2 border-dashed 
      border-[#2b3a67]/60 rounded-2xl py-8 sm:py-12 px-4 sm:px-8"
      >
        {/* Facilities Grid */}
        {loading ? (
          <p className="text-gray-500">Loading facilities...</p>
        ) : (
          <div
            className="
          grid 
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4
          lg:grid-cols-5
          gap-y-8 
          sm:gap-y-10
          gap-x-6
          justify-items-center"
          >
            {data.map((item, index) => (
              <div
                key={index}
                className="
                  flex flex-col items-center
                  text-[#3A3125]
                  hover:text-[#b38a58]
                  transition-all duration-300
                  group
                "
              >
                {/* ICON */}
                {item.image?.url ? (
                  <img
                    src={File_URL + item.image.url}
                    alt={item.image.altText || item.name}
                    className="w-8 h-8 
                    sm:w-10 sm:h-10
                    object-contain
                    mb-3
                    group-hover:scale-110
                    transition-transform duration-300"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-gray-200" />
                )}

                {/* LABEL */}
                <p className="text-xs sm:text-sm font-medium tracking-wide">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom text */}
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-dmserif text-[#2b3a67] mt-10 sm:mt-14">
        Customer’s Testimonial
      </h3>
    </section>
  );
}
