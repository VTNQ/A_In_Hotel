"use client";
import {
  Bath,
  BedDouble,
  Tv,
  Wifi,
  Coffee,
  ParkingCircle,
  Bike,
  Beer,
  Wind,
  ConciergeBell,
} from "lucide-react";

export default function FacilitiesSection() {
  const facilities = [
    { icon: <BedDouble className="w-8 h-8" />, label: "Evening turndown service" },
    { icon: <Bath className="w-8 h-8" />, label: "Bathrooms with shower" },
    { icon: <Tv className="w-8 h-8" />, label: "Netflix" },
    { icon: <Wifi className="w-8 h-8" />, label: "Wifi free" },
    { icon: <ConciergeBell className="w-8 h-8" />, label: "22h room service" },
    { icon: <ParkingCircle className="w-8 h-8" />, label: "Parking free" },
    { icon: <Bike className="w-8 h-8" />, label: "Rent motorbike" },
    { icon: <Beer className="w-8 h-8" />, label: "Minibar drinks" },
    { icon: <Wind className="w-8 h-8" />, label: "Air conditioning" },
    { icon: <Coffee className="w-8 h-8" />, label: "Coffee and tea service" },
  ];

  return (
    <section className="w-full bg-[#fcfaf8] py-16 text-center">
      {/* Title top */}
      <h2 className="text-3xl md:text-4xl font-bold text-[#2b3a67] mb-10">
        Facilities & services
      </h2>

      {/* Box with border */}
      <div className="max-w-5xl mx-auto border-2 border-dashed border-[#2b3a67] rounded-2xl py-10 px-6 relative">
        {/* Facilities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-10 gap-x-8 justify-items-center">
          {facilities.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-[#3A3125] hover:text-[#b38a58] transition-colors duration-300"
            >
              {item.icon}
              <p className="text-sm mt-3 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom text */}
      <h3 className="text-2xl md:text-3xl font-bold text-[#2b3a67] mt-12">
        Customer’s TestimonialL
      </h3>
    </section>
  );
}
