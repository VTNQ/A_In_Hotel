import { useEffect, useState } from "react";
import { GetAllBookings } from "../../service/api/Booking";
import { Search } from "lucide-react";
import CommonTable from "../../components/ui/CommonTable";
import SimpleDatePicker from "../../components/ui/SimpleDatePicker";
import BookingActionMenu from "../../components/Booking/BookingActionMenu";

const ViewBooking = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bookingDate, setBookingDate] = useState("");

    const [sortKey, setSortKey] = useState<string>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };


    const fetchData = async (pageNumber = 1, key = sortKey, order = sortOrder) => {
        setLoading(true);
        try {
            let filters: string[] = [];
            if (statusFilter) {
                filters.push(`status==${statusFilter}`);
            }
            if (bookingDate) {
                filters.push(
                    `createdAt=ge=${bookingDate}T00:00:00+07:00`,
                    `createdAt=le=${bookingDate}T23:59:59+07:00`
                );

            }
            const filterQuery = filters.join(" and ");
            const params = {
                page: pageNumber, sort: `${key},${order}`,
                size: 10,
                searchValue:searchValue,
                ...(filterQuery ? { filter: filterQuery } : {})
            }
            const res = await GetAllBookings(params);
            console.log(res)
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
    }, [searchValue, statusFilter, sortKey, sortOrder,bookingDate]);

    const columns = [
        { key: "code", label: "Booking Id", sortable: true },
        { key: "guestName", label: "Guest Name", sortale: true },
        { key: "phoneNumber", label: "Phone", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "guestType", label: "Guest Type", sortable: true },
        {
            key: "checkInDate",
            label: "Check-in Date",
            render: (row: any) => `${row.checkInDate || ""} ${row.checkInTime || ""}`.trim(),
            sortable: true
        },
        {
            key: "checkOutDate",
            label: "Check-out Date",
            render: (row: any) => `${row.checkOutDate || ""} ${row.checkOutTime || ""}`.trim(),
            sortable: true
        },
        {
            key: "details.roomName",
            label: "Room",
            render: (row: any) => {
                if (!row.details || row.details.length === 0) return "";

                // Tìm detail có roomId != null
                const detail = row.details.find((d: any) => d.roomId !== null);

                // Nếu không có roomId khác null => trả về detail đầu tiên hoặc ""
                return detail ? detail.roomName : (row.details[0]?.roomName
                    + "-" + row.details[0]?.roomType || "");
            },
            sortable: true,
            sortKey: "details.roomName"
        },
        {
            key: "totalPrice",
            label: "Total Price",
            render: (row: any) =>
                `${(row.totalPrice ?? 0).toLocaleString("vi-VN")} VNĐ`,
            sortable: true
        },
        { key: "createdAt", label: "Created Date", sortable: true },
        {
            key: "status",
            label: "Status",
            render: (row: any) => {
                const statusCode = row.status; // status là số (0–5)

                // Map status code → label + màu sắc
                const statusMap: Record<number, { label: string; color: string; dot: string }> = {
                    1: { label: "Draft", color: "bg-[#E4F3FC] text-[#15AEEF]", dot: "bg-[#15AEEF]" },
                    2: { label: "Booked", color: "bg-[#FFDAFB80] text-[#BC00A9]", dot: "bg-[#BC00A9]" },
                    3: { label: "Checked-in", color: "bg-[#E0F2EA] text-[#36A877]", dot: "bg-[#33B27F]" },
                    4: { label: "Checked-out", color: "bg-[#F9EFCF] text-[#BE7300]", dot: "bg-[#BE7300]" },
                    5: { label: "Cancelled", color: "bg-[#FFF4F4] text-[#FF0000]", dot: "bg-[#FF0000]" },
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
              <BookingActionMenu
                booking={row}
               
              />
            ),
          },

    ]

    return (
        <div className="flex flex-col flex-1 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">Room</h1>
                <button className="px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2] transition">
                    + New Booking
                </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder="Search by room number, name"
                        className="pl-10 pr-3 py-2 border border-[#C2C4C5] rounded-lg w-72 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>
                <div className="flex items-center border border-[#b0ddf3] rounded-lg overflow-hidden w-80">
                    <div className="bg-[#F1F2F3] px-3 py-2 text-gray-600 text-sm">Status</div>
                    <select value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)} className="w-full py-2 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none">
                        <option value="">All</option>
                        <option value="1">Draft</option>
                        <option value="2">Booked</option>
                        <option value="3">Check-in</option>
                        <option value="4">Check-out</option>
                        <option value="4">Cancelled</option>
                    </select>
                </div>
                <div className="flex items-center border border-[#b0ddf3] rounded-xl  h-10 w-80">

                    <div className="bg-[#F1F2F3] px-3 text-gray-600 text-sm h-full flex items-center">
                        Booking Date
                    </div>

                    <div className="flex-1 h-full">
                        <SimpleDatePicker value={bookingDate} onChange={setBookingDate} />
                    </div>

                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
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
        </div>
    )
}
export default ViewBooking;