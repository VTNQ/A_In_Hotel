import type {
  FranchiseSection,
  FranchiseSectionTableProps,
} from "@/type/franchiseSection.types";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import FranchiseSectionActionMenu from "./FranchiseSectionActionMenu";

const FranchiseSectionTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,
  page,
  pageSize,
  onEdit,
  total,
  onPageChange,
  onActive,
  onDeactivate
}: FranchiseSectionTableProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  return (
    <Table<keyof FranchiseSection>
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
          <TableHead sortable sortKey="code">
            {t("franchiseSection.fields.code")}
          </TableHead>
          <TableHead sortable sortKey="title">
            {t("franchiseSection.fields.title")}
          </TableHead>

          <TableHead sortable sortKey="subTitle">
            {t("franchiseSection.fields.subTitle")}
          </TableHead>
          <TableHead sortable sortKey="sortOrder">
            {t("franchiseSection.fields.sortOrder")}
          </TableHead>
          <TableHead> {t("franchiseSection.fields.status")}</TableHead>
          <TableHead width={120}>{t("common.action")}</TableHead>
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
              <TableCell>{row.title}</TableCell>

              <TableCell>{row.subTitle}</TableCell>
              <TableCell>{row.sortOrder}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    row.active
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {row.active ? t("franchiseSection.status.active") : t("franchiseSection.status.inactive")}
                </span>
              </TableCell>
              <TableCell>
                <FranchiseSectionActionMenu
                  franchiseSection={row}
                  onEdit={onEdit}
                  onActive={onActive}
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
export default FranchiseSectionTable;
