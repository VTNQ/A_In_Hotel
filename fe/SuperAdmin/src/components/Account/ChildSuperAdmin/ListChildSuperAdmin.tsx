import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAll } from "@/service/api/Authenticate";
import { File_URL } from "@/setting/constant/app";

import { ChevronDown, ChevronUp, Search, SearchIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type SearchField = "default" | "fullName" | "email" | "phone";
type Gender = "MALE" | "FEMALE";
type GenderFilter = "ALL" | Gender;
interface BasicRow {
  id: string | number;
  fullName: string;
  email: string;
  birthday: string | number;
  gender: string;
  phone: string;
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

const formatDate = (val: string | number) => {
  const d = typeof val === "number" ? new Date(val) : new Date(val);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

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
        <img
          src={src}
          alt={alt}
          className="h-12 w-20 rounded object-cover border"
        />
        <span className="pointer-events-none absolute inset-0 hidden items-center justify-center rounded bg-black/30 group-hover:flex">
          <SearchIcon className="h-5 w-5 text-white" />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <img
                src={src}
                alt={alt}
                className="max-h-[85vh] max-w-[90vw] rounded shadow-2xl"
              />
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
const ListChildSuperAdmin: React.FC = () => {
  const { t } = useTranslation();
  const SEARCH_PLACEHOLDER: Record<SearchField, string> = {
    default: t("childSuperAdmin.search.default"),
    fullName: t("childSuperAdmin.search.fullName"),
    email: t("childSuperAdmin.search.email"),
    phone: t("childSuperAdmin.search.phone"),
  };
  const [rows, setRows] = useState<BasicRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // paging & sort
  const [uiPage, setUiPage] = useState(1);
  const [pageSize] = useState(5);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("ALL");
  const [totalPages, setTotalPages] = useState(1);

  const [sortKey, setSortKey] = useState<keyof BasicRow | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [searchField, setSearchField] = useState<SearchField>("default");
  // search + filter
  const [search, setSearch] = useState("");

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAll({
        page: uiPage,
        size: pageSize,
        filter: "role.id==5",
        sort: sortKey ? `${String(sortKey)},${sortDir}` : "id,asc",
        searchField: searchField === "default" ? undefined : searchField,
        searchValue: search,
      });
      const list: BasicRow[] = (res?.data?.content || []).map((item: any) => ({
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        gender: item.gender,
        phone: item.phone,
        url: item.avatarUrl,
        birthday: item.birthday,
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

  const cols: Column<BasicRow>[] = useMemo(
    () => [
      { key: "index", header: "#" },
      {
        key: "fullName",
        header: t("childSuperAdmin.table.fullName"),
        sortable: true,
      },
      { key: "email", header: t("childSuperAdmin.table.email") },
      { key: "birthday", header: t("childSuperAdmin.table.birthday") },
      { key: "phone", header: t("childSuperAdmin.table.phone") },
      {
        key: "gender",
        header: t("childSuperAdmin.table.gender"),
        sortable: true,
        cell: (row) => t(`gender.${row.gender.toLowerCase()}`),
      },
      {
        key: "url",
        header: t("childSuperAdmin.table.avatar"),
        cell: (row) =>
          row.url ? (
            <ThumbWithPreview
              src={File_URL + row.url}
              alt={row.fullName || "Avatar"}
            />
          ) : (
            <span className="text-xs text-muted-foreground">
              {t("common.noImage")}
            </span>
          ),
      },
      {
        key: "createdOn",
        header: t("childSuperAdmin.table.createdAt"),
        sortable: true,
        cell: (row) => (
          <span className="text-muted-foreground">
            {formatDate(row.createdOn)}
          </span>
        ),
      },
    ],
    [t],
  );

  const onSort = (key: keyof BasicRow) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setUiPage(1);
  };
  const filteredRows = useMemo(() => {
    if (genderFilter === "ALL") return rows;
    return rows.filter((r) => r.gender === genderFilter);
  }, [rows, genderFilter]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {t("childSuperAdmin.listTitle")}
        </h2>

        <div className="flex items-center gap-2">
          <SelectField<{ value: SearchField; label: string }>
            isRequired={false}
            items={[
              {
                value: "default",
                label: t("childSuperAdmin.searchField.default"),
              },
              {
                value: "fullName",
                label: t("childSuperAdmin.searchField.fullName"),
              },
              { value: "email", label: t("childSuperAdmin.searchField.email") },
              { value: "phone", label: t("childSuperAdmin.searchField.phone") },
            ]}
            value={searchField}
            onChange={(val) => {
              setSearchField((val as SearchField) ?? "default");
              setUiPage(1);
            }}
            placeholder="Tìm theo"
            size="sm"
            fullWidth={false}
            getValue={(i) => i.value}
            getLabel={(i) => i.label}
          />
          <SelectField<{ value: "ALL" | Gender; label: string }>
            isRequired={false}
            items={[
              { value: "ALL", label: t("common.all") },
              { value: "MALE", label: t("gender.male") },
              { value: "FEMALE", label: t("gender.female") },
            ]}
            value={genderFilter}
            onChange={(val) => {
              setGenderFilter((val as "ALL" | Gender) ?? "ALL");
              setUiPage(1);
            }}
            placeholder="Lọc trạng thái"
            size="sm"
            fullWidth={false}
            getValue={(i) => i.value}
            getLabel={(i) => i.label}
            clearable={false}
          />

          <div className="relative w-72">
            <Search
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder={SEARCH_PLACEHOLDER[searchField]}
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setUiPage(1);
              }}
            />
          </div>

          <Button asChild>
            <a href="/Home/ChildSuperAdmin/create">
              + {t("childSuperAdmin.add")}
            </a>
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
                  sortable={c.sortable}
                  sortKey={c.key as keyof BasicRow}
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
                  {t("common.loading")}
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
                <TableCell
                  colSpan={cols.length}
                  className="py-8 text-center text-muted-foreground"
                >
                  {t("common.noData")}
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
            {t("common.prev")}
          </Button>
          <span className="text-sm">
            {t("common.page")} {uiPage}/{totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUiPage((p) => Math.min(totalPages, p + 1))}
            disabled={uiPage >= totalPages}
          >
            {t("common.next")}
          </Button>
        </div>
      )}
    </div>
  );
};
export default ListChildSuperAdmin;
