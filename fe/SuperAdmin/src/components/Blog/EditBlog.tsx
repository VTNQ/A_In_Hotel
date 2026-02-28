import type { BlogEditProps, BlogForm } from "@/type/blog.types";
import { useAlert } from "../alert-context";
import { useEffect, useState } from "react";
import QuillEditor from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useTranslation } from "react-i18next";
import { findById, updateBlog } from "@/service/api/Blog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { SelectField } from "../ui/select";
import UploadField from "../ui/UploadField";
import { Button } from "../ui/button";
import { File_URL } from "@/setting/constant/app";

const EditBlog: React.FC<BlogEditProps> = ({
  open,
  blogId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlogForm>({
    title: "",
    category: "",
    description: "",
    content: "",
    status: "",
    image: null,
  });
  const { t } = useTranslation();
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const categories = [
    { id: "1", name: t("blog.blogCategories.newsUpdates") },
    { id: "2", name: t("blog.blogCategories.offersPromotions") },
    { id: "3", name: t("blog.blogCategories.travelGuides") },
    { id: "4", name: t("blog.blogCategories.localFood") },
    { id: "5", name: t("blog.blogCategories.bookingTips") },
    { id: "6", name: t("blog.blogCategories.hotelServices") },
    { id: "7", name: t("blog.blogCategories.eventsActivities") },
    { id: "8", name: t("blog.blogCategories.nearbyAttractions") },
    { id: "9", name: t("blog.blogCategories.travelTips") },
    { id: "10", name: t("blog.blogCategories.guestExperiences") },
  ];
  const fullToolbar = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],

      [{ header: 1 }, { header: 2 }],
      [{ font: [] }],
      [{ size: [] }],

      [{ color: [] }, { background: [] }],

      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],

      ["link", "image"],

      ["blockquote", "code-block"],

      [{ indent: "-1" }, { indent: "+1" }],

      ["clean"],
    ],
  };
  const [defaultPreview, setDefaultPreview] = useState<string>(
    "/placeholder-image.png",
  );
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!open || !blogId) return;
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await findById(blogId);
        const b = response?.data?.data;
        setFormData({
          title: b.title || "",
          category: b.categoryId ? String(b.categoryId) : "",
          description: b.description || "",
          content: b.content || "",
          status: b.status ? String(b.status) : "",
          image: null,
        });
        setDefaultPreview(File_URL+ b?.image?.url);
      } catch (err: any) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [open, blogId]);

  const handleBannerImage = (files: File[] | null) =>
    setFormData((p) => ({ ...p, image: files?.[0] ?? null }));
  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const cleanedData = Object.fromEntries(
        Object.entries({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          content: formData.content,
          status: formData.status,
          image: formData.image,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ]),
      );
      const response = await updateBlog(blogId ?? 0, cleanedData);
      showAlert({
        title: response?.data?.message,
        type: "success",
        autoClose: 4000,
      });
      setFormData({
        title: "",
        category: "",
        description: "",
        content: "",
        status: "",
        image: null,
      });
      onSubmit();
      onClose();
    } catch (err: any) {
      showAlert({
        title: t("blog.createOrUpdate.updateError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      content: "",
      status: "",
      image: null,
    });
    onClose();
  };
  if (!open || !blogId) return <></>;
 return (
  <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
    <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] p-0 rounded-2xl overflow-hidden">

      {/* HEADER */}
      <DialogHeader className="px-6 py-4 border-b bg-gray-50">
        <DialogTitle className="text-lg font-semibold">
          {t("blog.createOrUpdate.titleEdit")}
        </DialogTitle>
      </DialogHeader>

      {fetching ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* BODY SCROLL */}
          <div className="px-6 py-6 overflow-y-auto max-h-[70vh] space-y-6">

            {/* TOP GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* TITLE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("blog.name")} *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleTextChange}
                  className="h-11"
                />
              </div>

              {/* STATUS */}
              <div className="space-y-2">
                <SelectField
                  label={t("common.status")}
                  items={[
                    { value: "1", label: t("blog.draft") },
                    { value: "2", label: t("blog.published") },
                  ]}
                  value={formData.status}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, status: v }))
                  }
                  isRequired
                  getValue={(i) => String(i.value)}
                  getLabel={(i) => i.label}
                />
              </div>

              {/* CATEGORY FULL */}
              <div className="md:col-span-2 space-y-2">
                <SelectField
                  label={t("blog.category")}
                  items={categories}
                  value={formData.category}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, category: v }))
                  }
                  isRequired
                  getValue={(i) => String(i.id)}
                  getLabel={(i) => i.name}
                />
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("blog.description")}
              </label>
              <div className="border rounded-lg overflow-hidden">
                <QuillEditor
                  theme="snow"
                  value={formData.description}
                  onChange={(v) =>
                    setFormData((f) => ({ ...f, description: v }))
                  }
                  modules={fullToolbar}
                  className="min-h-[180px]"
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("blog.content")}
              </label>
              <div className="border rounded-lg overflow-hidden">
                <QuillEditor
                  theme="snow"
                  value={formData.content}
                  onChange={(v) =>
                    setFormData((f) => ({ ...f, content: v }))
                  }
                  modules={fullToolbar}
                  className="min-h-[250px]"
                />
              </div>
            </div>

            {/* IMAGE */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("banner.thumbnail")}
              </label>
              <UploadField
                className="w-full"
                defaultPreviewUrl={defaultPreview}
                onChange={handleBannerImage}
              />
            </div>

          </div>

          {/* FOOTER */}
          <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              {t("common.cancel")}
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  </Dialog>
);
};
export default EditBlog;
