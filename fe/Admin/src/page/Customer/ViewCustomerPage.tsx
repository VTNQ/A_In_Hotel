import { useEffect, useState } from "react";
import { useAlert } from "../../components/alert-context";
import { useTranslation } from "react-i18next";
import { getCustomer, updateStatus } from "../../service/api/Customer";
import { Search } from "lucide-react";
import CommonTable from "../../components/ui/CommonTable";
import CustomerActionMenu from "../../components/Customer/CustomerActionMenu";
import { useNavigate } from "react-router-dom";
import { getTokens } from "../../util/auth";

const ViewCustomerPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>("id");
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const fetchData = async (pageNumber = page) => {
    setLoading(true);
    try {
      const params = {
        page: pageNumber,
        size: 10,
        sort: `${sortKey},${sortOrder}`,
        searchValue,
        filter:`hotelId==${getTokens()?.hotelId}`
      };

      const res = await getCustomer(params);

      setData(res?.content || []);
      setTotalPages(res?.totalPages || 1);
      setTotalResults(res?.totalElements || res?.totalItems || 0);
      setPage(pageNumber);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(t("common.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  useEffect(() => {
    fetchData(1);
  }, [searchValue, sortKey, sortOrder]);
  const handleToogleBlock = async (row: any) => {
    const current = row.blocked;
    const newStatus = current === true ? false : true;
    const oldStatus = current;
    setData((prev: any[]) =>
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
      setData((prev: any[]) =>
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
  const columns = [
    {
      key: "customerCode",
      label: t("customer.table.customerId"),
      
    },
    { key: "fullName", label: t("customer.table.fullName") },
    {
      key: "email",
      label: t("customer.table.email"),
    
      sortKey: "account.email",
    },
    {
      key: "phone",
      label: t("customer.table.phone"),
    
      sortKey: "phoneNumber",
    },
    {
      key: "totalCompletedBookings",
      label: t("customer.table.totalBookings"),
     
    },
    {
      key: "rewardBalance",
      label: t("customer.table.rewardBalance"),
   
    },
    {
      key: "block",
      label: t("customer.table.block"),
      render: (row: any) => {
        const isActive = row.blocked === true;
        const isInActive = row.blocked === false;
        const isToggleEnabled = isActive || isInActive;

        return (
          <label className="flex items-center justify-center cursor-pointer">
            <input
              type="checkbox"
              checked={isInActive}
              disabled={!isToggleEnabled}
              onChange={() => handleToogleBlock(row)}
              className="hidden"
            />

            {/* TOGGLE UI */}
            <div
              className={`
                          w-12 h-6 flex items-center rounded-full p-1
                          transition
                          ${isInActive ? "bg-gray-300" : "bg-[#2E3A8C]"}
                          ${!isToggleEnabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                      `}
            >
              <div
                className={`
                              bg-white w-5 h-5 rounded-full shadow-md transform transition
                              ${isActive ? "translate-x-6" : "translate-x-0"}
                          `}
              />
            </div>
          </label>
        );
      },
    },
    {
      key: "status",
      label: t("common.status"),
      render: (row: any) => (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                  ${row.blocked ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              row.blocked ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          {row.blocked ? t("common.active") : t("common.inactive")}
        </div>
      ),
    },
    {
      key: "lastBookingAt",
      label: t("customer.table.lastBooking"),
 
    },
    {
      key: "action",
      label: t("common.action"),
      render: (row: any) => (
        <CustomerActionMenu
          customer={row}
          onView={() => navigate(`/Dashboard/customer/${row.id}`)}
        />
      ),
    },
  ];
  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-700">
          {t("customer.management.title")}
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={t("customer.search.placeholder")}
            className="w-full pl-10 pr-3 py-2 border border-[#C2C4C5] rounded-lg  focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
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
          }}
        />
      )}
    </div>
  );
};
export default ViewCustomerPage;
