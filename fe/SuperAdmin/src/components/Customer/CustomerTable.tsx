import type { Customer, CustomerTableProps } from "@/type/customer.types";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import CustomerActionMenu from "./CustomerActionMenu";

const CustomerTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,
  onView,
  onBlocked,
  page,
  pageSize,
  total,
  onPageChange,
}: CustomerTableProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  
  return (
    <Table<keyof Customer>
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
         <TableHead>{t("customer.table.customerId")}</TableHead>
        <TableHead>{t("customer.table.fullName")}</TableHead>
        <TableHead>{t("customer.table.email")}</TableHead>
        <TableHead>{t("customer.table.phone")}</TableHead>
        <TableHead>{t("customer.table.totalBookings")}</TableHead>
        <TableHead>{t("customer.table.rewardBalance")}</TableHead>
        <TableHead>{t("customer.table.block")}</TableHead>
        <TableHead>{t("common.status")}</TableHead>
        <TableHead>{t("customer.table.lastBooking")}</TableHead>
        <TableHead>{t("common.action")}</TableHead>
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
          rows.map((row) => {
            const isActive = row.blocked === false;

            return (
              <TableRow key={row.id} className="hover:bg-gray-50 transition">
                {/* Customer Code */}
                <TableCell className="font-medium text-gray-700">
                  {row.customerCode}
                </TableCell>

                {/* Full Name */}
                <TableCell>{row.fullName}</TableCell>

                {/* Email */}
                <TableCell className="text-gray-600">
                  {row.email || "-"}
                </TableCell>

                {/* Phone */}
                <TableCell>{row.phone || "-"}</TableCell>

                {/* Total Bookings */}
                <TableCell className="text-center">
                  {row.totalCompletedBookings ?? 0}
                </TableCell>

                {/* Reward Balance */}
                <TableCell className="font-medium">
                  {row.rewardBalance?.toLocaleString() ?? 0}
                </TableCell>

                {/* TOGGLE */}
                <TableCell className="text-center">
                  <label className="flex items-center justify-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => onBlocked(row)}
                      className="hidden"
                    />

                    <div
                      className={`
              w-12 h-6 flex items-center rounded-full p-1 transition
              ${isActive ? "bg-green-100" : "bg-red-100"}
            `}
                    >
                      <div
                        className={`
                w-5 h-5 rounded-full shadow-md transition transform
                ${isActive ? "bg-green-500 translate-x-6" : "bg-red-500 translate-x-0"}
              `}
                      />
                    </div>
                  </label>
                </TableCell>

                {/* STATUS BADGE */}
                <TableCell>
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
            ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}
          `}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {isActive ? t("common.active") : t("common.deActivate")}
                  </div>
                </TableCell>

                {/* ACTION */}
                <TableCell>
                  {row.lastBookingAt}
                </TableCell>
                <TableCell className="text-center">
                <CustomerActionMenu
                    customer={row}
                    onView={onView}
                  />
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};
export default CustomerTable;