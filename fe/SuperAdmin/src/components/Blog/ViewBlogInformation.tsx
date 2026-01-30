import type { ViewBlogProps } from "@/type/blog.types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { findById } from "@/service/api/Blog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { File_URL } from "@/setting/constant/app";

const ViewBlogInformation: React.FC<ViewBlogProps> = ({
  isOpen,
  onClose,
  blogId,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    if (!isOpen || !blogId) return;

    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await findById(blogId);
        setBlog(res?.data?.data ?? null);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [isOpen, blogId]);
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

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t("blog.viewTitle")}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="ml-3 text-sm text-gray-500">
              {t("common.loading")}
            </span>
          </div>
        ) : (
          <>
            {/* CONTENT */}
            <div className="mt-4 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
              {/* BASIC INFO */}
              <div className="rounded-lg border bg-gray-50 p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {t("blog.code")}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {blog?.blogCode ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {t("blog.name")}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {blog?.title ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {t("blog.category")}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {blog?.category ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {t("blog.createdAt")}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {blog?.createdAt
                      ? format(new Date(blog.createdAt), "dd/MM/yyyy HH:mm")
                      : "-"}
                  </span>
                </div>

                {/* STATUS */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {t("common.status")}
                  </span>
                  {(() => {
                    const status = statusMap[blog?.status];

                    if (!status) return "-";

                    return (
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                          status.color,
                        )}
                      >
                        <span
                          className={cn("h-2 w-2 rounded-full", status.dot)}
                        />
                        {status.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* THUMBNAIL */}
              <div className="rounded-lg border p-4">
                <p className="mb-2 text-sm text-gray-500">
                  {t("blog.thumbnail")}
                </p>
                <img
                  src={
                    blog?.image?.url
                      ? File_URL + blog.image.url
                      : "/placeholder-image.png"
                  }
                  alt={blog?.image?.altText}
                  className="h-40 w-full object-cover rounded-lg border"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="rounded-lg border p-4">
                <p className="mb-2 text-sm text-gray-500">
                  {t("blog.description")}
                </p>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: blog?.description || "-",
                  }}
                />
              </div>

              {/* CONTENT */}
              <div className="rounded-lg border p-4">
                <p className="mb-2 text-sm text-gray-500">
                  {t("blog.content")}
                </p>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: blog?.content || "-",
                  }}
                />
              </div>
            </div>

            {/* FOOTER */}
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>
                {t("common.close")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewBlogInformation;
