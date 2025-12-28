import { useEffect, useState } from "react";
import type { ViewAssetProps } from "../../type";
import CommonModalView from "../ui/CommonModalView";
import { findById } from "../../service/api/Asset";
import { File_URL } from "../../setting/constant/app";

const ViewAssetInformation: React.FC<ViewAssetProps> = ({ isOpen, onClose, assetId }) => {
    const [asset, setAsset] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (isOpen && assetId) {
            fetchAsset(assetId);
        }
    }, [isOpen, assetId]);
    const fetchAsset = async (id: number) => {
        try {
            setLoading(true);
            const response = await findById(id);
            setAsset(response.data.data || null);
        } finally {
            setLoading(false)
        }
    }
    return (
        <CommonModalView
            isOpen={isOpen}
            onClose={onClose}
            title="Amenities & Asset Tracking"
            width="w-[95vw] sm:w-[90vw] lg:w-[560px]"
            isBorderBottom={true}
            withCenter="text-left"

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
            {!loading && asset && (
                <>
                    <h3 className="text-[24px] mt-4 leading-[32px] font-semibold tracking-[0.2px] text-[#253150]">
                        Asset Information
                    </h3>

                    <div className=" w-full py-2 mt-3  rounded-xl text-[16px] text-[#2B2B2B]" >
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-[160px_1fr] lg:grid-cols-[350px_2fr]">
                            <span className="font-semibold text-[18px] leading-[22px] text-[#253150]/90 flex items-center">
                                Thumbnail
                            </span>

                            <div className="flex items-center">
                                <div className="w-24 h-24 sm:w-26 sm:h-26 border border-[#4B62A0]/40 rounded-xl overflow-hidden bg-[#F3F4F6] flex items-center justify-center">
                                    {asset.thumbnail?.url ? (
                                        <img
                                            src={File_URL + asset.thumbnail.url}
                                            alt="thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm">No Image</span>
                                    )}
                                </div>
                            </div>
                            <span className="font-semibold text-base sm:text-[18px] text-[#253150]/90 ">
                                Asset Name
                            </span>


                            <span className="text-sm sm:text-[16px] leading-[22px]" style={{ fontWeight: '400', fontSize: '16px', lineHeight: '22px', letterSpacing: "0px" }}>{asset.assetName}</span>

                            <span className="font-semibold text-[18px] leading-[22px] text-[#253150]/90 ">Asset ID</span>
                            <span style={{ fontWeight: '400' }}>{asset.assetCode}</span>

                            <span className="font-semibold text-[18px] leading-[22px] text-[#253150]/90 ">Category</span>
                            <span style={{ fontWeight: '400' }}>{asset.categoryName}</span>

                            <span className="font-semibold text-[18px] leading-[22px] text-[#253150]/90 ">Room Number</span>
                            <span style={{ fontWeight: '400' }}>{asset.roomNumber}</span>

                            <span className="font-semibold text-[18px] leading-[22px] text-[#253150]/90 ">Price(VND)</span>
                            <span style={{ fontWeight: '400' }}>
                                {Number(asset.price).toLocaleString("vi-VN")} {asset.currency ?? "VND"}
                            </span>

                            <span className="font-semibold text-[18px] leading-[22px] text-[#253150]/90 ">Quantity</span>
                            <span style={{ fontWeight: '400' }}>{asset.quantity}</span>

                        </div>
                    </div>
                    <div className="mt-4 sm:mt-3">
                        <h3 className="font-semibold text-[18px] leading-[22px] text-[#253150]/90 ">Note</h3>

                        <p className="text-[#2B2B2B] leading-relaxed text-[14px]" style={{ fontWeight: '400' }}>
                            {asset.note || "No notes available."}
                        </p>

                        <div className="mt-4 border-b border-dotted border-gray-400"></div>
                    </div>
                </>
            )}


        </CommonModalView>
    )
}
export default ViewAssetInformation;