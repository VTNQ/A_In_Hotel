import { useAlert } from "@/components/alert-context";
import BlogFilter from "@/components/Blog/BlogFilter";
import BlogTable from "@/components/Blog/BlogTable";
import EditBlog from "@/components/Blog/EditBlog";
import ViewBlogInformation from "@/components/Blog/ViewBlogInformation";
import { getBlog, updateStatus } from "@/service/api/Blog";
import { type Blog, type BlogStatusFilter } from "@/type/blog.types";
import type { SortDir } from "@/type/common";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ViewBlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Blog | null>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [editModal, setEditModal] = useState<Blog | null>(null);
  const [viewModal, setViewModal] = useState<Blog | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<BlogStatusFilter>("ALL");
  const fetchData = async () => {
    try {
      let filters: string[] = [];
      if (statusFilter !== "ALL") {
        filters.push(`status==${statusFilter}`);
      }
      const filterQuery = filters.join(" and ");
      const param = {
        page,
        size: 10,
        sort: sortKey ? `${sortKey},${sortDir}` : "id,desc",
        searchValue,
        ...(filterQuery ? { filter: filterQuery } : {}),
      };
      const resp = await getBlog(param);
      setBlogs(resp.data.content);
      setTotal(resp.data.totalElements);
    } catch (err: any) {
      setError(err.message || t("common.loadFailed"));
    }
  };
  const loadlBlog = async () => {
    try {
      setLoading(true);
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(t("common.loadFailed"));
    } finally {
      setLoading(false);
    }
  };
  const handleSort = (key: keyof Blog) => {
    setPage(1);

    setSortDir((prev) => {
      if (sortKey === key) {
        return prev === "asc" ? "desc" : "asc";
      }
      return "desc";
    });

    setSortKey(key);
  };
  useEffect(() => {
    loadlBlog();
  }, [page, sortKey, sortDir, searchValue, statusFilter]);
  const { showAlert } = useAlert();
  const handleChangeStatus = async (id: number, next: any) => {
    try {
      setLoading(true);
      await updateStatus(id, next);
      showAlert({
        title: t("blog.updateStatusSuccess"),
        type: "success",
      });
      await fetchData();
    } catch (err: any) {
      showAlert({
        title: err?.response?.data?.message || t("blog.updateStatusSuccess"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t("blog.title")}</h2>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <BlogFilter
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            search={searchValue}
            onSearchChange={setSearchValue}
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <BlogTable
          rows={blogs}
          loading={loading}
          page={page}
          pageSize={10}
          total={total}
          onView={(row) => setViewModal(row)}
          onPageChange={setPage}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={handleSort}
          onEdit={(row) => setEditModal(row)}
          onPublish={(row) => handleChangeStatus(row.id, 2)}
          onArchive={(row) => handleChangeStatus(row.id, 3)}
          onRestore={(row) => handleChangeStatus(row.id, 1)}
        />
        <EditBlog
          open={!!editModal}
          blogId={editModal?.id ?? 0}
          onClose={() => setEditModal(null)}
          onSubmit={fetchData}
        />
        <ViewBlogInformation
          isOpen={!!viewModal}
          onClose={() => setViewModal(null)}
          blogId={viewModal?.id ?? 0}
        />
      </div>
    </>
  );
};
export default ViewBlogPage;
