import type { Category, CategoryTableProps } from "@/type/category.types";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import CategoryActionMenu from "./CategoryActionMenu";

const CategoryTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,
  onEdit,
  onView,
  onActivate,
  onDeactivate,
  page,
  pageSize,
  total,
  onPageChange,
}: CategoryTableProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  return (
    <Table<keyof Category>
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
            {t("category.code")}
          </TableHead>
          <TableHead sortable sortKey="name">
            {t("category.name")}
          </TableHead>
          <TableHead sortable sortKey="type">
            {t("category.type")}
          </TableHead>

          <TableHead sortable sortKey="capacity">
            {t("category.capacity")}
          </TableHead>

          <TableHead sortable sortKey="createdAt">
            {t("category.createdAt")}
          </TableHead>

          <TableHead sortable sortKey="updatedAt">
            {t("category.updatedAt")}
          </TableHead>

          <TableHead sortable sortKey="isActive">
            {t("common.status")}
          </TableHead>
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
          rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.code}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.capacity}</TableCell>
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
                <CategoryActionMenu
                  category={row}
                  onEdit={onEdit}
                  onActivate={onActivate}
                  onView={onView}
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
export default CategoryTable;
