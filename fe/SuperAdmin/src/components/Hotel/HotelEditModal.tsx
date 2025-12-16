import type { HotelEditProps, HotelFormData } from "@/type/hotel.types";
import type React from "react";
import { useAlert } from "../alert-context";
import { useEffect, useState } from "react";
import { getAll } from "@/service/api/Authenticate";
import { getHotelById, updateHotel } from "@/service/api/Hotel";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { SelectField } from "../ui/select";
import { Button } from "../ui/button";
import type { UserResponse } from "@/type/UserResponse";

const HotelEditModal: React.FC<HotelEditProps> = ({
  open,
  hotelId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [formData, setFormData] = useState<HotelFormData>({
    name: "",
    address: "",
    idUser: null,
  });

  const fetchUsers = async () => {
    try {
      const response = await getAll({ all: true, filter: "role.id==2" });
      setUsers(response?.data?.content || []);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    // ✅ chỉ fetch khi modal mở và có hotelId
    if (!open || !hotelId) return;

    const fetchData = async () => {
      try {
        const response = await getHotelById(Number(hotelId));
        console.log(response)
        setFormData({
          name: response?.data?.data?.name || "",
          address: response?.data?.data?.address || "",
          idUser: response?.data?.data?.idUser ?? null,
        });
      } catch (err) {
        console.error("Failed to fetch hotel:", err);
      }
    };

    fetchData();
    fetchUsers();
  }, [open, hotelId]);

  const handleSubmit = async () => {
    if (loading || !hotelId) return;
    try {
      setLoading(true);
      const response = await updateHotel(Number(hotelId), formData);

      showAlert({
        title: response?.data?.message ?? "Update hotel success",
        type: "success",
        autoClose: 4000,
      });

      onClose();
      onSubmit();
    } catch (err: any) {
      showAlert({
        title: "Update hotel failed",
        description:
          err?.response?.data?.message || err?.message || "Vui lòng thử lại sau",
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit hotel information</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <label className="text-sm">Hotel name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((f) => ({ ...f, name: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Address</label>
            <Textarea
              value={formData.address}
              onChange={(e) =>
                setFormData((f) => ({ ...f, address: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-2">
            <SelectField<UserResponse>
              items={users}
              value={formData.idUser != null ? String(formData.idUser) : null}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HotelEditModal;
