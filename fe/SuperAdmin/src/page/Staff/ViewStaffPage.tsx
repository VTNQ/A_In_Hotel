import { useAlert } from "@/components/alert-context";
import StaffFilter from "@/components/Staff/StaffFilter";
import StaffTable from "@/components/Staff/StaffTable";
import { getAllStaff, updateStatus } from "@/service/api/Staff";
import type { SortDir } from "@/type/common";
import type { StatusFilter } from "@/type/hotel.types";
import type { Staff } from "@/type/Staff.type";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ViewStaffPage = () => {
  const [data, setData] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [hotelFilter, setHotelFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const [sortKey, setSortKey] = useState<keyof Staff | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      let filters: string[] = [];
      if (statusFilter !== "ALL") {
        filters.push(`status==${statusFilter}`);
      }
      if (hotelFilter) {
        filters.push(`hotelId==${hotelFilter}`);
      }
      const response = await getAllStaff({
        page: page,
        size: 5,
        sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
        searchValue: search,
        ...(filters.length > 0 ? { filter: filters.join(" and ") } : {}),
      });
      setData(response?.data?.content);
      setTotalPages(response.data.totalElements);
    } catch (err: any) {
      setError(err.message || t("common.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [page, sortKey, sortDir, search, statusFilter]);
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);
  const handleSort = (key: keyof Staff) => {
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
    try {
      setLoading(true);
      await updateStatus(id, next);
      fetchStaff();
      showAlert({
        title: t("staff.status.updateSuccess"),
        type: "success",
      });
    } catch (err: any) {
      showAlert({
        title: err?.response?.data?.message || t("staff.status.updateFailed"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">{t("staff.title")}</h2>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-start">
        {/* TITLE */}
      

        {/* FILTER */}
        <StaffFilter
          search={search}
          onSearchChange={setSearch}
          hotelFilter={hotelFilter}
          onHotelFilterChange={setHotelFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <StaffTable
        rows={data}
        loading={loading}
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={handleSort}
        page={page}
        pageSize={10}
        total={totalPages}
        onPageChange={setPage}
        onActive={(row: Staff) => handleChangeStatus(row.id, true)}
        onInActive={(row: Staff) => handleChangeStatus(row.id, false)}
      />
    </div>
  );
};
export default ViewStaffPage;
