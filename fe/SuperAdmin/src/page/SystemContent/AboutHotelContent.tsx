import { useAlert } from "@/components/alert-context";
import { getSystemContentByKey, updateSystemContent } from "@/service/api/SystemContent";
import { File_URL } from "@/setting/constant/app";
import type { AboutHotelContentForm } from "@/type/SystemContent";
import { useEffect, useState } from "react";

const AboutHotelContent = () => {
    const [form, setForm] = useState<AboutHotelContentForm>({
        description: "",
        id:"",
        ctaText: "",
        title: "",
        image: null,
        imageUrl: ""
    });
    const { showAlert } = useAlert();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSystemContentByKey(1);
                setForm({
                    id: response.data.data.id || "",
                    description: response.data.data.description || "",
                    ctaText: response.data.data.ctaText,
                    title: response.data.data.title,
                    imageUrl: File_URL + response.data.data.backgroundImage?.url || "",
                })
            } catch (err: any) {
                console.log(err)
            }
        }
        fetchData();
    }, [])
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setForm((prev) => ({ ...prev, image: e.target.files![0] }));
        }
    };

    const handleSubmit =async () => {
        try {
            const payload = {
               title:form.title,
               description:form.description,
               ctaText:form.ctaText,
               image:form.image
            }
            const response = await updateSystemContent(Number(form.id), payload);
            const message = response?.data?.message || "System Content updated successfully.";
            showAlert({
                title: message,
                type: "success",
                autoClose: 3000,
            });

        
        } catch (err: any) {
            console.error("Update error:", err);
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to update asset. Please try again.",
                type: "error",
                autoClose: 4000,
            })
        } 
    };
    const previewImage = form.image
        ? URL.createObjectURL(form.image)
        : form.imageUrl;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    About Hotel Content
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    System Management / System Content /{" "}
                    <span className="text-blue-600">About Hotel</span>
                </p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-xl shadow-sm border">
                {/* Card Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="font-medium text-gray-900">Edit Content</h2>
                    <span className="text-xs text-gray-400">
                        Last updated: 2 hours ago
                    </span>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                T
                            </span>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Welcome to Our Hotel"
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm
                 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <p className="text-xs text-gray-400 mt-1">
                            The main headline displayed for the About section.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={8}
                            placeholder="Enter a detailed description about the hotel, its atmosphere, services, and unique experiences..."
                            className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-700
               focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <p className="text-xs text-gray-400 mt-1">
                            Provide a clear and engaging description that highlights the hotel's story,
                            values, and unique selling points.
                        </p>
                    </div>


                    {/* CTA + Image */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* CTA */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Call to Action Text
                            </label>
                            <input
                                type="text"
                                name="ctaText"
                                value={form.ctaText}
                                onChange={handleChange}
                                placeholder="e.g. Book Your Stay Now"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                This text will appear on the button below the description.
                            </p>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Featured Image
                            </label>

                            <div className="flex gap-4 items-start">
                                {/* Preview Image */}
                                {previewImage && (
                                    <div className="w-[140px] h-[140px] rounded-md overflow-hidden border">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Upload Box */}
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-[140px] w-full cursor-pointer hover:border-blue-500 transition">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/png,image/jpeg,image/gif"
                                        onChange={handleImageChange}
                                    />
                                    <span className="text-blue-600 text-sm">
                                        Upload a file or drag and drop
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1">
                                        PNG, JPG, GIF up to 10MB
                                    </span>
                                </label>
                            </div>
                        </div>

                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutHotelContent;
