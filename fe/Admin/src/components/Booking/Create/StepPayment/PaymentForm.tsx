import { useState } from "react";
import Input from "../../../ui/Input";
import { createBooking } from "../../../../service/api/Booking";
import { useAlert } from "../../../alert-context";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { validateVoucher } from "../../../../service/api/Voucher";
import type { bookingRequest } from "../../../../type/booking.types";

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
      setVoucherError(t("payment.validation.voucherRequired"));
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
      setVoucherSuccess(t("payment.validation.voucherSuccess"));
    } catch (err: any) {
      setDiscount(0);
      setVoucherSuccess("");
      setVoucherCode("");
      setVoucherError(
        err?.response?.data?.message || t("payment.validation.voucherInvalid"),
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

  const buildBookingPayload = (booking: any): bookingRequest => {
    const nights = booking.selectDate?.nights || 0;

    // ===== ROOM DETAILS =====
    const roomDetails = booking.rooms.map((room: any) => ({
      roomId: room.id,
      specialRequest: room.specialRequest || "",
      price: Number(room.price) * nights,
    }));
    const rooms = booking.rooms || [];

    const roomsTotal = rooms.reduce(
      (sum: number, room: any) => sum + (room.price || 0) * nights,
      0,
    );
    const servicesTotal = (booking.services || []).reduce(
      (sum: number, s: any) => {
        const percent = Number(s.extraCharge) || 0;
        const servicePrice = (roomsTotal * percent) / 100;
        return sum + servicePrice;
      },
      0,
    );
    // ===== SERVICE DETAILS =====
    const serviceDetails = (booking.services || []).map((s: any) => {
      const percent = s.extraCharge || 0;
      const price = (roomsTotal * percent) / 100;

      return {
        extraServiceId: s.extraServiceId,

        price: Number(price.toFixed(2)),
      };
    });
    const originalTotal = Number((roomsTotal + servicesTotal).toFixed(2));
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
      voucherCode: voucherCode.trim() === "" ? null : voucherCode,
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
      BookingPackage: Number(booking.selectDate?.package),

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
      const payload = buildBookingPayload(booking) as bookingRequest;
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
    <div
      className="
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        rounded-2xl p-4 sm:p-6 shadow-sm
      "
    >
      {/* HEADER */}
      <h2 className="text-xl sm:text-2xl font-semibold mb-1 text-gray-900 dark:text-gray-100">
        {t("payment.title")}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {t("payment.subtitle")}
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PAID */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">
            {t("payment.paidAmount")}
          </label>
          <Input
            type="number"
            value={paidAmountInput}
            onChange={(e: any) => setPaidAmountInput(e.target.value)}
          />
        </div>

        {/* METHOD */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">
            {t("payment.paymentMethod")}
          </label>

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="
              mt-1 w-full rounded-lg px-3 py-2 border
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-600
              focus:ring-1 focus:ring-[#42578E]
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
          <label className="text-sm text-gray-600 dark:text-gray-400">
            {t("payment.outstanding")}
          </label>
          <Input type="number" disabled value={outstanding} />
        </div>

        {/* NOTE */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">
            {t("payment.notes")}
          </label>
          <Input value={note} onChange={(e: any) => setNote(e.target.value)} />
        </div>

        {/* VOUCHER */}
        <div className="sm:col-span-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            {t("payment.voucherCode")}
          </label>

          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            <Input
              value={voucherCode}
              onChange={(e: any) => setVoucherCode(e.target.value)}
            />

            <button
              onClick={handleApplyVoucher}
              disabled={isCheckVoucher}
              className="
                px-6 py-2 rounded-xl text-sm font-medium
                bg-[#42578E] text-white
                dark:bg-[#536DB2]
                disabled:bg-gray-300 disabled:text-gray-500
              "
            >
              {isCheckVoucher ? t("payment.checking") : t("payment.apply")}
            </button>
          </div>

          {voucherError && (
            <p className="text-red-500 text-sm mt-2">{voucherError}</p>
          )}

          {voucherSuccess && (
            <p className="text-green-500 text-sm mt-2">
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
          className="
            w-full sm:w-auto px-8 py-3 rounded-xl font-medium text-lg
            bg-[#42578E] text-white
            dark:bg-[#536DB2]
            disabled:bg-gray-300 disabled:text-gray-500
          "
        >
          {isLoading ? t("payment.processing") : t("payment.complete")}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
