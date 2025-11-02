import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
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
  const handleSort = (key: string) => {
    if (!onSortChange) return;
    if (sortKey === key) {
      onSortChange(key, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(key, "asc");
    }
  };

  return (
    <div className="relative border border-gray-300 bg-white rounded-2xl shadow-sm overflow-visible">
      <table className="w-full text-sm text-gray-700 border-collapse">
        {/* Header */}
        <thead className="text-[#F2F2F2] uppercase text-xs font-semibold border-b border-gray-300">
          <tr className="bg-[#536DB2]">
            {columns.map((col, index) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`px-4 py-3 text-center border-r border-[#6C80C2]
                  ${index === 0 ? "rounded-tl-xl" : ""}
                  ${index === columns.length - 1 ? "rounded-tr-xl border-r-0" : ""}
                  ${col.sortable ? "cursor-pointer select-none" : ""}
                `}
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
                  <td key={col.key} className="px-4 py-3 text-center">
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

      {/* ✅ Pagination */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-300 bg-gray-50 text-sm text-gray-600">
        <p>
          Showing{" "}
          {(page - 1) * itemsPerPage + 1}–
          {Math.min(page * itemsPerPage, totalResults)} of{" "}
          {totalResults} results
        </p>


        {/* Nút phân trang */}
        <div className="flex items-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-2 py-1 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            ‹
          </button>

          {/* Hiển thị số trang rút gọn */}
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
                      : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  {num}
                </button>
              </React.Fragment>
            ))}

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-2 py-1 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonTable;
