
import FranchiseInquiryFilter from "@/components/FranchiseInquiry/FranchiseInquiryFilter";
import FranchiseInquiryTable from "@/components/FranchiseInquiry/FranchiseInquiryTable";
import { getFranchiseInquiry } from "@/service/api/FranchiseInquiry";
import type { SortDir } from "@/type/common";
import type { franchiseInquiryResponse } from "@/type/franchiseInquiry.types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ViewFranchiseInquiry = () => {
  const [data, setData] = useState<franchiseInquiryResponse[]>([]);
  const [sortKey, setSortKey] = useState<keyof franchiseInquiryResponse | null>(
    null,
  );
  const { t } = useTranslation();
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const fetchFranchiseInquiry = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getFranchiseInquiry({
        page: page,
        size: 5,
        sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
      });
      setData(response?.data?.content);
      setTotalPages(response.data.totalElements);
    } catch (err: any) {
      setError(err.message || t("common.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [page, sortKey, sortDir]);
  useEffect(() => {
    fetchFranchiseInquiry();
  }, [fetchFranchiseInquiry]);
  const handleSort = (key: keyof franchiseInquiryResponse) => {
    setPage(1);

    setSortDir((prev) => {
      if (sortKey === key) {
        return prev === "asc" ? "desc" : "asc";
      }
      return "desc";
    });

    setSortKey(key);
  };
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className="p-6 bg-gray-50 dark:bg-neutral-950 min-h-screen">
      <div className="mx-auto w-full max-w-[1400px] px-4 lg:px-6 py-4 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold dark:text-white">
              {t("franchiseInquiry.title")}
            </h1>

            <p className="text-sm text-gray-500">
              {t("franchiseInquiry.description")}
            </p>
          </div>
        </div>
        <FranchiseInquiryFilter
          search={searchValue}
          onSearchChange={setSearchValue}
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <FranchiseInquiryTable
          rows={data}
          loading={loading}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={handleSort}
          page={page}
          pageSize={10}
          total={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
export default ViewFranchiseInquiry;
