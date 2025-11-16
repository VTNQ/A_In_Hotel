import { useState } from "react";
import type { BlogFormModalProps } from "../../type";
import CommonModal from "../ui/CommonModal";
import QuillEditor from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAlert } from "../alert-context";
import { createBlog } from "../../service/api/Blog";
const BlogFormModal = ({
    isOpen,
    onClose,
    onSuccess,
}: BlogFormModalProps) => {
    const [loading, setLoading] = useState(false);
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
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setFormData((prev) => ({ ...prev, image: file }));
        }
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
        onClose();
    };
    const handleSave = async () => {
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
                ])
            );
            const response = await createBlog(cleanedData);
               
            showAlert({
                title: response?.data?.message || "Blog created successfully!",
                type: "success",
                autoClose: 3000
            });

            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error("Create error:", err);
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to create blog. Please try again.",
                type: "error",
                autoClose: 4000,
            });
        } finally {
            setLoading(false)
        }
    }
    return (
        <CommonModal
            isOpen={isOpen}
            onClose={handleCancel}
            onSave={handleSave}
            title="Create New Blog"
            saveLabel={loading ? "Saving..." : "Save"}
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
export default BlogFormModal;