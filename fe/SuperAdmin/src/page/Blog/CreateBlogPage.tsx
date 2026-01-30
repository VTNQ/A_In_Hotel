import Breadcrumb from "@/components/Breadcrumb";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import type { BlogForm } from "@/type/blog.types";
import QuillEditor from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import UploadField from "@/components/ui/UploadField";
import { useAlert } from "@/components/alert-context";
import { createBlog } from "@/service/api/Blog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CreateBlogPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BlogForm>({
    title: "",
    category: "",
    description: "",
    content: "",
    status: "",
    image: null,
  });
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
  const { showAlert } = useAlert();
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
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    if (submitting) return;
    e.preventDefault();
    try {
      setSubmitting(true);
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
      const response = await createBlog(cleanedData);
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
    } catch (err: any) {
      showAlert({
        title: t("blog.createOrUpdate.createError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    }finally{
      setSubmitting(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("blog.createOrUpdate.titleCreate")}
        </h1>
        <Breadcrumb
          items={[
            { label: t("common.home"), href: "/Home" },
            { label: t("sidebar.blog"), href: "/Home/banner" },
            { label: t("blog.createOrUpdate.titleCreate") },
          ]}
        />
      </div>
      <div className="rounded-xl border bg-white p-6 space-y-6">
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
            onChange={(v) => setFormData((prev) => ({ ...prev, category: v }))}
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
            onChange={(v) => setFormData((prev) => ({ ...prev, status: v }))}
            isRequired={true}
            getValue={(i) => String(i.value)}
            getLabel={(i) => i.label}
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("blog.description")}</label>
          <QuillEditor
            theme="snow"
            value={formData.description}
            onChange={(v) => setFormData((f) => ({ ...f, description: v }))}
            modules={fullToolbar}
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("blog.content")}</label>
          <QuillEditor
            theme="snow"
            value={formData.content}
            onChange={(v) => setFormData((f) => ({ ...f, content: v }))}
            modules={fullToolbar}
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("blog.thumbnail")}</label>
          <UploadField
            className="w-full mt-2"
            value={formData.image}
            onChange={(files) =>
              setFormData((p) => ({ ...p, image: files?.[0] ?? null }))
            }
          />
        </div>
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => navigate("/Home/post/blog")}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="min-w-[140px]"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                {t("common.saving")}
              </span>
            ) : (
              t("common.save")
            )}
          </Button>
        </div>
      </div>
         
    </div>
  );
};
export default CreateBlogPage;
