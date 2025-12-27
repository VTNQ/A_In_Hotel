import { Search } from "lucide-react";
import CommonTable from "../../components/ui/CommonTable";
import { useEffect, useState } from "react";
import { getAll, updateStatus } from "../../service/api/ExtraService";
import { getAllCategory } from "../../service/api/Category";
import ExtraServiceFormModal from "../../components/ExtraService/ExtraServiceFormModal";
import { useAlert } from "../../components/alert-context";
import UpdateExtraServiceFormModal from "../../components/ExtraService/UpdateExtraServiceFormModal";
import ExtraServiceActionMenu from "../../components/ExtraService/ExtraServiceActionMenu";
import { getTokens } from "../../util/auth";
import { File_URL } from "../../setting/constant/app";

const ViewExtraServicePage = () => {
  const [data, setData] = useState<any[]>([]);
  const [category, setCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "true" | "false" | ""
  const [categoryFilter, setCategoryFilter] = useState(""); // 🔹 checkbox state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [sortKey, setSortKey] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  // 🔹 Fetch data
  const fetchData = async (pageNumber = 1, key = sortKey, order = sortOrder) => {
    setLoading(true);
    let filters: string[] = [];
    // Nếu có status (true / false)
    if (statusFilter) {
      filters.push(`isActive==${statusFilter}`);
    }

    // Nếu có category (id)
    if (categoryFilter) {
      filters.push(`category.id==${categoryFilter}`);
    }
    filters.push(`hotelId==${getTokens()?.hotelId}`)
    const filterQuery = filters.join(" and ");
    try {
      const params = {
        page: pageNumber, sort: `${key},${order}`,
        size: 10, searchValue: searchValue, ...(filterQuery ? { filter: filterQuery } : {})
      }
      const res = await getAll(params);
      setData(res.data?.content || []);
      setTotalPages(res?.data?.totalPages || 1);
      setTotalResults(res?.data?.totalElements || res?.data?.totalItems || 0);
      setPage(pageNumber);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };
  // 🔹 Fetch Category list
  const fetchCategory = async () => {
    try {
      const res = await getAllCategory({
        all: true,
        filter: "isActive==1 and type==2"
      });
      setCategory(res.content || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load category data.");
    }
  };
  useEffect(() => {
    fetchData();
  }, [searchValue, statusFilter, categoryFilter, sortKey, sortOrder]);
  useEffect(() => {
    fetchData();
    fetchCategory();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleEdit = (row: any) => {
    setSelectedService(row.id);
    setShowUpdateModal(true);
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedService(null);
  };

  const handleDeactivate = async (row: any) => {
    try {
      setLoading(true);
      const response = await updateStatus(row.id, false);
      const message =
        response?.data?.message || "Service deactivated successfully!";
      showAlert({ title: message, type: "success", autoClose: 3000 });
      fetchData();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          "Failed to deactivate service. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleToogleBlock = async (row: any) => {
    const current = row.isActive;
    const newStatus = current === true ? false : true;
    const oldStatus = current;
    setData((prev: any[]) =>
      prev.map(item =>
        item.id === row.id ? { ...item, isActive: newStatus } : item
      )
    );
    try {
      const response = await updateStatus(row.id, newStatus);
      if (response?.data?.status !== "success") {
        throw new Error("Update failed");
      }
    } catch (err: any) {
      setData((prev: any[]) =>
        prev.map(item =>
          item.id === row.id ? { ...item, isActive: oldStatus } : item
        )
      );

      showAlert({
        title: err?.response?.data?.message || "Failed to update status!",
        type: "error",
      });
    }

  }
  const handleActive = async (row: any) => {
    try {
      setLoading(true);
      const response = await updateStatus(row.id, true);
      const message =
        response?.data?.message || "Service activated successfully!";
      showAlert({ title: message, type: "success", autoClose: 3000 });
      fetchData();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          "Failed to activate service. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "serviceCode", label: "Service ID", sortable: true },
    {
      key: "icon",
      label: "Icon",
      render: (row: any) => (
        <img
          src={row.icon != null
            ? File_URL + row.icon?.url
            : "/default.webp"
          }
          // hiển thị ảnh đầu tiên
          alt={row.serviceName}
          width="80"
          height="60"
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    { key: "serviceName", label: "Service Name", sortable: true },
    { key: "categoryName", label: "Category", sortable: true },
    {
      key: "price",
      label: "Price (VNĐ)",
      render: (row: any) =>
        `${row.price?.toLocaleString("vi-VN")} ${"VNĐ"}`,
      sortable: true,
    },
    {
      key: "extraCharge",
      label: "Extra Charge (%)",
    },

    { key: "unit", label: "Unit", sortable: true, },
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (row: any) => (
        <span title={row.description}>
          {row.description?.length > 50
            ? row.description.substring(0, 50) + "..."
            : row.description || "-"}
        </span>
      ),
    },
    {
      key: "note",
      label: "Note",
      render: (row: any) => (
        <span title={row.note}>
          {row.note?.length > 50
            ? row.note.substring(0, 50) + "..."
            : row.note || "No note"}
        </span>
      ),
    },
    { key: "createdAt", label: "Created Date", sortable: true },
    { key: "updatedAt", label: "Last Updated", sortable: true, },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
            ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${row.isActive ? "bg-green-500" : "bg-red-500"
              }`}
          ></span>
          {row.isActive ? "Active" : "Inactive"}
        </div>
      ),
    },
    {
      key: "block",
      label: "Block",
      render: (row: any) => {
        const isActive = row.isActive === true;
        const isInActive = row.isActive === false;
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
      key: "action",
      label: "Action",
      render: (row: any) => (
        <ExtraServiceActionMenu
          service={row}
          onDeactivate={handleDeactivate}
          onActivate={handleActive}
          onEdit={() => handleEdit(row)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 bg-gray-50">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-700">
          Extra Service
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2]"
        >
          + New Extra Service
        </button>
      </div>

      {/* 🔍 Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative w-full lg:w-[300px]">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Name or ID"
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-3 py-2 border border-[#C2C4C5] rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Status */}
        <div className="flex w-full lg:w-[220px] items-center border border-[#C2C4C5] rounded-lg overflow-hidden">
          <div className="bg-[#F1F2F3] px-3 py-2.5 text-gray-600 text-sm">
            Status
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 py-2.5 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        {/* Category */}
        <div className="flex w-full lg:w-[220px] items-center border border-[#C2C4C5] rounded-lg overflow-hidden">
          <div className="bg-[#F1F2F3] px-3 py-2.5 text-gray-600 text-sm">
            Category
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 py-2.5 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none"
          >
            <option value="">All</option>
            {category.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Deactivated checkbox */}

      </div>

      {/* Table */}
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

      {/* Modals */}
      <ExtraServiceFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          fetchData();
          setShowModal(false);
        }}

      />
      <UpdateExtraServiceFormModal
        isOpen={showUpdateModal}
        onClose={handleCloseModal}
        onSuccess={() => {
          fetchData();
          setShowUpdateModal(false);
        }}
        serviceId={selectedService}
      />

    </div>
  );
};

export default ViewExtraServicePage;
