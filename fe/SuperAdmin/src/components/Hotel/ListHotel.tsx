import React, { useEffect, useMemo, useState } from "react";
import { useAlert } from "../alert-context";

import type { HotelRow, StatusFilter } from "@/type/hotel.types";
import type { SortDir } from "@/type/common";

import { type HotelStatus } from "@/setting/constant/hotel.constants";
import { getAllHotel, UpdateStatusHotel } from "@/service/api/Hotel";

import HotelFilter from "./HotelFilter";
import HotelTable from "./HotelTable";
import HotelEditModal from "./HotelEditModal";

const ListHotel: React.FC = () => {
  const { showAlert } = useAlert();

  const [rows, setRows] = useState<HotelRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingRow,setEditingRow]= useState<HotelRow | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [sortKey, setSortKey] = useState<keyof HotelRow | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  // ================= FETCH =================
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const resp = await getAllHotel({
        page,
        size: pageSize,
        sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
        searchValue: search,
      });

      const list: HotelRow[] = resp.data.content.map((i: any) => ({
        id: i.id,
        code: i.code,
        name: i.name,
        address: i.address ?? "Chưa cập nhật",
        createdOn: i.createdAt,
        status: Number(i.status) as HotelStatus,
        fullName: i.fullName,
        idUser: i.idUser,
        thumbnail: i.thumbnail
      }));

      setRows(list);
    } catch (e: any) {
      setError(e.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchHotels();
  }, [page, sortKey, sortDir, search]);

  // ================= ACTION =================
  const updateStatus = async (row: HotelRow, next: HotelStatus) => {
    try {
      await UpdateStatusHotel(row.id, next);
      showAlert({
        title: "Cập nhật trạng thái thành công",
        type: "success",
      });
      fetchHotels();
    } catch {
      showAlert({
        title: "Cập nhật trạng thái thất bại",
        type: "error",
      });
    }
  };

  const filteredRows = useMemo(() => {
    if (statusFilter === "ALL") return rows;
    return rows.filter((r) => r.status === statusFilter);
  }, [rows, statusFilter]);
  const handleSort = (key: keyof HotelRow) => {
    setPage(1);
    setSortDir((prev) =>
      sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"
    );
    setSortKey(key);
  };
  

  // ================= RENDER =================
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Hotel List</h2>

        <HotelFilter
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <HotelTable
        rows={filteredRows}
        loading={loading}
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={handleSort}
        onEdit={(row:any) => setEditingRow(row)}
        onStatusChange={updateStatus}
      />
      <HotelEditModal
        open={!!editingRow}
        hotelId={Number(editingRow?.id)}
        onClose={()=>setEditingRow(null)}
        onSubmit={fetchHotels}
        />
    </div>
  );
};

export default ListHotel;
