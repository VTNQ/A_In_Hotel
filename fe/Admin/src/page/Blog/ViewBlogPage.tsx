import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllBlog, updateStatus } from "../../service/api/Blog";
import CommonTable from "../../components/ui/CommonTable";
import BlogFormModal from "../../components/Blog/BlogFormModal";
import { File_URL } from "../../setting/constant/app";
import BlogActionMenu from "../../components/Blog/BlogActionMenu";
import BlogEditFormModal from "../../components/Blog/BlogEditFormModal";
import { useAlert } from "../../components/alert-context";
import ViewBlog from "../../components/Blog/ViewBlog";
import { useTranslation } from "react-i18next";

const ViewBlogPage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const { t } = useTranslation();
    const [sortKey, setSortKey] = useState<string>("id");
    
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { showAlert } = useAlert();
    const [totalResults, setTotalResults] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const fetchData = async (pageNumber = 1, key = sortKey, order = sortOrder) => {
        setLoading(true);
        try {
            let filters: string[] = [];
            if (statusFilter) {
                filters.push(`status==${statusFilter}`);
            }
            const filterQuery = filters.join(" and ");
            const params = {
                page: pageNumber, sort: `${key},${order}`,
                size: 10,
                searchValue: searchValue,
                ...(filterQuery ? { filter: filterQuery } : {})
            }
            const res = await getAllBlog(params);
            setData(res?.data?.content || []);
            setTotalPages(res?.data?.totalPages || 1);
            setTotalResults(res?.data?.totalElements || res?.data?.totalItems || 0);
            setPage(pageNumber);
        } catch (err: any) {
            console.error("Fetch error:", err);
            setError(t("blog.loadError"));
        } finally {
            setLoading(false)
        }
    }
    const handleView = (row: any) => {
        setSelectedBlog(row.id);
        setShowViewModal(true);
    }
    const handleEdit = (row: any) => {
        setSelectedBlog(row.id);
        setShowUpdateModal(true);
    };
    const stripHtml = (html: string) => {
        const temp = document.createElement("div");
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || "";
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };
    useEffect(() => {
        fetchData();
    }, [sortKey, sortOrder, searchValue, statusFilter]);
    const handleRestore = async (row: any) => {
        try {
            setLoading(true);
            const response = await updateStatus(row.id, 1);
            const message = response?.data?.message || t("blog.restoreSucess");
            showAlert({ title: message, type: "success", autoClose: 3000 });
            fetchData();
        } catch (err: any) {
            showAlert({
                title:
                    err?.response?.data?.message ||
                    t("blog.restoreError"),
                type: "error",
            });
        } finally {
            setLoading(false)
        }
    }
    const handlePublish = async (row: any) => {
        try {
            setLoading(true);
            const response = await updateStatus(row.id, 2);
            const message =
                response?.data?.message || t("blog.publishSucess");
            showAlert({ title: message, type: "success", autoClose: 3000 });
            fetchData();
        } catch (err: any) {
            showAlert({
                title:
                    err?.response?.data?.message ||
                    t("blog.publishError"),
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }
    const handleArchive = async (row: any) => {
        try {
            setLoading(true);
            const response = await updateStatus(row.id, 3);
            const message =
                response?.data?.message || t("blog.archiveSucess");
            showAlert({ title: message, type: "success", autoClose: 3000 });
            fetchData();
        } catch (err: any) {
            showAlert({
                title:
                    err?.response?.data?.message ||
                    t("blog.archiveError"),
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }
    const columns = [
        { key: "blogCode", label: t("blog.code"), sortable: true },
        {
            key: "image", label: t("blog.thumbnail"),

            render: (row: any) => (
                <img

                    src={File_URL + row.image.url || "/no-image.png"} // hiển thị ảnh đầu tiên
                    alt={row.code}
                    width="80"
                    height="60"
                    className="mx-auto"
                    style={{ objectFit: "cover", borderRadius: 8, textAlign: "center" }}
                />
            ),
        },
        { key: "title", label: t("blog.name"), sortalbe: true },
        {
            key: "description",
            label: t("blog.description"),
            render: (row: any) => {
                const fullText = stripHtml(row.description || "");
                const shortText =
                    fullText.length > 50 ? fullText.substring(0, 50) + "..." : fullText;

                return (
                    <span
                        title={fullText} // Tooltip full content
                        dangerouslySetInnerHTML={{ __html: shortText }}
                    />
                );
            },
        },
        { key: "createdAt", label: t("blog.createdAt")},
        { key: "updatedAt", label: t("blog.updatedAt") },
        { key: "createdBy", label: t("blog.createdBy") },

        {
            key: "status",
            label: t("common.status"),
            render: (row: any) => {
                const statusCode = row.status;
                const statusMap: Record<number, { label: string; color: string; dot: string }> = {
                    1: { label: t("blog.draft"), color: "bg-[#E4F3FC] text-[#15AEEF]", dot: "bg-[#15AEEF]" },
                    2: { label: t("blog.published"), color: "bg-[#E0F2EA] text-[#36A877]", dot: "bg-[#33B27F]" },
                    3: { label: t("blog.archived"), color: "bg-[#EAEBEB] text-[#626262]", dot: "bg-[#626262]" },
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
            key: "action",
            label: t("common.action"),
            render: (row: any) => (
                <BlogActionMenu
                    blog={row}
                    onView={() => handleView(row)}
                    onEdit={() => handleEdit(row)}
                    onRestore={() => handleRestore(row)}
                    onPublish={() => handlePublish(row)}
                    onArchive={() => handleArchive(row)}
                />
            ),
        },

    ]
    return (
        <div className="flex flex-col flex-1 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-700">
                   {t("blog.title")}
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2]">
                    {t("blog.new")}
                </button>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
                <div className="relative w-full lg:w-[320px]">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder={t("blog.searchPlaceholder")}
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
                        <option value="1">{t("blog.draft")}</option>
                        <option value="2">{t("blog.published")}</option>
                        <option value="3">{t("blog.archived")}</option>
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
            <BlogEditFormModal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                onSuccess={() => {
                    fetchData();
                    setShowUpdateModal(false);
                }}
                blogId={selectedBlog}
            />
            <BlogFormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    fetchData();
                    setShowModal(false);
                }}

            />
            <ViewBlog
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                blogId={selectedBlog}
            />

        </div>
    )
}
export default ViewBlogPage;