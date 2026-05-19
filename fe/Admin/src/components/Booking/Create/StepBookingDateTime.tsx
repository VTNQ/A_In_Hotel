import { useMemo, useState } from "react";
import CalendarRange from "../../ui/CalenderRange";
import BookingDetailsPanel from "./BookingDetailsPanel";
import { useTranslation } from "react-i18next";
import z from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const StepBookingDateTime = ({ data, onBack, onNext, onCancel }: any) => {
  const schema = z
    .object({
      checkInDate: z.string().min(1, "Check-in date is required"),

      checkOutDate: z.string().min(1, "Check-out date is required"),

      checkInTime: z.string().min(1),

      checkOutTime: z.string().min(1),

      package: z.string().min(1),

      adults: z.number().min(1, "At least 1 adult is required"),

      children: z.number().min(0),
    })
    .refine(
      (data) => new Date(data.checkOutDate) >= new Date(data.checkInDate),
      {
        message: "Check-out date must be after check-in date",
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
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50">
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {t("bookingDateTime.title")}
        </h2>
        <p className="text-sm text-gray-500">{t("bookingDateTime.step")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-4 shadow-sm">
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
              <p className="mt-2 text-sm text-red-500">
                {errors.checkInDate.message}
              </p>
            )}

            {errors.checkOutDate && (
              <p className="mt-2 text-sm text-red-500">
                {errors.checkOutDate.message}
              </p>
            )}
          </div>
        </div>
        <BookingDetailsPanel
          form={form}
          nights={nights}
         onChange={(key: any, value: any) =>
            setValue(key, value, {
              shouldValidate: true,
            })
          }
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-8">
        {/* CANCEL - NGOÀI, BÊN TRÁI */}
        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium
          text-red-600 border border-red-200 bg-red-50
          hover:bg-red-100 hover:border-red-300 transition"
        >
          {t("bookingDateTime.cancel")}
        </button>
        {/* BACK + NEXT - NHÓM RIÊNG */}
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-4 py-2 rounded-lg
            bg-[#F2F2F2] text-[#4B4B4B]"
          >
            {t("bookingDateTime.back")}
          </button>

          <button
            disabled={!isValid}
            onClick={handleSubmit(submit)}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl transition
            ${
              isValid
                ? "bg-[#42578E] text-white hover:bg-[#536DB2]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
