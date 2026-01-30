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
    <Dialog open={!!open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("blog.createOrUpdate.titleEdit")}</DialogTitle>
        </DialogHeader>
        {fetching ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#253150]/20 border-t-[#253150] rounded-full animate-spin" />
            <span className="ml-3 text-sm text-gray-500">
              {t("common.loading")}
            </span>
          </div>
        ) : (
          <>
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
              <div className="space-y-4 py-2">
                <div>
                  <label className="text-sm font-medium">
                    {t("blog.name")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="title"
                    placeholder={t("blog.createOrUpdate.enterTitle")}
                    onChange={handleTextChange}
                    value={formData.title}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {t("blog.category")} <span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    items={categories}
                    value={formData.category}
                    onChange={(v) =>
                      setFormData((prev) => ({ ...prev, category: v }))
                    }
                    isRequired={true}
                    placeholder={t("blog.createOrUpdate.selectCategory")}
                    getValue={(i) => String(i.id)}
                    getLabel={(i) => i.name}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {t("common.status")}
                    <span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    items={[
                      { value: "1", label: t("blog.draft") },
                      { value: "2", label: t("blog.published") },
                    ]}
                    value={formData.status}
                    placeholder={t("blog.createOrUpdate.selectStatus")}
                    onChange={(v) =>
                      setFormData((prev) => ({ ...prev, status: v }))
                    }
                    isRequired={true}
                    getValue={(i) => String(i.value)}
                    getLabel={(i) => i.label}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {t("blog.description")}
                  </label>
                  <QuillEditor
                    theme="snow"
                    value={formData.description}
                    onChange={(v) =>
                      setFormData((f) => ({ ...f, description: v }))
                    }
                    modules={fullToolbar}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {t("blog.content")}
                  </label>
                  <QuillEditor
                    theme="snow"
                    value={formData.content}
                    onChange={(v) => setFormData((f) => ({ ...f, content: v }))}
                    modules={fullToolbar}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {t("banner.thumbnail")}
                  </label>
                  <UploadField
                    className="mt-2 w-full"
                    defaultPreviewUrl={defaultPreview}
                    onChange={handleBannerImage}
                  />
                </div>
              </div>
            </div>
          </>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t("common.saving") : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default EditBlog;
