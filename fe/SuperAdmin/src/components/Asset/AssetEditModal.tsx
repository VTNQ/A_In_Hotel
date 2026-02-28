import { getAssetById, updateAsset } from "@/service/api/Asset";
import { getAllCategories } from "@/service/api/Categories";
import { getAllHotel } from "@/service/api/Hotel";
import { getRoom } from "@/service/api/Room";
import { File_URL } from "@/setting/constant/app";
import type { AssetEditProps, AssetForm } from "@/type/asset.types";
import type { HotelRow } from "@/type/hotel.types";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogContent, DialogFooter, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { SelectField } from "../ui/select";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useAlert } from "../alert-context";
import { Upload, X } from "lucide-react";

const AssetEditModal: React.FC<AssetEditProps> = ({
  open,
  onClose,
  onSubmit,
  assetId,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<AssetForm>({
    assetName: "",
    categoryId: "",
    hotelId: "",
    roomId: "",
    price: "",
    quantity: "",
    note: "",
    image: null,
  });
  const [hotels, setHotels] = useState<HotelRow[]>([]);
  const [fetching, setFetching] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories({
        all: true,
        filter: "isActive==1 and type==3",
      });
      setCategories(response.content);
    } catch (err: any) {
      console.log(err);
    }
  };
  const fetchHotels = async () => {
    try {
      const response = await getAllHotel({
        all: true,
        filter: "status==1",
      });
      setHotels(response.data.content);
    } catch (err: any) {
      console.log(err);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const fetchRooms = async (hotelId: string) => {
    if (!hotelId) {
      setRooms([]);
      return;
    }

    try {
      const response = await getRoom({
        all: true,
        filter: `hotel.id==${hotelId}`,
      });
      setRooms(response.data.content);
    } catch (err: any) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (!open || !assetId) return;

    const fetchData = async () => {
      setFetching(true);
      try {
        const res = await getAssetById(Number(assetId));
        const asset = res;

        setFormData({
          assetName: asset.assetName,
          categoryId: String(asset.categoryId),
          hotelId: String(asset.hotelId),
          roomId: String(asset.roomId),
          price: String(asset.price),
          quantity: String(asset.quantity),
          note: asset.note ?? "",
          image: null,
        });

        setImagePreview(File_URL + asset.thumbnail?.url);
        await fetchRooms(String(asset.hotelId));
      } catch (err) {
        console.log(err);
      } finally {
        setFetching(false);
      }
    };

    fetchHotels();
    fetchCategories();
    fetchData();
  }, [open, assetId]);

  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const payload = {
        assetName: formData.assetName,
        categoryId: formData.categoryId,
        hotelId: formData.hotelId,
        roomId: formData.roomId,
        price: formData.price,
        quantity: formData.quantity,
        note: formData.note,
        image: formData.image,
      };
      const response = await updateAsset(payload, Number(assetId));
      showAlert({
        title:
          response?.data?.message || t("asset.createOrUpdate.updateSucess"),
        type: "success",
        autoClose: 4000,
      });
      setFormData({
        assetName: "",
        categoryId: "",
        hotelId: "",
        roomId: "",
        price: "",
        quantity: "",
        note: "",
        image: null,
      });
      setImagePreview(null);
      onSubmit();
      onClose();
    } catch (err: any) {
      showAlert({
        title: t("asset.createOrUpdate.updateError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  useEffect(() => {
    if (!formData.hotelId) return;

    fetchRooms(formData.hotelId);

    if (!assetId) {
      setFormData((prev) => ({ ...prev, roomId: "" }));
    }
  }, [formData.hotelId]);
  const handleClose = () => {
    setFormData({
      assetName: "",
      categoryId: "",
      hotelId: "",
      roomId: "",
      price: "",
      quantity: "",
      note: "",
      image: null,
    });
    setImagePreview(null);
    onClose();
  };
  if (!open || !assetId) return <></>;
  return (
    <Dialog open={!!open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="
          p-0
          w-[calc(100vw-20px)] sm:w-full
          max-w-[96vw] sm:max-w-xl lg:max-w-3xl
          max-h-[90vh]
          overflow-y-auto
          custom-scrollbar"
      >
        {/* HEADER sticky */}
        <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {t("asset.createOrUpdate.titleEdit")}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* BODY */}
        <div className="custom-scrollbar overflow-y-auto px-6 py-5">
          {fetching ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700" />
              <span className="ml-3 text-sm text-gray-500">
                {t("common.loading")}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("asset.name")} <span className="text-red-500">*</span>
                </label>
                <Input
                  name="assetName"
                  placeholder={t("asset.createOrUpdate.namePlaceHolder")}
                  onChange={handleChange}
                  value={formData.assetName}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("asset.category")} <span className="text-red-500">*</span>
                </label>
                <SelectField
                  items={categories}
                  value={formData.categoryId}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, categoryId: v }))
                  }
                  isRequired
                  placeholder={t("asset.createOrUpdate.categoryPlaceHolder")}
                  getValue={(i) => String(i.id)}
                  getLabel={(i) => i.name}
                />
              </div>

              {/* Hotel */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("asset.hotel")} <span className="text-red-500">*</span>
                </label>
                <SelectField
                  items={hotels}
                  value={formData.hotelId}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, hotelId: v, roomId: "" }))
                  }
                  isRequired
                  placeholder={t("asset.createOrUpdate.hotelPlaceHolder")}
                  getValue={(i) => String(i.id)}
                  getLabel={(i) => i.name}
                />
              </div>

              {/* Room */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("asset.room")} <span className="text-red-500">*</span>
                </label>
                <SelectField
                  items={rooms}
                  value={formData.roomId}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, roomId: v }))
                  }
                  isRequired
                  placeholder={t("asset.createOrUpdate.roomPlaceHolder")}
                  getValue={(i) => String(i.id)}
                  getLabel={(i) => i.roomNumber}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("asset.price")} <span className="text-red-500">*</span>
                </label>
                <Input
                  name="price"
                  type="number"
                  placeholder={t("asset.createOrUpdate.pricePlaceHolder")}
                  onChange={handleChange}
                  value={formData.price}
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("asset.quantity")} <span className="text-red-500">*</span>
                </label>
                <Input
                  name="quantity"
                  type="number"
                  placeholder={t("asset.createOrUpdate.quantityPlaceHolder")}
                  onChange={handleChange}
                  value={formData.quantity}
                />
              </div>

              {/* Note */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">
                  {t("asset.createOrUpdate.note")}
                </label>
                <Textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder={t("asset.createOrUpdate.notePlaceholder")}
                  rows={3}
                />
              </div>

              {/* Image */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">{t("asset.icon")}</label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (imagePreview?.startsWith("blob:")) {
                      URL.revokeObjectURL(imagePreview);
                    }

                    setFormData((prev) => ({
                      ...prev,
                      image: file, // ✅ đúng field
                    }));

                    setImagePreview(URL.createObjectURL(file));
                  }}
                />

                <div
                  onClick={() => !imagePreview && fileInputRef.current?.click()}
                  className="
                    relative cursor-pointer overflow-hidden rounded-2xl
                    border-2 border-dashed border-slate-300 bg-slate-50
                    hover:border-slate-400 transition
                  "
                >
                  {!imagePreview ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 sm:py-12 text-center">
                      <div className="rounded-full bg-white p-3 shadow-sm">
                        <Upload className="h-5 w-5 text-slate-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {t("asset.createOrUpdate.uploadHint")}
                      </p>
                      <p className="text-xs text-slate-500">JPG, PNG</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-[220px] w-full object-cover sm:h-[280px]"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/70"
                        aria-label="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER fixed */}
        <div className="border-t bg-white px-6 py-4">
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AssetEditModal;
