import { Search } from "lucide-react";
import ActionMenu from "../../components/ui/ActionMenu";
import { useEffect, useState } from "react";
import { getAllCategory } from "../../service/api/Category";
import CommonTable from "../../components/ui/CommonTable";

const ViewCategoryPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fetchData = async () => {
        setLoading(true);
        try {
            const params = { page: 1, size: 10 }
            const res = await getAllCategory(params);
            setData(res?.content || []);
        } catch (err: any) {
            console.error("Fetch error:", err);
            setError("Failed to load data.");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, [])
    const columns = [
        { key: "code", label: "Category ID", sortable: true },
        { key: "name", label: "Category Name", sortable: true },
        { key: "type", label: "Type", sortable: true },
        { key: "capacity", label: "Capacity", sortable: true },
        { key: "createdAt", label: "Created Date" },
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
                <ActionMenu
                    row={row}
                />
            ),
        },
    ]
    return (
        <div className="flex h-screen bg-gray-50">
            <div className="flex flex-col flex-1">
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-700">
                            Category Service
                        </h1>
                        <button
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
                                    className="w-full py-2.5 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none appearance-none">
                                    <option value="">All</option>
                                    <option value="1">Room</option>
                                    <option value="2">Extra Service</option>
                                    <option value="3">Asset</option>
                                </select>
                            </div>

                        </div>
                        <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 accent-blue-600"
                            />
                            <span>Deactivated</span>
                        </label>
                    </div>
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <CommonTable columns={columns} data={data} itemsPerPage={10} />
                    )}

                </main>
            </div>
        </div>
    )
}

export default ViewCategoryPage;