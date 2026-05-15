import { CheckCircle } from "lucide-react";
import { useBookingSearch } from "../context/booking/BookingSearchContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BookingSuccess() {
  const { t } = useTranslation();
  const { search, clearSearch } = useBookingSearch();
  const navigate = useNavigate();

  const handleBackHome = () => {
    clearSearch();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-xl w-full p-8 text-center space-y-6">

        {/* ICON */}
        <div className="flex justify-center">
          <CheckCircle size={72} className="text-green-500" />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-gray-800">
          {t("booking.success.title")}
        </h1>

        <p className="text-gray-500 text-sm">
          {t("booking.success.subtitle")}
        </p>

        {/* SUMMARY */}
        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">{t("booking.success.guest")}</span>
            <span className="font-medium">
              {search?.guestName ?? t("booking.success.guest")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">{t("booking.success.checkIn")}</span>
            <span className="font-medium">{search?.checkIn}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">{t("booking.success.checkOut")}</span>
            <span className="font-medium">{search?.checkOut}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">{t("booking.success.totalPaid")}</span>
            <span className="font-semibold text-[#b38a58]">
              {search?.totalPrice?.toLocaleString()} {t("common.vnd")}
            </span>
          </div>
        </div>

        {/* ACTION */}
        <button
          onClick={handleBackHome}
          className="w-full bg-[#b38a58] text-white rounded-lg py-3 font-semibold hover:bg-[#9a7748]"
        >
          {t("booking.success.backHome")}
        </button>

      </div>
    </div>
  );
}
