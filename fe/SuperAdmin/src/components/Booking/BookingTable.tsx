import {
  GUEST_TYPE_MAP,
  type BookingResponse,
  type BookingTableProps,
} from "@/type/booking.types";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import BookingActionMenu from "./BookingActionMenu";

const BookingTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,
  page,
  pageSize,
  total,
  onPageChange,
  onView,
  onCancel,
  onCheckIn,
  onCheckOut,
  onSwitchRoom,
}: BookingTableProps) => {
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
  const getRoomDisplayName = (details?: any[]) => {
    if (!details?.length) return "";

    const withRoom = details.find((d) => d.roomId != null);
    if (withRoom?.roomName) return withRoom.roomName;

    const first = details[0];
    return [first?.roomName, first?.roomType].filter(Boolean).join(" - ");
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
          <TableHead sortable sortKey="code" width={220}>
            {t("booking.code")}
          </TableHead>
          <TableHead sortable sortKey="idNumber" width={220}>
            {t("bookingGuest.idNumber")}
          </TableHead>
          <TableHead sortable sortKey="guestName" width={220}>
            {t("booking.guestName")}
          </TableHead>
          <TableHead sortable sortKey="phoneNumber" width={220}>
            {t("booking.phone")}
          </TableHead>
          <TableHead sortable sortKey="email" width={220}>
            Email
          </TableHead>
          <TableHead sortable sortKey="guestType" width={220}>
            {t("booking.guestType")}
          </TableHead>
          <TableHead sortable sortKey="checkInDate" width={220}>
            {t("booking.checkInDate")}
          </TableHead>
          <TableHead sortable sortKey="checkOutDate" width={220}>
            {t("booking.checkOutDate")}
          </TableHead>
          <TableHead sortable sortKey="details.roomName" width={220}>
            {t("booking.room")}
          </TableHead>
          <TableHead sortable sortKey="totalPrice" width={220}>
            {t("booking.totalPrice")}
          </TableHead>
          <TableHead sortable sortKey="createdAt" width={220}>
            {t("booking.createdAt")}
          </TableHead>
          <TableHead sortKey="checkedInAt" sortable width={220}>
            {t("booking.actualCheckIn")}
          </TableHead>
          <TableHead sortable sortKey="checkedOutAt" width={220}>
            {t("booking.actualCheckOut")}
          </TableHead>
          <TableHead sortable sortKey="status" width={220}>
            {t("common.status")}
          </TableHead>
          <TableHead width={220}>{t("common.action")}</TableHead>
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
              <TableCell>{row.idNumber}</TableCell>
              <TableCell>{row.guestName}</TableCell>
              <TableCell>{row.phoneNumber}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{GUEST_TYPE_MAP[row.guestType] ?? "--"}</TableCell>
              <TableCell>
                {`${row.checkInDate || ""} ${row.checkInTime || ""}`.trim()}
              </TableCell>
              <TableCell>
                {`${row.checkOutDate || ""} ${row.checkOutTime || ""}`.trim()}
              </TableCell>
              <TableCell>{getRoomDisplayName(row.details)}</TableCell>
              <TableCell>{row.totalPrice}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>
                {row.checkedInAt ? row.checkedInAt : t("booking.notCheckedIn")}
              </TableCell>
              <TableCell>
                {row.checkedOutAt
                  ? row.checkedOutAt
                  : t("booking.notCheckedOutIn")}
              </TableCell>
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
              <TableCell>
                <BookingActionMenu
                  booking={row}
                  onView={onView}
                  onCancel={onCancel}
                  onCheckIn={onCheckIn}
                  onCheckOut={onCheckOut}
                  onSwitchRoom={onSwitchRoom}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
export default BookingTable;
