import type {
  franchiseInquiryResponse,
  franchiseInquiryTableProps,
} from "@/type/franchiseInquiry.types";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const FranchiseInquiryTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,
  page,
  pageSize,
  total,
  onPageChange,
}: franchiseInquiryTableProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  return (
    <Table<keyof franchiseInquiryResponse>
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
      <TableHeader>
        <TableRow>
          <TableHead sortable sortKey="fullName">
            {t("franchiseInquiry.fullName")}
          </TableHead>
          <TableHead sortable sortKey="phone">
            {t("franchiseInquiry.phone")}
          </TableHead>
          <TableHead sortable sortKey="email">
            {t("franchiseInquiry.email")}
          </TableHead>
          <TableHead sortable sortKey="province">
            {t("franchiseInquiry.province")}
          </TableHead>
          <TableHead sortable sortKey="propertyLocation">
            {t("franchiseInquiry.propertyLocation")}
          </TableHead>
          <TableHead sortable sortKey="landArea">
            {t("franchiseInquiry.landArea")}
          </TableHead>
          <TableHead sortable sortKey="roomCount">
            {t("franchiseInquiry.roomCount")}
          </TableHead>
          <TableHead>{t("franchiseInquiry.contacted")}</TableHead>
          <TableHead sortable sortKey="createdAt">
            {t("franchiseInquiry.createdAt")}
          </TableHead>
        </TableRow>
      </TableHeader>
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
              <TableCell>{row.fullName}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.province}</TableCell>
              <TableCell>{row.propertyLocation}</TableCell>
              <TableCell>{row.landArea}</TableCell>
              <TableCell>{row.roomCount}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-pointer">
                        {row.contacted ? t("common.yes") : t("common.no")}
                      </span>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>{row.message || t("franchiseInquiry.noMessage")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{row.createdAt}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
export default FranchiseInquiryTable;
