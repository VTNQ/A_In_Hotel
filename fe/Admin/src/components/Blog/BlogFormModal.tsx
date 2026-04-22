import { useState } from "react";
import CommonModal from "../ui/CommonModal";
import QuillEditor, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAlert } from "../alert-context";
import { createBlog } from "../../service/api/Blog";
import { useTranslation } from "react-i18next";
import BlotFormatter from "quill-blot-formatter";
Quill.register("modules/blotFormatter", BlotFormatter);
import type { BlogFormModalProps } from "../../type/blog.types";
const BlogFormModal = ({ isOpen, onClose, onSuccess }: BlogFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
  });
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    content: "",
    status: "2",
    image: null as File | null,
  });
  const { showAlert } = useAlert();
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
  const validateField = (name: string, value: any) => {
    let error = "";
    switch (name) {
      case "title":
        if (!value?.trim()) error = t("blog.createOrUpdate.enterTitle");
        break;
      case "category":
        if (!value) error = t("blog.createOrUpdate.selectCategory");
        break;
      case "content":
        if (!value || value === "<p><br></p>")
          error = t("blog.createOrUpdate.enterContent");
        break;
      case "image":
        if (!value) error = t("blog.createOrUpdate.imageRequired");
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  const validateAll = () => {
    const newErrors = {
      title: "",
      category: "",
      content: "",
      image: "",
    };
    if (!formData.title.trim()) newErrors.title = t("blog.valid.titleRequired");
    if (!formData.category)
      newErrors.category = t("blog.valid.categoryRequired");
    if (!formData.content || formData.content === "<p><br></p>")
      newErrors.content = t("blog.valid.contentRequired");
    if (!formData.image) newErrors.image = t("blog.valid.imageRequired");
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };
  const isFormValid = () => {
    const newErrors = {
      title: "",
      category: "",
      content: "",
      image: "",
    };
    if (!formData.title.trim()) newErrors.title = t("blog.valid.titleRequired");
    if (!formData.category)
      newErrors.category = t("blog.valid.categoryRequired");
    if (!formData.content || formData.content === "<p><br></p>")
      newErrors.content = t("blog.valid.contentRequired");
    if (!formData.image) newErrors.image = t("blog.valid.imageRequired");
    return !Object.values(newErrors).some((e) => e);
  };
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
    blotFormatter: {
      overlay: {
        style: {
          border: "2px dashed #444",
        },
      },
    },
  };
  const fullToolbarDescription = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],

      [{ header: 1 }, { header: 2 }],
      [{ font: [] }],
      [{ size: [] }],

      [{ color: [] }, { background: [] }],

      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],

      ["blockquote", "code-block"],

      [{ indent: "-1" }, { indent: "+1" }],

      ["clean"],
    ],
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024;
    if (!file) {
      setErrors((prev) => ({
        ...prev,
        image: t("blog.valid.imageRequired"),
      }));
      setPreview(null);
      setFormData((prev) => ({ ...prev, image: null }));
      return;
    }
    if (!allowedTypes.includes(file?.type)) {
      showAlert({
        title: t("blog.createOrUpdate.uploadError"),
        type: "error",
        autoClose: 3000,
      });
      setErrors((prev) => ({
        ...prev,
        image: t("blog.valid.imageInvalid"),
      }));
      setPreview(null);
      setFormData((prev) => ({ ...prev, image: null }));
      return;
    }
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        image: t("blog.validate.imageTooLarge"),
      }));
      setPreview(null);
      setFormData((prev) => ({ ...prev, image: null }));
      return;
    }
    setPreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, image: file }));
    setErrors((prev) => ({
      ...prev,
      image: "",
    }));
  };
  const handleCancel = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      status: "2",
      content: "",
      image: null,
    });
    setErrors({
      title: "",
    category: "",
    content: "",
    image: "",
    })
    setPreview(null);
    onClose();
  };
  const handleSave = async () => {
    if (!validateAll()) return;
    setLoading(true);
    try {
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
      await createBlog(cleanedData);

      showAlert({
        title: t("blog.createOrUpdate.createSucess"),
        type: "success",
        autoClose: 3000,
      });
      setFormData({
        title: "",
        category: "",
        description: "",
        status: "2",
        content: "",
        image: null,
      });
      setPreview(null);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Create error:", err);
      showAlert({
        title:
          err?.response?.data?.message || t("blog.createOrUpdate.createError"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <CommonModal
      isOpen={isOpen}
      onsubmit={loading}
      onClose={handleCancel}
      onSave={handleSave}
      title={t("blog.createOrUpdate.titleCreate")}
      saveLabel={loading ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      diabled={!isFormValid() || loading}
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("blog.name")} *
          </label>
          <input
            type="text"
            name="title"
            placeholder={t("blog.createOrUpdate.enterTitle")}
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("blog.category")} *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
          >
            <option value="">{t("blog.createOrUpdate.selectCategory")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>
        <div>
          <label className="font-medium">{t("common.status")} *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
          >
            <option value="1">{t("blog.draft")}</option>
            <option value="2">{t("blog.published")}</option>
          </select>
        </div>
        <div>
          <label className="font-medium">{t("blog.description")}</label>
          <QuillEditor
            theme="snow"
            value={formData.description}
            onChange={(v) => setFormData((f) => ({ ...f, description: v }))}
            modules={fullToolbarDescription}
          />
        </div>

        <div>
          <label className="font-medium">{t("blog.content")}</label>
          <QuillEditor
            theme="snow"
            value={formData.content}
            onBlur={() => validateField("content", formData.content)}
            onChange={(v) => setFormData((f) => ({ ...f, content: v }))}
            modules={fullToolbar}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#253150]">
            {t("blog.thumbnail")} *
          </label>

          <div
            className="border-2 border-dashed border-[#AFC0E2] 
                        hover:border-[#4B62A0] transition rounded-xl bg-[#F6F8FC] cursor-pointer
                        flex flex-col items-center justify-center py-10 text-center"
            onClick={() => document.getElementById("thumbnailInput")?.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg shadow"
              />
            ) : (
              <>
                <div className="text-gray-400 flex flex-col items-center">
                  <img
                    src="/defaultImage.png"
                    className="w-[167px] h-[117px] opacity-60"
                    alt=""
                  />
                  <p className="text-gray-500 text-sm">
                    {t("blog.createOrUpdate.clickSelectImages")}
                  </p>
                </div>
              </>
            )}
          </div>

          <input
            id="thumbnailInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        {errors.image && (
          <p className="text-red-500 text-sm mt-1">{errors.image}</p>
        )}
      </div>
    </CommonModal>
  );
};
export default BlogFormModal;
