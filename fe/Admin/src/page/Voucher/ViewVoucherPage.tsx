import { useEffect, useState } from "react";
import { useAlert } from "../../components/alert-context";
import { useTranslation } from "react-i18next";
import { VOUCHER_TYPE } from "../../type/voucher.types";
import { Search } from "lucide-react";
import CreateVoucher from "../../components/Voucher/CreateVoucher";
import { getVouchers, updateVoucherStatus } from "../../service/api/Voucher";
import CommonTable from "../../components/ui/CommonTable";
import VoucherActionMenu from "../../components/Voucher/VoucherActionMenu";
import UpdateVoucher from "../../components/Voucher/UpdateVoucher";

const ViewVoucherPage = () => {
  const [data, setData] = useState<any[]>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<string>("id");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { showAlert } = useAlert();
  const [page, setPage] = useState(1);
  const [selectedVoucher, setSelectedVoucher] = useState<any | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
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
    const resp = await getVouchers(params);
    setData(resp.data?.content || []);
    setTotalPages(resp?.data?.totalPages || 1);
    setTotalResults(resp?.data?.totalElements || resp?.data?.totalItems || 0);
    setPage(pageNumber);
  };
  const loadVouchers = async (page = 1) => {
    try {
      setLoading(true);
      await fetchData(page);
    } catch (err) {
      console.error(err);
      setError("loading error voucher");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (row: any) => {
    setSelectedVoucher(row.id);
    setShowUpdateModal(true);
  };
  const handleUpdateStatusVoucher = async (
    voucherId: number,
    isActive: any,
  ) => {
    try {
      setLoading(true);

      const response = await updateVoucherStatus(voucherId, isActive);

      await fetchData(page);

      const message =
        response?.data?.message || t("voucher.successUpdateStatus");

      showAlert({ title: message, type: "success", autoClose: 3000 });
    } catch (err: any) {
      showAlert({
        title: err?.response?.data?.message || t("voucher.errorUpdateStatus"),
        type: "error",
      });
    }finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    loadVouchers();
  }, [sortKey, sortOrder, statusFilter, searchValue]);
  const columns = [
    { key: "voucherCode", label: t("voucher.code"), sortable: true },
    { key: "voucherName", label: t("voucher.name"), sortable: true },
    {
      key: "type",
      label: t("voucher.discountType"),
      sortable: true,
      render: (row: any) => t(VOUCHER_TYPE[Number(row.type)]),
    },
    {
      key: "value",
      label: t("voucher.discountValue"),
      sortable: true,
      render: (row: any) => {
        const value = row.value;
        if (row.type === 1 || row.type == 3) {
          return `${value.toLocaleString()} VND`;
        } else {
          return `${value}%`;
        }
      },
    },

    {
      key: "roomTypes[0].roomTypeName",
      label: t("voucher.roomType"),

      render: (row: any) => {
        if (!row.roomTypes || row.roomTypes.length === 0) return "-";

        const firstIncluded = row.roomTypes.find(
          (r: any) => r.excluded === false,
        );

        return firstIncluded ? firstIncluded.roomTypeName : "-";
      },
    },
    {
      key: "validPeriod",
      label: t("voucher.validPeriod"),
      render: (row: any) => {
        if (!row.startDate || !row.endDate) return "-";
        return `${row.startDate} - ${row.endDate}`;
      },
    },
    {
      key: "priority",
      label: t("voucher.usage"),
      sortable: true,
      render: (row: any) => {
        return `${row.priority}/10`;
      },
    },
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
            ? t("voucher.status.enabled")
            : t("voucher.status.disabled")}
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
        <VoucherActionMenu
          voucher={row}
          onEdit={() => handleEdit(row)}
          onView={() => {}}
          onDiabled={()=>handleUpdateStatusVoucher(row.id,false)}
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
          onClick={() => setOpen(true)}
          className="px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2]"
        >
          {t("voucher.new")}
        </button>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <div className="relative w-full lg:w-[320px]">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={t("voucher.searchPlaceholder")}
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
            <option value="true">{t("voucher.status.enabled")}</option>
            <option value="false">{t("voucher.status.disabled")}</option>
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
      <CreateVoucher
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() => fetchData()}
      />
      <UpdateVoucher
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSuccess={() => fetchData()}
        voucherId={selectedVoucher}
      />
    </div>
  );
};
export default ViewVoucherPage;
