import { CalendarDays, Phone, MapPin } from "lucide-react";

export default function HotelBookingHeader() {
  return (
    <div className="w-full bg-white p-4 shadow-md">
      {/* Hotel Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              Sheraton Saigon Grand Opera Hotel
            </h1>

            <div className="flex items-center space-x-1 mr-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-purple-600 rounded-full" />
              ))}
              <div className="w-3 h-3 border-2 border-purple-600 rounded-full" />
            </div>

            <span className="text-sm text-gray-600">
              4.4 •{" "}
              <a href="#" className="underline">
                1087 Reviews
              </a>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <a href="#" className="flex items-center text-purple-700 hover:underline">
            <MapPin className="w-4 h-4 mr-1" /> VIEW MAP
          </a>
          <a
            href="tel:+842838272828"
            className="flex items-center text-purple-700 hover:underline"
          >
            <Phone className="w-4 h-4 mr-1" /> +84 28-3827 2828
          </a>
        </div>
      </div>

      {/* Booking Details + CTA on same line */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 items-center">
        {/* Booking Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2 border p-3 rounded-lg">
            <CalendarDays className="w-4 h-4 text-gray-600" />
            <span className="font-semibold">DATES (1 NIGHT):</span>
            <span className="ml-auto">Tue, Jul 29 → Wed, Jul 30</span>
          </div>
          <div className="flex items-center justify-between border p-3 rounded-lg">
            <span className="font-semibold">ROOMS & GUESTS:</span>
            <span>1 Room, 1 Adult</span>
          </div>
          <div className="flex items-center justify-between border p-3 rounded-lg">
            <span className="font-semibold">SPECIAL RATES:</span>
            <span>Lowest Regular Rate</span>
          </div>
        </div>

        {/* View Rates Button */}
        <div className="flex justify-end">
          <button className="bg-[#5A4A42] text-white px-6 py-2 rounded-full hover:bg-[#40332e] transition">
            View Rates
          </button>
        </div>
      </div>
    </div>
  );
}
