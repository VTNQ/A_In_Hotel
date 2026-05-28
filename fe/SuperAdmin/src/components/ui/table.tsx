import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type {
  PaginationConfig,
  SortDir,
  TableContextType,
} from "@/type/common";
import { useTranslation } from "react-i18next";

/* =======================
   TYPES
======================= */

const TableContext = React.createContext<TableContextType<any> | null>(null);

/* =======================
   TABLE
======================= */

export function Table<SortKey extends string>({
  sortKey,
  sortDir = "asc",
  onSort,
  pagination,
  className,
  children,
}: React.PropsWithChildren<{
  sortKey?: SortKey | null;
  sortDir?: SortDir;
  onSort?: (key: SortKey) => void;
  pagination?: PaginationConfig;
  className?: string;
}>) {
  const { t } = useTranslation();
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 0;

  const getPages = () => {
    if (!pagination) return [];
    const { page } = pagination;
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 4) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };
  return (
    <TableContext.Provider
      value={{ sortKey: sortKey ?? null, sortDir, onSort }}
    >
      <div
        className="relative w-full rounded-2xl border border-gray-200 
      bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        {/* TABLE */}
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className={cn("w-full  text-sm table-fixed", className)}>
            {children}
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        {pagination && totalPages > 1 && (
          <div
            className="flex items-center justify-between border-t border-gray-200 px-4 py-3
          dark:border-neutral-800"
          >
            <span className="text-sm text-gray-500 dark:">
              {t("table.page")}{" "}
              <span className="font-medium text-gray-800 dark:text-white">
                {pagination.page}
              </span>{" "}
              /{" "}
              <span className="font-medium text-gray-800 dark:text-white">
                {totalPages}
              </span>
            </span>

            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                disabled={pagination.page === 1}
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition dark:border-neutral-700 dark:text-neutral-300",
                  pagination.page === 1
                    ? "cursor-not-allowed opacity-40"
                    : "hover:bg-gray-100 dark:hover:bg-neutral-800",
                )}
              >
                <ChevronLeft size={18} />
              </button>

              {/* Page numbers */}
              {getPages().map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className="px-2 text-sm text-gray-400"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => pagination.onPageChange(p)}
                    className={cn(
                      "flex h-9 min-w-[36px] items-center justify-center rounded-full text-sm font-medium",
                      p === pagination.page
                        ? "bg-gray-900 text-white dark:bg-indigo-600"
                        : "text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
                    )}
                  >
                    {p}
                  </button>
                ),
              )}

              {/* Next */}
              <button
                disabled={pagination.page === totalPages}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition dark:border-neutral-700 dark:text-neutral-300",
                  pagination.page === totalPages
                    ? "cursor-not-allowed opacity-40"
                    : "hover:bg-gray-100 dark:hover:bg-neutral-800",
                )}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </TableContext.Provider>
  );
}

/* =======================
   TABLE PARTS
======================= */

export function TableHeader(props: React.ComponentProps<"thead">) {
  return (
    <thead
      {...props}
      className="
      sticky top-0 z-10
      border-b border-gray-200
      bg-white 
      text-xs font-semibold uppercase tracking-wide text-gray-500
      dark:border-neutral-800
      dark:bg-neutral-900
      dark:text-neutral-400"
    />
  );
}

export function TableBody(props: React.ComponentProps<"tbody">) {
  return (
    <tbody
      {...props}
      className="divide-y divide-gray-100 dark:divide-neutral-800"
    />
  );
}

export function TableRow(props: React.ComponentProps<"tr">) {
  return (
    <tr
      {...props}
      className="
      transition-colors 
      hover:bg-gray-50 
      even:bg-gray-50/40
      dark:hover:bg-neutral-800/60
      dark:even:bg-neutral-800/20"
    />
  );
}

export function TableCell({ style, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      {...props}
      style={style}
      className="
      whitespace-nowrap px-4 py-3 text-center text-sm 
      text-gray-600
      dark:text-neutral-300"
    />
  );
}

export function TableHead<SortKey extends string>({
  children,
  sortable,
  sortKey,
  width,
}: {
  children: React.ReactNode;
  sortable?: boolean;
  sortKey?: SortKey;
  width?: number | string;
}) {
  const ctx = React.useContext(TableContext);
  const isActive = sortable && sortKey === ctx?.sortKey;

  const handleClick = () => {
    if (!sortable || !sortKey || !ctx?.onSort) return;
    ctx.onSort(sortKey);
  };

  return (
    <th
      style={width ? { width } : undefined}
      onClick={handleClick}
      className={cn(
        "px-4 py-3 text-center font-semibold select-none text-gray-700 dark:text-neutral-200",
        sortable && "cursor-pointer hover:text-black dark:hover:text-white",
      )}
    >
      <div className="flex items-center justify-center gap-1">
        {children}
        {sortable &&
          (isActive ? (
            ctx?.sortDir === "asc" ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )
          ) : (
            <ChevronUp size={14} className="opacity-30 dark:text-neutral-500" />
          ))}
      </div>
    </th>
  );
}
TableHead.displayName = "TableHead";
