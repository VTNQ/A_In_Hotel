import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllVoucher, updateStatus } from "../../service/api/Voucher";
import { Search } from "lucide-react";
import CommonTable from "../../components/ui/CommonTable";
import VoucherFormModal from "../../components/Voucher/VoucherFormModal";
import VoucherActionMenu from "../../components/Voucher/VoucherActionMenu";
import { useAlert } from "../../components/alert-context";
import VoucherEditModal from "../../components/Voucher/VoucherEditModal";

const ViewVoucherPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string>("id");
  const { showAlert } = useAlert();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedVoucher, setSelectedVoucher] = useState<any | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const fetchData = async (
    pageNumber = 1,
    key = sortKey,
    order = sortOrder
  ) => {
    setLoading(true);
    try {
      let filters: string[] = [];
      if (statusFilter) {
        filters.push(`status==${statusFilter}`);
      }
      const filterQuery = filters.join(" and ");
      const params = {
        page: pageNumber,
        size: 10,
        sort: `${key},${order}`,
        searchValue: searchValue,
        ...(filterQuery ? { filter: filterQuery } : {}),
      };
      const response = await getAllVoucher(params);
      setData(response.data?.content || []);
      setTotalPages(response?.data?.totalPages || 1);
      setTotalResults(response?.data?.totalElements || 0);
      setPage(pageNumber);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(t("voucher.errorLoad"));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row: any) => {
    setSelectedVoucher(row);
    setShowUpdateModal(true);
  };

  const changeStatus = async (row: any) => {
    try {
      setLoading(true);
      const response = await updateStatus(row.id, row.status == 1 ? 2 : 1);
      const message = response?.data?.message || t("voucher.changeSuccess");
      showAlert({ title: message, type: "success", autoClose: 3000 });
      fetchData();
    } catch (err: any) {
      showAlert({
        title: err?.response?.data?.message || t("voucher.changeError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [sortKey, sortOrder, searchValue, statusFilter]);
  const columns = [
    { key: "voucherCode", label: t("voucher.code") },
    { key: "voucherName", label: t("voucher.name") },
    {
      key: "discountType",
      label: t("voucher.discountType"),
      render: (row: any) =>
        row.discountType == 1
          ? t("voucher.createOrUpdate.percent")
          : t("voucher.createOrUpdate.fixed"),
    },
    { key: "discountValue", label: t("voucher.discountValue") },
    { key: "minBookingAmount", label: t("voucher.minBookingAmount") },
    { key: "maxDiscount", label: t("voucher.maxDiscount") },
    { key: "startDate", label: t("voucher.startDate") },
    { key: "endDate", label: t("voucher.endDate") },
    { key: "usageLimit", label: t("voucher.usageLimit") },
    {
      key: "usageCount",
      label: t("voucher.usageCount"),
      render: (row: any) => row.usageCount || 0,
    },
    {
      key: "status",
      label: t("voucher.status"),
      render: (row: any) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endDate = row.endDate ? new Date(row.endDate) : null;

        let statusKey: "ACTIVE" | "INACTIVE" | "EXPIRED" | "UNKNOWN" =
          "UNKNOWN";

        if (endDate && endDate < today) {
          statusKey = "EXPIRED";
        } else {
          if (row.status === 1) statusKey = "ACTIVE";
          else if (row.status === 2) statusKey = "INACTIVE";
        }
        const statusMap: Record<
          string,
          { label: string; color: string; dot: string }
        > = {
          ACTIVE: {
            label: t("common.active"),
            color: "bg-green-50 text-green-700",
            dot: "bg-green-500",
          },
          INACTIVE: {
            label: t("common.inactive"),
            color: "bg-yellow-50 text-yellow-700",
            dot: "bg-yellow-500",
          },
          EXPIRED: {
            label: t("voucher.expired"),
            color: "bg-gray-100 text-gray-500",
            dot: "bg-gray-400",
          },
          UNKNOWN: {
            label: "Unknown",
            color: "bg-gray-100 text-gray-500",
            dot: "bg-gray-400",
          },
        };
        const st = statusMap[statusKey];

        return (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${st.color}`}
          >
            <span className={`h-2 w-2 rounded-full ${st.dot}`} />
            {st.label}
          </div>
        );
      },
    },
    { key: "createdAt", label: t("voucher.createdAt") },
    { key: "updatedAt", label: t("voucher.updatedAt") },
    {
      key: "action",
      label: t("common.action"),
      render: (row: any) => (
        <VoucherActionMenu
          voucher={row}
          onEdit={() => handleEdit(row)}
          onActivate={() => changeStatus(row)}
          onDeactivate={() => changeStatus(row)}
        />
      ),
    },
  ];
  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-700">
          {t("voucher.title")}
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2] transition"
        >
          {t("voucher.new")}
        </button>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
        <div className="relative w-full lg:w-[300px]">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t("voucher.searchPlaceholder")}
            className="w-full pl-10 pr-3 py-2 border border-[#C2C4C5] rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div className="flex w-full lg:w-[220px] h-11 border border-[#C2C4C5] rounded-lg overflow-hidden bg-white">
          <div className="flex items-center px-3 bg-[#F1F2F3] text-gray-600 text-sm whitespace-nowrap">
            {t("common.status")}
          </div>
          <div className="w-px bg-[#C2C4C5]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 py-2 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none"
          >
            <option value="">{t("common.all")}</option>
            <option value="1">{t("common.active")}</option>
            <option value="2">{t("common.inactive")}</option>
          </select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
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

        <VoucherFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchData();
            setShowModal(false);
          }}
        />
        <VoucherEditModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={() => {
            fetchData();
            setShowUpdateModal(false);
          }}
          voucherId={selectedVoucher?.id}
        />
      </div>
    </div>
  );
};
export default ViewVoucherPage;
