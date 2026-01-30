import BannerEditModal from "@/components/Banner/BannerEditModal";
import BannerFilter from "@/components/Banner/BannerFilter";
import BannerTable from "@/components/Banner/BannerTable";
import { getBanner } from "@/service/api/Banner";
import type { Banner } from "@/type/banner.types";
import type { SortDir } from "@/type/common";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const BannerPage = () => {
  const [data, setData] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Banner | null>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [editModal, setEditModal] = useState<Banner | null>(null);
  const computeStatus = (row: any) => {
    const now = Date.now();
    const s = row.startAt ? new Date(row.startAt).getTime() : undefined;
    const e = row.endAt ? new Date(row.endAt).getTime() : undefined;
    if (typeof s === "number" && now < s) return "INACTIVE";
    if (typeof e === "number" && now > e) return "INACTIVE";
    return "ACTIVE";
  };
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
        searchValue: searchValue,
      };
      const response = await getBanner(params);
      setData(response?.data?.content);
      setTotal(response?.data?.totalElements);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || t("common.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [page, sortKey, sortDir, searchValue]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const filteredRows = useMemo(() => {
    if (statusFilter === "") return data;
    return data.filter((r) => computeStatus(r) === statusFilter);
  }, [data, statusFilter]);
  const handleSort = (key: keyof Banner) => {
    setPage(1);

    setSortDir((prev) => {
      if (sortKey === key) {
        return prev === "asc" ? "desc" : "asc";
      }
      return "desc";
    });

    setSortKey(key);
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("banner.title")}</h2>
        <BannerFilter
          search={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <BannerTable
        rows={filteredRows ?? []}
        loading={loading}
        page={page}
        pageSize={10}
        total={total}
        onPageChange={setPage}
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={handleSort}
         onEdit={(row) => setEditModal(row)}
      />
      <BannerEditModal
        open={!!editModal}
        bannerId={editModal?.id ?? 0}
        onClose={() => setEditModal(null)}
        onSubmit={fetchData}
      />
    </div>
  );
};
export default BannerPage;
