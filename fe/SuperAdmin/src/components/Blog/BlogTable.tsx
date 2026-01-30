import type { Blog, BlogTableProps } from "@/type/blog.types";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { File_URL } from "@/setting/constant/app";
import BlogActionMenu from "./BlogActionMenu";

const BlogTable = ({
  rows,
  loading,
  sortKey,
  sortDir,
  onSortChange,
  onEdit,
  page,
  pageSize,
  total,
  onView,
  onPageChange,
  onPublish,
  onArchive,
  onRestore
}: BlogTableProps) => {
  const { t } = useTranslation();
 
  if (loading) {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }
  const statusMap: Record<
    number,
    { label: string; color: string; dot: string }
  > = {
    1: {
      label: t("blog.draft"),
      color: "bg-[#E4F3FC] text-[#15AEEF]",
      dot: "bg-[#15AEEF]",
    },
    2: {
      label: t("blog.published"),
      color: "bg-[#E0F2EA] text-[#36A877]",
      dot: "bg-[#33B27F]",
    },
    3: {
      label: t("blog.archived"),
      color: "bg-[#EAEBEB] text-[#626262]",
      dot: "bg-[#626262]",
    },
  };
  return (
    <Table<keyof Blog>
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
          <TableHead sortable sortKey="blogCode" width={220}>
            {t("blog.code")}
          </TableHead>
          <TableHead width={120}>{t("blog.thumbnail")}</TableHead>
          <TableHead sortable sortKey="title" width={300}>
            {t("blog.name")}
          </TableHead>

          <TableHead sortable sortKey="createdAt" width={140}>
            {t("blog.createdAt")}
          </TableHead>
          <TableHead sortable sortKey="updatedAt" width={140}>
            {t("blog.updatedAt")}
          </TableHead>
          <TableHead width={120}>{t("blog.createdBy")}</TableHead>
          <TableHead width={120}>{t("common.status")}</TableHead>
          <TableHead width={120}>{t("common.action")}</TableHead>
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
              <TableCell>{row.blogCode}</TableCell>
              <TableCell style={{ width: 180 }}>
                <img
                  src={
                    row.image != null
                      ? File_URL + row.image?.url
                      : "/default.webp"
                  }
                  alt={row.image?.altText}
                  className="w-32 h-24 object-cover rounded-lg
                                  mx-auto border"
                />
              </TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.updatedAt}</TableCell>
              <TableCell>{row.createdBy}</TableCell>
              <TableCell>
                {(() => {
                  const st = statusMap[row.status] ?? {
                    labelKey: "common.unknown",
                    color: "bg-gray-100 text-gray-500",
                    dot: "bg-gray-400",
                  };

                  return (
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${st.color}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                      {t(st.label)}
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell>
                <BlogActionMenu
                blog={row}
                onEdit={() => onEdit(row)}
                onView={()=>onView(row)}
                onPublish={()=>onPublish?.(row)}
                onArchive={()=>onArchive?.(row)}
                onRestore={()=>onRestore?.(row)}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
export default BlogTable;
