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
    <DialogContent
      className="
        sm:max-w-lg
        p-6
        bg-white
        dark:bg-neutral-950
        border
        border-slate-200
        dark:border-neutral-800
      "
    >
      <DialogHeader>
        <DialogTitle
          className="
            text-slate-900
            dark:text-slate-100
          "
        >
          {t("asset.view.title")}
        </DialogTitle>
      </DialogHeader>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />

          <span
            className="
              ml-3
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {t("common.loading")}
          </span>
        </div>
      ) : (
        <>
          <div
            className="
              mt-4
              space-y-3
              rounded-lg
              border
              border-slate-200
              dark:border-neutral-800
              bg-slate-50
              dark:bg-neutral-900
              p-4
            "
          >
            <div className="flex justify-between items-center">
              <span
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("asset.icon")}
              </span>

              <div
                className="
                  w-24
                  h-24
                  sm:w-26
                  sm:h-26
                  border
                  border-slate-300
                  dark:border-neutral-700
                  rounded-xl
                  overflow-hidden
                  bg-slate-100
                  dark:bg-neutral-800
                  flex
                  items-center
                  justify-center
                "
              >
                {asset?.thumbnail?.url ? (
                  <img
                    src={File_URL + asset.thumbnail.url}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="
                      text-sm
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    {t("common.noImage")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <span
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("asset.name")}
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-900
                  dark:text-slate-100
                "
              >
                {asset?.assetName || "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("asset.code")}
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-900
                  dark:text-slate-100
                "
              >
                {asset?.assetCode || "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("asset.category")}
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-900
                  dark:text-slate-100
                "
              >
                {asset?.categoryName || "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("asset.createOrUpdate.room")}
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-900
                  dark:text-slate-100
                "
              >
                {asset?.roomName || "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("asset.createOrUpdate.price")}
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-900
                  dark:text-slate-100
                "
              >
                {Number(asset?.price).toLocaleString("vi-VN")} VND
              </span>
            </div>

            <div className="flex justify-between">
              <span
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("asset.createOrUpdate.quantity")}
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-900
                  dark:text-slate-100
                "
              >
                {asset?.quantity || "-"}
              </span>
            </div>

            <div className="mt-4 sm:mt-3">
              <h3
                className="
                  font-semibold
                  text-[18px]
                  leading-[22px]
                  text-slate-700
                  dark:text-slate-200
                "
              >
                {t("asset.createOrUpdate.note")}
              </h3>

              <p
                className="
                  mt-2
                  font-medium
                  leading-relaxed
                  text-[14px]
                  text-slate-900
                  dark:text-slate-100
                "
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