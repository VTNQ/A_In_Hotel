import { getAllCategories } from "@/service/api/Categories";
import { getFacilityById, updateExtraServcie } from "@/service/api/facilities";
import { File_URL } from "@/setting/constant/app";
import { type FacilitiesEditProps, type FacilityForm } from "@/type/facility.types";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { SelectField } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useAlert } from "../alert-context";
import { Button } from "../ui/button";

const FacilityEditModal: React.FC<FacilitiesEditProps> = ({
    open,
    facilityId,
    onClose,
    onSubmit
}) => {
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FacilityForm>({
        serviceName: "",
        description: "",
        note: "",
        categoryId: ""
    });
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
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
        const fetchData = async () => {
            try {
                const response = await getFacilityById(Number(facilityId));
                setFormData({
                    serviceName: response.serviceName,
                    description: response.description,
                    note: response.note,
                    categoryId: response.categoryId
                });
                setPreview(File_URL + response.icon.url)
            } catch (err) {
                console.log(err)
            }
        }
        if (!open || !facilityId) return;
        fetchData();
        fetchCategories();
    }, [open,facilityId]);
    if (!open || !facilityId) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;


        setFormData((prev) => ({ ...prev, [name]: value }));
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

    const handleSubmit = async()=>{
        if (loading) return;
        try{
            setLoading(true)
            const payload = {
                serviceName: formData.serviceName,
                description: formData.description,
                categoryId: Number(formData.categoryId),
                note: formData.note,
                image: coverImage,
                extraCharge:0,
                price:0,
            }
            const response = await updateExtraServcie(facilityId,payload);
            showAlert({
                title: response.data.message,
                type: "success",
                autoClose: 4000,
            });
            setFormData({
                serviceName: "",
                description: "",
                note: "",
                categoryId: "",
               
            })
            onClose();
            onSubmit();
        }catch(err:any){
            showAlert({
                title: "update facilities failed",
                description: err?.response.data.message || "Vui lòng thử lại sau",
                type: "error",
                autoClose: 4000,
            })
        }finally{
            setLoading(false);
           
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative flex h-[80vh] w-[800px] flex-col rounded-xl custom-scrollbar bg-white shadow-xl">
      
            {/* HEADER */}
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h3 className="text-lg font-semibold">Edit Facility</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
      
            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
      
              {/* Name */}
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  placeholder="Enter facility name"
                  className="mt-1"
                />
              </div>
      
              {/* Category */}
              <div>
                <label className="text-sm font-medium">Category</label>
                <SelectField
                  items={categories}
                  value={formData.categoryId}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, categoryId: v }))
                  }
                  placeholder="Select category"
                  getValue={(i) => i.id}
                  getLabel={(i) => i.name}
                />
              </div>
      
              {/* Cover Image */}
              <div>
                <label className="text-sm font-medium">Cover Image</label>
      
                <label
                  htmlFor="cover-upload"
                  className="mt-2 flex aspect-video cursor-pointer items-center justify-center
                             rounded-lg border-2 border-dashed border-gray-300
                             bg-gray-50 hover:border-primary"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="text-center text-sm text-gray-500">
                      <p className="font-medium">Click to upload</p>
                      <p className="text-xs">PNG, JPG, SVG</p>
                    </div>
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
      
              {/* Description */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1"
                  placeholder="Shown to customer"
                />
              </div>
      
              {/* Note */}
              <div>
                <label className="text-sm font-medium">Note</label>
                <Textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1"
                  placeholder="Internal note"
                />
              </div>
            </div>
      
            {/* FOOTER */}
            <div className="flex justify-end gap-2 border-t px-5 py-3">
              <Button
              variant="outline" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="min-w-[140px]"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      );
      

}
export default FacilityEditModal;