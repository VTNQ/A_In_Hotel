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

import { getRewardTransaction } from "../../service/api/Reward-Transaction";
import { useTranslation } from "react-i18next";
import BookingHistoryTable from "@/components/Customer/BookingHistoryTable";
import type { BookingResponse } from "@/type/booking.types";
import { DatePickerField } from "@/components/ui/DatePickerField";
import RewardTransactionTable from "@/components/Customer/RewardTransactionTable";
import { SelectField } from "@/components/ui/select";

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"basic" | "points">("basic");
  const [loading, setLoading] = useState(false);
  const [bookingPage, setBookingPage] = useState(1);
  const [rewardTransaction, setRewardTransaction] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>("");
  const [rewardTransactionPage, setRewardTransactionPage] = useState(1);

  const [rewardTransactionLoading, setRewardTransactionLoading] =
    useState(false);
  const [transactionDate, setTransactionDate] = useState<Date | undefined>(
    undefined,
  );
  const [rewardTransactionTotalPages, setRewardTransactionTotalPages] =
    useState(1);
  const [rewardTransactionTotalResults, setRewardTransactionTotalResults] =
    useState(0);
  const [bookingTotalPages, setBookingTotalPages] = useState(1);
  const [summary, setSummary] = useState<any | null>(null);
  const [bookingTotalResults, setBookingTotalResults] = useState(0);
  const [bookingSortKey, setBookingSortKey] =
    useState<keyof BookingResponse>("id");
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
      filter: `customer.id==${id} `,
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
        BookingSummary(Number(id)),
      ]);
      setSummary(bookingSummary?.data);
      setCustomer(detailRes);
    } finally {
      setLoading(false);
    }
  };
  const handleSort = (key: keyof BookingResponse) => {
    setBookingPage(1);

    setBookingSortOrder((prev) => {
      if (bookingSortKey === key) {
        return prev === "asc" ? "desc" : "asc";
      }
      return "desc";
    });

    setBookingSortKey(key);
  };
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  });
  if (loading || !customer) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-6 bg-gray-50 dark:bg-neutral-950 p-6">
      {/* BACK BUTTON */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => navigate("/Home/customer")}
          className="flex items-center gap-2 
          text-sm font-medium 
          text-indigo-600 hover:text-indigo-700
          dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("common.back")}
        </button>
      </div>

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow dark:bg-neutral-950">
        {/* Top row: Name + Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {customer.fullName}
          </h1>

          <span
            className={`px-3 py-1 text-sm rounded-full font-medium w-fit
      ${
        customer.blocked
          ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
          : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
      }
    `}
          >
            {customer.blocked
              ? t("customer.status.blocked")
              : t("common.active")}
          </span>
        </div>

        {/* Phone + Email */}
        <div
          className="
          mt-2 flex flex-col gap-3 text-gray-600
          sm:flex-row sm:items-center sm:gap-6
          dark:text-neutral-300
        "
        >
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-600" />
            <span>{customer.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-600" />
            <span className="break-all">{customer.email}</span>
          </div>
        </div>

        {/* Customer ID */}
        <div className="mt-2">
          <span className="text-sm text-gray-500 dark:text-neutral-400">
            {t("customer.customerId")}:{" "}
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {customer.customerCode}
            </span>
          </span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-300 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab("basic")}
          className={`pb-2 transition text-sm
      ${
        activeTab === "basic"
          ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold dark:text-indigo-400 dark:border-indigo-400"
          : "text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-white"
      }
    `}
        >
          {t("customer.tabs.basic")}
        </button>

        <button
          onClick={() => setActiveTab("points")}
          className={`pb-2 transition text-sm
      ${
        activeTab === "points"
          ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold dark:text-indigo-400 dark:border-indigo-400"
          : "text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-white"
      }
    `}
        />
      </div>
      {activeTab === "basic" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: BASIC INFO */}
            <div className="rounded-xl bg-white p-6 shadow dark:bg-neutral-950">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-neutral-400">
                    {t("customer.fullName")}
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {customer.fullName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-neutral-400">
                    {t("customer.phone")}
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {customer.phone}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-neutral-400">
                    {t("customer.email")}
                  </span>
                  <span className="text-sm font-medium break-all text-right dark:text-white">
                    {customer.email}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-neutral-400">
                    {t("customer.nationality")}
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {customer.nationality || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* POINTS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Points */}
                <div className="rounded-xl bg-white p-5 shadow dark:bg-neutral-950">
                  <div
                    className="mb-1 flex items-center gap-2 text-sm
                  text-gray-500 dark:text-neutral-400"
                  >
                    <Wallet className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium">
                      {t("customer.points.total")}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-indigo-800 dark:text-indigo-400">
                    {customer.totalPoint}
                  </p>
                </div>

                {/* Available Points */}
                <div className="rounded-xl bg-white p-5 shadow dark:bg-neutral-950">
                  <div className="mb-1 flex items-center gap-2 text-sm
                  text-gray-500 dark:text-neutral-400">
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
                <div className="rounded-xl bg-white p-5 shadow dark:bg-neutral-950">
                  <div className="mb-1 flex items-center gap-2 text-sm
                  text-gray-500 dark:text-neutral-400">
                    <Lock className="w-4 h-4 text-gray-600 dark:text-neutral-300" />
                    <span className="font-medium">
                      {t("customer.points.used")}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-neutral-400">
                    {customer.usedPoint}
                  </p>
                </div>
              </div>

              {/* TIP BOX */}
              <div
                className="flex items-start gap-3
              rounded-xl border border-indigo-100  
              bg-indigo-50 p-4 
              dark:border-indigo-500/20 dark:bg-indigo-500/10"
              >
                <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
                <p className="text-sm leading-relaxed text-indigo-700 dark:text-indigo-300">
                  <b>{t("common.tip")}:</b>{" "}
                  {t("customer.points.tip", { percent: 30 })}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 rounded-xl bg-white p-6  shadow dark:bg-neutral-950">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">
                {t("customer.bookingHistory.title")}
              </h2>
              <BookingHistoryTable
                rows={bookings}
                loading={loading}
                page={bookingTotalPages}
                pageSize={10}
                total={bookingTotalResults}
                sortKey={bookingSortKey}
                sortDir={bookingSortOrder}
                onPageChange={setBookingPage}
                onSortChange={handleSort}
              />
            </div>
            <div className="flex flex-col gap-5 rounded-xl bg-white p-4 shadow dark:bg-neutral-950">
              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  {t("customer.bookingSummary.totalBookings")}
                </p>
                <p className="text-2xl font-semibold dark:text-white">
                  {summary?.totalBookings ?? 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  {t("customer.bookingSummary.nightsStayed")}
                </p>
                <p className="text-2xl font-semibold dark:text-white ">
                  {summary?.nightsStayed ?? 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  {t("customer.bookingSummary.totalRevenue")}
                </p>
                <p className="text-2xl font-semibold dark:text-white">
                  {summary?.totalRevenue?.toLocaleString() ?? 0} VND
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {activeTab === "points" && (
        <div className="rounded-xl bg-white p-4 shadow dark:bg-neutral-950 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#2E3A8C] dark:text-indigo-400">
            {t("reward.title")}
          </h2>
          {/* FILTER BAR */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-3 mb-4">
            <div className="w-full lg:w-[320px]">
              <SelectField
                isRequired={false}
                items={[
                  { value: "All", label: t("reward.type.all") },
                  { value: "1", label: t("reward.type.earn") },
                  { value: "2", label: t("reward.type.redeem") },
                  { value: "3", label: t("reward.type.expire") },
                ]}
                value={filterType}
                onChange={(e: any) => setFilterType(e)}
                size="sm"
                fullWidth={isMobile}
                getValue={(i) => i.value}
                getLabel={(i) => i.label}
              />
            </div>
            <div className="w-full lg:w-[260px]">
              <DatePickerField
                value={transactionDate}
                onChange={setTransactionDate}
                placeholder={t("booking.bookingFilterDate")}
              />
            </div>
            {/* TYPE FILTER */}

            {/* FILTER BUTTON */}
            <div className="w-full lg:w-auto lg:ml-auto">
              <button
                onClick={() => fetchRewardTransaction(1)}
                disabled={rewardTransactionLoading}
                className={`
            w-full lg:w-auto
            rounded-lg px-4 py-2  
            text-sm font-medium text-white 
            transition
            ${
              rewardTransactionLoading
                ? "cursor-not-allowed bg-gray-400 dark:bg-neutral-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }
          `}
              >
                {rewardTransactionLoading
                  ? t("common.filtering")
                  : t("common.filter")}
              </button>
            </div>
          </div>
          {rewardTransactionLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded bg-gray-100 dark:bg-neutral-700"
                />
              ))}
            </div>
          )}
          {!rewardTransactionLoading && (
            <RewardTransactionTable
              rows={rewardTransaction}
              loading={rewardTransactionLoading}
              page={rewardTransactionPage}
              pageSize={rewardTransactionTotalPages}
              total={rewardTransactionTotalResults}
              onPageChange={setRewardTransactionPage}
              sortKey={null}
              sortDir={"desc"}
              onSortChange={() => {}}
            />
          )}
        </div>
      )}
    </div>
  );
};
export default CustomerDetailPage;
