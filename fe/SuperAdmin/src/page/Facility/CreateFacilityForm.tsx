import { useAlert } from "@/components/alert-context";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {  getAllCategories } from "@/service/api/Categories";
import { addExtraService } from "@/service/api/facilities";
import type { FacilityForm } from "@/type/facility.types";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateFacilityForm: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const { showAlert } = useAlert();
    const [form, setForm] = useState<FacilityForm>({
        serviceName: "",
        description: "",
        note: "",
        categoryId: null,
       
    });
    const navigate = useNavigate();
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    /* ================= handlers ================= */

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;


        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (file: File) => {
        setCoverImage(file);
        setPreview(URL.createObjectURL(file));
    }
    const onFileInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) handleImageChange(file);
    };
    /* ================= fetch category ================= */

    const fetchCategories = async () => {
        try {
            const res = await getAllCategories({
                all: true,
                filter: "isActive==1 and type==2",
            });
            setCategories(res.content || []);
            console.log(res.content)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        if (submitting) return;
        try {
            setSubmitting(true);
            const payload = {
                serviceName: form.serviceName,
                description: form.description,
                categoryId: Number(form.categoryId),
                price: 0,
                extraCharge: 0,
                note: form.note,
                type: 1,
                isActive: 1,
                image: coverImage
            }
            const response = await addExtraService(payload);
            showAlert({
                title: response.data.message,
                type: "success",
                autoClose: 4000,
            });
            setForm({
                serviceName: "",
                description: "",
                note: "",
                categoryId: null,
               
            })
        } catch (err: any) {
            showAlert({
                title: "create facilities failed",
                description: err?.response.data.message || "Vui lòng thử lại sau",
                type: "error",
                autoClose: 4000,
            })
        } finally {
            setSubmitting(false)
        }


    }

    /* ================= render ================= */

    return (
        <div className="space-y-6">
            {/* ===== Page header ===== */}
            <div>
                <h1 className="text-2xl font-semibold">Create Facility</h1>

                <Breadcrumb
                    items={[
                        { label: "Home", href: "/Home" },

                        { label: "Facilities", href: "/Home/facilities" },
                        { label: "Create Facility" },
                    ]}
                />
            </div>

            {/* ===== Form ===== */}
            <div className=" rounded-xl border bg-white p-6 space-y-6">
                {/* Facility name */}
                <div>
                    <label className="text-sm font-medium">
                        Facility Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="serviceName"
                        value={form.serviceName}
                        onChange={handleChange}
                        placeholder="Enter facility name"
                        className="mt-1"
                    />
                </div>

                {/* Description (show to customer) */}
                <div>
                    <label className="text-sm font-medium">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe this facility (shown to customer)"
                        rows={3}
                        className="mt-1"
                    />
                </div>

                {/* Category */}
                <SelectField
                    label="Category"
                    items={categories}
                    value={form.categoryId}
                    onChange={(v) =>
                        setForm((prev) => ({ ...prev, categoryId: v }))
                    }
                    placeholder="Select category"
                    getValue={(i) => i.id}
                    getLabel={(i) => i.name}
                />
                {/* Cover Image */}
                <div>
                    <label className="text-sm font-medium">Cover Image</label>

                    <div className="mt-2">
                        <label
                            htmlFor="cover-upload"
                            className="
    flex h-100 cursor-pointer flex-col items-center justify-center
    rounded-lg border-2 border-dashed border-gray-300
    text-center text-sm text-gray-500
    hover:border-primary hover:bg-gray-50
  "
                        >

                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Cover preview"
                                    className="h-full w-full rounded-lg object-cover"
                                />
                            ) : (
                                <>
                                    <svg
                                        className="mb-2 h-8 w-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M3 16l4-4a2 2 0 012.828 0l4.344 4.344a2 2 0 002.828 0L21 12"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M14 8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>

                                    <p className="font-medium">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        SVG, PNG, JPG (max. 800×400px)
                                    </p>
                                </>
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
                </div>


                {/* Internal note */}
                <div>
                    <label className="text-sm font-medium">Note</label>
                    <Textarea
                        name="note"
                        value={form.note}
                        onChange={handleChange}
                        placeholder="Internal note (not shown to customer)"
                        rows={2}
                        className="mt-1"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 border-t pt-4">
                    <Button variant="outline" onClick={()=>navigate("/Home/facility")}>Cancel</Button>
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
                                Saving...
                            </span>
                        ) : (
                            "Create Facility"
                        )}
                    </Button>

                </div>
            </div>
        </div>
    );
};

export default CreateFacilityForm;
