import { getAllFacilities } from "../../service/api/facilities";
import { useEffect, useState } from "react";
import type { facilitiesResponse } from "../../type/facilities.types";
import { File_URL } from "../../setting/constant/app";

export default function FacilitiesSection() {
  const[data,setData]=useState<facilitiesResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchData =async()=>{
    try{
      setLoading(true)
        const response= await getAllFacilities({
          page:1,
          size:10,
          filter:"isActive==true and type==1 and price==0"
        });
        setData(response?.content || [])
    }catch(err:any){
      console.log(err)
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    fetchData();
  },[])
 

  return (
    <section className="w-full bg-[#fcfaf8] py-16 text-center">
      {/* Title top */}
      <h2 className="text-3xl md:text-4xl font-bold text-[#2b3a67] mb-10">
        Facilities & services
      </h2>

      {/* Box with border */}
      <div className="max-w-5xl mx-auto border-2 border-dashed border-[#2b3a67] rounded-2xl py-10 px-6 relative">
        {/* Facilities Grid */}
        {loading ? (
          <p className="text-gray-500">Loading facilities...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-10  justify-items-center">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-[#3A3125] hover:text-[#b38a58] transition-colors duration-300"
              >
                {/* ICON */}
                {item.icon?.url ? (
                  <img
                    src={File_URL + item.icon.url}
                    alt={item.icon.altText || item.serviceName}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-gray-200" />
                )}

                {/* LABEL */}
                <p className="text-sm font-montserrat font-medium">
                  {item.serviceName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom text */}
      <h3 className="text-2xl md:text-3xl font-bold text-[#2b3a67] mt-12">
        Customer’s TestimonialL
      </h3>
    </section>
  );
}
