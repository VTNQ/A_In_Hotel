import { useAlert } from "@/components/alert-context";
import CustomerFilter from "@/components/Customer/CustomerFilter";
import CustomerTable from "@/components/Customer/CustomerTable";
import { getCustomer, updateStatus } from "@/service/api/Customer";
import type { SortDir } from "@/type/common";
import type { Customer } from "@/type/customer.types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ViewCustomerPage = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sortKey, setSortKey] = useState<keyof Customer | null>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const buildParams = () => {
    const param = {
      page,
      size: 10,
      sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
      searchValue,
    };
    return param;
  };
  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);

      const resp = await getCustomer(buildParams());
      setCustomers(resp.content);
      setTotal(resp.totalElements);
    } catch (err: any) {
      setError(err.message || t("common.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [page, sortKey, sortDir, searchValue]);
  const handleSort = (key: keyof Customer) => {
    setPage(1);

    setSortDir((prev) => {
      if (sortKey === key) {
        return prev === "asc" ? "desc" : "asc";
      }
      return "desc";
    });

    setSortKey(key);
  };
   const handleToogleBlock = async (row: any) => {
    const current = row.blocked;
    const newStatus = current === true ? false : true;
    const oldStatus = current;
    setCustomers((prev: any[]) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, blocked: newStatus } : item,
      ),
    );
    try {
      const response = await updateStatus(row.id, newStatus);
      if (response?.data?.status !== "success") {
        throw new Error("Update failed");
      }
    } catch (err: any) {
      setCustomers((prev: any[]) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, blocked: oldStatus } : item,
        ),
      );

      showAlert({
        title: err?.response?.data?.message || "Failed to update status!",
        type: "error",
      });
    }
  };
  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);
  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {" "}
            {t("customer.management.title")}
          </h1>
          <CustomerFilter
            search={searchValue}
            onSearchChange={setSearchValue}
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <CustomerTable
          rows={customers}
          loading={loading}
          sortKey={sortKey}
          sortDir={sortDir}
          onBlocked={(row:any)=>handleToogleBlock(row)}
          onSortChange={handleSort}
          onView={(row:any) => navigate(`/Home/customer/${row.id}`)}
          page={page}
          pageSize={10}
          total={total}
          onPageChange={setPage}
        />
      </div>
    </>
  );
};
export default ViewCustomerPage;
