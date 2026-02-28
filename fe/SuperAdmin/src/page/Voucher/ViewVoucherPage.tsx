import { useAlert } from "@/components/alert-context";
import UpdateVoucher from "@/components/Voucher/UpdateVoucher";
import ViewVoucher from "@/components/Voucher/ViewVoucher";
import VoucherFilter from "@/components/Voucher/VoucherFilter";
import VoucherTable from "@/components/Voucher/VoucherTable";
import { getVouchers, updateVoucherStatus } from "@/service/api/Voucher";
import type { SortDir } from "@/type/common";
import type { StatusFilter } from "@/type/hotel.types";
import type { Voucher } from "@/type/voucher.types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ViewVoucherPage = () => {
  const [data, setData] = useState<Voucher[]>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortKey, setSortKey] = useState<keyof Voucher | null>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [editModal, setEditModal] = useState<Voucher | null>(null);
  const [viewModal, setViewModal] = useState<Voucher | null>(null);
  const { showAlert } = useAlert();
  const [total, setTotal] = useState(0);
  const fetchVoucher = useCallback(async () => {
    try {
      setLoading(true);
      let filters: string[] = [];
      if (statusFilter !== "ALL") {
        filters.push(`status==${statusFilter}`);
      }
      const response = await getVouchers({
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
  const handleSort = (key: keyof Voucher) => {
    setPage(1);

    setSortDir((prev) => {
      if (sortKey === key) {
        return prev === "asc" ? "desc" : "asc";
      }
      return "desc";
    });

    setSortKey(key);
  };
  useEffect(() => {
    fetchVoucher();
  }, [fetchVoucher]);
  const handleUpdateStatusVoucher = async (
    voucherId: number,
    isActive: any,
  ) => {
    try {
      setLoading(true);

      const response = await updateVoucherStatus(voucherId, isActive);

      await fetchVoucher();

      const message =
        response?.data?.message || t("voucher.successUpdateStatus");

      showAlert({ title: message, type: "success", autoClose: 3000 });
    } catch (err: any) {
      showAlert({
        title: err?.response?.data?.message || t("voucher.errorUpdateStatus"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{t("voucher.title")}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-start">
        <VoucherFilter
          search={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <VoucherTable
        rows={data}
        loading={loading}
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={handleSort}
        page={page}
        onEdit={(row: any) => setEditModal(row)}
        onView={(row: any) => setViewModal(row)}
        onDiabled={(row: any) => handleUpdateStatusVoucher(row.id, false)}
        pageSize={5}
        total={total}
        onPageChange={setPage}
      />
      <UpdateVoucher
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        voucherId={editModal?.id ?? 0}
        onSuccess={fetchVoucher}
      />
      <ViewVoucher
        isOpen={!!viewModal}
        onClose={() => setViewModal(null)}
        voucherId={viewModal?.id ?? 0}
      />
    </div>
  );
};
export default ViewVoucherPage;
