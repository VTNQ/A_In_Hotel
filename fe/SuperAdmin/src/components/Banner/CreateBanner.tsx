import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { DatePickerField } from "../ui/DatePickerField";
import { Textarea } from "../ui/textarea";
import UploadField from "../ui/UploadField";
import type { BannerForm } from "@/type/Banner/BannerForm";
import { useAlert } from "../alert-context";
import { createBanner } from "@/service/api/Banner";
import { Button } from "../ui/button";
import { isBefore, startOfToday } from "date-fns";

const CreateBanner = () => {
    const { showAlert } = useAlert();
    const [formData, setFormData] = useState<BannerForm>({
        title: "",
        startDate: undefined,
        endDate: undefined,
        cta: "",
        desc: "",
        bannerImage: null,
    });
    const handleTextChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    const handleStartDate = (d?: Date) => {
        setFormData((p) => ({ ...p, startDate: d })); // d có thể undefined
    };
    const handleEndDate = (d?: Date) =>
        setFormData((p) => ({ ...p, endDate: d }));
    const handleBannerImage = (files: File[] | null) =>
        setFormData((p) => ({ ...p, bannerImage: files && files[0] ? files[0] : null }));
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const BannerDto = {
                name: formData.title,
                startAt: formData.startDate,
                endAt: formData.endDate,
                ctaLabel: formData.cta,
                description: formData.desc
            }
            const response = await createBanner(BannerDto, formData.bannerImage);

            showAlert({
                title: response.message,
                type: "success",
                autoClose: 4000,
            })
            setFormData({
                title: "",
                startDate: undefined,
                endDate: undefined,
                cta: "",
                desc: "",
                bannerImage: null,
            })
        } catch (error: any) {

            showAlert({
                title: "Tạo banner thất bại",
                description: error?.response.data.message || "Vui lòng thử lại sau",
                type: "error",
                autoClose: 4000,
            })
        }
    }

    return (
        <div className="min-h-screen  bg-gray-50 p-6">
            <div className="mx-auto mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Banner</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Banner <span className="mx-1">»</span> Add Banner
                    </p>
                </div>
            </div>
            <div className="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-1">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 p-4">
                        <h3 className="text-lg font-semibold text-gray-800">Banner</h3>

                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="Tiêu đề Banner">Tiêu đề</Label>
                                <Input name="title" placeholder="Nhập tiêu đề banner" value={formData.title} onChange={handleTextChange} className="mt-3" />
                            </div>
                            <div>
                                <Label htmlFor="Ngày Bắt Đầu">Ngày Bắt Đầu</Label>
                                <DatePickerField value={formData.startDate}
                                    disabledDate={(date) => isBefore(date, startOfToday())}
                                    onChange={handleStartDate} className="mt-3" placeholder="Nhập ngày bắt đầu" />
                            </div>
                            <div>
                                <Label htmlFor="Ngày kết thúc">Ngày kết thúc</Label>
                                <DatePickerField className="mt-3" placeholder="Nhập ngày kết thúc" value={formData.endDate} onChange={handleEndDate} disabledDate={(date) =>
                                    !formData.startDate ? false : date <= formData.startDate
                                } />
                            </div>
                            <div>
                                <Label htmlFor="Nút CTA">Nút CTA</Label>
                                <Input name="cta" placeholder="Nhập nội dung nút CTA" value={formData.cta} onChange={handleTextChange} className="mt-3"></Input>
                            </div>
                            <div>
                                <Label htmlFor="Mô tả ngắn gọn của Banner">Mô tả Banner</Label>
                                <Textarea name="desc" placeholder="Nhập mô tả ngắn gọn" value={formData.desc} onChange={handleTextChange} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]" rows={3}></Textarea>
                            </div>
                            <div>
                                <Label htmlFor="Ảnh Banner">Ảnh Banner</Label>
                                <UploadField className="w-full mt-2"
                                    value={formData.bannerImage}
                                    onChange={(files) =>
                                        setFormData((p) => ({ ...p, bannerImage: files?.[0] ?? null }))
                                    }
                                />
                            </div>
                            <Button type="submit" >Lưu</Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CreateBanner;