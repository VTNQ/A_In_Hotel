import React, { useEffect, useState } from "react";
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
    const getUser = async () => {
        try {
            const response = await getAll();
            setUsers(response.data.content);
        } catch (error) {
            console.log("Failed to fetch user:", error);
        }
    }
    useEffect(() => {
        getUser();
    }, []);
    const [formData, setFormData] = useState<HotelFormData>({
        name: '',
        address: '',
        idUser: null
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
                idUser: null
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
                        <h3 className="text-lg font-semibold text-gray-800">Khách sạn</h3>

                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="Tên khách sạn">Tên khách sạn</Label>
                                <Input value={formData.name} onChange={(val) => setFormData((prev) => ({ ...prev, name: val.target.value }))} placeholder="Nhập tên khách sạn" />
                            </div>
                            <div>
                                <Label htmlFor="Địa chỉ khách sạn">Địa chỉ</Label>
                                <Textarea value={formData.address} placeholder="Nhập địa chỉ khách sạn" onChange={(val) => setFormData((prev) => ({ ...prev, address: val.target.value }))} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]" rows={3} />
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
                                    label="Người quản lý"
                                    placeholder="Chọn người quản lý"
                                    description="Chọn 1 người để phụ trách phòng."
                                    clearable
                                    size="md"
                                    getValue={(u) => String(u.id)}
                                    getLabel={(u) => u.fullName ?? u.email ?? `User #${u.id}`}
                                />
                            </div>
                            <Button type="submit" >Lưu</Button>
                        </form>
                    </div>
                </div>


            </div>
        </div>
    );
}

