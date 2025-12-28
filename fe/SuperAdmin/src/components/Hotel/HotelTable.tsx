import type { HotelRow, HotelTableProps } from "@/type/hotel.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { File_URL } from "@/setting/constant/app";

const HotelTable = ({
    rows,
    loading,
    onEdit,
    onDelete,
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
                    <TableHead sortable sortKey="code">code</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead sortable sortKey="name">name</TableHead>
                    <TableHead>address</TableHead>
                    <TableHead>Manager</TableHead>

                    <TableHead>action</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.id}>

                        <TableCell>{row.code}</TableCell>
                        <TableCell>
                            <img
                                src={row.thumbnail != null
                                    ? File_URL + row.thumbnail?.url
                                    : "/default.webp"
                                }
                                alt={row.thumbnail?.altText}
                                width="60"
                                height="50"
                                style={{ objectFit: "cover", borderRadius: 8 }}
                            />
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.address}</TableCell>
                        <TableCell>{row.fullName}</TableCell>
                        {/* <TableCell>
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
                        </TableCell> */}
                        <TableCell>
                            <div className="flex gap-2">
                                {/* Edit */}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onEdit(row)}
                                >
                                    <Pencil className="mr-1 h-4 w-4" />
                                    Edit
                                </Button>

                                {/* Delete */}
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => onDelete(row)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
export default HotelTable;