import {
  VOUCHER_TYPE,
  type Voucher,
  type VoucherTableProps,
} from "@/type/voucher.types";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import VoucherActionMenu from "./VoucherActionMenu";

const VoucherTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,
  onEdit,
  page,
  pageSize,
  total,
  onPageChange,
  onView,
  onDiabled,
}: VoucherTableProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  const renderRoomTypes = (row: any) => {
    if (!row.roomTypes || row.roomTypes.length === 0) return "-";

    const firstIncluded = row.roomTypes.find((r: any) => r.excluded === false);

    return firstIncluded ? firstIncluded.roomTypeName : "-";
  };
  const renderDateRange = (row: any) => {
    if (!row.startDate || !row.endDate) return "-";

    return `${row.startDate} - ${row.endDate}`;
  };
  return (
    <Table<keyof Voucher>
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
          <TableHead sortable sortKey="voucherCode" width={220}>
            {t("voucher.code")}
          </TableHead>
          <TableHead sortable sortKey="voucherName" width={220}>
            {t("voucher.name")}
          </TableHead>
          <TableHead sortable sortKey="type" width={220}>
            {t("voucher.discountType")}
          </TableHead>
          <TableHead sortable sortKey="value" width={220}>
            {t("voucher.discountValue")}
          </TableHead>
          <TableHead width={220}>{t("voucher.roomType")}</TableHead>
          <TableHead width={220}>{t("voucher.validPeriod")}</TableHead>
          <TableHead sortable sortKey="priority" width={220}>
            {t("voucher.usage")}
          </TableHead>
          <TableHead sortable sortKey="status" width={220}>
            {t("common.status")}
          </TableHead>
          <TableHead sortable sortKey="createdAt" width={220}>
            {t("common.createdAt")}
          </TableHead>
          <TableHead sortable sortKey="updatedAt" width={220}>
            {t("common.updatedAt")}
          </TableHead>
          <TableHead sortable sortKey="createdBy" width={220}>
            {t("promotion.createdBy")}
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
              <TableCell>{row.voucherCode}</TableCell>
              <TableCell>{row.voucherName}</TableCell>
              <TableCell>{t(VOUCHER_TYPE[Number(row.type)])}</TableCell>
             <TableCell>
                {row.type === 1 || row.type === 3
                  ? `${Number(row.value).toLocaleString()} VND`
                  : `${row.value}%`}
              </TableCell>
               <TableCell>{renderRoomTypes(row)}</TableCell>
             
              <TableCell>{renderDateRange(row)}</TableCell>
             
              <TableCell>{`${row.priority}/10`}</TableCell>
              <TableCell>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                  ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      row.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  {row.isActive
                    ? t("voucher.status.enabled")
                    : t("voucher.status.disabled")}
                </div>
              </TableCell>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.updatedAt}</TableCell>
              <TableCell>{row.createdBy}</TableCell>
              <TableCell>
                <VoucherActionMenu
                  voucher={row}
                  onEdit={onEdit}
                  onView={onView}
                  onDiabled={onDiabled}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
export default VoucherTable;
