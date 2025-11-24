import { useEffect, useState } from "react";
import StaffActionMenu from "../../components/Staff/StaffActionMenu";
import { getAllStaff, updateStatus } from "../../service/api/Staff";
import { Search } from "lucide-react";
import CommonTable from "../../components/ui/CommonTable";
import StaffFormModal from "../../components/Staff/StaffFormModal";
import { useAlert } from "../../components/alert-context";

const ViewStaffPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState<string>("account.id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalResults, setTotalResults] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { showAlert } = useAlert();
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const fetchData = async (pageNumber = 1, key = sortKey, order = sortOrder) => {
    setLoading(true);
    let filters: string[] = [];
    filters.push("(account.role.id==3 or account.role.id==4)"); // nhóm điều kiện role
    if (statusFilter) {
      filters.push(`account.isActive==${statusFilter}`);
    }
    const filterQuery = filters.join(" and ");
    try {
      const response = await getAllStaff({ page: pageNumber, size: 10, sort: `${key},${order}`, searchValue: searchValue, filter: filterQuery });
      setData(response?.data?.content || []);
      setTotalPages(response?.data?.totalPages || 1);
      setTotalResults(response?.data?.totalElements || response?.data?.totalItems || 0);
      setPage(pageNumber);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, [sortKey, sortOrder, searchValue, statusFilter]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const handleDeactivate = async (row: any) => {
    try {
      setLoading(true);
      const response = await updateStatus(row.id, false);
      const message =
        response?.data?.message || "Staff deactivated successfully!";
      showAlert({ title: message, type: "success", autoClose: 3000 });
      fetchData();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          "Failed to deactivate staff. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActive = async (row: any) => {
    try {
      setLoading(true);
      const response = await updateStatus(row.id, true);
      const message =
        response?.data?.message || "Staff activated successfully!";
      showAlert({ title: message, type: "success", autoClose: 3000 });
      fetchData();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          "Failed to activate staff. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "staffCode", label: "StaffID" },
    { key: "fullName", label: "Full Name", sortable: true, keySort: "fullName" },
    { key: "gender", label: "Gender", sortable: true, keySort: "gender" },
    { key: "birthday", label: "Date of Birth" },
    { key: "email", label: "Email", sortable: true, keySort: "account.email" },
    { key: "phone", label: "Phone", sortable: true, keySort: "phone" },
    { key: "role", label: "Role", sortable: true, keySort: "account.role.name" },
    { key: "createdAt", label: "Created Date", sortable: true },
    { key: "updatedAt", label: "Last Updated" },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                  ${row.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${row.isActive ? "bg-green-500" : "bg-gray-400"
              }`}
          ></span>
          {row.isActive ? "Active" : "Inactive"}
        </div>
      )
    },
    {
      key: "action",
      label: "Action",
      render: (row: any) => (
        <StaffActionMenu
          onDeactivate={handleDeactivate}
          onActivate={handleActive}
          staff={row}
        />
      ),
    },
  ]
  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">
          Staff Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2]"
        >
          + New Staff
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search by StaffID, Full Name"
            className="pl-10 pr-3 py-2 border border-[#C2C4C5] rounded-lg w-82 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center border border-[#C2C4C5] rounded-lg overflow-hidden w-80">
          <div className="bg-[#F1F2F3] px-3 py-2 text-gray-600 text-sm">
            Status
          </div>
          <div className="relative flex-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none appearance-none"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
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
      <StaffFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          fetchData();
          setShowModal(false);
        }}

      />
    </div>
  )
}
export default ViewStaffPage;