import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookingSummary, getCustomerDetail } from "../../service/api/Customer";
import {
  Phone,
  Mail,
  Lock,
  Coins,
  Wallet,
  Info,
  ArrowLeft,
} from "lucide-react";
import { GetAllBookings } from "../../service/api/Booking";
import { getTokens } from "../../util/auth";
import CommonTable from "../../components/ui/CommonTable";
import { getRewardTransaction } from "../../service/api/Reward-Transaction";
import SimpleDatePicker from "../../components/ui/SimpleDatePicker";
import { useTranslation } from "react-i18next";

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"basic" | "points">("basic");
  const [loading, setLoading] = useState(false);
  const [bookingPage, setBookingPage] = useState(1);
  const [rewardTransaction, setRewardTransaction] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<number | "">("");
  const [rewardTransactionPage, setRewardTransactionPage] = useState(1);
  const [rewardTransactionLoading, setRewardTransactionLoading] =
    useState(false);
  const [transactionDate, setTransactionDate] = useState("");
  const [rewardTransactionTotalPages, setRewardTransactionTotalPages] =
    useState(1);
  const [rewardTransactionTotalResults, setRewardTransactionTotalResults] =
    useState(0);
  const [bookingTotalPages, setBookingTotalPages] = useState(1);
  const [summary, setSummary] = useState<any | null>(null);
  const [bookingTotalResults, setBookingTotalResults] = useState(0);
  const [bookingSortKey, setBookingSortKey] = useState("id");
  const [bookingSortOrder, setBookingSortOrder] = useState<"asc" | "desc">(
    "desc",
  );
  useEffect(() => {
    if (id) {
      fetchDetail();
      fetchBookings(1);
      fetchRewardTransaction(1);
    }
  }, [id]);
  const fetchRewardTransaction = async (pageNumber = rewardTransactionPage) => {
    setRewardTransactionLoading(true);

    try {
      const filters: string[] = [];

      if (filterType) {
        filters.push(`type==${filterType}`);
      }

      if (transactionDate) {
        filters.push(
          `createdAt=ge=${transactionDate}T00:00:00+07:00`,
          `createdAt=le=${transactionDate}T23:59:59+07:00`,
        );
      }

      const filterQuery = filters.length ? filters.join(";") : undefined;

      const res = await getRewardTransaction({
        page: pageNumber,
        size: 5,
        filter: filterQuery
          ? `customerId==${id};${filterQuery}`
          : `customerId==${id}`,
      });

      setRewardTransaction(res?.content || []);
      setRewardTransactionTotalPages(res?.totalPages || 1);
      setRewardTransactionTotalResults(res?.totalElements || 0);
      setRewardTransactionPage(pageNumber);
    } finally {
      setRewardTransactionLoading(false);
    }
  };
  const navigate = useNavigate();

  const fetchBookings = async (
    pageNumber = bookingPage,
    key = bookingSortKey,
    order = bookingSortOrder,
  ) => {
    const res = await GetAllBookings({
      page: pageNumber,
      size: 5,
      sort: `${key},${order}`,
      filter: `customer.id==${id} and hotelId==${getTokens()?.hotelId}`,
    });

    setBookings(res?.content || []);
    setBookingTotalPages(res?.totalPages || 1);
    setBookingTotalResults(res?.totalElements || 0);
    setBookingPage(pageNumber);
  };
  const fetchDetail = async () => {
    setLoading(true);
    try {
      const [detailRes, bookingSummary] = await Promise.all([
        getCustomerDetail(Number(id)),
        BookingSummary(Number(id), getTokens()?.hotelId ?? 0),
      ]);
      setSummary(bookingSummary);
      setCustomer(detailRes);
    } finally {
      setLoading(false);
    }
  };
  if (loading || !customer) return <p>Loading...</p>;
  return (
    <div className="flex flex-col gap-6 bg-gray-50 p-6">
      {/* BACK BUTTON */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => navigate("/Dashboard/customer")}
          className="flex items-center gap-2 text-sm text-[#2E3A8C] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("common.back")}
        </button>
      </div>

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow">
        {/* Top row: Name + Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-semibold text-gray-800">
            {customer.fullName}
          </h1>

          <span
            className={`px-3 py-1 text-sm rounded-full font-medium w-fit
            ${
              customer.blocked
                ? "bg-red-100 text-red-600"
                : "bg-[#EEF1FF] text-[#2E3A8C]"
            }
          `}
          >
            {customer.blocked
              ? t("customer.status.blocked")
              : t("common.active")}
          </span>
        </div>

        {/* Phone + Email */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-gray-600 mt-2">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#2E3A8C]" />
            <span>{customer.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#2E3A8C]" />
            <span className="break-all">{customer.email}</span>
          </div>
        </div>

        {/* Customer ID */}
        <div className="mt-2">
          <span className="text-sm text-gray-500">
            {t("customer.customerId")}: {customer.customerCode}
          </span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("basic")}
          className={`pb-2 transition
          ${
            activeTab === "basic"
              ? "border-b-2 border-[#2E3A8C] text-[#2E3A8C] font-semibold"
              : "text-gray-500"
          }`}
        >
          {t("customer.tabs.basic")}
        </button>

        <button
          onClick={() => setActiveTab("points")}
          className={`pb-2 transition
          ${
            activeTab === "points"
              ? "border-b-2 border-[#2E3A8C] text-[#2E3A8C] font-semibold"
              : "text-gray-500"
          }`}
        >
          {t("customer.tabs.points")}
        </button>
      </div>
      {activeTab === "basic" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: BASIC INFO */}
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {t("customer.fullName")}
                  </span>
                  <span className="text-sm font-medium">
                    {customer.fullName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {t("customer.phone")}
                  </span>
                  <span className="text-sm font-medium">{customer.phone}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {t("customer.email")}
                  </span>
                  <span className="text-sm font-medium break-all text-right">
                    {customer.email}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {t("customer.nationality")}
                  </span>
                  <span className="text-sm font-medium">
                    {customer.nationality || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* POINTS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Points */}
                <div className="bg-white p-5 rounded-xl shadow">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Wallet className="w-4 h-4 text-[#2E3A8C]" />
                    <span className="font-medium">
                      {t("customer.points.total")}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[#2E3A8C]">
                    {customer.totalPoint}
                  </p>
                </div>

                {/* Available Points */}
                <div className="bg-white p-5 rounded-xl shadow">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Coins className="w-4 h-4 text-green-600" />
                    <span className="font-medium">
                      {t("customer.points.available")}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {customer.availablePoint}
                  </p>
                </div>

                {/* Used Points */}
                <div className="bg-white p-5 rounded-xl shadow">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Lock className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">
                      {t("customer.points.used")}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {customer.usedPoint}
                  </p>
                </div>
              </div>

              {/* TIP BOX */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-sm text-green-700 leading-relaxed">
                  <b>{t("common.tip")}:</b>{" "}
                  {t("customer.points.tip", { percent: 30 })}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">
                {t("customer.bookingHistory.title")}
              </h2>
              <CommonTable
                columns={[
                  {
                    key: "bookingCode",
                    label: t("reward.table.bookingId"),
                    sortable: true,
                  },
                  {
                    key: "checkedInAt",
                    label: t("booking.actualCheckIn"),
                    sortable: true,
                    render: (value: any) =>
                      value.checkedInAt
                        ? value.checkedInAt
                        : t("booking.notCheckedIn"),
                  },
                  {
                    key: "checkedOutAt",
                    label: t("booking.actualCheckOut"),
                    sortable: true,
                    render: (value: any) =>
                      value.checkedOutAt
                        ? value.checkedOutAt
                        : t("booking.notCheckedOutIn"),
                  },
                  {
                    key: "details.roomName",
                    label: t("booking.room"),
                    render: (row: any) => {
                      if (!row.details || row.details.length === 0) return "";

                      // Tìm detail có roomId != null
                      const detail = row.details.find(
                        (d: any) => d.roomId !== null,
                      );

                      // Nếu không có roomId khác null => trả về detail đầu tiên hoặc ""
                      return detail
                        ? detail.roomName
                        : row.details[0]?.roomName +
                            "-" +
                            row.details[0]?.roomType || "";
                    },
                  },
                  {
                    key: "totalPrice",
                    label: t("booking.totalPrice"),
                    sortable: true,
                    render: (row: any) => (
                      <span className="font-medium">
                        {row.amount?.toLocaleString()} VND
                      </span>
                    ),
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
                ]}
                data={bookings}
                page={bookingPage}
                totalPages={bookingTotalPages}
                totalResults={bookingTotalResults}
                sortKey={bookingSortKey}
                sortOrder={bookingSortOrder}
                onPageChange={(newPage) => {
                  fetchBookings(newPage);
                }}
                onSortChange={(key, order) => {
                  setBookingSortKey(key);
                  setBookingSortOrder(order);
                  fetchBookings(bookingPage, key, order);
                }}
              />
            </div>
            <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-5">
              <div>
                <p className="text-sm text-gray-500">
                  {t("customer.bookingSummary.totalBookings")}
                </p>
                <p className="text-2xl font-semibold">
                  {summary?.totalBookings ?? 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t("customer.bookingSummary.nightsStayed")}
                </p>
                <p className="text-2xl font-semibold">
                  {summary?.nightsStayed ?? 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t("customer.bookingSummary.totalRevenue")}
                </p>
                <p className="text-xl font-semibold">
                  {summary?.totalRevenue?.toLocaleString() ?? 0} VND
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {activeTab === "points" && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#2E3A8C]">
            {t("reward.title")}
          </h2>
          {/* FILTER BAR */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative w-full lg:w-[320px]">
              <select
                value={filterType}
                onChange={(e) =>
                  setFilterType(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="w-full pl-10 pr-3 py-2 border border-[#C2C4C5] rounded-lg  focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">{t("reward.type.all")}</option>
                <option value={1}>{t("reward.type.earn")}</option>
                <option value={2}>{t("reward.type.redeem")}</option>
                <option value={3}>{t("reward.type.expire")}</option>
              </select>
            </div>
            <div className="w-full lg:w-[260px]">
              <SimpleDatePicker
                value={transactionDate}
                onChange={setTransactionDate}
              />
            </div>
            {/* TYPE FILTER */}

            {/* FILTER BUTTON */}
            <button
              onClick={() => fetchRewardTransaction(1)}
              disabled={rewardTransactionLoading}
              className={`ml-auto px-4 py-2 rounded-lg text-sm font-medium text-white
    ${
      rewardTransactionLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#2E3A8C] hover:opacity-90"
    }
  `}
            >
              {rewardTransactionLoading
                ? t("common.filtering")
                : t("common.filter")}
            </button>
          </div>
          {rewardTransactionLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-100 rounded animate-pulse"
                />
              ))}
            </div>
          )}
          {!rewardTransactionLoading && (
            <CommonTable
              columns={[
                {
                  key: "createdAt",
                  label: t("reward.table.date"),
                  sortable: true,
                  render: (row: any) =>
                    row.createdAt
                      ? new Date(row.createdAt).toLocaleString()
                      : "-",
                },
                {
                  key: "transactionCode",
                  label: t("reward.table.transactionId"),
                  render: (row: any) => (
                    <span className="text-[#2E3A8C] font-medium">
                      {row.transactionCode}
                    </span>
                  ),
                },
                {
                  key: "bookingCode",
                  label: t("reward.table.bookingId"),
                  render: (row: any) => row.bookingCode || "-",
                },
                {
                  key: "type",
                  label: t("reward.table.type"),
                  render: (row: any) => {
                    const typeConfig: Record<
                      number,
                      { label: string; className: string }
                    > = {
                      1: {
                        label: t("reward.type.earn"),
                        className: "bg-green-100 text-green-700",
                      },
                      2: {
                        label: t("reward.type.redeem"),
                        className: "bg-red-100 text-red-600",
                      },
                      3: {
                        label: t("reward.type.expire"),
                        className: "bg-gray-100 text-gray-600",
                      },
                    };

                    const config = typeConfig[row.type];

                    return (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          config?.className || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {config?.label || "UNKNOWN"}
                      </span>
                    );
                  },
                },

                {
                  key: "points",
                  label: t("reward.table.points"),

                  render: (row: any) => {
                    const isEarn = row.type === 1;
                    const value = Math.abs(row.points);

                    return (
                      <span
                        className={`font-semibold ${
                          isEarn ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {isEarn ? `+${value}` : `-${value}`}
                      </span>
                    );
                  },
                },

                {
                  key: "balanceBefore",
                  label: t("reward.table.balanceBefore"),
                  render: (row: any) =>
                    row.balanceBefore?.toLocaleString() ?? "0",
                },
                {
                  key: "balanceAfter",
                  label: t("reward.table.balanceAfter"),
                  render: (row: any) =>
                    row.balanceAfter?.toLocaleString() ?? "0",
                },
                {
                  key: "description",
                  label: t("reward.table.description"),
                  render: (row: any) => row.description || "-",
                },
              ]}
              data={rewardTransaction}
              page={rewardTransactionPage}
              totalPages={rewardTransactionTotalPages}
              totalResults={rewardTransactionTotalResults}
              onPageChange={(newPage) => {
                fetchRewardTransaction(newPage);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
export default CustomerDetailPage;
