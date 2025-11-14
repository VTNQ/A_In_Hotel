import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllCategory, updateStatus } from "../../service/api/Category";
import CommonTable from "../../components/ui/CommonTable";
import CategoryFormModal from "../../components/Category/CategoryFormModal";
import UpdateCategoryFormModal from "../../components/Category/UpdateCategoryFormModal";
import { useAlert } from "../../components/alert-context";
import CategoryActionMenu from "../../components/Category/CategoryActionMenu";
import ViewCategoryInformation from "../../components/Category/ViewCategoryInformation";

const ViewCategoryPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { showAlert } = useAlert();
    const [sortKey, setSortKey] = useState<string>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchValue, setSearchValue] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [showViewModal, setShowViewModal]=useState(false);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };
    const handleView = (row: any) => {
        setSelectedCategory(row.id);
        setShowViewModal(true);
      };
    const fetchData = async (pageNumber = 1, key = sortKey, order = sortOrder) => {
        setLoading(true);
        try {
            let filters: string[] = [];
            // Nếu có status (true / false)
            if (statusFilter) {
                filters.push(`isActive==${statusFilter}`);
            }

            // Nếu có category (id)
            if (typeFilter) {
                filters.push(`type==${typeFilter}`);
            }
        
            const filterQuery = filters.join(" and ");
            const params = {
                page: pageNumber, sort: `${key},${order}`,
                size: 10, searchValue: searchValue, ...(filterQuery ? { filter: filterQuery } : {})
            }
            const res = await getAllCategory(params);
            setData(res?.content || []);
            setTotalPages(res?.totalPages || 1);
            setTotalResults(res?.totalElements || res?.totalItems || 0);
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
    }, [searchValue, statusFilter, typeFilter, sortKey, sortOrder]);

    useEffect(() => {
        fetchData();
    }, [])
    const handleEdit = (row: any) => {
        setSelectedCategory(row.id);
        setShowUpdateModal(true);
    };
    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setSelectedCategory(null);
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
        { key: "code", label: "Category ID", sortable: true },
        { key: "name", label: "Category Name", sortable: true },
        { key: "type", label: "Type", sortable: true },
        { key: "capacity", label: "Capacity", sortable: true },
        { key: "createdAt", label: "Created Date",sortable: true },
        { key: "updatedAt", label: "Last Updated" },
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
            key: "action",
            label: "Action",
            render: (row: any) => (
                <CategoryActionMenu
                category={row}
                onView={() => handleView(row)}
                onEdit={() => handleEdit(row)}
                onActivate={() => handleActive(row)}
                onDeactivate={() => handleDeactivate(row)}
                />
            ),
        },
    ]
    return ( 
    <div className="flex flex-col flex-1 bg-gray-50">
     
        <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-700">
                            Category Service
                        </h1>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2]"
                        >
                            + New Category
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={handleSearchChange}
                                placeholder="Search by Category ID, Category Name"
                                className="pl-10 pr-3 py-2 border border-[#C2C4C5] rounded-lg w-82 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center border border-[#C2C4C5] rounded-lg overflow-hidden w-80">
                            <div className="bg-[#F1F2F3] px-3 py-2.5 text-gray-600 text-sm">
                                Status
                            </div>
                            <div className="relative flex-1">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full py-2.5 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none appearance-none"
                                >
                                    <option value="">All</option>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center border border-[#C2C4C5] rounded-lg overflow-hidden w-80">
                            <div className="bg-[#F1F2F3] px-3 py-2.5 text-gray-600 text-sm whitespace-nowrap">
                                Type
                            </div>
                            <div className="relative flex-1">
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full py-2.5 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none appearance-none">
                                    <option value="">All</option>
                                    <option value="1">Room</option>
                                    <option value="2">Extra Service</option>
                                    <option value="3">Asset</option>
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
                    <ViewCategoryInformation
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    categoryId={selectedCategory}
                    />
                    <CategoryFormModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        onSuccess={() => {
                            fetchData();
                            setShowModal(false);
                        }}

                    />
                    <UpdateCategoryFormModal
                        isOpen={showUpdateModal}
                        onClose={handleCloseModal}
                        onSuccess={() => {
                            fetchData();
                            setShowUpdateModal(false);
                        }}
                        categoryId={selectedCategory}
                    />
            
        </div>
    )
}

export default ViewCategoryPage;