import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

/* =======================
   TYPES
======================= */

export type SortDir = "asc" | "desc";

type InjectedSortProps<SortKey extends string> = {
  __activeSortKey?: SortKey | null;
  __sortDir?: SortDir;
  __onSort?: (key: SortKey) => void;
};

export type TableProps<SortKey extends string = string> =
  React.PropsWithChildren<
    React.TableHTMLAttributes<HTMLTableElement> & {
      sortKey?: SortKey | null;
      sortDir?: SortDir;
      onSort?: (key: SortKey) => void;
    }
  >;

export type TableHeadProps<SortKey extends string = string> =
  React.ThHTMLAttributes<HTMLTableHeaderCellElement> & {
    sortable?: boolean;
    sortKey?: SortKey;
  } & InjectedSortProps<SortKey>;

/* =======================
   INTERNAL: inject sort
======================= */

function injectSort<SortKey extends string>(
  node: React.ReactNode,
  injected: InjectedSortProps<SortKey>
): React.ReactNode {
  if (!React.isValidElement(node)) return node;

  // ✅ ÉP KIỂU ĐỂ TS BIẾT CÓ children
  const element = node as React.ReactElement<any>;

  // Inject cho TableHead
  if ((element.type as any).displayName === "TableHead") {
    return React.cloneElement(element, injected);
  }

  // Đệ quy children nếu có
  if (element.props?.children) {
    return React.cloneElement(element, {
      children: React.Children.map(
        element.props.children,
        (child) => injectSort(child, injected)
      ),
    });
  }

  return element;
}

/* =======================
   TABLE
======================= */

export function Table<SortKey extends string = string>({
  className,
  sortKey,
  sortDir = "asc",
  onSort,
  children,
  ...props
}: TableProps<SortKey>) {
  return (
    <div className="relative w-full overflow-x-auto rounded-2xl border custom-scrollbar bg-white shadow-sm">
      <table
        {...props}
        className={cn("w-full text-sm text-gray-700", className)}
      >
        {injectSort<SortKey>(children, {
          __activeSortKey: sortKey ?? null,
          __sortDir: sortDir,
          __onSort: onSort,
        })}
      </table>
    </div>
  );
}

/* =======================
   TABLE PARTS
======================= */

export function TableHeader(
  props: React.ComponentProps<"thead">
) {
  return (
    <thead
      {...props}
      className="sticky top-0 z-10 bg-white text-xs font-semibold uppercase tracking-wide text-gray-500 border-b"
    />
  );
}

export function TableBody(
  props: React.ComponentProps<"tbody">
) {
  return <tbody {...props} className="divide-y divide-gray-100" />;
}

export function TableRow(
  props: React.ComponentProps<"tr">
) {
  return (
    <tr
      {...props}
      className="transition-colors hover:bg-gray-50 even:bg-gray-50/40"
    />
  );
}

export function TableCell(
  props: React.ComponentProps<"td">
) {
  return (
    <td
      {...props}
      className="px-4 py-3 text-center text-sm text-gray-600 whitespace-nowrap"
    />
  );
}

export function TableHead<SortKey extends string = string>({
  sortable,
  sortKey,
  __activeSortKey,
  __sortDir = "asc",
  __onSort,
  children,
  className,
  ...props
}: TableHeadProps<SortKey>) {
  const isActive = sortable && sortKey === __activeSortKey;

  return (
    <th
      {...props}
      className={cn(
        "h-12 px-4 text-center align-middle text-sm font-semibold whitespace-nowrap text-gray-700",
        sortable && "cursor-pointer select-none hover:text-gray-900",
        className
      )}
      onClick={() => sortable && sortKey && __onSort?.(sortKey)}
    >
      <div className="flex items-center justify-center gap-1">
        {children}

        {sortable &&
          (isActive ? (
            __sortDir === "asc" ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )
          ) : (
            <ChevronUp size={14} className="opacity-30" />
          ))}
      </div>
    </th>
  );
}
TableHead.displayName = "TableHead";
