"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { DatePickerField } from "../ui/DatePickerField";
import { Textarea } from "../ui/textarea";
import UploadField from "../ui/UploadField";
import { Button } from "../ui/button";
import { useAlert } from "../alert-context";
import { findById, updateBanner } from "@/service/api/Banner";
import {  isBefore, startOfToday } from "date-fns";
import { File_URL } from "@/setting/constant/app";
import { formatISO } from "date-fns";

type BannerForm = {
    title: string;
    startDate?: Date;
    endDate?: Date;
    cta: string;
    desc: string;
    bannerImage: File | null; // ảnh mới (nếu chọn)
};


const EditBanner: React.FC = () => {
    const { id } = useParams();
    const bannerId = Number(id);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [loading, setLoading] = useState(true);
    const [defaultPreview, setDefaultPreview] = useState<string>("/placeholder-image.png");
    const [formData, setFormData] = useState<BannerForm>({
        title: "",
        startDate: undefined,
        endDate: undefined,
        cta: "",
        desc: "",
        bannerImage: null,
    });

    // ───────── Fetch detail ─────────
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await findById(bannerId);
                const b = res?.data;

                setFormData({
                    title: b?.name ?? "",
                    startDate: b?.startAt ? new Date(b.startAt) : undefined,
                    endDate: b?.endAt ? new Date(b.endAt) : undefined,
                    cta: b?.ctaLabel ?? "",
                    desc: b?.description ?? "",
                    bannerImage: null, // ban đầu chưa có file mới
                });

                setDefaultPreview(File_URL+b?.image?.url);
            } catch (e: any) {
                showAlert({
                    title: "Không tải được dữ liệu banner",
                    description: e?.message,
                    type: "error",
                    autoClose: 4000,
                });
            } finally {
                setLoading(false);
            }
        };

        if (!isNaN(bannerId)) fetchDetail();
    }, [bannerId, showAlert]);

    // ───────── Handlers ─────────
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStartDate = (d?: Date) => setFormData((p) => ({ ...p, startDate: d }));
    const handleEndDate = (d?: Date) => setFormData((p) => ({ ...p, endDate: d }));

    const handleBannerImage = (files: File[] | null) =>
        setFormData((p) => ({ ...p, bannerImage: files?.[0] ?? null }));


    const toOffsetDateTime = (d?: Date) =>
        d ? formatISO(d) : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dto = {
                name: formData.title,
                startAt: toOffsetDateTime(formData.startDate),
                endAt: toOffsetDateTime(formData.endDate),
                ctaLabel: formData.cta,
                description: formData.desc,
                image:formData.bannerImage
            };
            const response = await updateBanner(dto, bannerId)

            showAlert({
                title: response.data.message,
                type: "success",
                autoClose: 4000,
            })

            
            setFormData((p) => ({ ...p, bannerImage: null }));
             navigate("/Home/banner");
        } catch (error: any) {
            showAlert({
                title: "Cập nhật banner thất bại",
                description: error?.response.data.message || "Vui lòng thử lại sau",
                type: "error",
                autoClose: 4000,
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <p className="text-sm text-muted-foreground">Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Banner</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Banner <span className="mx-1">»</span> Edit Banner
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            </div>

            <div className="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-1">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 p-4">
                        <h3 className="text-lg font-semibold text-gray-800">Chỉnh sửa Banner</h3>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="title">Tiêu đề</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Nhập tiêu đề banner"
                                    value={formData.title}
                                    onChange={handleTextChange}
                                    className="mt-3"
                                />
                            </div>

                            <div>
                                <Label>Ngày Bắt Đầu</Label>
                                <DatePickerField
                                    value={formData.startDate}
                                    onChange={handleStartDate}
                                    disabledDate={(date) => isBefore(date, startOfToday())}
                                    className="mt-3"
                                    placeholder="Nhập ngày bắt đầu"
                                />
                            </div>

                            <div>
                                <Label>Ngày Kết Thúc</Label>
                                <DatePickerField
                                    className="mt-3"
                                    placeholder="Nhập ngày kết thúc"
                                    value={formData.endDate}
                                    onChange={handleEndDate}
                                     disabledDate={(date) =>
                                    !formData.startDate ? false : date <= formData.startDate
                                } />
                                
                            </div>

                            <div>
                                <Label htmlFor="cta">Nút CTA</Label>
                                <Input
                                    id="cta"
                                    name="cta"
                                    placeholder="Nhập nội dung nút CTA"
                                    value={formData.cta}
                                    onChange={handleTextChange}
                                    className="mt-3"
                                />
                            </div>

                            <div>
                                <Label htmlFor="desc">Mô tả Banner</Label>
                                <Textarea
                                    id="desc"
                                    name="desc"
                                    placeholder="Nhập mô tả ngắn gọn"
                                    value={formData.desc}
                                    onChange={handleTextChange}
                                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label>Ảnh Banner</Label>
                                <UploadField
                                    className="mt-2 w-full"
                                    // KHÔNG dùng prop `value` – UploadField không hỗ trợ controlled
                                    defaultPreviewUrl={defaultPreview} // ảnh hiện tại
                                    onChange={handleBannerImage} // file mới (nếu có)
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Không chọn ảnh mới sẽ giữ nguyên ảnh hiện tại.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit">Lưu</Button>
                                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBanner;
