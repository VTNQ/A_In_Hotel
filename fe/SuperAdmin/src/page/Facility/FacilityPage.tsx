import { useAlert } from "@/components/alert-context";
import FacilityEditModal from "@/components/Facility/FacilityEditModal";
import FacilityFiler from "@/components/Facility/FacilityFilter";
import FacilityTable from "@/components/Facility/FacilityTable";
import { getAllFicilities, updateStatusFacilities } from "@/service/api/facilities";
import type { FacilityStatus } from "@/setting/constant/Facility.constant";
import type { SortDir } from "@/type/common";
import type { facilityRow, StatusFilter } from "@/type/facility.types";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const FacilityPage: React.FC = () => {
    const { showAlert } = useAlert();
    const { t } = useTranslation();
    const [rows, setRows] = useState<facilityRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [sortKey, setSortKey] = useState<keyof facilityRow | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>("asc");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("ALL");

    const fetchFacilities = async () => {
        try {
            setLoading(true);
            let filter = "price==0 and type==1";

            if (statusFilter !== "ALL") {
                filter += ` and isActive==${statusFilter}`;
            }
            const resp = await getAllFicilities({
                page,
                size: pageSize,
                filter,
                sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
                searchValue: search,
            });
            setRows(resp.data.content);
        } catch (e: any) {
            setError(e.message || t("common.loadFailed"));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFacilities();
    }, [page, sortKey, sortDir, search, statusFilter]);

    const handleSort = (key: keyof facilityRow) => {
        setPage(1);
        setSortDir((prev) =>
            sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"
        );
        setSortKey(key);
    };
    const updateStatus = async (row: facilityRow, next: FacilityStatus) => {
        try {
            await updateStatusFacilities(row.id, next);
            showAlert({
                title: t("facility.status.updateSuccess"),
                type: "success",
            });
        } catch {
            showAlert({
                title: t("facility.status.updateFailed"),
                type: "error",
            });
        }
    };
    const [editingRow, setEditingRow] = useState<facilityRow | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold"> {t("facility.page.title")}</h2>
                <FacilityFiler
                    search={search}
                    onSearchChange={setSearch}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                />
            </div>
            {error && (
                <div className="text-sm text-red-600">{error}</div>
            )}
            <FacilityTable
                rows={rows}
                loading={loading}
                sortKey={sortKey}
                sortDir={sortDir}
                onSortChange={handleSort}
                onEdit={(row) => setEditingRow(row)}
                onStatusChange={updateStatus}
            />
            <FacilityEditModal
                open={!!editingRow}
                facilityId={Number(editingRow?.id)}
                onClose={() => setEditingRow(null)}
                onSubmit={fetchFacilities}

            />

        </div>
    )
}
export default FacilityPage;