import React from "react";

type Stat = { value: string | number; label: string };
type Props = {
  eyebrow?: string;
  title?: string;
  description?: React.ReactNode;
  stats?: Stat[];
  onCapacityChartClick?: () => void;
  onFloorPlansClick?: () => void;
  onEquipmentClick?: () => void;
};

export default function EventSummary({
  eyebrow = "5 STAR MEETING AND EVENT VENUE IN SAIGON",
  title = "Events",
  description = (
    <>
      Be a successful host for your corporate meetings or an intimate gathering for a special
      occasion in downtown Ho Chi Minh City. For over 20 years, offering refined and bespoke meeting
      experiences, Sheraton... <a href="#" className="underline">See More</a>
    </>
  ),
  stats = [
    { value: 15, label: "Event Rooms" },
    { value: "1496 SQ MT", label: "Total Event Space" },
    { value: 1200, label: "Capacity Largest Space" },
    { value: 17, label: "Breakout Rooms" },
  ],
  onCapacityChartClick,
  onFloorPlansClick,
  onEquipmentClick,
}: Props) {
  return (
    <section className="">
      {/* Top intro band */}
      <div className="bg-[#eee7e0]">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <div className="text-[12px] tracking-[0.19em] text-gray-700">
            {eyebrow}
          </div>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{title}</h2>
          <p className="mx-auto mt-6 max-w-4xl text-lg leading-7 text-gray-800">
            {description}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-y-12 py-14 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-6 h-0.5 w-20 bg-purple-500/70"></div>
              <div className="font-serif text-4xl sm:text-5xl">{s.value}</div>
              <div className="mt-3 text-sm text-gray-700">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Links row */}
        <div className="pb-10 text-center">
          <button
            onClick={onCapacityChartClick}
            className="underline underline-offset-4 hover:text-purple-700"
          >
            Capacity Chart
          </button>
          <span className="px-4 text-gray-400">|</span>
          <button
            onClick={onFloorPlansClick}
            className="underline underline-offset-4 hover:text-purple-700"
          >
            Floor Plans
          </button>
          <span className="px-4 text-gray-400">|</span>
          <button
            onClick={onEquipmentClick}
            className="underline underline-offset-4 hover:text-purple-700"
          >
            Equipment and Services
          </button>
        </div>
      </div>
    </section>
  );
}
