import React, { useState, useMemo } from "react";
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
  itemsPerPage?: number;
}

const CommonTable: React.FC<CommonTableProps> = ({
  columns,
  data,
  itemsPerPage = 10,
}) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortOrder === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      }
      if (typeof av === "number" && typeof bv === "number") {
        return sortOrder === "asc" ? av - bv : bv - av;
      }
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  const startIndex = (page - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

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
                  {col.sortable &&
                    sortKey === col.key &&
                    (sortOrder === "asc" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-[#EDEEEE]">
          {currentData.length ? (
            currentData.map((row, i) => (
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

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-300 bg-gray-50 text-sm text-gray-600">
        <p>
          Showing {startIndex + 1}–
          {Math.min(startIndex + itemsPerPage, data.length)} of {data.length} results
        </p>
        <div className="flex gap-2 items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">{page}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonTable;
