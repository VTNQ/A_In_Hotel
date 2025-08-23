import React, { useEffect, useState } from "react";
import { Mail, Lock, User2, Code2 } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { getAll } from "@/setting/api/Authenticate";
import type { UserResponse } from "@/type/UserResponse";
import { SelectField } from "../ui/select";


/**
 * FormLayouts
 * - 4 thẻ form theo layout giống ảnh: Vertical, Vertical w/ icons, Horizontal, Horizontal w/ icons
 * - Tailwind only, icon bằng lucide-react
 * - Nút "Show Code" ở góc phải mỗi card (demo, chưa gắn hành động)
 */
export default function FormLayouts() {
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
    }, [])
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mx-auto mb-6 flex  items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Form Layouts</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Forms <span className="mx-1">»</span> Form Layouts
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-50">
                        Plan Upgrade
                    </button>
                    <button className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 shadow-sm hover:bg-rose-50">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="mx-auto grid  grid-cols-1 gap-6 lg:grid-cols-1">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 p-4">
                        <h3 className="text-lg font-semibold text-gray-800">Khách sạn</h3>

                    </div>
                    <div className="p-6">
                        <form className="space-y-4">
                            <div>
                                <Label htmlFor="Tên khách sạn">Tên khách sạn</Label>
                                <Input placeholder="Nhập tên khách sạn" />
                            </div>
                            <div>
                                <Label htmlFor="Tên khách sạn">Địa chỉ</Label>
                                <Textarea placeholder="Nhập địa chỉ khách sạn" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]" rows={3} />
                            </div>
                            <div>
                               
                                <SelectField<UserResponse>
                                    items={users}


                                    label="Người quản lý"
                                    placeholder="Chọn người quản lý"
                                    description="Chọn 1 người để phụ trách phòng."
                                    clearable
                                    size="md"
                                    getValue={(u) => String(u.id)}
                                    getLabel={(u) => u.fullName ?? u.email ?? `User #${u.id}`}
                                />
                            </div>
                            <Button type="submit" >Submit</Button>
                        </form>
                    </div>
                </div>


            </div>
        </div>
    );
}

