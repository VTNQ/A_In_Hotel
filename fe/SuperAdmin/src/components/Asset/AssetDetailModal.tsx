import type { Asset, ViewAssetProps } from "@/type/asset.types";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getAssetById } from "@/service/api/Asset";
import { File_URL } from "@/setting/constant/app";
import { Button } from "../ui/button";

const AssetDetailModal: React.FC<ViewAssetProps> = ({
  isOpen,
  onClose,
  assetId,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState<Asset | null>(null);
  useEffect(() => {
    if (!isOpen || !assetId) return;
    const fetchAsset = async () => {
      setLoading(true);
      try {
        const res = await getAssetById(assetId);
        setAsset(res ?? null);
      } catch (err) {
        console.error("Failed to fetch asset:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [isOpen, assetId]);
  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>{t("asset.view.title")}</DialogTitle>
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
            <div className="mt-4 space-y-3 rounded-lg border bg-gray-50 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{t("asset.icon")}</span>

                <div className="w-24 h-24 sm:w-26 sm:h-26 border border-[#4B62A0]/40 rounded-xl overflow-hidden bg-[#F3F4F6] flex items-center justify-center">
                  {asset?.thumbnail?.url ? (
                    <img
                      src={File_URL + asset.thumbnail.url}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">
                      {t("common.noImage")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{t("asset.name")}</span>
                <span className="text-sm font-medium text-gray-900">
                  {asset?.assetName || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{t("asset.code")}</span>
                <span className="text-sm font-medium text-gray-900">
                  {asset?.assetCode || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {t("asset.category")}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {asset?.categoryName || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {t("asset.createOrUpdate.room")}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {asset?.roomNumber || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {t("asset.createOrUpdate.price")}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {Number(asset?.price).toLocaleString("vi-VN")} {"VND"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {t("asset.createOrUpdate.quantity")}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {asset?.quantity || "-"}
                </span>
              </div>
              <div className="mt-4 sm:mt-3">
                <h3 className="font-semibold text-[18px] leading-[22px] text-gray-500 ">
                  {" "}
                  {t("asset.createOrUpdate.note")}
                </h3>

                <p
                  className="font-medium text-gray-900 leading-relaxed text-[14px]"
          
                >
                  {asset?.note || t("asset.view.noNote")}
                </p>
              </div>
            </div>
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
export default AssetDetailModal;