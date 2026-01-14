import { useEffect, useState } from "react";
import { cancelBooking, GetAllBookings, handleCheckIn } from "../../service/api/Booking";
import { Search } from "lucide-react";
import CommonTable from "../../components/ui/CommonTable";
import SimpleDatePicker from "../../components/ui/SimpleDatePicker";
import BookingActionMenu from "../../components/Booking/BookingActionMenu";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../components/alert-context";
import ConfirmCheckIn from "../../components/Booking/CheckIn/ConfirmCheckIn";
import ConfirmCheckOut from "../../components/Booking/CheckOut/ConfirmCheckOut";
import SwitchRoomModal from "../../components/Booking/SwitchRoom/SwitchRoomModal";
import { getTokens } from "../../util/auth";
import { useTranslation } from "react-i18next";
import ViewBookingModal from "../../components/Booking/View/ViewBookingModal";
import { GUEST_TYPE_MAP } from "../../type/booking.types";

const ViewBooking = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [openSwitchRoom, setOpenSwitchRoom] = useState(false);
  const [sortKey, setSortKey] = useState<string>("id");
  const { t } = useTranslation();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [openViewBooking, setOpenViewBooking] = useState(false);

  const [open, setOpen] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const handleConfirmCheckIn = (row: any) => {
    setOpen(true);
    setSelectedBooking(row);
  };
  const handleOpenCheckout = (booking: any) => {
    setSelectedBooking(booking);
    setOpenCheckout(true);
  };
  const handleCancelBooking = async(booking: any) => {
    try {
      const response = await cancelBooking(booking.id);
      showAlert({
        title: response?.data?.message || t("booking.cancelSuccess"),
        type: "success",
        autoClose: 3000,
      });
      fetchData();
    } catch (err: any) {
      showAlert({
        title: err?.response?.data?.message || t("booking.cancelError"),
        type: "error",
        autoClose: 4000,
      });
    }
  };
  const handleOpenViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setOpenViewBooking(true);
  };
  const handleSwitchRoom = (booking: any) => {
    setSelectedBooking(booking);
    setOpenSwitchRoom(true);
  };
  const fetchData = async (
    pageNumber = 1,
    key = sortKey,
    order = sortOrder
  ) => {
    setLoading(true);
    try {
      let filters: string[] = [`hotelId==${getTokens()?.hotelId}`];
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
        page: pageNumber,
        sort: `${key},${order}`,
        size: 10,
        searchValue: searchValue,
        ...(filterQuery ? { filter: filterQuery } : {}),
      };
      const res = await GetAllBookings(params);

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
  };
  const handleCheckInConfirm = async (id: number) => {
    try {
      const response = await handleCheckIn(id);

      showAlert({
        title: response?.data?.message || "Check-in successful!",
        type: "success",
        autoClose: 3000,
      });

      fetchData();

      return true;
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          "Failed to confirm check-in. Please try again.",
        type: "error",
      });

      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchValue, statusFilter, sortKey, sortOrder, bookingDate]);

  const columns = [
    { key: "code", label: t("booking.code"), sortable: true },
    {key:"idNumber",label:t("bookingGuest.idNumber"),sortable:true},
    { key: "guestName", label: t("booking.guestName"), sortale: true },
    { key: "phoneNumber", label: t("booking.phone"), sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "guestType",
      label: t("booking.guestType"),
      sortable: true,
      render: (value: any) => GUEST_TYPE_MAP[value.guestType] ?? "--",
    },

    {
      key: "checkInDate",
      label: t("booking.checkInDate"),
      render: (row: any) =>
        `${row.checkInDate || ""} ${row.checkInTime || ""}`.trim(),
      sortable: true,
    },
    {
      key: "checkOutDate",
      label: t("booking.checkOutDate"),
      render: (row: any) =>
        `${row.checkOutDate || ""} ${row.checkOutTime || ""}`.trim(),
      sortable: true,
    },
    {
      key: "details.roomName",
      label: t("booking.room"),
      render: (row: any) => {
        if (!row.details || row.details.length === 0) return "";

        // Tìm detail có roomId != null
        const detail = row.details.find((d: any) => d.roomId !== null);

        // Nếu không có roomId khác null => trả về detail đầu tiên hoặc ""
        return detail
          ? detail.roomName
          : row.details[0]?.roomName + "-" + row.details[0]?.roomType || "";
      },
      sortable: true,
      sortKey: "details.roomName",
    },
    {
      key: "totalPrice",
      label: t("booking.totalPrice"),
      render: (row: any) =>
        `${(row.totalPrice ?? 0).toLocaleString("vi-VN")} VNĐ`,
      sortable: true,
    },
    { key: "createdAt", label: t("booking.createdDate"), sortable: true },
    {
      key: "checkedInAt",
      label: t("booking.actualCheckIn"),
      sortable: true,
      render: (value: any) =>
        value.checkedInAt ? value.checkedInAt : t("booking.notCheckedIn"),
    },
    {
      key: "checkedOutAt",
      label: t("booking.actualCheckOut"),
      sortable: true,
      render: (value: any) =>
        value.checkedOutAt ? value.checkedOutAt : t("booking.notCheckedOutIn"),
    },
    {
      key: "status",
      label: t("common.status"),
      render: (row: any) => {
        const statusCode = row.status; // status là số (0–5)

        // Map status code → label + màu sắc
        const statusMap: Record<
          number,
          { label: string; color: string; dot: string }
        > = {
          1: {
            label: t("booking.booked"),
            color: "bg-[#FFDAFB80] text-[#BC00A9]",
            dot: "bg-[#BC00A9]",
          },
          2: {
            label: t("booking.checkIn"),
            color: "bg-[#E0F2EA] text-[#36A877]",
            dot: "bg-[#33B27F]",
          },
          3: {
            label: t("booking.checkOut"),
            color: "bg-[#F9EFCF] text-[#BE7300]",
            dot: "bg-[#BE7300]",
          },
          4: {
            label: t("booking.cancelled"),
            color: "bg-[#FFF4F4] text-[#FF0000]",
            dot: "bg-[#FF0000]",
          },
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
        <BookingActionMenu
          booking={row}
          onCancel={()=>handleCancelBooking(row)}
          onCheckOut={() => handleOpenCheckout(row)}
          onCheckIn={() => handleConfirmCheckIn(row)}
          onView={() => handleOpenViewBooking(row)}
          onSwitchRoom={() => handleSwitchRoom(row)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-700">
          {t("booking.title")}
        </h1>
        <button
          onClick={() => navigate("/Dashboard/booking/create")}
          className="w-full sm:w-auto px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2]"
        >
          {t("booking.new")}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative w-full lg:w-[320px]">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={t("booking.searchPlaceholder")}
            className="w-full pl-10 pr-3 py-2 border border-[#C2C4C5] rounded-lg  focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div className="flex w-full lg:w-[220px] h-11 border border-[#C2C4C5] rounded-lg overflow-hidden bg-white">
          <div className="flex items-center px-3 bg-[#F1F2F3] text-gray-600 text-sm whitespace-nowrap">
            {" "}
            {t("common.status")}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 py-2.5 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none"
          >
            <option value="">{t("common.all")}</option>

            <option value="1">{t("booking.booked")}</option>
            <option value="2">{t("booking.checkIn")}</option>
            <option value="3">{t("booking.checkOut")}</option>
            <option value="4">{t("booking.cancelled")}</option>
          </select>
        </div>
        <div className="w-full lg:w-[260px]">
          <SimpleDatePicker value={bookingDate} onChange={setBookingDate} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
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
      </div>
      <ConfirmCheckIn
        open={open}
        onConfirm={() => handleCheckInConfirm(selectedBooking?.id)}
        onCancel={() => setOpen(false)}
        id={selectedBooking?.id}
      />
      <ConfirmCheckOut
        open={openCheckout}
        id={selectedBooking?.id}
        onCancel={() => setOpenCheckout(false)}
        onConfirm={() => fetchData()}
      />
      <SwitchRoomModal
        open={openSwitchRoom}
        onConfirm={() => fetchData()}
        onClose={() => setOpenSwitchRoom(false)}
        id={selectedBooking?.id}
      />
      <ViewBookingModal
        open={openViewBooking}
        id={selectedBooking?.id}
        onClose={() => setOpenViewBooking(false)}
      />
   
    </div>
  );
};
export default ViewBooking;
