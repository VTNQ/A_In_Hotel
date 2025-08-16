import  { useState } from "react";

const amenities = [
  { icon: "♻️", label: "Sustainability" },
  { icon: "🍽️", label: "Restaurant On-Site" },
  { icon: "🛁", label: "Spa" },
  { icon: "🏋️", label: "Fitness Center" },
  { icon: "🧺", label: "On-Site Laundry" },
  { icon: "🎧", label: "Club Lounge" },
  { icon: "📍", label: "Meeting Space" },
];

const tabs = ["Spa", "Fitness", "Swimming"];

const FeaturedAmenities = () => {
  const [activeTab, setActiveTab] = useState("Spa");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Featured Amenities On-Site
      </h2>

      <div className="flex justify-center space-x-6 text-sm mb-6">
        {["Property Amenities", "Room Amenities", "Hotel Services", "Activities", "View All"].map((tab, idx) => (
          <button key={idx} className={`hover:underline ${idx === 0 ? "font-bold text-black" : "text-gray-500"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm text-center mb-10">
        {amenities.map((a, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-1 text-gray-700">
            <div className="text-xl">{a.icon}</div>
            <div>{a.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-center text-lg font-medium mb-4">More Ways to Enjoy Your Stay</h3>

        <div className="flex justify-center space-x-6 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm ${activeTab === tab ? "font-bold text-purple-700 underline" : "text-gray-500"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Spa" && (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">
            <img
              src="https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-evolve-wellness-15070-62412:Wide-Hor?wid=1318&fit=constrain"
              alt="Evolve Wellness Center"
              className="w-full h-auto object-cover"
            />
            <div className="p-6 space-y-4">
              <h4 className="text-xs tracking-widest text-gray-400">SPA</h4>
              <h3 className="text-xl font-semibold text-gray-800">Evolve Wellness Center</h3>
              <p className="text-sm text-gray-600">
                Perched on the 23rd floor of the Sheraton Saigon Grand Opera Hotel, Evolve Wellness Center offers a sanctuary for discerning guests seeking a holistic wellness experience.
              </p>
              <div className="flex space-x-4">
                <button className="bg-gray-800 text-white text-sm px-4 py-2 rounded-full">Book Now</button>
                <button className="text-purple-600 text-sm">Learn More →</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedAmenities;
