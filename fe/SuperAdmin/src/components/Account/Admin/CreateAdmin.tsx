import { useAlert } from "@/components/alert-context";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/ui/DatePickerField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select";
import UploadField from "@/components/ui/UploadField";
import { register } from "@/service/api/Authenticate";
import { format } from "date-fns";
import { type Gender, type SuperAdminForm } from "@/type/Account/SuperAdmin/SuperAdminForm";
import React, { useState } from "react";
import { Loader2 } from "lucide-react"; // spinner icon

const CreateAdmin = () => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false); // ✅ state loading
  const [formData, setFormData] = useState<SuperAdminForm>({
    email: "",

    fullName: "",
    gender: "MALE",
    phone: "",
    birthday: undefined,
    image: null,
  });

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBirthDay = (d?: Date) => {
    setFormData((p) => ({ ...p, birthday: d }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true); // ✅ bật loading
      const registerDTO = {
        email: formData.email,
        idRole: 2,
        gender: formData.gender,
        fullName: formData.fullName,
        phone: formData.phone,
        birthday: formData.birthday
          ? format(formData.birthday, "yyyy-MM-dd")
          : null,
      };


      const response = await register(registerDTO, formData.image);

      showAlert({
        title: response.message,
        type: "success",
        autoClose: 4000,
      })
      setFormData({
        email: "",

        fullName: "",
        gender: "MALE",
        phone: "",
        birthday: undefined,
        image: null,
      })
    } catch (error: any) {
      showAlert({
        title: "Tạo tài khoản thất bại",
        description: error?.response?.data?.message || "Vui lòng thử lại sau",
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setLoading(false); // ✅ tắt loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-gray-500">
            Admin <span className="mx-1">»</span> Tạo tài khoản Admin
          </p>
        </div>
      </div>
      <div className="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-1">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <h3 className="text-lg font-semibold text-gray-800">Thông tin</h3>
          </div>
          <div className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  placeholder="Nhập email"
                  type="email"
                  value={formData.email}
                  onChange={handleTextChange}
                  className="mt-3"
                />
              </div>

              {/* Tên đầy đủ */}
              <div>
                <Label>Tên đầy đủ</Label>
                <Input
                  name="fullName"
                  placeholder="Nhập Tên đầy đủ"
                  value={formData.fullName}
                  onChange={handleTextChange}
                  className="mt-3"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <Label>Số điện thoại</Label>
                <Input
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleTextChange}
                  className="mt-3"
                />
              </div>

              {/* Ngày sinh */}
              <div>
                <Label>Ngày sinh</Label>
                <DatePickerField
                  value={formData.birthday}
                  onChange={handleBirthDay}
                  className="mt-3"
                  placeholder="Nhập ngày sinh"
                />
              </div>

              {/* Giới tính */}
              <div>
                <Label className="mb-3">Giới tính</Label>
                <SelectField
                  items={["MALE", "FEMALE"]}
                  value={formData.gender}
                  onChange={(val) => {
                    setFormData((prev) => ({
                      ...prev,
                      gender: (val as Gender) ?? "MALE",
                    }));
                  }}
                  placeholder="Chọn giới tính"
                  getValue={(item) => item}
                  getLabel={(item) => (item === "MALE" ? "Nam" : "Nữ")}
                  clearable={false}
                />

              </div>

              {/* Avatar */}
              <div>
                <Label>Ảnh Avatar</Label>
                <UploadField
                  className="w-full mt-2"
                  value={formData.image}
                  onChange={(files) =>
                    setFormData((p) => ({
                      ...p,
                      image: files?.[0] ?? null,
                    }))
                  }
                />
              </div>

              {/* Submit button */}
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang lưu...
                  </span>
                ) : (
                  "Lưu"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
