import type {
  FranchiseSectionItem,
  FranchiseSectionItemTableProps,
} from "@/type/franchiseSectionItem.types";
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
import FranchiseSectionItemActionMenu from "./FranchiseSectionItemActionMenu";

const FranchiseSectionItemTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,
  page,
  pageSize,
  onEdit,
  total,
  onActive,
  onDeActive,
  onPageChange,
}: FranchiseSectionItemTableProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  return (
    <Table<keyof FranchiseSectionItem>
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
          <TableHead sortable sortKey="title" width={220}>
            {t("franchiseSectionItem.fields.title")}
          </TableHead>
          <TableHead width={220}>Icon</TableHead>
          <TableHead sortable sortKey="sortOrder">
            {t("franchiseSectionItem.fields.sortOrder")}
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
              <TableCell>{row.title}</TableCell>
              <TableCell>
                <img
                  src={
                    row.icon != null
                      ? File_URL + row.icon?.url
                      : "/default.webp"
                  }
                  alt={row.icon?.altText}
                  className="w-32 h-24 object-cover rounded-lg
                                mx-auto border"
                />
              </TableCell>
              <TableCell>{row.sortOrder}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    row.active
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {row.active
                    ? t("franchiseSectionItem.status.active")
                    : t("franchiseSectionItem.status.inactive")}
                </span>
              </TableCell>
              <TableCell>
                <FranchiseSectionItemActionMenu
                  franchiseSectionItem={row}
                  onEdit={onEdit}
                  onActive={onActive}
                  onDeActive={onDeActive}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
export default FranchiseSectionItemTable;
