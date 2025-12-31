import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllCategory, updateStatus } from "../../service/api/Category";
import CommonTable from "../../components/ui/CommonTable";
import CategoryFormModal from "../../components/Category/CategoryFormModal";
import UpdateCategoryFormModal from "../../components/Category/UpdateCategoryFormModal";
import { useAlert } from "../../components/alert-context";
import CategoryActionMenu from "../../components/Category/CategoryActionMenu";
import ViewCategoryInformation from "../../components/Category/ViewCategoryInformation";
import { useTranslation } from "react-i18next";

const ViewCategoryPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { showAlert } = useAlert();
    const { t } = useTranslation();
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
    const [showViewModal, setShowViewModal] = useState(false);
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
        { key: "code", label: t("category.code"), sortable: true },
        { key: "name", label: t("category.name"), sortable: true },
        { key: "type", label: t("category.type"), sortable: true },
        { key: "capacity", label: t("category.capacity"), sortable: true },
        { key: "createdAt", label: t("category.createdAt"), sortable: true },
        { key: "updatedAt", label: t("category.updatedAt") },
        {
            key: "status",
            label: t("common.status"),
            render: (row: any) => (
                <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                  ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                >
                    <span
                        className={`h-2 w-2 rounded-full ${row.isActive ? "bg-green-500" : "bg-red-500"
                            }`}
                    ></span>
                    {row.isActive ? t("common.active") : t("common.inactive")}
                </div>
            ),
        },
        {
            key: "action",
            label: t("common.action"),
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

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-700">
                    {t("category.title")}
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2]"
                >
                    {t("category.new")}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
                <div className="relative w-full lg:w-[320px]">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder={t("category.searchPlaceholder")}
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
                        className="flex-1 py-2.5 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none"
                    >
                        <option value="">{t("common.all")}</option>
                        <option value="true">{t("common.active")}</option>
                        <option value="false">{t("common.inactive")}</option>
                    </select>
                </div>
                <div className="flex w-full lg:w-[220px] h-11 border border-[#C2C4C5] rounded-lg overflow-hidden bg-white">
                    <div className="flex items-center px-3 bg-[#F1F2F3] text-gray-600 text-sm whitespace-nowrap">
                        {t("category.type")}
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="flex-1 py-2.5 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none"
                    >
                        <option value="">{t("common.all")}</option>
                        <option value="1">{t("category.room")}</option>
                        <option value="2">{t("category.service")}</option>
                        <option value="3">{t("category.asset")}</option>
                    </select>
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