import { useAlert } from "@/components/alert-context";
import CategoryEdit from "@/components/Category/CategoryEdit";
import { CategoryFilter } from "@/components/Category/CategoryFilter";
import CategoryTable from "@/components/Category/CategoryTable";
import CategoryViewInformation from "@/components/Category/CategoryViewInformation";
import { getAllCategories, updateStatus } from "@/service/api/Categories";
import type { Category } from "@/type/category.types";
import type { SortDir } from "@/type/common";
import type { StatusFilter } from "@/type/hotel.types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ViewCategoryPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [sortKey, setSortKey] = useState<keyof Category | null>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);

  const [editModal, setEditModal] = useState<Category | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const handleChangeStatus = async (id: number, next: any) => {
    try {
      setLoading(true);
      await updateStatus(id, next);
      showAlert({
        title: t("category.status.updateSuccess"),
        type: "success",
      });
      fetchData();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          "Failed to change status of category. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSort = (key: keyof Category) => {
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
    setSelectedCategory(row.id);
    setShowViewModal(true);
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      let filters = [];
      if (statusFilter !== "ALL") {
        filters.push(`isActive==${statusFilter}`);
      }
      if (typeFilter) {
        filters.push(`type==${typeFilter}`);
      }
      const param = {
        page: page,
        sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
        size: 10,
        searchValue,
        ...(filters.length > 0 && { filter: filters.join(" and ") }),
      };
      const res = await getAllCategories(param);
      setData(res?.content || []);
      setTotal(res?.totalElements || 0);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [page, sortKey, sortDir, searchValue, statusFilter, typeFilter]);

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t("category.title")}</h2>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <CategoryFilter
            search={searchValue}
            onSearchChange={setSearchValue}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={(v) => setTypeFilter(v)}
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <CategoryTable
          rows={data}
          loading={loading}
          page={page}
          pageSize={10}
          total={total}
          onPageChange={setPage}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={handleSort}
          onView={(row) => handleView(row)}
          onEdit={(row) => setEditModal(row)}
          onActivate={(row) => handleChangeStatus(row?.id ?? 0, true)}
          onDeactivate={(row) => handleChangeStatus(row?.id ?? 0, false)}
        />
        <CategoryEdit
          open={!!editModal}
          categoryId={editModal?.id ?? 0}
          onClose={() => setEditModal(null)}
          onSubmit={fetchData}
        />

        <CategoryViewInformation
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          categoryId={selectedCategory}
        />
      </div>
    </>
  );
};
export default ViewCategoryPage;
