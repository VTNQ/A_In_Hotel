import { getAllCategories } from "@/service/api/Categories";
import { getFacilityById, updateExtraServcie } from "@/service/api/facilities";
import { File_URL } from "@/setting/constant/app";
import type { FacilitiesEditProps, FacilityForm } from "@/type/facility.types";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { SelectField } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useAlert } from "../alert-context";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";

const FacilityEditModal: React.FC<FacilitiesEditProps> = ({
  open,
  facilityId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FacilityForm>({
    serviceName: "",
    description: "",
    note: "",
    categoryId: "",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // ===== Fetch categories =====
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories({
        all: true,
        filter: "isActive==1 and type==2",
      });
      setCategories(res?.content || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ===== Fetch facility =====
  useEffect(() => {
    if (!open || !facilityId) return;

    const fetchData = async () => {
      try {
        const response = await getFacilityById(Number(facilityId));
        setFormData({
          serviceName: response.serviceName ?? "",
          description: response.description ?? "",
          note: response.note ?? "",
          categoryId: String(response.categoryId ?? ""),
        });
        setPreview(response?.icon?.url ? File_URL + response.icon.url : null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    fetchCategories();

    return () => {
      // cleanup preview url
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, facilityId]);

  if (!open || !facilityId) return null;

  // ===== Handlers =====
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);

      const payload = {
        serviceName: formData.serviceName,
        description: formData.description,
        note: formData.note,
        categoryId: Number(formData.categoryId),
        image: coverImage, // giữ đúng tên field API
        extraCharge: 0,
        price: 0,
      };

      const response = await updateExtraServcie(Number(facilityId), payload);

      showAlert({
        title: response?.data?.message || "Cập nhật thành công",
        type: "success",
        autoClose: 4000,
      });

      // reset
      setFormData({
        serviceName: "",
        description: "",
        note: "",
        categoryId: "",
      });
      setCoverImage(null);
      setPreview(null);

      onClose();
      onSubmit();
    } catch (err: any) {
      showAlert({
        title: "Update facilities failed",
        description:
          err?.response?.data?.message || "Vui lòng thử lại sau",
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="
    w-full
    max-w-2xl
    max-h-[90vh]
    overflow-y-auto
    custom-scrollbar
  "
      >

        <DialogHeader>
          <DialogTitle>Edit Facility</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="Enter facility name"
            />
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Category</label>
            <SelectField
              items={categories}
              value={formData.categoryId}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, categoryId: String(v) }))
              }
              placeholder="Select category"
              getValue={(i) => String(i.id)}
              getLabel={(i) => i.name}
            />
          </div>

          {/* Cover Image */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Cover Image</label>

            <label
              htmlFor="cover-upload"
              className="flex aspect-video cursor-pointer items-center justify-center
                         rounded-lg border-2 border-dashed border-gray-300
                         bg-gray-50 hover:border-primary"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="text-center text-sm text-gray-500">
                  <p className="font-medium">Click to upload</p>
                  <p className="text-xs">PNG, JPG, SVG</p>
                </div>
              )}
            </label>

            <input
              id="cover-upload"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
              onChange={onFileInputChange}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Shown to customer"
            />
          </div>

          {/* Note */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Note</label>
            <Textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={2}
              placeholder="Internal note"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FacilityEditModal;
