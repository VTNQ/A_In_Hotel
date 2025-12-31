import { useEffect, useMemo, useState } from "react";
import { File_URL } from "../../setting/constant/app";
import BannerActionMenu from "../../components/Banner/BannerActionMenu";
import { Search } from "lucide-react";
import CommonTable from "../../components/ui/CommonTable";
import { getBanner } from "../../service/api/Banner";
import BannerFormModal from "../../components/Banner/BannerFormModal";
import BannerEditFormModal from "../../components/Banner/BannerEditFormModal";
import { useTranslation } from "react-i18next";

const ViewBanner = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
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
        { key: "bannerCode", label: t("banner.code"), sortable: true },
        { key: "name", label: t("banner.name"), sortable: true },
        { key: "startAt", label: t("banner.startAt"), sortable: true },
        { key: "endAt", label: t("banner.endAt"), sortable: true },
        {
            key: "image", label: t("banner.thumbnail"),

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
        { key: "createdAt", label: t("banner.createdAt"), sortable: true },
        { key: "updatedAt", label: t("banner.updatedAt"), sortable: true },
        {
            key: "status",
            label: t("common.status"),
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
            label: t("common.action"),
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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-700">
                    {t("banner.title")}
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2]"
                >
                   {t("banner.new")}
                </button>

            </div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative w-full lg:w-[320px]">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder={t("banner.searchPlaceholder")}
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
                        <option value="ACTIVE">{t("common.active")}</option>
                        <option value="INACTIVE">{t("common.inactive")}</option>
                    </select>
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
                <p className="text-gray-500">{t("common.loading")}</p>
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