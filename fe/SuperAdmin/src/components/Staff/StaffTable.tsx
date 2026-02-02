import type { Staff, StaffTableProps } from "@/type/Staff.type";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import StaffActionMenu from "./StaffActionMenu";

const StaffTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,
  page,
  pageSize,
  total,
  onPageChange,
  onActive,
  onInActive,
}: StaffTableProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  return (
    <Table<keyof Staff>
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
          <TableHead sortable sortKey="staffCode" width={200}>
            {t("staff.code")}
          </TableHead>
          <TableHead sortable sortKey="fullName" width={200}>
            {t("staff.fullName")}
          </TableHead>
          <TableHead sortable sortKey="gender" width={200}>
            {t("staff.gender")}
          </TableHead>
          <TableHead sortable sortKey="birthday" width={200}>
            {t("staff.dob")}
          </TableHead>
          <TableHead sortable sortKey="email" width={200}>
            Email
          </TableHead>
          <TableHead sortable sortKey="phone" width={200}>
            {t("staff.phone")}
          </TableHead>
          <TableHead sortable sortKey="account.role.name" width={200}>
            {t("staff.role")}
          </TableHead>
          <TableHead sortable sortKey="createdAt" width={200}>
            {t("staff.createdAt")}
          </TableHead>
          <TableHead sortable sortKey="updatedAt" width={200}>
            {t("staff.updatedAt")}
          </TableHead>
          <TableHead width={200}>{t("common.status")}</TableHead>
          <TableHead width={200}> {t("common.action")}</TableHead>
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
              <TableCell>{row.staffCode}</TableCell>
              <TableCell>{row.fullName}</TableCell>
              <TableCell>{row.gender}</TableCell>
              <TableCell>{row.birthday}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.role}</TableCell>
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
                  {row.isActive ? t("staff.active") : t("staff.view.inActive")}
                </div>
              </TableCell>
              <TableCell>
                <StaffActionMenu
                  staff={row}
                  onActive={onActive}
                  onInActive={onInActive}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
export default StaffTable;
