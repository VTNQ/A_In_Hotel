import React, { useEffect, useMemo, useState } from "react";
import { useAlert } from "../alert-context";

import type { HotelRow, StatusFilter } from "@/type/hotel.types";
import type { SortDir } from "@/type/common";

import { type HotelStatus } from "@/setting/constant/hotel.constants";
import { getAllHotel, UpdateStatusHotel } from "@/service/api/Hotel";

import HotelFilter from "./HotelFilter";
import HotelTable from "./HotelTable";
import HotelEditModal from "./HotelEditModal";
import { useTranslation } from "react-i18next";

const ListHotel: React.FC = () => {
  const { showAlert } = useAlert();

  const [rows, setRows] = useState<HotelRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<HotelRow | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { t } = useTranslation();
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
        filter: "status==1"
      });

      const list: HotelRow[] = resp.data.content.map((i: any) => ({
        id: i.id,
        code: i.code,
        name: i.name,
        address: i.address ?? t("hotel.notUpdated"),
        createdAt: i.createdAt,
        status: Number(i.status) as HotelStatus,
        fullName: i.fullName,
        idUser: i.idUser,
        thumbnail: i.thumbnail
      }));

      setRows(list);
    } catch (e: any) {
      setError(e.message || t("hotel.loadError"));
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchHotels();
  }, [page, sortKey, sortDir, search]);

  // ================= ACTION =================
  const updateStatus = async (row: HotelRow) => {
    const prevRows = rows;

    setRows((prev) =>
      prev.filter((r) => r.id !== row.id)
    );
    try {
      await UpdateStatusHotel(row.id, 0);
    } catch {
      setRows(prevRows);
      showAlert({
        title: t("hotel.deleteError"),
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
       <h2 className="text-xl font-semibold"> {t("hotel.listTitle")}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-start">
       

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
        onEdit={(row: any) => setEditingRow(row)}
        onDelete={(row: any) => updateStatus(row)}
      />
      <HotelEditModal
        open={!!editingRow}
        hotelId={Number(editingRow?.id)}
        onClose={() => setEditingRow(null)}
        onSubmit={fetchHotels}
      />
    </div>
  );
};

export default ListHotel;
