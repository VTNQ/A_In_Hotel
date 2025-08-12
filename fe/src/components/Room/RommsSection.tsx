import React, { useState } from "react";
import RoomDetailsModal from "./RoomDetailsModal"; // chỉnh path nếu khác
import type { RoomDetailsData } from "../data/RoomDetailData";

// ==== Types + sample data ====
export interface Room {
  id: number;
  title: string;
  beds: string;
  accessible: boolean;
  image: string;       // thumbnail cho card
  images: string[];    // ảnh cho carousel modal
  description: string; // mô tả dài cho modal
}

const ROOMS: Room[] = [
  {
    id: 1,
    title: "Guest room",
    beds: "1 King",
    accessible: false,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
    ],
    description:
      "Guest room, 1 King, Mini fridge, 37sqm/398sqft, Living/sitting area, Complimentary Wi‑Fi, Coffee/tea maker.",
  },
  {
    id: 2,
    title: "Guest room",
    beds: "2 Twin",
    accessible: true,
    image: "https://images.unsplash.com/photo-1560185007-c5ca9d2ccee3?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560185007-c5ca9d2ccee3?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d51?q=80&w=1600&auto=format&fit=crop",
    ],
    description:
      "Guest room, 2 Twin, 35sqm/377sqft, Desk, City view, Complimentary Wi‑Fi, Coffee/tea maker.",
  },
];

// ==== Icons (dùng inline cho gọn) ====
interface IconProps extends React.SVGProps<SVGSVGElement> {}
const ExpandIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const InfoIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8h.01M11 12h2v4h-2z" strokeLinecap="round" />
  </svg>
);
const ChevronRight: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ==== Card ====
interface RoomCardProps {
  room: Room;
  onViewMore?: (room: Room) => void; // callback mở modal
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onViewMore }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
    <div className="relative aspect-[16/9]">
      <img src={room.image} alt={room.title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* top-right expand */}
      <button className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-md bg-black/60 text-white backdrop-blur transition hover:bg-black/70">
        <ExpandIcon className="h-4 w-4" />
      </button>

      {/* bottom content */}
      <div className="absolute inset-x-5 bottom-5 text-white">
        {room.accessible && (
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium ring-1 ring-inset ring-white/30 backdrop-blur">
            ACCESSIBLE OPTIONS
          </span>
        )}
        <h3 className="text-2xl font-semibold drop-shadow-sm">{room.title}</h3>
        <p className="mt-1 text-sm/6 text-white/90">{room.beds}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-3xl bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-100">
            View Rates
          </button>

          {/* bật modal với data phòng */}
          <button
            onClick={() => onViewMore?.(room)}
            className="rounded-3xl bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/40 backdrop-blur transition hover:bg-white/15"
          >
            <span className="mr-1">View More</span>
            <ChevronRight className="inline h-4 w-4 align-[-2px]" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ==== Section (list + modal) ====
const RoomsSection: React.FC = () => {
  const [tab, setTab] = useState<"all" | "accessible">("all");
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState<RoomDetailsData| null>(null);

  const filtered = ROOMS.filter((r) => (tab === "accessible" ? r.accessible : true));

  // map Room -> RoomDetailsData
  const toDetails = (r: Room): RoomDetailsData => ({
    name: r.title,
    headline: r.beds,
    description: r.description,
    images: r.images.length ? r.images : [r.image],
    ctaLabel: "View Rates",
    sections: [
      { title: "Room Overview", rows: [{ label: "", value: r.title }] },
      { title: "Special Benefits", rows: [{ label: "", value: "High‑speed Wi‑Fi" }] },
      { title: "Beds and Bedding", rows: [{ label: "Maximum occupancy", value: "2" }] },
      {
        title: "Room Features",
        rows: [{ label: "Area", value: r.beds.includes("King") ? "37sqm/398sqft" : "35sqm/377sqft" }],
      },
    ],
  });

  const handleViewMore = (room: Room) => {
    setModalData(toDetails(room));
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8">
      {/* tabs */}
      <div className="mb-6 flex items-center gap-8 border-b border-gray-200">
        {[
          { key: "all", label: "All Rooms" },
          { key: "accessible", label: "Accessible Rooms" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as "all" | "accessible")}
            className={`relative -mb-px pb-3 text-sm font-medium transition ${
              tab === t.key ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {t.label}
            {tab === t.key && <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-violet-500" />}
          </button>
        ))}
      </div>

      {/* notice */}
      <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50/70 p-4 text-sm text-violet-900">
        <div className="flex items-start gap-3">
          <InfoIcon className="mt-0.5 h-5 w-5" />
          <div className="flex-1">
            There may be a limited number of accessible rooms for each room type. Select an accessible room during the
            booking process.
            <button className="ml-2 inline-flex items-center gap-1 font-medium text-violet-900 underline underline-offset-2 hover:no-underline">
              View Rates For Availability <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filtered.map((r) => (
          <RoomCard key={r.id} room={r} onViewMore={handleViewMore} />
        ))}
      </div>

      {/* modal */}
      {modalData && (
        <RoomDetailsModal open={open} onClose={() => setOpen(false)} data={modalData} />
      )}
    </div>
  );
};

export default RoomsSection;
