import React, { useEffect, useRef, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { getAll } from "@/service/api/Authenticate";
import type { UserResponse } from "@/type/UserResponse";
import { SelectField } from "../ui/select";
import { useAlert } from "../alert-context";
import { AddHotel } from "@/service/api/Hotel";
import { useNavigate } from "react-router-dom";
import type { HotelFormData } from "@/type/hotel.types";
import Breadcrumb from "../Breadcrumb";


/**
 * FormLayouts
 * - 4 thẻ form theo layout giống ảnh: Vertical, Vertical w/ icons, Horizontal, Horizontal w/ icons
 * - Tailwind only, icon bằng lucide-reactch
 * - Nút "Show Code" ở góc phải mỗi card (demo, chưa gắn hành động)
 */
export default function CreateHotel() {
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const getUser = async () => {
        try {
            const response = await getAll({
                all: true,
                filter: "hotel.id=isnull=true and role.id==2"
            });
            setUsers(response.data.content);
        } catch (error) {
            console.log("Failed to fetch user:", error);
        }
    }
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    useEffect(() => {
        getUser();
    }, []);
    const [formData, setFormData] = useState<HotelFormData>({
        name: '',
        address: '',
        idUser: null,
        image: null as File | null
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await AddHotel(formData);

            showAlert({
                title: response.data.message,
                type: "success",
                autoClose: 4000,
            })
            setFormData({
                name: '',
                address: '',
                idUser: null,
                image: null as File | null
            })
            navigate('/Home/hotel');
        } catch (error: any) {
            showAlert({
                title: "Tạo khách sạn thất bại",
                description: error?.response.data.message || "Vui lòng thử lại sau",
                type: "error",
                autoClose: 4000,
            })
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}

            <div >
                <h1 className="text-2xl font-semibold">Create Hotel</h1>
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/Home" },

                        { label: "Hotel", href: "/Home/hotel" },
                        { label: "Create Hotel" },
                    ]}
                />

            </div>

            {/* Grid */}
            <div className="mx-auto grid mt-5  grid-cols-1 gap-6 lg:grid-cols-1">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 p-4">
                        <h3 className="text-lg font-semibold text-gray-800">Hotel</h3>

                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="Hotel Name">Hotel Name</Label>
                                <Input value={formData.name} onChange={(val) => setFormData((prev) => ({ ...prev, name: val.target.value }))} placeholder="Enter Name Hotel" />
                            </div>
                            <div>
                                <Label htmlFor="Address">Address</Label>
                                <Textarea value={formData.address} placeholder="Enter Address Hotel" onChange={(val) => setFormData((prev) => ({ ...prev, address: val.target.value }))} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]" rows={3} />
                            </div>
                            <div>

                                <SelectField<UserResponse>
                                    items={users}

                                    value={formData.idUser ? String(formData.idUser) : ""}
                                    onChange={(val) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            idUser: val ? Number(val) : null,
                                        }))
                                    }
                                    label="Manager"
                                    placeholder="Select Manager"
                                    description="Choose one person to be in charge of the room."
                                    clearable
                                    size="md"
                                    getValue={(u) => String(u.id)}
                                    getLabel={(u) => u.fullName ?? u.email ?? `User #${u.id}`}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Image</Label>

                                <div className="relative mt-2 w-[13%]">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className={`absolute inset-0 cursor-pointer opacity-0 ${imagePreview ? "pointer-events-none" : "z-10"
                                            }`}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setFormData((prev) => ({
                                                ...prev,
                                                image: file,
                                            }));
                                            setImagePreview(URL.createObjectURL(file));
                                        }}
                                    />

                                    <div className="flex min-h-[130px] w-[126%] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50  text-center hover:border-[#42578E]">
                                        {!imagePreview ? (
                                            <>
                                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                                                    <svg
                                                        className="h-6 w-6 text-slate-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={1.5}
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M3 16.5V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5v9a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 16.5z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M3 13.5l4.5-4.5a2.25 2.25 0 013.182 0L15 13.5"
                                                        />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-slate-600">
                                                    Click to upload hotel photos
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    JPG, PNG 
                                                </p>
                                            </>
                                        ) : (
                                            <div className="relative w-full">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="h-48 w-full rounded-lg object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            image: null,
                                                        }));
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = "";
                                                        }
                                                    }}
                                                    className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" >Lưu</Button>
                        </form>
                    </div>
                </div>


            </div>
        </div>
    );
}

