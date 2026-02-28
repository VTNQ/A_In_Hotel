import { useAlert } from "@/components/alert-context";
import AssetDetailModal from "@/components/Asset/AssetDetailModal";
import AssetEditModal from "@/components/Asset/AssetEditModal";
import AssetFilter from "@/components/Asset/AssetFilter";
import AssetTable from "@/components/Asset/AssetTable";
import { getAllAsset, updateStatusAsset } from "@/service/api/Asset";
import { type Asset, type AssetStatusFilter } from "@/type/asset.types";
import type { SortDir } from "@/type/common";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AssetPage = () => {
  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [sortKey, setSortKey] = useState<keyof Asset | null>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [hotelFilter, setHotelFilter] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editModal, setEditModal] = useState<Asset | null>(null);
  const [selectedRow, setSelectedRow] = useState<Asset | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<AssetStatusFilter>("ALL");
  const [searchValue, setSearchValue] = useState("");
  const fetchAssets = useCallback(async () => {
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
        filters.push(`hotelId==${hotelFilter}`);
      }
      const filterQuery = filters.join(" and ");
      const param = {
        page,
        size: 10,
        sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
        searchValue,
        ...(filterQuery ? { filter: filterQuery } : {}),
      };
      const resp = await getAllAsset(param);
      setData(resp.data.content);
      setTotal(resp.data.totalElements);
    } catch (e: any) {
      setError(e.message || t("common.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [
    page,
    sortKey,
    sortDir,
    searchValue,
    statusFilter,
    filterCategory,
    hotelFilter,
  ]);
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);
  const handleSort = (key: keyof Asset) => {
    setPage(1);

    setSortDir((prev) => {
      if (sortKey === key) {
        return prev === "asc" ? "desc" : "asc";
      }
      return "desc";
    });

    setSortKey(key);
  };
  const handleView = (row: any) => {
    setSelectedRow(row.id);
    setShowViewModal(true);
  };
  const handleChangeStatus = async (id: number, next: any) => {
    try {
      setLoading(true);
      await updateStatusAsset(id, next);
      showAlert({
        title: t("asset.status.updateSuccess"),
        type: "success",
      });
      fetchAssets();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          "Failed to change status of asset. Please try again.",
        type: "error",
      });
    }finally{
      setLoading(false);
    }
  };
  return (
    <>
      <div className="w-full">
    <div className="mx-auto w-full max-w-[1400px] px-4 lg:px-6 py-4 space-y-4">
      
      <h2 className="text-xl font-semibold">
        {t("asset.title")}
      </h2>

      {/* FILTER */}
      <AssetFilter
        search={searchValue}
        onSearchChange={setSearchValue}
        hotelFilter={hotelFilter}
        onHotelFilterChange={setHotelFilter}
        categoryFilter={filterCategory}
        onCategoryFilterChange={setFilterCategory}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="w-full overflow-x-auto">
        <AssetTable
          rows={data}
          loading={loading}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={handleSort}
          onEdit={(row) => setEditModal(row)}
          onView={(row) => handleView(row)}
          onActivate={(row) => handleChangeStatus(row.id, 1)}
          onDeactivate={(row) => handleChangeStatus(row.id, 4)}
          onMaintenance={(row) => handleChangeStatus(row.id, 2)}
          page={page}
          pageSize={10}
          total={total}
          onPageChange={setPage}
        />
      </div>

      {/* MODALS */}
      <AssetEditModal
        open={!!editModal}
        assetId={editModal?.id ?? 0}
        onClose={() => setEditModal(null)}
        onSubmit={fetchAssets}
      />

      <AssetDetailModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        assetId={selectedRow}
      />

    </div>
  </div>
    </>
  );
};
export default AssetPage;
