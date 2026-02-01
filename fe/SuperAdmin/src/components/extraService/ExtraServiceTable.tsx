import type {
  ExtraService,
  ExtraServiceTableProps,
} from "@/type/extraService.types";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { File_URL } from "@/setting/constant/app";
import ExtraServiceActionMenu from "./ExtraServiceActionMenu";

const ExtraServiceTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,
  onEdit,

  page,
  pageSize,
  onActivate,
  onDeactivate,
  total,
  onPageChange,
}: ExtraServiceTableProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }

  return (
    <Table<keyof ExtraService>
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
          <TableHead sortable sortKey="serviceCode" width={220}>
            {t("extraService.code")}
          </TableHead>
          <TableHead width={220}>{t("extraService.icon")}</TableHead>
          <TableHead sortable sortKey="serviceName" width={220}>
            {t("extraService.name")}
          </TableHead>
          <TableHead width={220}>{t("extraService.hotel")}</TableHead>
          <TableHead sortable sortKey="category" width={220}>
            {t("extraService.category")}
          </TableHead>
          <TableHead sortable sortKey="price" width={220}>
            {t("extraService.price")}
          </TableHead>
          <TableHead sortable sortKey="unit" width={220}>
            {t("extraService.unit")}
          </TableHead>

          <TableHead sortable sortKey="createdAt" width={220}>
            {t("extraService.createdAt")}
          </TableHead>
          <TableHead sortable sortKey="updatedAt" width={220}>
            {t("extraService.updatedAt")}
          </TableHead>
          <TableHead sortable sortKey="isActive" width={220}>
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
              <TableCell>{row.serviceCode}</TableCell>
              <TableCell>
                <img
                  src={
                    row.icon != null
                      ? File_URL + row.icon?.url
                      : "/default.webp"
                  }
                  // hiển thị ảnh đầu tiên
                  alt={row.serviceName}
                   className="w-32 h-24 object-cover rounded-lg
                  mx-auto border"
                />
              </TableCell>
              <TableCell>{row.serviceName}</TableCell>
              <TableCell>{row.hotelName}</TableCell>
              <TableCell>{row.categoryName}</TableCell>
              <TableCell>{row.price}</TableCell>
              <TableCell>{row.unit}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.updatedAt}</TableCell>
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
                  {row.isActive ? t("common.active") : t("common.deActivate")}
                </div>
              </TableCell>
              <TableCell>
                <ExtraServiceActionMenu
                  extraService={row}
                  onEdit={onEdit}
                  onActivate={onActivate}
                  onDeactivate={onDeactivate}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
export default ExtraServiceTable;
