import {
  PROMOTION_TYPE_I18N,
  type Promotion,
  type PromotionTableProps,
} from "@/type/Promotion.types";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import PromotionActionMenu from "./PromotionActionMenu";

const PromotionTable = ({
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
}: PromotionTableProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  return (
    <Table<keyof Promotion>
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
          <TableHead sortable sortKey="code" width={200}>
            {t("promotion.code")}
          </TableHead>
          <TableHead sortable sortKey="name" width={200}>
            {t("promotion.name")}
          </TableHead>
          <TableHead sortable sortKey="type" width={200}>
            {t("promotion.type")}
          </TableHead>
          <TableHead sortable sortKey="value" width={200}>
            {t("promotion.value")}
          </TableHead>
          <TableHead sortable sortKey="startDate" width={200}>
            {t("promotion.startDate")}
          </TableHead>
          <TableHead sortable sortKey="endDate" width={200}>
            {t("promotion.endDate")}
          </TableHead>
          <TableHead width={200}>{t("common.status")}</TableHead>
          <TableHead sortable sortKey="createdAt" width={200}>
            {t("common.createdAt")}
          </TableHead>
          <TableHead sortable sortKey="updatedAt" width={200}>
            {t("common.updatedAt")}
          </TableHead>
          <TableHead width={200}>{t("promotion.createdBy")}</TableHead>
          <TableHead width={200}>{t("common.action")}</TableHead>
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
              <TableCell>{row.name}</TableCell>
              <TableCell>{t(PROMOTION_TYPE_I18N[Number(row.type)])}</TableCell>
              <TableCell>{row.value}</TableCell>
              <TableCell>{row.startDate}</TableCell>
              <TableCell>{row.endDate}</TableCell>
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
                    ? t("promotion.status.enabled")
                    : t("promotion.status.Disabled")}
                </div>
              </TableCell>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.updatedAt}</TableCell>
              <TableCell>{row.createdBy ?? t("common.none")}</TableCell>
              <TableCell>
                <PromotionActionMenu
                  promotion={row}
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
export default PromotionTable;
