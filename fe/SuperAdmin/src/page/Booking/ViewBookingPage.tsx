import { useAlert } from "@/components/alert-context";
import BookingFilter from "@/components/Booking/BookingFilter";
import BookingTable from "@/components/Booking/BookingTable";
import ConfirmCheckIn from "@/components/Booking/CheckIn/ConfirmCheckIn";
import ConfirmCheckOut from "@/components/Booking/CheckOut/ConfirmCheckOut";
import SwitchRoomModal from "@/components/Booking/SwitchRoom/SwitchRoomModal";
import ViewBookingModal from "@/components/Booking/View/ViewBookingModal";

import {
  cancelBooking,
  GetAllBookings,
  handleCheckIn,
} from "@/service/api/Booking";
import type {
  BookingResponse,
  BookingStatusFilter,
} from "@/type/booking.types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ViewBookingPage = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof BookingResponse | null>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [checkInModal, setCheckInModal] = useState<BookingResponse | null>(
    null,
  );
  const [bookingDate, setBookingDate] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [total, setTotal] = useState(0);
  const [checkOutModal, setCheckOutModal] = useState<BookingResponse | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>("ALL");
  const [viewModal, setViewModal] = useState<BookingResponse | null>(null);
  const [switchRoomModal, setSwithRoomModal] = useState<BookingResponse | null>(
    null,
  );
  const { showAlert } = useAlert();
  const [hotelFilter, setHotelFilter] = useState("");
  const handleCheckInConfirm = async (id: number) => {
    try {
      const response = await handleCheckIn(id);

      showAlert({
        title:
          response?.data?.message || t("confirmCheckIn.confirmCheckInSuccess"),
        type: "success",
        autoClose: 3000,
      });

      fetchData();

      return true;
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          t("confirmCheckIn.confirmCheckInError"),
        type: "error",
      });

      throw err;
    }
  };
  const handleCancelBooking = async (booking: any) => {
    try {
      const response = await cancelBooking(booking.id);
      showAlert({
        title: response?.data?.message || t("booking.cancelSuccess"),
        type: "success",
        autoClose: 3000,
      });
      fetchData();
    } catch (err: any) {
      showAlert({
        title: err?.response?.data?.message || t("booking.cancelError"),
        type: "error",
        autoClose: 4000,
      });
    }
  };
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let filters: string[] = [];
      if (statusFilter !== "ALL") {
        filters.push(`status==${statusFilter}`);
      }
      if (bookingDate) {
        filters.push(
          `createdAt=ge=${bookingDate}T00:00:00+07:00`,
          `createdAt=le=${bookingDate}T23:59:59+07:00`,
        );
      }
      if (hotelFilter) {
        filters.push(`hotel.id==${hotelFilter}`);
      }
      const filterQuery = filters.join(" and ");
      const param = {
        page,
        size: 10,
        sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
        searchValue,
        ...(filterQuery ? { filter: filterQuery } : {}),
      };
      const response = await GetAllBookings(param);
      setBookings(response.content);
      setTotal(response.totalElements);
    } catch (e: any) {
      setError(e.message || t("common.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [
    page,
    sortKey,
    sortDir,
    searchValue,
    statusFilter,
    hotelFilter,
    bookingDate,
  ]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleSort = (key: keyof BookingResponse) => {
    setPage(1);

    setSortDir((prev) => {
      if (sortKey === key) {
        return prev === "asc" ? "desc" : "asc";
      }
      return "desc";
    });

    setSortKey(key);
  };
  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-semibold">{t("booking.title")}</h2>
          <div className="w-full lg:w-auto">
            <BookingFilter
              search={searchValue}
              onSearchChange={setSearchValue}
              hotelFilter={hotelFilter}
              onHotelFilterChange={setHotelFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              dateFilter={bookingDate}
              onDateFilterChange={setBookingDate}
            />
          </div>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <BookingTable
          rows={bookings}
          loading={loading}
          page={page}
          pageSize={10}
          total={total}
          onPageChange={setPage}
          sortKey={sortKey}
          onCheckIn={(row) => setCheckInModal(row)}
          onCancel={(row) => handleCancelBooking(row)}
          onCheckOut={(row) => setCheckOutModal(row)}
          onSwitchRoom={(row) => setSwithRoomModal(row)}
          onView={(row) => setViewModal(row)}
          sortDir={sortDir}
          onSortChange={handleSort}
        />
        <ConfirmCheckIn
          open={!!checkInModal}
          id={checkInModal?.id ?? 0}
          onCancel={() => setCheckInModal(null)}
          onConfirm={() => handleCheckInConfirm(checkInModal?.id ?? 0)}
        />
        <ViewBookingModal
          open={!!viewModal}
          id={viewModal?.id ?? 0}
          onClose={() => setViewModal(null)}
        />
        <ConfirmCheckOut
          open={!!checkOutModal}
          id={checkOutModal?.id ?? 0}
          onCancel={() => setCheckOutModal(null)}
          onConfirm={() => fetchData()}
        />
        <SwitchRoomModal
          open={!!switchRoomModal}
          id={switchRoomModal?.id ?? 0}
          onClose={() => setSwithRoomModal(null)}
          onConfirm={() => fetchData()}
        />
      </div>
    </>
  );
};
export default ViewBookingPage;
