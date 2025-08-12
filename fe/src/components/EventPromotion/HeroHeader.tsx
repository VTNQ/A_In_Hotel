import {
  Calendar,
  ChevronDown,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

type Props = {
  imageUrl?: string;
  hotelName?: string;
  reviewsCount?: number | string;
  phone?: string;
};

export default function HeroHeader({
  imageUrl = "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-sgnsi-grand-ballroom-13696:Feature-Hor?wid=1920&fit=constrain",
  hotelName = "Sheraton Saigon Grand Opera Hotel",
  reviewsCount = 1091,
  phone = "+84 28-3827 2828",
}: Props) {
  return (
    <section className="bg-white">
      {/* Top line: name, rating, reviews, map & phone */}
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
        <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold">{hotelName}</h1>

            {/* rating dots + score */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`mx-0.5 h-3 w-3 rounded-full ${
                      i < 4 ? "bg-purple-600" : "bg-purple-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-700">4.4</span>
              <a
                href="#reviews"
                className="text-sm underline hover:text-purple-700"
              >
                {reviewsCount} Reviews
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-5 text-sm">
            <a href="#map" className="flex items-center gap-1 hover:text-purple-700">
              <MapPin className="h-4 w-4" />
              <span>VIEW MAP</span>
            </a>
            <a href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 hover:text-purple-700">
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Booking/search bar */}
      <div className="border-y border-gray-200">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
          <div className="flex flex-col items-stretch gap-3 py-3 md:flex-row md:items-center md:gap-0">
            {/* Dates */}
            <button className="group flex flex-1 items-center justify-between gap-4 rounded-xl border border-transparent px-4 py-3 hover:border-gray-300 md:rounded-none md:border-0 md:border-r md:hover:border-r-gray-200">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Dates (1 Night)
                  </div>
                  <div className="text-sm">Tue, Aug 12 → Wed, Aug 13</div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </button>

            {/* Rooms & Guests */}
            <button className="group flex flex-1 items-center justify-between gap-4 rounded-xl border border-transparent px-4 py-3 hover:border-gray-300 md:rounded-none md:border-0 md:border-r md:hover:border-r-gray-200">
              <div className="flex items-center gap-3">
                <UserRound className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Rooms & Guests
                  </div>
                  <div className="text-sm">1 Room, 1 Adult</div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </button>

            {/* Special Rates */}
            <button className="group flex flex-1 items-center justify-between gap-4 rounded-xl border border-transparent px-4 py-3 hover:border-gray-300 md:rounded-none md:border-0 md:border-r md:hover:border-r-gray-200">
              <div className="text-left">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Special Rates
                </div>
                <div className="text-sm">Lowest Regular Rate</div>
              </div>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </button>

            {/* CTA */}
            <div className="flex items-center justify-end p-2 md:p-0">
              <button className="w-full rounded-full bg-gray-700 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 md:w-auto">
                View Rates
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-screen-2xl">
          <img
            src={imageUrl}
            alt="Grand ballroom"
            className="h-[360px] w-full object-cover sm:h-[460px]"
          />
        </div>
      </div>
    </section>
  );
}
