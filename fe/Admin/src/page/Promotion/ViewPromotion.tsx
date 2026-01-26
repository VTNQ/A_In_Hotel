import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getPromotionAll,
  updateStatusPromotion,
} from "../../service/api/Promotion";
import { Search } from "lucide-react";
import CommonTable from "../../components/ui/CommonTable";
import { PROMOTION_TYPE_I18N } from "../../type/promotion.types";
import CreatePromotion from "../../components/Promotion/Create/CreatePromotion";
import PromotionActionMenu from "../../components/Promotion/PromotionActionMenu";
import UpdatePromotion from "../../components/Promotion/UpdatePromotion";
import { useAlert } from "../../components/alert-context";

const ViewPromotion = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<string>("id");
  const { showAlert } = useAlert();
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

const fetchData = async (
  pageNumber = 1,
  key = sortKey,
  order = sortOrder,
) => {
  let filters: string[] = [];

  if (statusFilter) {
    filters.push(`isActive==${statusFilter}`);
  }

  const filterQuery = filters.join(" and ");

  const params = {
    page: pageNumber,
    sort: `${key},${order}`,
    size: 10,
    searchValue: searchValue,
    ...(filterQuery ? { filter: filterQuery } : {}),
  };

  const res = await getPromotionAll(params);

  setData(res.data?.content || []);
  setTotalPages(res?.data?.totalPages || 1);
  setTotalResults(
    res?.data?.totalElements || res?.data?.totalItems || 0,
  );
  setPage(pageNumber);
};

  const handleEdit = (row: any) => {
    setSelectedService(row.id);
    setShowUpdateModal(true);
  };
  const loadPromotions = async (page = 1) => {
  try {
    setLoading(true);
    await fetchData(page);
  } catch (err) {
    console.error(err);
    setError(t("promotion.errorLoad"));
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadPromotions();
  }, [sortKey, sortOrder, statusFilter, searchValue]);
 const handleUpdateStatusPromotion = async (
  promotionId: number,
  isActive: any,
) => {
  try {
    setLoading(true);

    const response = await updateStatusPromotion(promotionId, isActive);

  
    await fetchData(page);

    const message =
      response?.data?.message || t("promotion.successUpdateStatus");

    showAlert({ title: message, type: "success", autoClose: 3000 });
  } catch (err: any) {
    showAlert({
      title:
        err?.response?.data?.message ||
        t("promotion.errorUpdateStatus"),
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};

  const { t } = useTranslation();
  const columns = [
    { key: "code", label: t("promotion.code"), sortable: true },
    { key: "name", label: t("promotion.name"), sortable: true },
    {
      key: "type",
      label: t("promotion.type"),
      sortable: true,
      render: (value: any) => t(PROMOTION_TYPE_I18N[Number(value.type)]),
    },

    { key: "value", label: t("promotion.value"), sortable: true },
    { key: "startDate", label: t("promotion.startDate"), sortable: true },
    { key: "endDate", label: t("promotion.endDate"), sortable: true },
    {
      key: "status",
      label: t("common.status"),
      render: (row: any) => (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                  ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              row.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          {row.isActive
            ? t("promotion.status.enabled")
            : t("promotion.status.disabled")}
        </div>
      ),
    },
    { key: "createdAt", label: t("common.createdAt"), sortable: true },
    { key: "updatedAt", label: t("common.updatedAt"), sortable: true },
    {
      key: "createdBy",
      label: t("promotion.createdBy"),
      render: (value: any) => value.createdBy ?? t("common.none"),
    },
    {
      key: "action",
      label: t("common.action"),
      render: (row: any) => (
        <PromotionActionMenu
          promotion={row}
          onDiabled={() => handleUpdateStatusPromotion(row.id, false)}
          onView={() => {}}
          onEdit={() => handleEdit(row)}
        />
      ),
    },
  ];
  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-700">
          {t("promotion.title")}
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2]"
        >
          {t("promotion.new")}
        </button>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <div className="relative w-full lg:w-[320px]">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={t("promotion.searchPlaceholder")}
            className="w-full pl-10 pr-3 py-2 border border-[#C2C4C5] rounded-lg  focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div className="flex w-full lg:w-[220px] h-11 border border-[#C2C4C5] rounded-lg overflow-hidden bg-white">
          <div className="flex items-center px-3 bg-[#F1F2F3] text-gray-600 text-sm whitespace-nowrap">
            {t("common.status")}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2.5 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none appearance-none"
          >
            <option value="">{t("common.all")}</option>
            <option value="true">{t("common.active")}</option>
            <option value="false">{t("common.inactive")}</option>
          </select>
        </div>
      </div>
      {loading ? (
        <p className="text-gray-500">{t("common.loading")}</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <CommonTable
          columns={columns}
          data={data}
          page={page}
          totalPages={totalPages}
          totalResults={totalResults}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onPageChange={(newPage) => fetchData(newPage)}
          onSortChange={(key, order) => {
            setSortKey(key);
            setSortOrder(order);
            fetchData(page, key, order);
          }}
        />
      )}
      <CreatePromotion
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() => fetchData()}
      />
      <UpdatePromotion
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSuccess={() => fetchData()}
        promotionId={selectedService}
      />
    </div>
  );
};
export default ViewPromotion;
