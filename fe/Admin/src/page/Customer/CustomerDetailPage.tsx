import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Phone,
  Mail,
  Lock,
  Coins,
  Wallet,
  Info,
  ArrowLeft,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { BookingSummary, getCustomerDetail } from "../../service/api/Customer";
import { GetAllBookings } from "../../service/api/Booking";
import { getRewardTransaction } from "../../service/api/Reward-Transaction";
import { getTokens } from "../../util/auth";

import CommonTable from "../../components/ui/CommonTable";
import SimpleDatePicker from "../../components/ui/SimpleDatePicker";
import StatCard from "../../components/Customer/StatCard";

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [customer, setCustomer] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"basic" | "points">("basic");

  /* ================= BOOKINGS ================= */
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingTotalPages, setBookingTotalPages] = useState(1);
  const [bookingTotalResults, setBookingTotalResults] = useState(0);
  const [bookingSortKey, setBookingSortKey] = useState("id");
  const [bookingSortOrder, setBookingSortOrder] = useState<"asc" | "desc">(
    "desc",
  );

  /* ================= REWARD ================= */
  const [rewardTransaction, setRewardTransaction] = useState<any[]>([]);
  const [rewardTransactionPage, setRewardTransactionPage] = useState(1);
  const [rewardTransactionTotalPages, setRewardTransactionTotalPages] =
    useState(1);
  const [rewardTransactionTotalResults, setRewardTransactionTotalResults] =
    useState(0);
  const [rewardTransactionLoading, setRewardTransactionLoading] =
    useState(false);

  const [filterType, setFilterType] = useState<number | "">("");
  const [transactionDate, setTransactionDate] = useState("");

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!id) return;
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [detailRes, summaryRes] = await Promise.all([
        getCustomerDetail(Number(id)),
        BookingSummary(Number(id)),
      ]);

      setCustomer(detailRes);
      setSummary(summaryRes);

      await fetchBookings(1);
      await fetchRewardTransaction(1);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchRewardTransaction = async (pageNumber = rewardTransactionPage) => {
    setRewardTransactionLoading(true);
    try {
      const filters: string[] = [];

      if (filterType) filters.push(`type==${filterType}`);

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
  const rewardColumns = [
    {
      key: "createdAt",
      label: t("reward.table.date"),
      sortable: true,
      render: (row: any) =>
        row.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
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
        const typeMap: Record<number, { label: string; className: string }> = {
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

        const config = typeMap[row.type];

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
      render: (row: any) => row.balanceBefore?.toLocaleString() ?? "0",
    },
    {
      key: "balanceAfter",
      label: t("reward.table.balanceAfter"),
      render: (row: any) => row.balanceAfter?.toLocaleString() ?? "0",
    },
    {
      key: "description",
      label: t("reward.table.description"),
      render: (row: any) => row.description || "-",
    },
  ];
  const bookingColumns = [
    {
      key: "bookingCode",
      label: t("reward.table.bookingId"),
      sortable: true,
      render: (row: any) => (
        <span className="font-medium text-[#2E3A8C]">{row.bookingCode}</span>
      ),
    },

    {
      key: "checkedInAt",
      label: t("booking.actualCheckIn"),
      sortable: true,
      render: (row: any) =>
        row.checkedInAt
          ? new Date(row.checkedInAt).toLocaleString()
          : t("booking.notCheckedIn"),
    },

    {
      key: "checkedOutAt",
      label: t("booking.actualCheckOut"),
      sortable: true,
      render: (row: any) =>
        row.checkedOutAt
          ? new Date(row.checkedOutAt).toLocaleString()
          : t("booking.notCheckedOut"),
    },

    {
      key: "room",
      label: t("booking.room"),
      render: (row: any) => {
        if (!row.details || row.details.length === 0) return "-";

        const detail = row.details.find((d: any) => d.roomId !== null);

        return detail
          ? `${detail.roomName}`
          : `${row.details[0]?.roomName || ""}`;
      },
    },

    {
      key: "totalPrice",
      label: t("booking.totalPrice"),
      sortable: true,
      render: (row: any) => (
        <span className="font-semibold">
          {row.amount?.toLocaleString()} VND
        </span>
      ),
    },

    {
      key: "status",
      label: t("common.status"),
      render: (row: any) => {
        const statusMap: Record<
          number,
          { label: string; bg: string; dot: string }
        > = {
          1: {
            label: t("booking.booked"),
            bg: "bg-purple-100 text-purple-700",
            dot: "bg-purple-600",
          },
          2: {
            label: t("booking.checkIn"),
            bg: "bg-green-100 text-green-700",
            dot: "bg-green-600",
          },
          3: {
            label: t("booking.checkOut"),
            bg: "bg-yellow-100 text-yellow-700",
            dot: "bg-yellow-600",
          },
          4: {
            label: t("booking.cancelled"),
            bg: "bg-red-100 text-red-600",
            dot: "bg-red-600",
          },
        };

        const st = statusMap[row.status] || {
          label: "Unknown",
          bg: "bg-gray-100 text-gray-500",
          dot: "bg-gray-400",
        };

        return (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${st.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${st.dot}`} />
            {st.label}
          </div>
        );
      },
    },
  ];
  if (loading || !customer) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-6">
      {/* ================= BACK ================= */}
      <button
        onClick={() => navigate("/Dashboard/customer")}
        className="flex items-center gap-2 text-sm text-[#2E3A8C] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("common.back")}
      </button>

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold">
            {customer.fullName}
          </h1>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              customer.blocked
                ? "bg-red-100 text-red-600"
                : "bg-[#EEF1FF] text-[#2E3A8C]"
            }`}
          >
            {customer.blocked
              ? t("customer.status.blocked")
              : t("common.active")}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#2E3A8C]" />
            {customer.phone}
          </div>

          <div className="flex items-center gap-2 break-all">
            <Mail className="w-4 h-4 text-[#2E3A8C]" />
            {customer.email}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          {t("customer.customerId")}: {customer.customerCode}
        </p>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-6 border-b border-gray-300 overflow-x-auto whitespace-nowrap">
        {["basic", "points"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-2 transition ${
              activeTab === tab
                ? "border-b-2 border-[#2E3A8C] text-[#2E3A8C] font-semibold"
                : "text-gray-500"
            }`}
          >
            {t(`customer.tabs.${tab}`)}
          </button>
        ))}
      </div>

      {/* ================= BASIC TAB ================= */}
      {activeTab === "basic" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* INFO */}
            <div className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-4 text-sm">
              {[
                ["fullName", customer.fullName],
                ["phone", customer.phone],
                ["email", customer.email],
                ["nationality", customer.nationality || "-"],
              ].map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4">
                  <span className="text-gray-500">{t(`customer.${key}`)}</span>
                  <span className="font-medium break-all text-right">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* POINTS */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  icon={<Wallet className="w-4 h-4 text-[#2E3A8C]" />}
                  label={t("customer.points.total")}
                  value={customer.totalPoint}
                  color="text-[#2E3A8C]"
                />
                <StatCard
                  icon={<Coins className="w-4 h-4 text-green-600" />}
                  label={t("customer.points.available")}
                  value={customer.availablePoint}
                  color="text-green-600"
                />
                <StatCard
                  icon={<Lock className="w-4 h-4 text-gray-600" />}
                  label={t("customer.points.used")}
                  value={customer.usedPoint}
                  color="text-gray-800"
                />
              </div>

              <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3 text-sm text-green-700">
                <Info className="w-5 h-5 mt-0.5" />
                <p>
                  <b>{t("common.tip")}:</b>{" "}
                  {t("customer.points.tip", { percent: 30 })}
                </p>
              </div>
            </div>
          </div>

          {/* BOOKING TABLE */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* ================= TABLE ================= */}
            <div className="xl:col-span-3 bg-white rounded-xl shadow p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">
                {t("customer.bookingHistory.title")}
              </h2>

              <div className="w-full overflow-x-auto">
                <div className="min-w-[700px] lg:min-w-0">
                  <CommonTable
                    columns={bookingColumns}
                    data={bookings}
                    page={bookingPage}
                    totalPages={bookingTotalPages}
                    totalResults={bookingTotalResults}
                    sortKey={bookingSortKey}
                    sortOrder={bookingSortOrder}
                    onPageChange={(p) => fetchBookings(p)}
                    onSortChange={(k, o) => {
                      setBookingSortKey(k);
                      setBookingSortOrder(o);
                      fetchBookings(bookingPage, k, o);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ================= SUMMARY ================= */}
            <div className="bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col gap-6">
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
                <p className="text-xl font-semibold break-words">
                  {summary?.totalRevenue?.toLocaleString() ?? 0} VND
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= POINTS TAB ================= */}
      {activeTab === "points" && (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-4">
          {/* FILTER */}
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              className="w-full lg:w-64 border border-gray-200 rounded-lg px-3 py-2"
            >
              <option value="">{t("reward.type.all")}</option>
              <option value={1}>{t("reward.type.earn")}</option>
              <option value={2}>{t("reward.type.redeem")}</option>
              <option value={3}>{t("reward.type.expire")}</option>
            </select>

            <div className="w-full lg:w-64">
              <SimpleDatePicker
                value={transactionDate}
                onChange={setTransactionDate}
              />
            </div>

            <button
              onClick={() => fetchRewardTransaction(1)}
              className={`w-full lg:w-auto px-4 py-2 rounded-lg  ${
                rewardTransactionLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2E3A8C] hover:opacity-90"
              } text-white`}
            >
              {rewardTransactionLoading
                ? t("common.filtering")
                : t("common.filter")}
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[1000px]">
              <CommonTable
                columns={rewardColumns}
                data={rewardTransaction}
                page={rewardTransactionPage}
                totalPages={rewardTransactionTotalPages}
                totalResults={rewardTransactionTotalResults}
                onPageChange={(p) => fetchRewardTransaction(p)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailPage;
