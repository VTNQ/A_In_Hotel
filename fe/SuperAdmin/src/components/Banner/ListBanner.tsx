"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Pencil, Search as SearchIcon, X } from "lucide-react";
import { SelectField } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { getBanner } from "@/service/api/Banner";
import { cn } from "@/lib/utils";
import { File_URL } from "@/setting/constant/app";

/** ------------ Types & helpers ------------ */
type Status = "ACTIVE" | "INACTIVE";
type StatusFilter = "ALL" | Status;

interface BasicRow {
  id: string | number;
  name: string;
  startAt: string | number;
  endAt: string | number;
  createdOn: string | number;
  url?: string;
}

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  cell?: (row: T) => React.ReactNode;
  width?: string | number;
}

type SortDir = "asc" | "desc";

const STATUS_STYLES: Record<Status, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  INACTIVE: "bg-rose-50 text-rose-700 ring-rose-200",
};

const formatDate = (val: string | number) => {
  const d = typeof val === "number" ? new Date(val) : new Date(val);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};


const toImgSrc = (u?: string) => {
  if (!u) return "/placeholder-image.png";
  if (/^https?:\/\//i.test(u)) return u;
  const clean = u.replace(/^\/+/, "");
  return `${File_URL}${clean}`;
};

/** ------------ Thumbnail + Lightbox ------------ */
function ThumbWithPreview({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative inline-block"
        title="Xem ảnh lớn"
      >
        <img src={src} alt={alt} className="h-12 w-20 rounded object-cover border" />
        <span className="pointer-events-none absolute inset-0 hidden items-center justify-center rounded bg-black/30 group-hover:flex">
          <SearchIcon className="h-5 w-5 text-white" />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <img src={src} alt={alt} className="max-h-[85vh] max-w-[90vw] rounded shadow-2xl" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute -right-3 -top-3 grid h-8 w-8 place-items-center rounded-full bg-white shadow ring-1 ring-slate-300"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** ------------ Main component ------------ */
const ListBanner: React.FC = () => {
  const [rows, setRows] = useState<BasicRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // paging & sort
  const [uiPage, setUiPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [sortKey, setSortKey] = useState<keyof BasicRow | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // search + filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const computeStatus = (row: BasicRow): Status => {
    const now = Date.now();
    const s = row.startAt ? new Date(row.startAt).getTime() : undefined;
    const e = row.endAt ? new Date(row.endAt).getTime() : undefined;
    if (typeof s === "number" && now < s) return "INACTIVE";
    if (typeof e === "number" && now > e) return "INACTIVE";
    return "ACTIVE";
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getBanner({
        page: uiPage,
        size: pageSize,
        sort: sortKey ? `${String(sortKey)},${sortDir}` : "id,asc",
        search: encodeURIComponent(search.trim()),
      });
      const list: BasicRow[] = (res?.data?.content || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        startAt: item.startAt,
        endAt: item.endAt,
        url: item.image?.url,
        createdOn: item.createdAt,
      }));
      setRows(list);
      setTotalPages(res?.data?.totalPages ?? 1);
    } catch (e: any) {
      setError(e?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiPage, sortKey, sortDir, search]);

  const filteredRows = useMemo(() => {
    if (statusFilter === "ALL") return rows;
    return rows.filter((r) => computeStatus(r) === statusFilter);
  }, [rows, statusFilter]);

  const cols: Column<BasicRow>[] = useMemo(
    () => [
      { key: "index", header: "#" },
      { key: "name", header: "Tiêu đề Banner", sortable: true },
      {
        key: "startAt",
        header: "Ngày bắt đầu",
        sortable: true,
        cell: (row) => <span className="text-muted-foreground">{formatDate(row.startAt)}</span>,
      },
      {
        key: "endAt",
        header: "Ngày kết thúc",
        sortable: true,
        cell: (row) => <span className="text-muted-foreground">{formatDate(row.endAt)}</span>,
      },
      {
        key: "url",
        header: "Hình ảnh banner",
        cell: (row) =>
          row.url ? (
            <ThumbWithPreview src={toImgSrc(row.url)} alt={row.name || "Banner"} />
          ) : (
            <span className="text-xs text-muted-foreground">Không có ảnh</span>
          ),
      },
      {
        key: "createdOn",
        header: "Ngày tạo",
        sortable: true,
        cell: (row) => <span className="text-muted-foreground">{formatDate(row.createdOn)}</span>,
      },
      {
        key: "status",
        header: "Tình trạng",
        cell: (row) => {
          const st = computeStatus(row);
          const label = st === "ACTIVE" ? "Hoạt động" : "Không hoạt động";
          return (
            <span
              className={cn(
                "inline-flex items-center px-2 py-1 text-xs font-medium ring-1 rounded-full",
                STATUS_STYLES[st]
              )}
            >
              {label}
            </span>
          );
        },
      },
      {
        key: "actions",
        header: "Thao tác",
        cell: (row) => (
          <Button size="sm" variant="outline" asChild>
            <Link to={`/Home/banner/edit/${row.id}`}>
              <Pencil className="mr-1 h-4 w-4" /> Sửa
            </Link>
          </Button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onSort = (key: keyof BasicRow) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setUiPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Danh sách banner</h2>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Tìm theo tên banner..."
            className="w-72"
            onChange={(e) => {
              setSearch(e.target.value.trim());
              setUiPage(1);
            }}
          />
          <SelectField<{ value: "ALL" | Status; label: string }>
            items={[
              { value: "ALL", label: "Tất cả" },
              { value: "ACTIVE", label: "Hoạt động" },
              { value: "INACTIVE", label: "Không hoạt động" },
            ]}
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter((val as "ALL" | Status) ?? "ALL");
              setUiPage(1);
            }}
            placeholder="Lọc trạng thái"
            size="sm"
            fullWidth={false}
            getValue={(i) => i.value}
            getLabel={(i) => i.label}
            clearable={false}
          />
          <Button asChild>
            <Link to="/Home/banner/create">+ Thêm banner</Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-card">
        {error && <div className="p-3 text-sm text-red-600">{error}</div>}
        <Table>
          <TableHeader>
            <TableRow>
              {cols.map((c) => (
                <TableHead
                  key={String(c.key)}
                  style={{ width: c.width }}
                  onClick={() => (c.sortable ? onSort(c.key as keyof BasicRow) : undefined)}
                >
                  <span>{c.header}</span>
                  {c.sortable &&
                    (sortKey === c.key ? (
                      sortDir === "asc" ? (
                        <ChevronUp className="inline h-4 w-4" />
                      ) : (
                        <ChevronDown className="inline h-4 w-4" />
                      )
                    ) : (
                      <ChevronUp className="inline h-4 w-4 opacity-30" />
                    ))}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={cols.length} className="py-8 text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : filteredRows.length > 0 ? (
              filteredRows.map((row, idx) => (
                <TableRow key={row.id}>
                  {cols.map((c) => (
                    <TableCell key={String(c.key)}>
                      {c.key === "index"
                        ? (uiPage - 1) * pageSize + idx + 1
                        : c.cell
                        ? c.cell(row)
                        : (row as any)[c.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={cols.length} className="py-8 text-center text-muted-foreground">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* (Tuỳ chọn) Pagination đơn giản */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUiPage((p) => Math.max(1, p - 1))}
            disabled={uiPage === 1}
          >
            Trang trước
          </Button>
          <span className="text-sm">
            Trang {uiPage}/{totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUiPage((p) => Math.min(totalPages, p + 1))}
            disabled={uiPage >= totalPages}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListBanner;
