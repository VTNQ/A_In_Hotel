import { useState, useMemo } from "react";

import { useAlert } from "../../../alert-context";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { createBooking } from "@/service/api/Booking";
import { SelectField } from "@/components/ui/select";

const PaymentForm = ({ booking, onSubmit }: any) => {
  const { t } = useTranslation();
  const rooms = booking.rooms || [];
  const services = booking.services || [];
  const nights = booking.selectDate?.nights || 0;
  const { showAlert } = useAlert();
  // 🔹 TOTAL = ROOMS + SERVICES
  const total = useMemo(() => {
    const roomTotal = rooms.reduce(
      (sum: number, r: any) => sum + Number(r.price || 0) * nights,
      0,
    );

    const serviceTotal = services.reduce(
      (sum: number, s: any) => sum + Number(s.price || 0),
      0,
    );

    return roomTotal + serviceTotal;
  }, [rooms, services, nights]);
  console.log(booking);

  // 🔹 PAID AMOUNT = USER INPUT
  const [paidAmountInput, setPaidAmountInput] = useState("");
  const navigate = useNavigate();

  const [method, setMethod] = useState("CASH");
  const [note, setNote] = useState("");
  const paidAmount = Number(paidAmountInput || 0);
  const [isLoading, setIsLoading] = useState(false);
  // 🔹 OUTSTANDING = TOTAL - PAID
  const outstanding = Math.max(0, total - paidAmount);
  const buildBookingPayload = (booking: any) => {
    const nights = booking.selectDate?.nights || 0;

    // ===== ROOM DETAILS =====
    const roomDetails = booking.rooms.map((room: any) => ({
      roomId: room.id,
      specialRequest: room.specialRequest || "",
      price: Number(room.price) * nights,
    }));

    // ===== SERVICE DETAILS =====
    const serviceDetails = (booking.services || []).map((s: any) => ({
      extraServiceId: s.extraServiceId,
      price: Number(s.price),
    }));

    return {
      // ===== GUEST =====
      guestName: booking.guest?.firstName,
      surname: booking.guest?.lastName,
      email: booking.guest?.email,
      hotelId: booking?.hotelId,
      phoneNumber: booking.guest?.phone,

      guestType: booking.guest?.guestType ?? 1,
      numberOfGuests: booking.guest?.adults ?? 1,
      note: booking.guest?.note,
      idNumber: booking.guest?.idNumber,
      // ===== PAYMENT =====

      payment: {
        paidAmount: paidAmount,
        paymentMethod: method,
        paymentType: 1,
        notes: note,
      },

      // ===== DATE & TIME =====
      checkInDate: booking.selectDate?.checkInDate, // yyyy-MM-dd
      checkInTime: booking.selectDate?.checkInTime, // HH:mm
      checkOutDate: booking.selectDate?.checkOutDate,
      checkOutTime: booking.selectDate?.checkOutTime,

      // ===== PACKAGE =====
      bookingPackage: booking.selectDate?.package,

      // ===== TOTAL =====
      totalPrice:
        roomDetails.reduce((s: number, r: any) => s + r.price, 0) +
        serviceDetails.reduce((s: number, r: any) => s + r.price, 0),

      // ===== DETAILS =====
      bookingDetail: [...roomDetails, ...serviceDetails],
    };
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const payload = buildBookingPayload(booking);
      const response = await createBooking(payload);
      showAlert({
        title: response?.data?.message || "Booking created successfully.",
        type: "success",
        autoClose: 3000,
      });

      onSubmit();
      navigate("/Home/booking");
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          "Failed to create booking. Please try again.",
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">
        {t("payment.title")}
      </h2>
      <p className="text-sm text-gray-500 mb-6">{t("payment.subtitle")}</p>

      <div className="grid grid-cols-2 gap-4">
        {/* PAID AMOUNT */}
        <div>
          <label className="text-sm text-gray-600">
            {t("payment.paidAmount")}
          </label>
          <Input
            type="number"
            placeholder={t("payment.paidAmountPlaceholder")}
            value={paidAmountInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              let value = e.target.value;

              // bỏ số 0 phía trước (trừ khi chỉ có "0")
              if (value.length > 1 && value.startsWith("0")) {
                value = value.replace(/^0+/, "");
              }

              setPaidAmountInput(value);
            }}
          />
        </div>

        {/* PAYMENT METHOD */}
        <div>
          <label className="text-sm text-gray-600">
            {t("payment.paymentMethod")}
          </label>
          <SelectField
            items={[
              { label: t("payment.method.CASH"), value: "CASH" },
              { label: t("payment.method.CARD"), value: "CARD" },
              {
                label: t("payment.method.BANK_TRANSFER"),
                value: "BANK_TRANSFER",
              },
            ]}
            value={method}
            onChange={(v) => setMethod(String(v))}
            isRequired={true}
            placeholder={t("payment.selectPaymentMethod")}
            getValue={(i) => i.value}
            getLabel={(i) => i.label}
          />
        </div>

        {/* OUTSTANDING */}
        <div>
          <label className="text-sm text-gray-600">
            {t("payment.outstanding")}
          </label>
          <Input type="number" disabled value={outstanding} />
        </div>

        {/* NOTES */}
        <div>
          <label className="text-sm text-gray-600">{t("payment.notes")}</label>
          <Input
            placeholder={t("payment.notesPlaceholder")}
            value={note}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNote(e.target.value)
            }
          />
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2
      ${
        isLoading
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-indigo-500 text-white hover:bg-indigo-600"
      }`}
        >
          {isLoading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}

          {isLoading ? t("payment.processing") : t("payment.complete")}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
