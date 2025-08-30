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
import { Badge, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";

import { SelectField } from "@/components/ui/select"; // ✅ dùng SelectField mới
import { getAllHotel, updateHotel, UpdateStatusHotel } from "@/service/api/Hotel";
import { getAll } from "@/service/api/Authenticate";
import { useAlert } from "../alert-context";
import type { UserResponse } from "@/type/UserResponse";
import { Link } from "react-router-dom";

type Status = "ACTIVE" | "INACTIVE";
type SearchField = "default" | "name" | "code" | "fullName";

interface BasicRow {
    id: string | number;
    code?: string;
    name: string;
    createdOn: string | number;
    status: Status;
    address: string;
    fullName?: string;
    idUser: string | number | null;
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
type StatusFilter = "ALL" | Status;
const SEARCH_PLACEHOLDER: Record<SearchField, string> = {
    default: "Tìm Theo",
    name: "Tìm theo tên khách sạn ...",
    code: "Tìm theo mã khách sạn ...",
    fullName: "Tìm theo người quản lý ...",
};

const ListHotel: React.FC = () => {
    const { showAlert } = useAlert();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [rows, setRows] = useState<BasicRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // paging & sort
    const [uiPage, setUiPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const [sortKey, setSortKey] = useState<keyof BasicRow | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>("asc");

    // search
    const [searchField, setSearchField] = useState<SearchField>("default");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    // edit dialog
    const [editing, setEditing] = useState<BasicRow | null>(null);
    const [form, setForm] = useState<
        Pick<BasicRow, "name" | "address" | "status" | "idUser">
    >({
        name: "",
        address: "",
        status: "ACTIVE",
        idUser: null,
    });

    const fetchHotels = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getAllHotel({
                page: uiPage,
                size: pageSize,
                sort: sortKey ? `${sortKey},${sortDir}` : "id,asc",
                search:
                    searchField === "default"
                        ? undefined
                        : `${searchField} like *${search}*`,
            });

            const list: BasicRow[] = (res?.data?.content || []).map((item: any) => ({
                id: item.id,
                code: item.code,
                name: item.name,
                createdOn: item.createdAt,
                status: item.status,
                address: item.address || "Chưa cập nhật",
                fullName: item.fullName || "Chưa cập nhật",
                idUser: item.idUser,
            }));

            setRows(list);
            setTotalPages(res?.totalPages ?? 1);
            setTotalElements(res?.totalElements ?? list.length);
        } catch (e: any) {
            setError(e?.message || "Không thể tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getAll();
            setUsers(response.data.content);
        } catch (error) {
            console.log("Failed to fetch user:", error);
        }
    };

    useEffect(() => {
        fetchHotels();
        fetchUsers();
    }, [uiPage, pageSize, sortKey, sortDir, search]);

    const openEdit = (row: BasicRow) => {
        setEditing(row);
        setForm({
            name: row.name,
            address: row.address,
            status: row.status,
            idUser: row.idUser,
        });
    };
    const closeEdit = () => setEditing(null);

    const updateStatus = async (row: BasicRow, next: Status) => {
        try {
            const response = await UpdateStatusHotel(Number(row.id), next);
            showAlert({
                title: response.data.message,
                type: "success",
                autoClose: 4000,
            });
            fetchHotels();
        } catch {
            showAlert({
                title: "Cập nhật trạng thái thất bại",
                description: "Vui lòng thử lại sau",
                type: "error",
                autoClose: 4000,
            });
        }
    };
    const filteredRows = useMemo(() => {
        return statusFilter === "ALL"
            ? rows
            : rows.filter((h) => h.status === statusFilter);
    }, [rows, statusFilter]);
    const cols: Column<BasicRow>[] = useMemo(
        () => [
            { key: "index", header: "#" },
            { key: "code", header: "Mã khách sạn" },
            { key: "name", header: "Tên khách sạn", sortable: true },
            { key: "address", header: "Địa chỉ khách sạn" },
            { key: "fullName", header: "Người quản lý" },
            {
                key: "createdOn",
                header: "Ngày tạo",
                sortable: true,
                cell: (row) => (
                    <span className="text-muted-foreground">
                        {formatDate(row.createdOn)}
                    </span>
                ),
            },
            {
                key: "status",
                header: "Tình trạng",
                cell: (row) => (
                    <div className="flex items-center gap-2">
                        <Badge
                            className={`px-2 py-1 ring-1 ${STATUS_STYLES[row.status]}`}
                        >
                            {row.status}
                        </Badge>
                        <SelectField<{ value: Status; label: string }>
                            items={[
                                { value: "ACTIVE", label: "Hoạt động" },
                                { value: "INACTIVE", label: "Không hoạt động" },
                            ]}
                            value={row.status}
                            onChange={(val) => val && updateStatus(row, val as Status)}
                            placeholder="Chọn trạng thái"
                            size="sm"
                            fullWidth={false}
                            getValue={(i) => i.value}
                            getLabel={(i) => i.label}
                        />
                    </div>
                ),
            },
            {
                key: "actions",
                header: "Thao tác",
                cell: (row) => (
                    <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                        <Pencil className="mr-1 h-4 w-4" /> Sửa
                    </Button>
                ),
            },
        ],
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
    const handleSubmit = async () => {
        try {
            const HotelRequest = {
                name: form.name,
                address: form.address,
                status: form.status,
                idUser: form.idUser
            }
            const response = await updateHotel(Number(editing?.id), HotelRequest);
            showAlert({
                title: response.data.message,
                type: "success",
                autoClose: 4000,
            });
            setEditing(null);
            fetchHotels();
        } catch (error: any) {
            showAlert({
                title: "Cập nhật khách sạn thất bại",
                description: error?.response.data.message || "Vui lòng thử lại sau",
                type: "error",
                autoClose: 4000,
            });
        }
    }
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Danh sách khách sạn</h2>

                <div className="flex items-center gap-2">

                    <SelectField<{ value: SearchField; label: string }>
                        items={[
                            { value: "default", label: "Mặc định" },
                            { value: "name", label: "Tên khách sạn" },
                            { value: "code", label: "Mã khách sạn" },
                            { value: "fullName", label: "Người quản lý" },
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
                    {/* ✅ Nhập nội dung search */}
                    <Input
                        placeholder={SEARCH_PLACEHOLDER[searchField]}
                        className="w-72"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setUiPage(1);
                        }}
                    />

                    {/* Nút thêm khách sạn */}
                    <Button asChild>
                        <a href="/Home/hotel/create">+ Thêm khách sạn</a>
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
                                    onClick={() =>
                                        c.sortable ? onSort(c.key as keyof BasicRow) : undefined
                                    }
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
                                <TableCell colSpan={cols.length} className="text-center py-8">
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
                                <TableCell
                                    colSpan={cols.length}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit dialog */}
            <Dialog open={!!editing} onOpenChange={(o) => !o && closeEdit()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Sửa thông tin khách sạn</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="grid gap-2">
                            <label className="text-sm">Tên khách sạn</label>
                            <Input
                                value={form.name}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, name: e.target.value }))
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm">Địa chỉ</label>
                            <Input
                                value={form.address}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, address: e.target.value }))
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm">Trạng thái</label>
                            <SelectField<{ value: Status; label: string }>
                                items={[
                                    { value: "ACTIVE", label: "Hoạt động" },
                                    { value: "INACTIVE", label: "Không hoạt động" },
                                ]}
                                value={form.status}
                                onChange={(val) =>
                                    setForm((f) => ({
                                        ...f,
                                        status: (val as Status) ?? "ACTIVE",
                                    }))
                                }
                                placeholder="Chọn trạng thái"
                                size="md"
                                getValue={(i) => i.value}
                                getLabel={(i) => i.label}
                            />
                        </div>

                        <div className="grid gap-2">
                            <SelectField<UserResponse>
                                items={users}
                                value={form.idUser != null ? String(form.idUser) : null}
                                onChange={(val, user) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        idUser: val ? Number(val) : null,
                                    }))
                                }
                                label="Người quản lý"
                                placeholder="Chọn người quản lý"
                                description="Chọn 1 người để phụ trách phòng."
                                clearable
                                size="md"
                                getValue={(u) => String(u.id)}
                                getLabel={(u) =>
                                    u.fullName ?? u.email ?? `User #${u.id}`
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={closeEdit}>
                            Hủy
                        </Button>
                        <Button onClick={() => handleSubmit()}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ListHotel;
