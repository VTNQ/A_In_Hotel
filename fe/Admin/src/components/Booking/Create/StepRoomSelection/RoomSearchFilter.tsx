import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const RoomSearchFilter = ({ filter, onChange, roomTypes }: any) => {
  const { t } = useTranslation();

  return (
    <div className="
      flex items-center gap-3 mt-4 rounded-2xl border p-4 shadow-sm
      border-gray-200 bg-white
      dark:bg-gray-800 dark:border-gray-700
    ">

      {/* SEARCH */}
      <div className="relative w-[280px]">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />

        <input
          value={filter.search}
          onChange={(e) => onChange("search", e.target.value)}
          placeholder={t("roomSelection.searchRoom")}
          className="
            w-full pl-9 pr-3 py-2 border rounded-full text-sm outline-none
            border-gray-300 bg-white text-gray-800
            focus:ring-2 focus:ring-[#536DB2]

            dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100
            dark:placeholder-gray-400 dark:focus:ring-blue-500/40
          "
        />
      </div>

      {/* ROOM TYPE */}
      <select
        value={filter.roomType}
        onChange={(e) => onChange("roomType", e.target.value)}
        className="
          px-4 py-2 border rounded-full text-sm outline-none bg-white
          border-gray-300 text-gray-800
          focus:ring-2 focus:ring-[#536DB2]

          dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100
          dark:focus:ring-blue-500/40
        "
      >
        <option value="">
          {t("roomSelection.allRoomTypes")}
        </option>

        {(roomTypes || []).map((rt: any) => (
          <option key={rt.id} value={rt.id}>
            {rt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoomSearchFilter;