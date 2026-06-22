import { useAlert } from "@/components/alert-context";
import FranchiseSectionItemEditModal from "@/components/FranchiseSectionItem/FranchiseSectionItemEditModal";
import FranchiseSectionItemFilter from "@/components/FranchiseSectionItem/FranchiseSectionItemFilter";
import FranchiseSectionItemTable from "@/components/FranchiseSectionItem/FranchiseSectionItemTable";
import {
  getFranchiseSectionItem,
  updateStatusFranchiseSectionItem,
} from "@/service/api/FranchiseSectionItem";
import type { SortDir } from "@/type/common";
import type { FranchiseSectionItem } from "@/type/franchiseSectionItem.types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const FranchiseSectionItemPage = () => {
  const { sectionId } = useParams();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [franchiseSectionItem, setFranchiseSectionItem] = useState<
    FranchiseSectionItem[]
  >([]);
  const [sortKey, setSortKey] = useState<keyof FranchiseSectionItem | null>(
    null,
  );
  const { t } = useTranslation();
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const [totalPages, setTotalPages] = useState(0);
  const [editModal, setEditModal] = useState<FranchiseSectionItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchFranchiseSectionItem = useCallback(async () => {
    try {
      setLoading(true);
      let filters: string[] = [`section.id==${sectionId}`];
      const filterQuery = filters.join(" and ");
      const response = await getFranchiseSectionItem({
        page: page,
        size: 5,
        filter: filterQuery,
        searchValue: searchValue,
        sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
      });
      setFranchiseSectionItem(response?.data?.content);
      setTotalPages(response.data.totalElements);
    } catch (err: any) {
      setError(err.message || t("common.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [page, sortKey, sortDir, searchValue]);
  useEffect(() => {
    fetchFranchiseSectionItem();
  }, [fetchFranchiseSectionItem]);
  const handleSort = (key: keyof FranchiseSectionItem) => {
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
      await updateStatusFranchiseSectionItem(id, next);
      showAlert({
        title: t("franchiseSectionItem.status.updateSuccess"),
        type: "error",
      });
    } catch (err: any) {
      showAlert({
        title: t("franchiseSectionItem.status.updateFailed"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 bg-gray-50 dark:bg-neutral-950 min-h-screen">
      <div className="mx-auto w-full max-w-[1400px] px-4 lg:px-6 py-4 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">
              {t("franchiseSectionItem.title")}
            </h1>

            <p className="text-sm text-gray-500">Section #{sectionId}</p>
          </div>
          <button
            onClick={() => navigate("/Home/franchise-section")}
            className="px-4 py-2
            border
            rounded-lg
            text-sm
            hover:bg-gray-100
            dark:hover:bg-neutral-800"
          >
            ← {t("common.back")}
          </button>
        </div>
        <FranchiseSectionItemFilter
          search={searchValue}
          onSearchChange={setSearchValue}
          SectionId={sectionId}
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <FranchiseSectionItemTable
          rows={franchiseSectionItem}
          loading={loading}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={handleSort}
          page={page}
          pageSize={10}
          total={totalPages}
          onPageChange={setPage}
          onEdit={(row) => setEditModal(row)}
          onActive={(row) => handleChangeStatus(row.id ?? 0, true)}
          onDeActive={(row) => handleChangeStatus(row.id ?? 0, false)}
        />
        <FranchiseSectionItemEditModal
          open={!!editModal}
          franchiseSectionItemId={editModal?.id ?? 0}
          onClose={() => setEditModal(null)}
          onSubmit={fetchFranchiseSectionItem}
        />
      </div>
    </div>
  );
};
export default FranchiseSectionItemPage;
