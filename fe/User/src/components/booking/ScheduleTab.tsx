import { useEffect, useMemo } from "react";
import TimePicker from "./TimePicker";
import ScheduleCalendar from "../ui/ScheduleCalendar";
import BookingPackage from "./BookingPackage";
import BookingSummarySchedule from "./BookingSummarySchedule";
import { useTranslation } from "react-i18next";
import { TIME_MAP } from "../../type/booking.types";
import { useForm } from "react-hook-form";

const ScheduleTab = ({ data, onChange }: any) => {
  const { t } = useTranslation();
  const { watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: data,
  });
  const form = watch();
  const nights = useMemo(() => {
    if (!form.checkInDate || !form.checkOutDate) return 0;
    const start = new Date(form.checkInDate);
    const end = new Date(form.checkOutDate);
    return Math.max(
      0,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
  }, [form.checkInDate, form.checkOutDate]);
  useEffect(() => {
    const isAutoTimePackage = ["2", "3"].includes(form.package);
    if (!isAutoTimePackage) return;
    const time = TIME_MAP[form.package];
    if (!time) return;
    setValue("checkInTime", time.checkIn);
    setValue("checkOutTime", time.checkOut);

    onChange((prev: any) => ({
      ...prev,
      checkInTime: time.checkIn,
      checkOutTime: time.checkOut,
    }));
  }, [form.package]);
  useEffect(() => {
    onChange(form);
  }, [form]);

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-8">
        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold text-on-surface">
            {t("booking.schedule.title")}
          </h2>
          <p className="text-gray-500 text-sm">
            {t("booking.schedule.subtitle")}
          </p>
        </div>

        <ScheduleCalendar
          checkInDate={form.checkInDate}
          checkOutDate={form.checkOutDate}
          onSelectDate={(date: Date) => {
            if (!form.checkInDate || (form.checkInDate && form.checkOutDate)) {
              setValue("checkInDate", date.toISOString());
              setValue("checkOutDate", "");
            } else {
              if (date > new Date(form.checkInDate)) {
                setValue("checkOutDate", date.toISOString());
              } else {
                setValue("checkInDate", date.toISOString());
                setValue("checkOutDate", "");
              }
            }
          }}
        />
        {!form.checkInDate && (
          <p className="text-sm text-red-500">
            {t("booking.validation.checkInRequired")}
          </p>
        )}
        {!form.checkOutDate && form.checkInDate && (
          <p className="text-sm text-red-500">
            {t("booking.validation.checkOutRequired")}
          </p>
        )}
        <BookingPackage
          form={form}
          nights={nights}
          onChange={(key: any, value: any) => {
            setValue(key, value);
          }}
        />
        {/* TIME PICKER */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Check-in */}
          <TimePicker
            title={t("booking.schedule.checkIn")}
            value={form.checkInTime}
            onChange={(t: string) => setValue("checkInTime", t)}
            form={form}
          />

          {/* Check-out */}
          <TimePicker
            title={t("booking.schedule.checkOut")}
            value={form.checkOutTime}
            onChange={(t: string) => setValue("checkOutTime", t)}
            form={data}
          />
        </div>
      </div>
      <BookingSummarySchedule data={data} nights={nights} />
    </div>
  );
};

export default ScheduleTab;
