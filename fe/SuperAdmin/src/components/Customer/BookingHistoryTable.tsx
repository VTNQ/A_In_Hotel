import type { bookingHistoryTableProps } from "@/type/customer.types";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { BookingResponse } from "@/type/booking.types";

const BookingHistoryTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,

  page,
  pageSize,
  total,
  onPageChange,
}: bookingHistoryTableProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  const statusMap: Record<
    number,
    { label: string; color: string; dot: string }
  > = {
    1: {
      label: t("booking.booked"),
      color: "bg-[#FFDAFB80] text-[#BC00A9]",
      dot: "bg-[#BC00A9]",
    },
    2: {
      label: t("booking.checkIn"),
      color: "bg-[#E0F2EA] text-[#36A877]",
      dot: "bg-[#33B27F]",
    },
    3: {
      label: t("booking.checkOut"),
      color: "bg-[#F9EFCF] text-[#BE7300]",
      dot: "bg-[#BE7300]",
    },
    4: {
      label: t("booking.cancelled"),
      color: "bg-[#FFF4F4] text-[#FF0000]",
      dot: "bg-[#FF0000]",
    },
  };
  return (
    <Table<keyof BookingResponse>
      sortKey={sortKey}
      sortDir={sortDir}
      onSort={onSortChange}
      pagination={{
        page,
        pageSize,
        total,
        onPageChange,
      }}
    >
      <TableHeader>
        <TableRow>
          <TableHead sortable sortKey="bookingCode">
            {t("reward.table.bookingId")}
          </TableHead>
          <TableHead sortable sortKey="checkedInAt">
            {t("booking.actualCheckIn")}
          </TableHead>
          <TableHead sortable sortKey="checkedOutAt">
            {t("booking.actualCheckOut")}
          </TableHead>
          <TableHead sortable sortKey="details.roomName">
            {t("booking.room")}
          </TableHead>
          <TableHead sortable sortKey="totalPrice">
            {t("booking.totalPrice")}
          </TableHead>
          <TableHead sortable sortKey="status">
            {t("common.status")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="h-[240px] text-center text-gray-400"
            >
              {t("common.noData")}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.code}</TableCell>
              <TableCell>
                {row.checkedInAt ? row.checkedInAt : t("booking.notCheckedIn")}
              </TableCell>
              <TableCell>
                {row.checkedOutAt
                  ? row.checkedOutAt
                  : t("booking.notCheckedOutIn")}
              </TableCell>
              <TableCell>{row.totalPrice}</TableCell>
              <TableCell>
                {(() => {
                  const st = statusMap[row.status] ?? {
                    labelKey: "common.unknown",
                    color: "bg-gray-100 text-gray-500",
                    dot: "bg-gray-400",
                  };

                  return (
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${st.color}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                      {t(st.label)}
                    </div>
                  );
                })()}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
export default BookingHistoryTable;
