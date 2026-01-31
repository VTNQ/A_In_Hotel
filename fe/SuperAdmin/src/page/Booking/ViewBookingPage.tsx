import BookingFilter from "@/components/Booking/BookingFilter";
import BookingTable from "@/components/Booking/BookingTable";

import { GetAllBookings } from "@/service/api/Booking";
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
  const [editModal, setEditModal] = useState<BookingResponse | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>("ALL");
  const [hotelFilter, setHotelFilter] = useState("");
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
          `createdAt=le=${bookingDate}T23:59:59+07:00`
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
  }, [page, sortKey, sortDir, searchValue, statusFilter, hotelFilter, bookingDate]);
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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("booking.title")}</h2>
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
        {error && <div className="text-sm text-red-600">{error}</div>}
        <BookingTable
          rows={bookings}
          loading={loading}
          page={page}
          pageSize={10}
          total={total}
          onPageChange={setPage}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={handleSort}
        />
      </div>
    </>
  );
};
export default ViewBookingPage;
