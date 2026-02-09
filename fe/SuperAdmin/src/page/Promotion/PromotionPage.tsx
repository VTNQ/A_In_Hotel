import { useAlert } from "@/components/alert-context";
import PromotionFilter from "@/components/Promotion/PromotionFilter";
import PromotionTable from "@/components/Promotion/PromotionTable";
import UpdatePromotion from "@/components/Promotion/UpdatePromotion";
import ViewPromotionModal from "@/components/Promotion/ViewPromotionModal";
import { getPromotionAll, updateStatusPromotion } from "@/service/api/Promotion";
import type { SortDir } from "@/type/common";
import type { StatusFilter } from "@/type/hotel.types";
import { type Promotion } from "@/type/Promotion.types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PromotionPage = () => {
  const [data, setData] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortKey, setSortKey] = useState<keyof Promotion | null>("id");
  const [viewModal,setViewModal] = useState<Promotion | null>(null);
  const [editModal, setEditModal] = useState<Promotion | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const fetchPromotion = useCallback(async () => {
    try {
      setLoading(true);
      let filters: string[] = [];
      if (statusFilter !== "ALL") {
        filters.push(`status==${statusFilter}`);
      }
      const response = await getPromotionAll({
        page: page,
        size: 10,
        sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
        searchValue: searchValue,
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
    fetchPromotion();
  }, [fetchPromotion]);
  const handleSort = (key: keyof Promotion) => {
    setPage(1);

    setSortDir((prev) => {
      if (sortKey === key) {
        return prev === "asc" ? "desc" : "asc";
      }
      return "desc";
    });

    setSortKey(key);
  };
  const handleUpdateStatusPromotion = async (
    promotionId: number,
    isActive: any,
  ) => {
    try {
      setLoading(true);

      const response = await updateStatusPromotion(promotionId, isActive);

      await fetchPromotion();

      const message =
        response?.data?.message || t("promotion.successUpdateStatus");

      showAlert({ title: message, type: "success", autoClose: 3000 });
    } catch (err: any) {
      showAlert({
        title: err?.response?.data?.message || t("promotion.errorUpdateStatus"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{t("promotion.title")}</h1>
        <PromotionFilter
          search={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <PromotionTable
        rows={data}
        loading={loading}
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={handleSort}
        page={page}
        pageSize={5}
        total={total}
        onView={(row)=>setViewModal(row)}
        onEdit={(row)=>setEditModal(row)}
        onDiabled={(row)=>handleUpdateStatusPromotion(row.id,false)}
        onPageChange={setPage}
      />
      <UpdatePromotion
        open={!!editModal}
        promotionId={editModal?.id ?? 0}
        onClose={() => setEditModal(null)}
        onSubmit={fetchPromotion}
      />
      <ViewPromotionModal
        isOpen={!!viewModal}
        onClose={() => setViewModal(null)}
        promotionId={viewModal?.id ?? 0}
      />
    </div>
  );
};
export default PromotionPage;
