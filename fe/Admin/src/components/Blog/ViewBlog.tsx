import { useEffect, useState } from "react";
import { findById } from "../../service/api/Blog";
import CommonModalView from "../ui/CommonModalView";
import { File_URL } from "../../setting/constant/app";
import { useTranslation } from "react-i18next";
import type { ViewBlogProps } from "../../type/blog.types";

const ViewBlog: React.FC<ViewBlogProps> = ({ isOpen, onClose, blogId }) => {
  const [blogData, setBlogdData] = useState<any>(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isOpen && blogId) {
      fetchBlog(blogId);
    }
  }, [isOpen, blogId]);
  const fetchBlog = async (id: number) => {
    try {
      setLoading(true);
      const response = await findById(id);
      setBlogdData(response?.data?.data);
    } finally {
      setLoading(false);
    }
  };
  const handleCloseModal = () => {
    onClose();
  };
  if (!blogData) return null;
  const statusMap: Record<
    number,
    { text: string; color: string; darkColor: string }
  > = {
    1: {
      text: t("blog.statusMap.draft"),
      color: "text-gray-500",
      darkColor: "dark:text-gray-400",
    },
    2: {
      text: t("blog.statusMap.published"),
      color: "text-green-600",
      darkColor: "dark:text-green-400",
    },
    3: {
      text: t("blog.statusMap.archived"),
      color: "text-red-600",
      darkColor: "dark:text-red-400",
    },
  };

  return (
    <CommonModalView
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={t("blog.viewTitle")}
      width="w-[650px]"
    >
      {loading && (
        <div className="animate-pulse mt-3 space-y-4">
          <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>

          <div className="grid grid-cols-[150px_1fr] gap-y-4">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>

            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>

            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>

          <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      )}

      {!loading && (
        <div className="space-y-5 text-[#2B2B2B] dark:text-gray-200">
          {/* Thumbnail */}
          <div className="w-full h-[260px] rounded-xl overflow-hidden custom-scroll shadow dark:shadow-black/30">
            <img
              src={File_URL + (blogData.image?.url || "")}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title */}
          <div>
            <h3 className="font-semibold text-[20px] text-[#253150] dark:text-white">
              {blogData.title}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("blog.blogCode")}:{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {blogData.blogCode}
              </span>
            </p>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-[#253150] dark:text-gray-100 mb-1">
              {t("blog.description")}
            </h4>

            <div
              className="
              prose prose-sm max-w-none
              dark:prose-invert
            "
              dangerouslySetInnerHTML={{ __html: blogData.description }}
            />
          </div>

          {/* Content */}
          <div>
            <h4 className="font-semibold text-[#253150] dark:text-gray-100 mb-1">
              {t("blog.content")}
            </h4>

            <div
              className="
              prose prose-sm max-w-none
              dark:prose-invert
            "
              dangerouslySetInnerHTML={{ __html: blogData.content }}
            />
          </div>

          {/* Status */}
          <div className="border-t border-gray-300 dark:border-gray-700 pt-3 text-[14px]">
            <p>
              <strong className="text-[#253150] dark:text-gray-100">
                {t("blog.status")}:
              </strong>{" "}
              <span
                className={`
                ${statusMap[blogData.status]?.color}
                ${statusMap[blogData.status]?.darkColor}
                font-medium
              `}
              >
                {t(statusMap[blogData.status]?.text || "common.unknown")}
              </span>
            </p>
          </div>
        </div>
      )}
    </CommonModalView>
  );
};
export default ViewBlog;
