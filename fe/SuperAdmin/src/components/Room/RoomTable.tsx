import type { Room, RoomTableProps } from "@/type/Room.type";
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
import RoomActionMenu from "./RoomActionMenu";

const RoomTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,
  page,
  pageSize,
  total,
  onPageChange,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
  onMaintenance,
}: RoomTableProps) => {
  const { t } = useTranslation();
  const statusMap: Record<
    number,
    { label: string; color: string; dot: string }
  > = {
    1: {
      label: t("room.roomStatus.vacantDirty"),
      color: "bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },
    2: {
      label: t("room.roomStatus.occupied"),
      color: "bg-blue-50 text-blue-700",
      dot: "bg-blue-500",
    },
    3: {
      label: t("room.roomStatus.available"),
      color: "bg-green-50 text-green-700",
      dot: "bg-green-500",
    },
    4: {
      label: t("room.roomStatus.maintenance"),
      color: "bg-red-50 text-red-700",
      dot: "bg-red-500",
    },
    5: {
      label: t("room.roomStatus.blocked"),
      color: "bg-fuchsia-50 text-fuchsia-700",
      dot: "bg-fuchsia-500",
    },
    6: {
      label: t("room.roomStatus.deactivated"),
      color: "bg-gray-100 text-gray-500",
      dot: "bg-gray-400",
    },
    7: {
      label: t("room.roomStatus.reserved"),
      color: "bg-purple-50 text-purple-700",
      dot: "bg-purple-500",
    },
  };

  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  return (
    <Table<keyof Room>
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
          <TableHead sortable sortKey="roomCode" width={120}>
            {t("room.code")}
          </TableHead>

          <TableHead sortable sortKey="roomNumber" width={120}>
            {t("room.roomNumber")}
          </TableHead>

          <TableHead width={180}>{t("room.image")}</TableHead>

          <TableHead sortable sortKey="roomName" width={220}>
            {t("room.roomName")}
          </TableHead>

          <TableHead sortable sortKey="roomTypeName" width={200}>
            {t("room.roomTypeName")}
          </TableHead>

          <TableHead sortable sortKey="defaultRate" width={140}>
            {t("room.defaultRate")}
          </TableHead>

          <TableHead sortable sortKey="createdAt" width={160}>
            {t("room.createdAt")}
          </TableHead>

          <TableHead sortable sortKey="updatedAt" width={160}>
            {t("room.updatedAt")}
          </TableHead>

          <TableHead sortable sortKey="status" width={160}>
            {t("common.status")}
          </TableHead>
          <TableHead width={160}>
            {t("common.action")}
          </TableHead>
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
              <TableCell>{row.roomCode}</TableCell>
              <TableCell>{row.roomNumber}</TableCell>
              <TableCell style={{ width: 180 }}>
                <img
                  src={
                    row.images?.[0]
                      ? File_URL + row.images[0].url
                      : "/default.webp"
                  }
                  alt={row.images?.[0]?.altText || "room image"}
                  className="w-32 h-24 object-cover rounded-lg
                  mx-auto border"
                />
              </TableCell>

              <TableCell>{row.roomName}</TableCell>
              <TableCell>{row.roomTypeName}</TableCell>
              <TableCell>{row.defaultRate}</TableCell>
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
                      {t(st.label)}
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell>
                <RoomActionMenu
                  room={row}
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
export default RoomTable;
