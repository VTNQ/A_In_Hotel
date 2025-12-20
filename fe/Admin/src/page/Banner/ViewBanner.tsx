import { useEffect, useMemo, useState } from "react";
import { File_URL } from "../../setting/constant/app";
import BannerActionMenu from "../../components/Banner/BannerActionMenu";
import { Search } from "lucide-react";
import CommonTable from "../../components/ui/CommonTable";
import { getBanner } from "../../service/api/Banner";
import BannerFormModal from "../../components/Banner/BannerFormModal";
import BannerEditFormModal from "../../components/Banner/BannerEditFormModal";

const ViewBanner = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selectedBanner, setSelectedBanner] = useState<any | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [sortKey, setSortKey] = useState<string>("id");
    const [totalResults, setTotalResults] = useState(0);
    const computeStatus = (row: any) => {
        const now = Date.now();
        const s = row.startAt ? new Date(row.startAt).getTime() : undefined;
        const e = row.endAt ? new Date(row.endAt).getTime() : undefined;
        if (typeof s === "number" && now < s) return "INACTIVE";
        if (typeof e === "number" && now > e) return "INACTIVE";
        return "ACTIVE";
    };
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };
    const handleEdit = (row: any) => {
        setSelectedBanner(row.id);
        setShowUpdateModal(true);
    };
    const fetchData = async (pageNumber = 1, key = sortKey, order = sortOrder) => {
        setLoading(true);
        try {
            const params = {
                page: pageNumber, sort: `${key},${order}`,
                size: 10,
                searchValue: searchValue,
            }
            const resp = await getBanner(params);
            setData(resp?.data?.content || []);
            setTotalPages(resp?.data?.totalPages || 1);
            setTotalResults(resp?.data?.totalElements || resp?.data?.totalItems || 0);
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
        setSelectedBanner(null);
    };
    useEffect(() => {
        fetchData();
    }, [sortKey, sortOrder, searchValue])
    const filteredRows = useMemo(() => {
        if (statusFilter === "") return data;
        return data.filter((r) => computeStatus(r) === statusFilter);
    }, [data, statusFilter]);
    const columns = [
        { key: "bannerCode", label: "Banner ID", sortable: true },
        { key: "name", label: "Banner Name", sortable: true },
        { key: "startAt", label: "Start At", sortable: true },
        { key: "endAt", label: "End At", sortable: true },
        {
            key: "image", label: "Thumbnail",

            render: (row: any) => (
                <img

                    src={File_URL + row.image?.url || "/no-image.png"}
                    alt={row.code}
                    width="80"
                    height="60"
                    className="mx-auto"
                    style={{ objectFit: "cover", borderRadius: 8, textAlign: "center" }}
                />
            ),
        },
        { key: "createdAt", label: "Created Date", sortable: true },
        { key: "updatedAt", label: "Last Updated Date", sortable: true },
        {
            key: "status",
            label: "Tình trạng",
            render: (row: any) => {
                const st = computeStatus(row);

                return (
                    <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                  ${st == "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                    >
                        <span
                            className={`h-2 w-2 rounded-full ${st == "ACTIVE" ? "bg-green-500" : "bg-red-500"
                                }`}
                        ></span>
                        {st == "ACTIVE" ? "Active" : "Inactive"}
                    </div>
                );
            },
        },
        {
            key: "action",
            label: "Action",
            render: (row: any) => (
                <BannerActionMenu
                    banner={row}
                    onEdit={() => handleEdit(row)}

                />
            ),
        }
    ]
    return (
        <div className="flex flex-col flex-1 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">
                    Banner
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2]"
                >
                    + New Banner
                </button>

            </div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder="Search by id,name"
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
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">InActive</option>
                        </select>
                    </div>
                </div>


            </div>
            <BannerFormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    fetchData();
                    setShowModal(false);
                }}
            />
            <BannerEditFormModal
                isOpen={showUpdateModal}
                onClose={handleCloseModal}
                onSuccess={() => {
                    fetchData();
                    setShowUpdateModal(false);
                }}
                bannerId={selectedBanner}
            />
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <CommonTable
                    columns={columns}
                    data={filteredRows}
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
export default ViewBanner;