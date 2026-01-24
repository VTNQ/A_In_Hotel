import type { Asset, AssetTableProps } from "@/type/asset.types";
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
import AssetActionMenu from "./AssetActionMenu";

const AssetTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
  onMaintenance,
  page,
  pageSize,
  total,
  onPageChange,
}: AssetTableProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  const statusMap: Record<
    number,
    { labelKey: string; color: string; dot: string }
  > = {
    1: {
      labelKey: "asset.status.good",
      color: "bg-green-50 text-green-700",
      dot: "bg-green-500",
    },
    2: {
      labelKey: "asset.status.maintenance",
      color: "bg-red-50 text-red-700",
      dot: "bg-red-500",
    },
    3: {
      labelKey: "asset.status.broken",
      color: "bg-fuchsia-50 text-fuchsia-700",
      dot: "bg-fuchsia-500",
    },
    4: {
      labelKey: "asset.status.deactivated",
      color: "bg-gray-100 text-gray-500",
      dot: "bg-gray-400",
    },
  };

  return (
    <Table<keyof Asset>
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
          <TableHead sortable sortKey="assetCode">
            {t("asset.code")}
          </TableHead>
          <TableHead>{t("asset.icon")}</TableHead>
          <TableHead sortable sortKey="assetName">
            {t("asset.name")}
          </TableHead>
          <TableHead sortable sortKey="roomNumber">
            {t("asset.room")}
          </TableHead>
          <TableHead sortable sortKey="category.id">
            {t("asset.category")}
          </TableHead>
          <TableHead sortable sortKey="price">
            {t("asset.price")}
          </TableHead>
          <TableHead sortable sortKey="quantity">
            {t("asset.quantity")}
          </TableHead>
          <TableHead >
            {t("asset.hotel")}
          </TableHead>
          <TableHead sortable sortKey="createdAt">
            {t("asset.createdAt")}
          </TableHead>
          <TableHead sortable sortKey="updatedAt">
            {t("asset.updatedAt")}
          </TableHead>
          <TableHead sortable sortKey="status">
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
              <TableCell>{row.assetCode}</TableCell>
              <TableCell>
                <img
                  src={
                    row.thumbnail != null
                      ? File_URL + row.thumbnail?.url
                      : "/default.webp"
                  }
                  // hiển thị ảnh đầu tiên
                  alt={row.thumbnail?.altText}
                  width="80"
                  height="60"
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
              </TableCell>
              <TableCell>{row.assetName}</TableCell>
              <TableCell>{row.roomNumber}</TableCell>
              <TableCell>{row.categoryName}</TableCell>
              <TableCell>{row.price}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.hotelName}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.updatedAt}</TableCell>
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
                      {t(st.labelKey)}
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell>
                <AssetActionMenu
                  asset={row}
                  onView={onView}
                  onEdit={onEdit}
                  onActivate={onActivate}
                  onDeactivate={onDeactivate}
                  onMaintenance={onMaintenance}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
export default AssetTable;