import { useState } from "react";
import TimePicker from "./TimePicker";
import ScheduleCalendar from "../ui/ScheduleCalendar";
import BookingPackage from "./BookingPackage";
import BookingSummarySchedule from "./BookingSummarySchedule";

const ScheduleTab = () => {
  const [checkIn, setCheckIn] = useState("15:00");
  const [checkOut, setCheckOut] = useState("10:00");
  const [selectedPackage, setSelectedPackage] = useState("2h");
  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-8">
        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold text-on-surface">
            Select Your Stay
          </h2>
          <p className="text-gray-500 text-sm">
            Choose the dates and times for your reservation.
          </p>
        </div>

        <ScheduleCalendar />
        <BookingPackage value={selectedPackage} onChange={setSelectedPackage} />
        {/* TIME PICKER */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Check-in */}
          <TimePicker
            title="Check-in Time"
            value={checkIn}
            onChange={setCheckIn}
          />

          {/* Check-out */}
          <TimePicker
            title="Check-out Time"
            value={checkOut}
            onChange={setCheckOut}
          />
        </div>
      </div>
          <BookingSummarySchedule />
    </div>
  );
};

export default ScheduleTab;
