import { useEffect, useState } from "react";
import type { ViewBlogProps } from "../../type";
import { findById } from "../../service/api/Blog";
import CommonModalView from "../ui/CommonModalView";
import { File_URL } from "../../setting/constant/app";

const ViewBlog: React.FC<ViewBlogProps> = ({ isOpen, onClose, blogId }) => {
    const [blogData, setBlogdData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (isOpen && blogId) {
            fetchBlog(blogId)
        }
    }, [isOpen, blogId])
    const fetchBlog = async (id: number) => {
        try {
            setLoading(true);
            const response = await findById(id);
            setBlogdData(response?.data?.data);
        } finally {
            setLoading(false)
        }
    }
    const handleCloseModal = () => {
        onClose();
    }
    if (!blogData) return null;
    const statusMap: Record<number, { text: string; color: string }> = {
        1: { text: "Draft", color: "text-gray-500" },
        2: { text: "Published", color: "text-green-600" },
        3: { text: "Archived", color: "text-red-600" },
      };
    return (
        <CommonModalView
            isOpen={isOpen}
            onClose={handleCloseModal}
            title="View Blog"
            width="w-[650px]"
        >
            {loading && (
                   <div className="animate-pulse mt-3 space-y-4">
                   <div className="h-4 w-40 bg-gray-300 rounded"></div>

                   <div className="grid grid-cols-[150px_1fr] gap-y-4">
                       <div className="h-4 w-28 bg-gray-200 rounded"></div>
                       <div className="h-4 w-40 bg-gray-300 rounded"></div>

                       <div className="h-4 w-20 bg-gray-200 rounded"></div>
                       <div className="h-4 w-24 bg-gray-300 rounded"></div>

                       <div className="h-4 w-24 bg-gray-200 rounded"></div>
                       <div className="h-4 w-20 bg-gray-300 rounded"></div>
                   </div>

                   <div className="h-6 w-full bg-gray-200 rounded"></div>
               </div>
            )}
            {!loading && (
                <div className="space-y-5 text-[#2B2B2B]">
                    <div className="w-full h-[260px] rounded-xl overflow-hidden shadow">
                        <img
                            src={File_URL + (blogData.image?.url || "")}
                            alt="Thumbnail"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[20px] text-[#253150]">{blogData.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Blog Code: <span className="font-medium">{blogData.blogCode}</span>
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#253150] mb-1">Description</h4>
                        <div
                            className="prose text-[14px]"
                            dangerouslySetInnerHTML={{ __html: blogData.description }}
                        />
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#253150] mb-1">Content</h4>
                        <div
                            className="prose text-[14px]"
                            dangerouslySetInnerHTML={{ __html: blogData.content }}
                        />
                    </div>
                    <div className="border-t border-gray-300 pt-3 text-[14px]">
                        <p><strong>Status:</strong> {statusMap[blogData.status]?.text || "Unknown"}</p>
                    </div>
                </div>
            )}
        </CommonModalView>
    )
}
export default ViewBlog;