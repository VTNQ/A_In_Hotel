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

const ViewBlogPage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [sortKey, setSortKey] = useState<string>("id");
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showViewModal,setShowViewModal]=useState(false);
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
            setError("Failed to load data.");
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
            const message = response?.data?.message || "Blog restored successfully!";
            showAlert({ title: message, type: "success", autoClose: 3000 });
            fetchData();
        } catch (err: any) {
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to restore blog. Please try again.",
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
                response?.data?.message || "Blog published successfully!";
            showAlert({ title: message, type: "success", autoClose: 3000 });
            fetchData();
        } catch (err: any) {
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to publish blog. Please try again.",
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
                response?.data?.message || "Blog archived successfully!";
            showAlert({ title: message, type: "success", autoClose: 3000 });
            fetchData();
        } catch (err: any) {
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to archive blog. Please try again.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }
    const columns = [
        { key: "blogCode", label: "BlogID", sortable: true },
        {
            key: "image", label: "Thumbnail",

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
        { key: "title", label: "Title", sortalbe: true },
        {
            key: "description",
            label: "Description",
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
        { key: "createdAt", label: "Created Date" },
        { key: "updatedAt", label: "Last Updated Date" },
        { key: "createdBy", label: "Created By" },

        {
            key: "status",
            label: "Status",
            render: (row: any) => {
                const statusCode = row.status;
                const statusMap: Record<number, { label: string; color: string; dot: string }> = {
                    1: { label: "Draft", color: "bg-[#E4F3FC] text-[#15AEEF]", dot: "bg-[#15AEEF]" },
                    2: { label: "Published", color: "bg-[#E0F2EA] text-[#36A877]", dot: "bg-[#33B27F]" },
                    3: { label: "Archived", color: "bg-[#EAEBEB] text-[#626262]", dot: "bg-[#626262]" },
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
            label: "Action",
            render: (row: any) => (
                <BlogActionMenu
                    blog={row}
                    onView={()=>handleView(row)}
                    onEdit={() => handleEdit(row)}
                    onRestore={()=>handleRestore(row)}
                    onPublish={() => handlePublish(row)}
                    onArchive={() => handleArchive(row)}
                />
            ),
        },

    ]
    return (
        <div className="flex flex-col flex-1 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">
                    Blog Post
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2]">
                    + New Blog
                </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder="Search by Id,Title"
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
                            <option value="1">Draft</option>
                            <option value="2">Published</option>
                            <option value="3">Archived</option>
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