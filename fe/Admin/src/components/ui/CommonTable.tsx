import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

/** --- Type định nghĩa cho props --- */
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  sortKey?: string;
  render?: (row: any) => React.ReactNode;
}

interface CommonTableProps {
  columns: Column[];
  data: any[];
  page: number;
  totalPages: number;
  totalResults: number;
  itemsPerPage?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  onPageChange: (newPage: number) => void;
  onSortChange?: (key: string, order: "asc" | "desc") => void;
}

/** --- Component chính --- */
const CommonTable: React.FC<CommonTableProps> = ({
  columns,
  data,
  page,
  totalPages,
  totalResults,
  itemsPerPage = 10,
  sortKey,
  sortOrder,
  onPageChange,
  onSortChange,
}) => {
  /** Xử lý sắp xếp */
  const handleSort = (col: Column) => {
    if (!onSortChange || !col.sortable) return;

    const keyToSort = col.sortKey ?? col.key;
    if (sortKey === keyToSort) {
      onSortChange(keyToSort, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(keyToSort, "asc");
    }
  };

  return (
    <div className="border border-gray-300 bg-white rounded-2xl shadow-sm mt-4 relative z-0">
      {/* ✅ Scroll ngang + cho phép dropdown tràn ra ngoài */}
      <div className="overflow-x-auto relative custom-scroll">
        <table className="w-full min-w-[900px] lg:min-w-[1400px] text-sm text-gray-700">
          {/* Header */}
          <thead className="sticky top-0 bg-[#536DB2] text-[#F2F2F2] uppercase text-[10px] sm:text-xs font-semibold z-10">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col)}
                  className={`px-4 py-3 text-center border-r border-[#6C80C2] ${index === 0 ? "rounded-tl-xl" : ""
                    } ${index === columns.length - 1
                      ? "rounded-tr-xl border-r-0"
                      : ""
                    } ${col.sortable ? "cursor-pointer select-none" : ""}`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <>
                        {sortKey === col.key ? (
                          sortOrder === "asc" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )
                        ) : (
                          <ChevronDown size={14} className="opacity-40" />
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[#EDEEEE]">
            {data.length ? (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition-colors even:bg-gray-50/40"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-2 sm:px-4 py-3 text-center whitespace-nowrap"
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-6 text-center text-gray-500 italic"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600 rounded-b-2xl">
        <p className="text-center sm:text-left">
          Showing {(page - 1) * itemsPerPage + 1}–
          {Math.min(page * itemsPerPage, totalResults)} of {totalResults} results
        </p>

        {/* Nút phân trang */}
        <div className="flex justify-center items-center gap-1 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-2 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (num) =>
                num === 1 ||
                num === totalPages ||
                (num >= page - 1 && num <= page + 1)
            )
            .map((num, index, arr) => (
              <React.Fragment key={num}>
                {index > 0 && arr[index - 1] !== num - 1 && (
                  <span className="px-1 text-gray-500">…</span>
                )}
                <button
                  onClick={() => onPageChange(num)}
                  className={`px-3 py-1 rounded-md ${num === page
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-gray-100"
                    }`}
                >
                  {num}
                </button>
              </React.Fragment>
            ))}
          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
           className="px-2 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonTable;
