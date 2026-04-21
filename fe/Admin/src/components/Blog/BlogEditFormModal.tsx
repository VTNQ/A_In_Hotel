import { useEffect, useState } from "react";
import { useAlert } from "../alert-context";
import { findById, updateBlog } from "../../service/api/Blog";
import { File_URL } from "../../setting/constant/app";
import CommonModal from "../ui/CommonModal";
import QuillEditor from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useTranslation } from "react-i18next";
import type { UpdateBlogFormModalProps } from "../../type/blog.types";

const BlogEditFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  blogId,
}: UpdateBlogFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [errors, setErrors] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
  });
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    category: "",
    description: "",
    content: "",
    status: "2",
    image: null as File | null,
  });
  const [saving, setSaving] = useState(false);
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
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!isOpen || !blogId) return;
    setLoading(true);
    findById(blogId)
      .then((res) => {
        const data = res?.data?.data;
        setFormData({
          id: data.id || "",
          title: data.title || "",
          category: data.categoryId || "",
          description: data.description || "",
          content: data.content || "",
          status: data.status || "",
          image: null,
        });
        setPreview(File_URL + data.image?.url || null);
      })
      .catch(() => {
        showAlert({
          title: t("blog.loadError"),
          type: "error",
        });
        onClose();
      })
      .finally(() => setLoading(false));
  }, [isOpen, blogId]);
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
    if(file.size > maxSize){
      setErrors((prev)=>({
        ...prev,
        image: t("blog.validate.imageTooLarge")
      }));
      setPreview(null);
      setFormData((prev) => ({ ...prev, image: null }));
      return;
    }
    setPreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, image: null }));
    setErrors((prev) => ({
      ...prev,
      image: "",
    }));
  };
  const handleCancel = () => {
    setFormData({
      id: "",
      title: "",
      category: "",
      description: "",
      status: "2",
      content: "",
      image: null,
    });
    onClose();
  };
  const handleSave = async () => {
    if (!validateAll()) return;
    setSaving(true);
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
      await updateBlog(Number(formData.id), cleanedData);
      const message = t("blog.createOrUpdate.updateSucess");
      showAlert({
        title: message,
        type: "success",
        autoClose: 3000,
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Update error:", err);
      showAlert({
        title:
          err?.response?.data?.message || t("blog.createOrUpdate.updateError"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setSaving(false);
    }
  };
  if (isOpen && loading) {
    return (
      <CommonModal
        isOpen={true}
        onClose={handleCancel}
        title={t("blog.createOrUpdate.titleEdit")}
        saveLabel={t("common.saveButton")}
        cancelLabel={t("common.cancelButton")}
      >
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-[#2E3A8C] border-t-transparent rounded-full" />
        </div>
      </CommonModal>
    );
  }
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleCancel}
      onSave={handleSave}
      onsubmit={saving}
      title={t("blog.createOrUpdate.titleEdit")}
      saveLabel={saving ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
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
          <label className="font-medium">{t("common.status")}*</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
          >
            <option value="1">{t("blog.draft")}</option>
            <option value="2">{t("blog.published")}</option>
            <option value="3">{t("blog.archived")}</option>
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
            className="border-2 border-dashed border-[#AFC0E2] hover:border-[#4B62A0] transition 
                        rounded-xl bg-[#F6F8FC] cursor-pointer flex flex-col items-center justify-center py-10 text-center"
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
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>
      </div>
    </CommonModal>
  );
};
export default BlogEditFormModal;
