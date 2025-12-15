import type { HotelRow, HotelTableProps } from "@/type/hotel.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge, Pencil } from "lucide-react";
import { SelectField } from "../ui/select";
import { Button } from "../ui/button";
import { STATUS_OPTIONS, STATUS_STYLES, type Status } from "@/type/common";

const HotelTable = ({
    rows,
    loading,
    onEdit,
    onStatusChange,
    sortKey,
    sortDir,
    onSortChange
}: HotelTableProps) => {
    if (loading) {
        return <div className="py-8 text-center">Đang tải...</div>;
    }

    return (
        <Table<keyof HotelRow>
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={onSortChange}
        >

            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead sortable sortKey="code">Mã</TableHead>
                    <TableHead sortable sortKey="name">Tên</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.map((row, idx) => (
                    <TableRow key={row.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.address}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Badge className={STATUS_STYLES[row.status]}>
                                    {row.status}
                                </Badge>

                                <SelectField
                                    items={STATUS_OPTIONS}
                                    value={String(row.status)}
                                    onChange={(v) =>
                                        v && onStatusChange(row, Number(v) as Status)
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
                ))}
            </TableBody>
        </Table>
    )
}
export default HotelTable;