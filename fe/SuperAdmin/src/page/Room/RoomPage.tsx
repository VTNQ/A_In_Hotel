import { useAlert } from "@/components/alert-context";
import RoomEdit from "@/components/Room/RoomEdit";
import RoomFilter from "@/components/Room/RoomFilter";
import RoomTable from "@/components/Room/RoomTable";
import ViewRoomInformation from "@/components/Room/View/ViewRoomInformation";
import { getRoom, updateStatus } from "@/service/api/Room";
import type { SortDir } from "@/type/common";
import type { Room, RoomStatusFilter } from "@/type/Room.type";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const RoomPage = () => {
  const [data, setData] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();
  const [selectedRow, setSelectedRow] = useState<Room | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const { t } = useTranslation();
  const [hotelFilter, setHotelFilter] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortKey, setSortKey] = useState<keyof Room | null>("id");
  const [editModal, setEditModal] = useState<Room | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<RoomStatusFilter>("ALL");
  const fetchRoom = useCallback(async () => {
    try {
      setLoading(true);
      let filters: string[] = [];
      if (statusFilter !== "ALL") {
        filters.push(`status==${statusFilter}`);
      }
      if (filterCategory) {
        filters.push(`category.id==${filterCategory}`);
      }
      if (hotelFilter) {
        filters.push(`hotel.id==${hotelFilter}`);
      }
      const response = await getRoom({
        page: page,
        size: 5,
        sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
        searchValue,
        ...(filters.length > 0 ? { filter: filters.join(" and ") } : {}),
      });
      setData(response.data.content);
      setTotal(response.data.totalElements);
    } catch (err: any) {
      setError(err.message || t("common.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [page, sortKey, sortDir, searchValue, statusFilter]);
  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);
  const handleSort = (key: keyof Room) => {
    setPage(1);

    setSortDir((prev) => {
      if (sortKey === key) {
        return prev === "asc" ? "desc" : "asc";
      }
      return "desc";
    });

    setSortKey(key);
  };
  const handleView = (row: Room) => {
    setSelectedRow(row);
    setShowViewModal(true);
  };
  const handleUpdateStatus = async (id: number, next: any) => {
    try {
      setLoading(true);
      await updateStatus(id, next);
      showAlert({
        title: t("room.updateStatusSuccess"),
        type: "success",
      });
      fetchRoom();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          "Failed to change status of room. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("room.title")}</h2>
        <RoomFilter
          search={searchValue}
          onSearchChange={setSearchValue}
          hotelFilter={hotelFilter}
          onHotelFilterChange={setHotelFilter}
          roomTypeFilter={filterCategory}
          onRoomTypeFilterChange={setFilterCategory}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <RoomTable
        rows={data}
        loading={loading}
        onEdit={(row) => setEditModal(row)}
        onView={(row) => handleView(row)}
        onActivate={(row) => handleUpdateStatus(row.id, 3)}
        onDeactivate={(row) => handleUpdateStatus(row.id, 6)}
        onMaintenance={(row) => handleUpdateStatus(row.id, 4)}
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={handleSort}
        page={page}
        pageSize={10}
        total={total}
        onPageChange={setPage}
      />
      <RoomEdit
        open={!!editModal}
        roomId={editModal?.id ?? 0}
        onClose={() => setEditModal(null)}
        onSubmit={fetchRoom}
      />
      <ViewRoomInformation
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        roomId={selectedRow?.id}
      />
    </div>
  );
};
export default RoomPage;
