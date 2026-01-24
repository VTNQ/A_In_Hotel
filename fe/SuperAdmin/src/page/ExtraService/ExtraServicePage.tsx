import { useAlert } from "@/components/alert-context";
import ExtraServiceEditModal from "@/components/extraService/ExtraServiceEditModal";
import ExtraServiceFilter from "@/components/extraService/ExtraServiceFilter";
import ExtraServiceTable from "@/components/extraService/ExtraServiceTable";
import { getExtraService, updateStatusFacilities } from "@/service/api/facilities";
import type { SortDir } from "@/type/common";
import type { ExtraService } from "@/type/extraService.types";
import type { StatusFilter } from "@/type/hotel.types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ExtraServicePage = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const {showAlert} = useAlert();
  const [total, setTotal] = useState(0);
  const pageSize = 5;
  const [extraService, setExtraService] = useState<ExtraService[]>([]);
  const [sortKey, setSortKey] = useState<keyof ExtraService | null>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [hotelFilter,setHotelFilter]= useState("");
  const [editModal,setEditModal] = useState<ExtraService | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [filterCategory, setFilterCategory] = useState("");
  const buildParams = () => {
    let filters: string[] = ["price>0"];
    filters.push("type==2");

    if (statusFilter !== "ALL") {
      filters.push(`isActive==${statusFilter}`);
    }
    if (filterCategory) {
      filters.push(`category.id==${filterCategory}`);
    }

    if(hotelFilter){
      filters.push(`hotelId==${hotelFilter}`)
    }

    const filterQuery = filters.join(" and ");

    const param = {
      page, // ✅ 0-based
      size: pageSize,
      sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
      searchValue,
      ...(filterQuery ? { filter: filterQuery } : {}),
    };
    return param;
  };

  const fetchExtraService = useCallback(async () => {
    try {
      setLoading(true);

      const resp = await getExtraService(buildParams());
      setExtraService(resp.data.content);
      setTotal(resp.data.totalElements);
    } catch (e: any) {
      setError(e.message || t("common.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [page, sortKey, sortDir, searchValue, filterCategory, statusFilter,hotelFilter]);
  const handleSort = (key: keyof ExtraService) => {
    setPage(1);

    setSortDir((prev) => {
      if (sortKey === key) {
        return prev === "asc" ? "desc" : "asc";
      }
      return "desc";
    });

    setSortKey(key);
  };
  const handleChangeStatus = async (id: number, next: any) => {
    try{
      setLoading(true);
      await updateStatusFacilities(id,next);
      showAlert({
                title: t("extraService.status.updateSuccess"),
                type: "success",
            });
    }catch(err:any){
      showAlert({
        title:
          err?.response?.data?.message ||
          "Failed to change status of service. Please try again.",
        type: "error",
      });
    }
  }
  useEffect(() => {
    fetchExtraService();
  }, [fetchExtraService]);
  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold"> {t("extraService.title")}</h1>
          <ExtraServiceFilter
            search={searchValue}
            onSearchChange={setSearchValue}
            hotelFilter={hotelFilter}
            onHotelFilterChange={setHotelFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilter={filterCategory}
            onCategoryFilterChange={setFilterCategory}
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <ExtraServiceTable
          rows={extraService}
          loading={loading}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={handleSort}
          onActivate={(row) => handleChangeStatus(row.id,true)}
          onDeactivate={(row) => handleChangeStatus(row.id,false)}
          onEdit={(row) => setEditModal(row)}

          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
        />
        <ExtraServiceEditModal
          open={!!editModal}
          extraServiceId={editModal?.id ?? 0}
          onClose={() => setEditModal(null)}
          onSubmit={fetchExtraService}
        />
      </div>
    </>
  );
};
export default ExtraServicePage;
