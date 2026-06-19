import { useAlert } from "@/components/alert-context";
import FranchiseSectionEditModal from "@/components/FranchiseSection/FranchiseSectionEditModal";
import FranchiseSectionFilter from "@/components/FranchiseSection/FranchiseSectionFilter";
import FranchiseSectionTable from "@/components/FranchiseSection/FranchiseSectionTable";
import {
  getFranchiseSection,
  updateStatus,
} from "@/service/api/FranchiseSection";
import type { SortDir } from "@/type/common";
import type { FranchiseSection } from "@/type/franchiseSection.types";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const FranchiseSectionPage = () => {
  const [franchiseSection, setFranchiseSection] = useState<FranchiseSection[]>(
    [],
  );
  const [sortKey, setSortKey] = useState<keyof FranchiseSection | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState<FranchiseSection | null>(null);
  const { t } = useTranslation();
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const { showAlert } = useAlert();
  const fetchFranchiseSection = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getFranchiseSection({
        page: page,
        size: 5,
        searchValue: searchValue,
        sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
      });
      setFranchiseSection(response?.data?.content);
      setTotalPages(response.data.totalElements);
    } catch (err: any) {
      setError(err.message || t("common.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [page, sortKey, sortDir, searchValue]);
  useEffect(() => {
    fetchFranchiseSection();
  }, [fetchFranchiseSection]);
  const handleSort = (key: keyof FranchiseSection) => {
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
      showAlert({
        title: t("franchiseSection.status.updateSuccess"),
        type: "success",
      });
      fetchFranchiseSection();
    } catch (err: any) {
      showAlert({
        title: t("franchiseSection.status.updateFailed"),
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
            <h1 className="text-2xl font-semibold dark:text-white">
              {t("franchiseSection.title")}
            </h1>

            <p className="text-sm text-gray-500">
              {t("franchiseSection.breadcrumb")}
            </p>
          </div>
        </div>
        <FranchiseSectionFilter
          search={searchValue}
          onSearchChange={setSearchValue}
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <FranchiseSectionTable
          rows={franchiseSection}
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
          onDeactivate={(row) => handleChangeStatus(row.id ?? 0, false)}
        />
        <FranchiseSectionEditModal
          open={!!editModal}
          franchiseSectionId={editModal?.id ?? 0}
          onClose={() => setEditModal(null)}
          onSubmit={fetchFranchiseSection}
        />
      </div>
    </div>
  );
};
export default FranchiseSectionPage;
