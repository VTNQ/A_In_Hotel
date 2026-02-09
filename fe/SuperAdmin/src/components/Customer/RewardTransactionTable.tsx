import type {
  RewardTransaction,
  RewardTransactionTableProps,
} from "@/type/RewardTransaction.types";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const RewardTransactionTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,

  page,
  pageSize,
  total,
  onPageChange,
}: RewardTransactionTableProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  const typeConfig: Record<number, { label: string; className: string }> = {
    1: {
      label: t("reward.type.earn"),
      className: "bg-green-100 text-green-700",
    },
    2: {
      label: t("reward.type.redeem"),
      className: "bg-red-100 text-red-600",
    },
    3: {
      label: t("reward.type.expire"),
      className: "bg-gray-100 text-gray-600",
    },
  };
  return (
    <Table<keyof RewardTransaction>
      sortKey={sortKey}
      sortDir={sortDir}
      onSort={onSortChange}
      pagination={{
        page,
        pageSize,
        total,
        onPageChange,
      }}
    >
      <TableRow>
        <TableHeader>
          <TableHead>({t("reward.table.date")})</TableHead>
          <TableHead>{t("reward.table.transactionId")}</TableHead>
          <TableHead>{t("reward.table.bookingId")}</TableHead>
          <TableHead>{t("reward.table.type")}</TableHead>
          <TableHead>{t("reward.table.points")}</TableHead>
          <TableHead>{t("reward.table.balanceBefore")}</TableHead>
          <TableHead>{t("reward.table.description")}</TableHead>
        </TableHeader>
      </TableRow>

      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="h-[240px] text-center text-gray-400"
            >
              {t("common.noData")}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.transactionCode}</TableCell>
              <TableCell>{row.bookingCode}</TableCell>
              <TableCell>
                {" "}
                {(() => {
                  const st = typeConfig[row.type] ?? {
                    labelKey: "common.unknown",
                    color: "bg-gray-100 text-gray-500",
                    dot: "bg-gray-400",
                  };

                  return (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        st?.className || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {st?.label || "UNKNOWN"}
                    </span>
                  );
                })()}
              </TableCell>
              <TableCell>
                {(() => {
                  const isEarn = row.type === 1;
                  const value = Math.abs(row.points ?? 0);

                  return (
                    <span
                      className={`font-semibold ${
                        isEarn ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {isEarn ? `+${value}` : `-${value}`}
                    </span>
                  );
                })()}
              </TableCell>
              <TableCell>
                {row.balanceBefore?.toLocaleString() ?? "0"}
              </TableCell>
              <TableCell>{row.balanceAfter?.toLocaleString() ?? "0"}</TableCell>
              <TableCell>{row.description || "-"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
export default RewardTransactionTable;
