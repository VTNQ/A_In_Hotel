import type { facilityRow, FacilityTableProps } from "@/type/facility.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { File_URL } from "@/setting/constant/app";
import { Badge, Pencil } from "lucide-react";
import { SelectField } from "../ui/select";
import { Button } from "../ui/button";
import { STATUS_OPTIONS, STATUS_STYLES, type FacilityStatus } from "@/setting/constant/Facility.constant";

const FacilityTable = ({
    rows,
    loading,
    sortKey,
    sortDir,
    onSortChange,
    onEdit,
    onStatusChange }: FacilityTableProps) => {
    if (loading) {
        return <div className="py-8 text-center">Đang tải...</div>;
    }
    return (
        <Table<keyof facilityRow>
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={onSortChange}
        >
            <TableHeader>
                <TableRow>
                    <TableHead
                        sortable
                        sortKey="serviceCode"
                    >Service ID</TableHead>

                    <TableHead >Icon</TableHead>
                    <TableHead sortable sortKey="serviceName">Service Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead sortable sortKey="category.id">Category</TableHead>
                    <TableHead sortable sortKey="createdAt">Created Date</TableHead>
                    <TableHead sortable sortKey="updatedAt">Last Updated</TableHead>
                    <TableHead >Status</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.length === 0 ? (
                    <TableRow>
                        <TableCell
                            colSpan={6}
                            className="h-[240px] text-center text-gray-400"
                        >
                            Không có dữ liệu
                        </TableCell>
                    </TableRow>
                ) : (
                    rows.map((row, idx) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.serviceCode}</TableCell>
                            <TableCell>
                                <img
                                    src={row.icon != null
                                        ? File_URL + row.icon?.url
                                        : "/default.webp"
                                    }
                                    // hiển thị ảnh đầu tiên
                                    alt={row.serviceName}
                                    width="80"
                                    height="60"
                                    style={{ objectFit: "cover", borderRadius: 8 }}
                                />
                            </TableCell>
                            <TableCell>{row.serviceName}</TableCell>
                            
                            <TableCell>{row.categoryName}</TableCell>
                            <TableCell>
                                {row.description && (
                                    <p className="text-sm text-gray-500">
                                        {row.description.length > 30
                                            ? row.description.slice(0, 60) + "…"
                                            : row.description   }
                                    </p>
                                )}
                            </TableCell>
                            <TableCell>
                                {row.note && (
                                    <p className="text-sm text-gray-500">
                                        {row.note.length > 30
                                            ? row.note.slice(0, 60) + "…"
                                            : row.note   }
                                    </p>
                                )}
                            </TableCell>

                            <TableCell>
                                {row.createdAt}
                            </TableCell>
                            <TableCell>
                                {row.updatedAt}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Badge className={STATUS_STYLES[row.isActive]}>
                                        {row.isActive}
                                    </Badge>

                                    <SelectField
                                        items={STATUS_OPTIONS}
                                        value={String(row.isActive)}
                                        onChange={(v) =>
                                            v && onStatusChange(row, v as FacilityStatus)
                                        }
                                        size="sm"
                                        fullWidth={false}
                                        getValue={(i) => String(i.value)}
                                        getLabel={(i) => i.label}
                                    />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Button size="sm" variant="outline" onClick={() => onEdit(row)}>
                                    <Pencil className="mr-1 h-4 w-4" /> Sửa
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
export default FacilityTable;