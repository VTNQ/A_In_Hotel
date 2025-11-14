import { useEffect, useState } from "react";
import type { ViewCategoryProps } from "../../type";
import CommonModalView from "../ui/CommonModalView";
import { findById } from "../../service/api/Category";

const ViewCategoryInformation: React.FC<ViewCategoryProps> = ({ isOpen, onClose, categoryId }) => {
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (isOpen && categoryId) {
            fetchCategory(categoryId);
        }
    }, [isOpen, categoryId]);
    const fetchCategory = async (id: number) => {
        try {
            setLoading(true);
            const response = await findById(id);
            setCategory(response.data.data || null);
        } finally {
            setLoading(false)
        }
    }
    return (
        <CommonModalView
            isOpen={isOpen}
            onClose={onClose}
            title="Category"
            width="w-[520px]"
            widthClose="w-full"
            isBorderBottom={true}
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
            {!loading && category && (
                <>
                    <h3 className="text-lg font-semibold mt-2 text-[#253150] ">
                        Category Information
                    </h3>
                    <div className=" w-full py-2  rounded-xl text-[16px] text-[#2B2B2B]" style={{ fontFamily: "Montserrat" }}>
                        <div className="grid grid-cols-[350px_2fr] gap-y-3">
                            <span className="font-semibold text-[#253150]">Category Name</span>
                            <span>{category.name}</span>
                            <span className="font-semibold text-[#253150]">Type</span>
                            <span>{category.type}</span>
                            <span className="font-semibold text-[#253150]">Capacity</span>
                            <span>{category.capacity}</span>

                        </div>
                        <div className="mt-4 border-b border-dotted border-gray-400"></div>
                    </div>
                </>
            )}

        </CommonModalView>
    )
}
export default ViewCategoryInformation;