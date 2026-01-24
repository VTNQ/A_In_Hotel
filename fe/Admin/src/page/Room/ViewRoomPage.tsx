import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllRoom, updateStatus } from "../../service/api/Room";
import CommonTable from "../../components/ui/CommonTable";
import RoomFormModal from "../../components/Room/RoomFormModal";
import { getAllCategory } from "../../service/api/Category";
import { File_URL } from "../../setting/constant/app";
import RoomActionMenu from "../../components/Room/RoomActionMenu";
import UpdateRoomFormModal from "../../components/Room/UpdateRoomFormModal";
import { useAlert } from "../../components/alert-context";
import ViewRoomManagement from "../../components/Room/ViewRoomManagement";
import { getTokens } from "../../util/auth";
import { useTranslation } from "react-i18next";

const ViewRoomPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const { showAlert } = useAlert();
  const [sortKey, setSortKey] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [categories, setCategories] = useState<any[]>([]);
  const fetchCategories = async () => {
    try {
      const res = await getAllCategory({ all: true, filter: "isActive==1 and type==1" });
      setCategories(res.content || []);
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchCategories();
  }, []);


  const fetchData = async (
    pageNumber = 1,
    key = sortKey,
    order = sortOrder
  ) => {
    setLoading(true);
    try {
      let filters: string[] = [];
      if (statusFilter) {
        filters.push(`status==${statusFilter}`);
      }
      if (categoryFilter) {
        filters.push(`roomType.id==${categoryFilter}`);

      }
      filters.push(`hotel.id==${getTokens()?.hotelId}`)
      const filterQuery = filters.join(" and ");
      const params = {
        page: pageNumber,
        size: 10,
        sort: `${key},${order}`,
        searchValue: searchValue,
        ...(filterQuery ? { filter: filterQuery } : {})
      };
      const resp = await getAllRoom(params);
      setData(resp.data?.content || []);
      setTotalPages(resp?.data?.totalPages || 1);
      setTotalResults(resp?.data?.totalElements || 0);
      setPage(pageNumber);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };
  const handleView = (row: any) => {
    setSelectedRoom(row.id);
    setShowViewModal(true);
  };
  const handleEdit = (row: any) => {
    setSelectedRoom(row.id);
    setShowUpdateModal(true);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const handleMaintenance = async (row: any) => {
    try {
      setLoading(true);
      const response = await updateStatus(row.id, 4);
      const message =
        response?.data?.message || "Room Maintenance successfully!";
      showAlert({ title: message, type: "success", autoClose: 3000 });
      fetchData();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          "Failed to Maintenance room. Please try again.",
        type: "error",
      });
    }
  };
  const handleActive = async (row: any) => {
    try {
      setLoading(true);
      const response = await updateStatus(row.id, 3);
      const message =
        response?.data?.message || "Room Active successfully!";
      showAlert({ title: message, type: "success", autoClose: 3000 });
      fetchData();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          "Failed to Active room. Please try again.",
        type: "error",
      });
    }
  };
  const handleDeActived = async (row: any) => {
    try {
      setLoading(true);
      const response = await updateStatus(row.id, 3);
      const message =
        response?.data?.message || "Room DeActived successfully!";
      showAlert({ title: message, type: "success", autoClose: 3000 });
      fetchData();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          "Failed to Deactived room. Please try again.",
        type: "error",
      });
    }
  };
  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedRoom(null);
  };
  useEffect(() => {
    fetchData();
  }, [sortKey, sortOrder, searchValue, statusFilter, categoryFilter]);

  const columns = [
    { key: "roomCode", label: t("room.code"), sortable: true },
    { key: "roomNumber", label: t("room.roomNumber") },
    {
      key: "image",
      label: t("room.image"),
      render: (row: any) => (
        <img
          src={row.images?.length > 0 ? File_URL + row.images[0].url : "/default.webp"}
          alt={row.roomNumber}
          className="w-16 h-12 sm:w-20 sm:h-14 object-cover rounded-lg"
        />
      ),
    },
    { key: "roomName", label: t("room.roomName") },
    {
      key: "roomTypeName", label: t("room.roomTypeName"),
      sortable: true, sortKey: "roomType.name"
    },
    {
      key: "defaultRate",
      label: t("room.priceFullDay"),
      sortable: true,
      render: (row: any) =>
        `${(row.defaultRate ?? 0).toLocaleString("vi-VN")} VNĐ`,
    },
    { key: "createdAt", label: t("common.createdAt"), sortable: true },
    { key: "updatedAt", label: t("common.updatedAt") },
    {
      key: "status",
      label: t("common.status"),
      render: (row: any) => {
        const statusCode = row.status; // status là số (0–5)

        // Map status code → label + màu sắc
        const statusMap: Record<number, { label: string; color: string; dot: string }> = {
          1: { label: t("room.roomStatus.vacantDirty"), color: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
          2: { label: t("room.roomStatus.occupied"), color: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
          3: { label: t("room.roomStatus.available"), color: "bg-green-50 text-green-700", dot: "bg-green-500" },
          4: { label: t("room.roomStatus.maintenance"), color: "bg-red-50 text-red-700", dot: "bg-red-500" },
          5: { label: t("room.roomStatus.blocked"), color: "bg-fuchsia-50 text-fuchsia-700", dot: "bg-fuchsia-500" },
          6: { label: t("room.roomStatus.deactivated"), color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
          7: {label: t("room.roomStatus.reserved"), color: "bg-purple-50 text-purple-700",dot:"bg-purple-500"}
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
        <RoomActionMenu
          room={row}
          onView={() => handleView(row)}
          onEdit={() => handleEdit(row)}
          onActivate={() => handleActive(row)}
          onDeactivate={() => handleDeActived(row)}
          onMaintenance={() => handleMaintenance(row)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-700">
          {t("room.title")}
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-4 py-2 text-white bg-[#42578E] rounded-lg hover:bg-[#536DB2] transition"
        >
          {t("room.new")}
        </button>
      </div>


      {/* Bộ lọc */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">

        {/* Search */}
        <div className="relative w-full lg:w-[300px]">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={t("room.searchPlaceholder")}
            className="w-full pl-10 pr-3 py-2 border border-[#C2C4C5] rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>


        {/* Status */}
        <div className="flex w-full lg:w-[220px] h-11 border border-[#C2C4C5] rounded-lg overflow-hidden bg-white">
          <div className="flex items-center px-3 bg-[#F1F2F3] text-gray-600 text-sm whitespace-nowrap">
            {t("common.status")}
          </div>
          {/* DIVIDER */}
          <div className="w-px bg-[#C2C4C5]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 py-2 pl-3 pr-8 text-gray-700 text-sm bg-white focus:outline-none"
          >
            <option value="">{t("common.all")}</option>
            <option value="1">{t("room.roomStatus.vacantDirty")}</option>
            <option value="2">{t("room.roomStatus.occupied")}</option>
            <option value="3">{t("room.roomStatus.available")}</option>
            <option value="4">{t("room.roomStatus.maintenance")}</option>
            <option value="5">{t("room.roomStatus.blocked")}</option>
            <option value="6">{t("room.roomStatus.deactivated")}</option>
            <option value="7">{t("room.roomStatus.reserved")}</option>
          </select>
        </div>

        {/* Room Type */}
        <div className="flex w-full lg:w-[220px] h-11 border border-[#C2C4C5] rounded-lg overflow-hidden bg-white">
          <div className="flex items-center px-3 bg-[#F1F2F3] text-gray-600 text-sm whitespace-nowrap">
            {t("room.roomTypeName")}
          </div>
            <div className="w-px bg-[#C2C4C5]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 px-3 text-sm text-gray-700 bg-white focus:outline-none appearance-none"
          >
            <option value="">{t("common.all")}</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>



      </div>

      {/* Table */}
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
        <RoomFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchData();
            setShowModal(false)
          }}

        />
        <ViewRoomManagement
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          roomId={selectedRoom}
        />
        <UpdateRoomFormModal
          isOpen={showUpdateModal}
          onClose={handleCloseModal}
          onSuccess={() => {
            fetchData();
            setShowUpdateModal(false);
          }}

          roomId={selectedRoom}
        />
      </div>
    </div>
  );
};

export default ViewRoomPage;
