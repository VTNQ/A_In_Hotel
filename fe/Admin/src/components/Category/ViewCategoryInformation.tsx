import { useEffect, useState } from "react";
import CommonModalView from "../ui/CommonModalView";
import { findById } from "../../service/api/Category";
import { useTranslation } from "react-i18next";
import type { ViewCategoryProps } from "../../type/category.types";

const ViewCategoryInformation: React.FC<ViewCategoryProps> = ({ isOpen, onClose, categoryId }) => {
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
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
            title={t("category.view.title")}
            width="w-[95vw] sm:w-[520px]"
            widthClose="w-full sm:w-[200px]"
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
                    

                    <div
                        className="w-full py-2 rounded-xl text-sm sm:text-[16px] text-[#2B2B2B]"
                        style={{ fontFamily: "Montserrat" }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-y-3 gap-x-4">
                            <span className="font-semibold text-[#253150]">{t("category.name")}</span>
                            <span>{category.name}</span>

                            <span className="font-semibold text-[#253150]">{t("category.type")}</span>
                            <span>{category.type}</span>

                            <span className="font-semibold text-[#253150]">{t("category.capacity")}</span>
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