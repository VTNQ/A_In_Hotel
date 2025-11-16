import { useEffect, useState } from "react";
import type { UpdateBlogFormModalProps } from "../../type";
import { useAlert } from "../alert-context";
import { findById, updateBlog } from "../../service/api/Blog";
import { File_URL } from "../../setting/constant/app";
import CommonModal from "../ui/CommonModal";
import QuillEditor from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const BlogEditFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    blogId
}: UpdateBlogFormModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        category: "",
        description: "",
        content: "",
        status: "2",
        image: null as File | null,
    })
    const [saving, setSaving] = useState(false);
    const { showAlert } = useAlert();
    const categories = [
        { id: "1", name: "News & Updates" },
        { id: "2", name: "Offers & Promotions" },
        { id: "3", name: "Travel Guides" },
        { id: "4", name: "Local Food" },
        { id: "5", name: "Booking Tips" },
        { id: "6", name: "Hotel Services" },
        { id: "7", name: "Events & Activities" },
        { id: "8", name: "Nearby Attractions" },
        { id: "9", name: "Travel Tips" },
        { id: "10", name: "Guest Experiences" }
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
                    image: null
                })
                setPreview(File_URL + data.image?.url || null)
            })
            .catch(() => {
                showAlert({
                    title: "Failed to load category information!",
                    type: "error",
                });
                onClose();
            })
            .finally(() => setLoading(false));


    }, [isOpen, blogId]);
    const fullToolbar = {
        toolbar: [
            ["bold", "italic", "underline", "strike"],

            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'font': [] }],
            [{ 'size': [] }],

            [{ 'color': [] }, { 'background': [] }],

            [{ 'align': [] }],

            [{ 'list': 'ordered' }, { 'list': 'bullet' }],

            ["link", "image"],

            ["blockquote", "code-block"],

            [{ 'indent': '-1' }, { 'indent': '+1' }],

            ["clean"],
        ]
    };
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setFormData((prev) => ({ ...prev, image: file }));
        }
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
        setSaving(true)
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
                ])
            );
            const response = await updateBlog(Number(formData.id), cleanedData);
            const message = response?.data?.message || "Blog updated successfully.";
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
                    err?.response?.data?.message ||
                    "Failed to update blog. Please try again.",
                type: "error",
                autoClose: 4000,
            })
        } finally {
            setSaving(false)
        }
    }
    if (isOpen && loading) {
        return (
            <CommonModal
                isOpen={true}
                onClose={handleCancel}
                title="Edit Blog"
                saveLabel="Save"
                cancelLabel="Cancel"
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
            title="Edit Blog"
            saveLabel={saving ? "Saving..." : "Save"}
            cancelLabel="Cancel"
        >
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">Title *</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter blog title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">Category *</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="font-medium">Status *</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                    >
                        <option value="1">Draft</option>
                        <option value="2">Published</option>
                        <option value="3">Archived</option>
                    </select>
                </div>
                <div>
                    <label className="font-medium">Description</label>
                    <QuillEditor
                        theme="snow"
                        value={formData.description}
                        onChange={(v) => setFormData((f) => ({ ...f, description: v }))}
                        modules={fullToolbar}
                    />
                </div>

                <div>
                    <label className="font-medium">Content</label>
                    <QuillEditor
                        theme="snow"
                        value={formData.content}
                        onChange={(v) => setFormData((f) => ({ ...f, content: v }))}
                        modules={fullToolbar}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium text-[#253150]">
                        Thumbnail *
                    </label>

                    <div
                        className="
      border-2 border-dashed border-[#AFC0E2]
      hover:border-[#4B62A0]
      transition
      rounded-xl
      bg-[#F6F8FC]
      cursor-pointer
      flex flex-col items-center justify-center
      py-10
      text-center
    "
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
                                    <p className="text-gray-500 text-sm">Click to select images</p>
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

            </div>
        </CommonModal>
    )
}
export default BlogEditFormModal;