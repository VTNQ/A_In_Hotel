import { useState } from "react";
import Input from "../../../ui/Input";
import { createBooking } from "../../../../service/api/Booking";
import { useAlert } from "../../../alert-context";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { validateVoucher } from "../../../../service/api/Voucher";

const PaymentForm = ({
  booking,
  discount,
  total,
  finalTotal,
  setDiscount,
  voucherCode,
  setVoucherCode,
  onSubmit,
}: any) => {
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const [isCheckVoucher, setIsCheckingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState("");
  const [voucherSuccess, setVoucherSuccess] = useState("");
  // 🔹 TOTAL = ROOMS + SERVICES
  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      setVoucherError("Please enter voucher code");
      setVoucherSuccess("");
      return;
    }
    try {
      setIsCheckingVoucher(true);
      setVoucherError("");
      setVoucherSuccess("");
      const res = await validateVoucher({
        voucherCode,
        totalAmount: total,
        nights: booking.selectDate?.nights,
        roomTypeIds: booking.rooms.map((r: any) => r.categoryId),
      });
      const discountAmount = res.data?.data?.discountAmount || 0;

      setDiscount(discountAmount);
      setVoucherSuccess( "Voucher applied successfully");
    } catch (err: any) {
      setDiscount(0);
      setVoucherSuccess("");
      setVoucherCode("");
      setVoucherError(
        err?.response?.data?.message || "Invalid or expired voucher",
      );
    } finally {
      setIsCheckingVoucher(false);
    }
  };

  // 🔹 PAID AMOUNT = USER INPUT
  const [paidAmountInput, setPaidAmountInput] = useState("");
  const navigate = useNavigate();

  const [method, setMethod] = useState("CASH");
  const [note, setNote] = useState("");
  const paidAmount = Number(paidAmountInput || 0);
  const [isLoading, setIsLoading] = useState(false);
  // 🔹 OUTSTANDING = TOTAL - PAID
  const outstanding = Math.max(0, Number(finalTotal) - paidAmount);

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
    const originalTotal =
      roomDetails.reduce((s: number, r: any) => s + r.price, 0) +
      serviceDetails.reduce((s: number, r: any) => s + r.price, 0);

    return {
      // ===== GUEST =====
      guestName: booking.guest?.firstName,
      surname: booking.guest?.lastName,
      email: booking.guest?.email,
      phoneNumber: booking.guest?.phone,

      guestType: booking.guest?.guestType ?? 1,
      numberOfGuests: booking.guest?.adults ?? 1,
      note: booking.guest?.note,
      idNumber: booking.guest?.idNumber,
      voucherCode:voucherCode.trim() === "" ? null : voucherCode,
      originalAmount: originalTotal,
      discountAmount: discount,
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
      totalPrice: Math.max(0, originalTotal - discount),

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
      navigate("/Dashboard/booking");
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
  <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
    {/* HEADER */}
    <h2 className="text-xl sm:text-2xl font-semibold mb-1">
      {t("payment.title")}
    </h2>
    <p className="text-sm text-gray-500 mb-6">
      {t("payment.subtitle")}
    </p>

    {/* FORM GRID */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="
            mt-1 w-full
            border border-gray-300
            rounded-lg px-3 py-2
            bg-white
            focus:ring-1 focus:ring-[#42578E]
            focus:border-[#42578E]
            transition
          "
        >
          <option value="CASH">{t("payment.method.CASH")}</option>
          <option value="CARD">{t("payment.method.CARD")}</option>
          <option value="BANK_TRANSFER">
            {t("payment.method.BANK_TRANSFER")}
          </option>
        </select>
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
        <label className="text-sm text-gray-600">
          {t("payment.notes")}
        </label>
        <Input
          placeholder={t("payment.notesPlaceholder")}
          value={note}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNote(e.target.value)
          }
        />
      </div>

      {/* VOUCHER */}
      <div className="sm:col-span-2">
        <label className="text-sm text-gray-600">
          {t("payment.voucherCode")}
        </label>

        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          <div className="flex-1">
            <Input
              placeholder={t("payment.voucherPlaceholder")}
              value={voucherCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setVoucherCode(e.target.value);
                setVoucherError("");
                setVoucherSuccess("");
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleApplyVoucher}
            disabled={isCheckVoucher}
            className={`
              w-full sm:w-auto
              px-6 py-2
              rounded-xl
              text-sm font-medium
              flex items-center justify-center gap-2
              transition
              ${
                isCheckVoucher
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#42578E] text-white hover:bg-[#536DB2]"
              }
            `}
          >
            {isCheckVoucher && (
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
            {isCheckVoucher
              ? t("payment.checking")
              : t("payment.apply")}
          </button>
        </div>

        {voucherError && (
          <p className="text-red-500 text-sm mt-2">
            {voucherError}
          </p>
        )}

        {voucherSuccess && (
          <p className="text-green-600 text-sm mt-2">
            {voucherSuccess} (-${discount.toFixed(2)})
          </p>
        )}
      </div>
    </div>

    {/* SUBMIT */}
    <div className="mt-8">
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`
          w-full sm:w-auto
          px-8 py-3
          rounded-xl
          font-medium
          flex items-center justify-center gap-2
          transition
          ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#42578E] text-white hover:bg-[#536DB2]"
          }
        `}
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
        {isLoading
          ? t("payment.processing")
          : t("payment.complete")}
      </button>
    </div>
  </div>
);
};

export default PaymentForm;
