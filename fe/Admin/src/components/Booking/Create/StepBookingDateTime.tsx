import { useMemo } from "react";
import CalendarRange from "../../ui/CalenderRange";
import BookingDetailsPanel from "./BookingDetailsPanel";
import { useTranslation } from "react-i18next";
import z from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const StepBookingDateTime = ({ data, onBack, onNext, onCancel }: any) => {
  const { t } = useTranslation();
  const schema = z
    .object({
      checkInDate: z
        .string()
        .min(1, t("bookingSchedule.validation.checkInRequired")),

      checkOutDate: z
        .string()
        .min(1, t("bookingSchedule.validation.checkOutRequired")),
      checkInTime: z
        .string()
        .min(1, t("bookingSchedule.validation.checkInTimeRequired")),

      checkOutTime: z
        .string()
        .min(1, t("bookingSchedule.validation.checkOutTimeRequired")),

      package: z
        .string()
        .min(1, t("bookingSchedule.validation.packageRequired")),
      adults: z.number().min(1, t("bookingSchedule.validation.adultRequired")),

      children: z.number().min(0),
    })
    .refine(
      (data) => new Date(data.checkOutDate) >= new Date(data.checkInDate),
      {
         message: t("bookingSchedule.validation.checkOutAfterCheckIn"),
        path: ["checkOutDate"],
      },
    );

  type FormValues = z.infer<typeof schema>;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      checkInDate: "",
      checkOutDate: "",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      package: "1",
      adults: 2,
      children: 0,
      ...data,
    },
  });

  const form = useWatch({ control });

  const nights = useMemo(() => {
    if (!form.checkInDate || !form.checkOutDate) return 0;

    const start = new Date(form.checkInDate);
    const end = new Date(form.checkOutDate);

    return Math.max(
      0,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
  }, [form.checkInDate, form.checkOutDate]);

  const submit = (values: FormValues) => {
    onNext({
      ...values,
      nights,
    });
  };

 return (
    <div className="">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
          {t("bookingDateTime.title")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("bookingDateTime.step")}
        </p>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CALENDAR */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl p-4 shadow-sm border border-transparent">

            <Controller
              control={control}
              name="checkInDate"
              render={() => (
                <CalendarRange
                  value={{
                    start: form.checkInDate,
                    end: form.checkOutDate,
                  }}
                  onChange={(range) => {
                    setValue("checkInDate", range.start || "", {
                      shouldValidate: true,
                    });
                    setValue("checkOutDate", range.end || "", {
                      shouldValidate: true,
                    });
                  }}
                />
              )}
            />

            {errors.checkInDate && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                {errors.checkInDate.message}
              </p>
            )}

            {errors.checkOutDate && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                {errors.checkOutDate.message}
              </p>
            )}
          </div>
        </div>

        {/* PANEL */}
        <BookingDetailsPanel
          form={form}
          nights={nights}
          onChange={(key: any, value: any) =>
            setValue(key, value, { shouldValidate: true })
          }
        />
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-8">

        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium
          text-red-600 border border-red-200 bg-red-50
          hover:bg-red-100 hover:border-red-300 transition
          dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/20"
        >
          {t("bookingDateTime.cancel")}
        </button>

        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">

          <button
            onClick={onBack}
            className="w-full sm:w-auto px-4 py-2 rounded-lg
            bg-[#F2F2F2] text-[#4B4B4B]
            dark:bg-gray-700 dark:text-gray-200"
          >
            {t("bookingDateTime.back")}
          </button>

          <button
            disabled={!isValid}
            onClick={handleSubmit(submit)}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl transition
              ${
                isValid
                  ? "bg-[#42578E] text-white hover:bg-[#536DB2] dark:bg-blue-600 dark:hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
              }`}
          >
            {t("bookingDateTime.next")}
          </button>

        </div>
      </div>
    </div>
  );
};
export default StepBookingDateTime;
