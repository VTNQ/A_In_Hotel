import type { Banner, BannerTableProps } from "@/type/banner.types";
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
import BannerActionMenu from "./BannerActionMenu";

const BannerTable = ({
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
}: BannerTableProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  const computeStatus = (row: any) => {
    const now = Date.now();
    const s = row.startAt ? new Date(row.startAt).getTime() : undefined;
    const e = row.endAt ? new Date(row.endAt).getTime() : undefined;
    if (typeof s === "number" && now < s) return "INACTIVE";
    if (typeof e === "number" && now > e) return "INACTIVE";
    return "ACTIVE";
  };
  return (
    <Table<keyof Banner>
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
          <TableHead sortable sortKey="bannerCode" width={120}>
            {t("banner.code")}
          </TableHead>
          <TableHead sortable sortKey="name" width={120}>
            {t("banner.name")}
          </TableHead>
          <TableHead sortable sortKey="ctaLabel" width={120}>
            {t("banner.createOrUpdate.ctaLabel")}
          </TableHead>
          <TableHead sortable sortKey="startAt" width={140}>
            {t("banner.startAt")}
          </TableHead>
          <TableHead sortable sortKey="endAt" width={140}>
            {t("banner.endAt")}
          </TableHead>
          <TableHead width={120}>{t("banner.thumbnail")}</TableHead>
          <TableHead sortable sortKey="createdAt" width={140}>
            {t("banner.createdAt")}
          </TableHead>
          <TableHead sortable sortKey="updatedAt" width={140}>
            {t("banner.updatedAt")}
          </TableHead>
          <TableHead sortable sortKey="isActive" width={120}>
            {t("common.status")}
          </TableHead>
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
              <TableCell>{row.bannerCode}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.ctaLabel}</TableCell>
              <TableCell>{row.startAt}</TableCell>
              <TableCell>{row.endAt}</TableCell>
              <TableCell style={{ width: 180 }}>
                <img
                  src={
                    row.image != null
                      ? File_URL + row.image?.url
                      : "/default.webp"
                  }
                  // hiển thị ảnh đầu tiên
                  alt={row.image?.altText}
                  className="w-32 h-24 object-cover rounded-lg
                  mx-auto border"
                />
              </TableCell>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.updatedAt}</TableCell>
              <TableCell>
                {(() => {
                  const st = computeStatus(row);

                  return (
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
          ${
            st === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          st === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {st === "ACTIVE" ? "Active" : "Inactive"}
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell>
                <BannerActionMenu banner={row} onEdit={onEdit} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
export default BannerTable;
