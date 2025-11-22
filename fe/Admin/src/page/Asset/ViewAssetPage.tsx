import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import CommonTable from "../../components/ui/CommonTable";
import { getAllAsset, updateStatus } from "../../service/api/Asset";
import AssetFormModal from "../../components/Asset/AssetFormModal";
import { getAllCategory } from "../../service/api/Category";
import AssetActionMenu from "../../components/Asset/AssetActionMenu";
import UpdateAssetFormModal from "../../components/Asset/UpdateAssetFormModal";
import { useAlert } from "../../components/alert-context";
import ViewAssetInformation from "../../components/Asset/ViewAssetInformation";
import { getTokens } from "../../util/auth";

const ViewAssetPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState<any[]>([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [showModal, setShowModal] = useState(false);
    const { showAlert } = useAlert();
    const [totalResults, setTotalResults] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sortKey, setSortKey] = useState<string>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [showViewModal, setShowViewModal]=useState(false);
    const handleEdit = (row: any) => {
        setSelectedAsset(row.id);
        setShowUpdateModal(true);
    };
    const handleMaintenance = async (row: any) => {
        try {
            setLoading(true);
            const response = await updateStatus(row.id, 2);
            const message =
                response?.data?.message || "Asset Maintenance successfully!";
            showAlert({ title: message, type: "success", autoClose: 3000 });
            fetchData();
        } catch (err: any) {
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to Maintenance Asset. Please try again.",
                type: "error",
            });
        }
    };
    const handleView = (row: any) => {
        setSelectedAsset(row.id);
        setShowViewModal(true);
      };
    const handleActive = async (row: any) => {
        try {
            setLoading(true);
            const response = await updateStatus(row.id, 1);
            const message =
                response?.data?.message || "Asset Active successfully!";
            showAlert({ title: message, type: "success", autoClose: 3000 });
            fetchData();
        } catch (err: any) {
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to Active Asset. Please try again.",
                type: "error",
            });
        }
    };
    const handleDeActived = async (row: any) => {
        try {
            setLoading(true);
            const response = await updateStatus(row.id, 4);
            const message =
                response?.data?.message || "Asset DeActived successfully!";
            showAlert({ title: message, type: "success", autoClose: 3000 });
            fetchData();
        } catch (err: any) {
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to Deactived Asset. Please try again.",
                type: "error",
            });
        }
    };
    const handleToogleBlock = async (row: any) => {
        const current = row.status;
        const newStatus = current === 1 ? 3 : 1;
        const oldStatus = current;
        setData((prev: any[]) =>
            prev.map(item =>
                item.id === row.id ? { ...item, status: newStatus } : item
            )
        );
        try {
            const response=await updateStatus(row.id,newStatus);
            if (response?.data?.status !== "success") {
                throw new Error("Update failed");
            }
        } catch (err: any) {
            setData((prev: any[]) =>
                prev.map(item =>
                    item.id === row.id ? { ...item, status: oldStatus } : item
                )
            );

            showAlert({
                title: err?.response?.data?.message || "Failed to update status!",
                type: "error",
            });
        }

    }
    const columns = [
        { key: "assetCode", label: "Asset ID" ,sortable: true },
        { key: "assetName", label: "Asset Name" },
        { key: "roomName", label: "Room",sortable: true },
        { key: "categoryName", label: "Category",sortable: true },
        {
            key: "price",
            label: "Price",
            render: (row: any) =>
                `${row.price?.toLocaleString("vi-VN")} ${row.currency || "VNĐ"}`,
            sortable: true
        },
        { key: "quantity", label: "Quantity",sortable:true },
    

        { key: "createdAt", label: "Created Date" ,sortable: true},
        { key: "updatedAt", label: "Last Updated Date",sortable: true },
        {
            key:"note",
            label:"Note",
            render: (row: any) => (
                <span title={row.note}>
                  {row.note?.length > 50
                    ? row.note.substring(0, 50) + "..."
                    : row.note || "No note"}
                </span>
              ),
        },
        {
            key: "action",
            label: "Action",
            render: (row: any) => (
                <AssetActionMenu
                    asset={row}
                    onEdit={() => handleEdit(row)}
                    onView={()=>handleView(row)}
                    onActivate={() => handleActive(row)}
                    onDeactivate={() => handleDeActived(row)}
                    onMaintenance={() => handleMaintenance(row)}
                />
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (row: any) => {
                const statusCode = row.status; // status là số (0–5)

                // Map status code → label + màu sắc
                const statusMap: Record<number, { label: string; color: string; dot: string }> = {
                    1: { label: "Good", color: "bg-green-50 text-green-700", dot: "bg-green-500" },
                    2: { label: "Maintenance", color: "bg-red-50 text-red-700", dot: "bg-red-500" },
                    3: { label: "Broken", color: "bg-fuchsia-50 text-fuchsia-700", dot: "bg-fuchsia-500" },
                    4: { label: "Deactivated", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
                };


                // Nếu không khớp code nào, dùng mặc định
                const st = statusMap[statusCode] || {
                    label: "Unknown",
                    color: "bg-gray-100 text-gray-500",
                    dot: "bg-gray-400",
                };

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
        {
            key: "block",
            label: "Block",
            render: (row: any) => {
                const isBlocked = row.status === 3;
                const isGood = row.status === 1;

                // Chỉ cho phép toggle khi status = Good hoặc Blocked
                const isToggleEnabled = isGood || isBlocked;

                return (
                    <label className="flex items-center justify-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isBlocked}
                            disabled={!isToggleEnabled}
                            onChange={() => handleToogleBlock(row)}
                            className="hidden"
                        />

                        {/* TOGGLE UI */}
                        <div
                            className={`
                                w-12 h-6 flex items-center rounded-full p-1
                                transition
                                ${!isBlocked ? "bg-[#2E3A8C]" : "bg-gray-300"}
                                ${!isToggleEnabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                            `}
                        >
                            <div
                                className={`
                                    bg-white w-5 h-5 rounded-full shadow-md transform transition
                                    ${!isBlocked ? "translate-x-6" : "translate-x-0"}
                                `}
                            />
                        </div>
                    </label>
                );
            },
        },
    ]
   
    const fetchCategory = async () => {
        try {
            const res = await getAllCategory({ page: 1, size: 10, searchField: "type", searchValue: "3", filter: "isActive==1" });
            setCategories(res.content || []);
        } catch (err) {
            console.log(err)
        }
    }

    const fetchData = async (pageNumber = 1, key = sortKey, order = sortOrder) => {
        setLoading(true);
        try {
            let filters: string[] = [];
            if (statusFilter) {
                filters.push(`status==${statusFilter}`);
            }
            if (categoryFilter) {
                filters.push(`category.id==${categoryFilter}`);

            }
            filters.push(`hotelId==${getTokens()?.hotelId}`)

            const filterQuery = filters.join(" and ");
            const params = {
                page: pageNumber, sort: `${key},${order}`,
                size: 10,
                searchValue: searchValue,
                ...(filterQuery ? { filter: filterQuery } : {})
            }
            const res = await getAllAsset(params);
            setData(res?.data?.content || []);
            setTotalPages(res?.data?.totalPages || 1);
            setTotalResults(res?.data?.totalElements || res?.data?.totalItems || 0);
            setPage(pageNumber);
        } catch (err: any) {
            console.error("Fetch error:", err);
            setError("Failed to load data.");
        } finally {
            setLoading(false);
        }
    }
    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setSelectedAsset(null);
    };
    useEffect(() => {
        fetchData();
    }, [sortKey, sortOrder, searchValue, categoryFilter, statusFilter]);

    useEffect(() => {
        fetchData();
        fetchCategory();
    }, [])
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };
    return (
        <div className="flex flex-col flex-1 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">
                    Amenties & Asset Tracking
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2]"
                >
                    + New Asset
                </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder="Search by Asset ID, Asset Name"
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
                            <option value="1">GOOD</option>
                            <option value="2">MAINTENANCE</option>
                            <option value="3">BROKEN</option>
                            <option value="4">DEACTIVATED</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center border border-[#C2C4C5] rounded-lg overflow-hidden w-80">
                    <div className="bg-[#F1F2F3] px-3 py-2.5 text-gray-600 text-sm whitespace-nowrap">
                        Category
                    </div>
                    <div className="relative flex-1">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full py-2 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none appearance-none"
                        >
                            <option value="">All</option>
                            {categories.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
                
            </div>
            <AssetFormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    fetchData();
                    setShowModal(false);
                }}
            />
            <ViewAssetInformation
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                assetId={selectedAsset}
            />
            <UpdateAssetFormModal
                isOpen={showUpdateModal}
                onClose={handleCloseModal}
                onSuccess={() => {
                    fetchData();
                    setShowUpdateModal(false);
                }}
                assetId={selectedAsset}
            />
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

        </div>
    )
}
export default ViewAssetPage;