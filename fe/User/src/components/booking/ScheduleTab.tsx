import { useEffect, useMemo } from "react";
import TimePicker from "./TimePicker";
import ScheduleCalendar from "../ui/ScheduleCalendar";
import BookingPackage from "./BookingPackage";
import BookingSummarySchedule from "./BookingSummarySchedule";
import { TIME_MAP } from "../../type/booking.types";

const ScheduleTab = ({ data,onChange }: any) => {
  const nights = useMemo(() => {
    if (!data.checkInDate || !data.checkOutDate) return 0;
    const start = new Date(data.checkInDate);
    const end = new Date(data.checkOutDate);
    return Math.max(
      0,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
  }, [data.checkInDate, data.checkOutDate]);

  const isAutoTimePackage = ["2", "3"].includes(data.package);
  // 👉 auto set time theo package
  useEffect(() => {
    if (!isAutoTimePackage) return;

    const time = TIME_MAP[data.package];
  
    if (!time) return;

    onChange((prev: any) => ({
      ...prev,
      checkInTime: time.checkIn,
      checkOutTime: time.checkOut,
    }));
  }, [data.package]);
 
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

        <ScheduleCalendar
          checkInDate={data.checkInDate}
          checkOutDate={data.checkOutDate}
          onSelectDate={(date: Date) => {
            if (!data.checkInDate || (data.checkInDate && data.checkOutDate)) {
              // chọn lại từ đầu
              onChange((prev: any) => ({
                ...prev,
                checkInDate: date.toISOString(),
                checkOutDate: "",
              }));
            } else {
              // chọn check-out
              if (date > new Date(data.checkInDate)) {
                onChange((prev: any) => ({
                  ...prev,
                  checkOutDate: date.toISOString(),
                }));
              } else {
                // nếu chọn ngày trước → reset
                onChange((prev: any) => ({
                  ...prev,
                  checkInDate: date.toISOString(),
                  checkOutDate: "",
                }));
              }
            }
          }}
        />
        <BookingPackage
          form={data}
          nights={nights}
          onChange={(key: any, value: any) =>
            onChange((p: any) => ({ ...p, [key]: value }))
          }
        />
        {/* TIME PICKER */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Check-in */}
          <TimePicker
            title="Check-in Time"
            value={data.checkInTime}
            onChange={(t: string) =>
              onChange((prev: any) => ({
                ...prev,
                checkInTime: t,
              }))
            }
            form={data}
          />

          {/* Check-out */}
          <TimePicker
            title="Check-out Time"
            value={data.checkOutTime}
            onChange={(t: string) =>
              onChange((prev: any) => ({
                ...prev,
                checkOutTime: t,
              }))
            }
            form={data}
          />
        </div>
      </div>
      <BookingSummarySchedule data={data}  nights={nights}/>
    </div>
  );
};

export default ScheduleTab;
