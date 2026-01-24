import {
  type CategoryEditProps,
  type CategoryForm,
} from "@/type/category.types";
import { useAlert } from "../alert-context";
import { useEffect, useState } from "react";
import { getCategoryById, updateCategoryById } from "@/service/api/Categories";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import { SelectField } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const CategoryEdit: React.FC<CategoryEditProps> = ({
  open,
  categoryId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formData, setFormData] = useState<CategoryForm>({
    name: "",
    type: null,
    description: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleClose = ()=>{
    setFormData({
      name: "",
      type: null,
      description: "",
    });
    onClose();

  }
  const handleSubmit = async ()=>{
    if(loading) return
    try{
      setLoading(true);
      const payload = {
        name: formData.name,
        type: Number(formData.type),
        description: formData.description,
      }
      const response = await updateCategoryById(Number(categoryId),payload);
      showAlert({
        title: response?.data?.message || t("category.createOrUpdate.updateSuccess"),
        type: "success",
        autoClose: 4000,
      });
      onSubmit();
      onClose();
    }catch(err:any){
      showAlert({
        title: t("category.createOrUpdate.updateError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
      })
    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    if (!open || !categoryId) return;
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await getCategoryById(Number(categoryId));
        setFormData({
          name: response?.data?.data?.name || "",
          type: response?.data?.data?.idType
            ? String(response.data.data.idType)
            : null,
          description: response?.data?.data?.description || "",
        });
      } catch (err) {
        console.error("Failed to fetch category:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [open, categoryId]);
  if (!open || !categoryId) return null;
  return (
    <Dialog open={!!open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="sm:max-w-md max-h-[90vh]  overflow-y-auto
    custom-scrollbar"
      >
        <DialogHeader>
          <DialogTitle>{t("category.createOrUpdate.titleEdit")}</DialogTitle>
        </DialogHeader>
        {fetching ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#253150]/20 border-t-[#253150] rounded-full animate-spin" />
            <span className="ml-3 text-sm text-gray-500">
              {t("category.createOrUpdate.titleEdit")}
            </span>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  {t("category.name")} <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  placeholder={t("category.createOrUpdate.enterName")}
                  onChange={handleChange}
                  value={formData.name}
                  className="mt-1"
                />
              </div>
              <div className="grid gap-2">
                <SelectField
                  label={t("category.type")}
                  items={[
                    {
                      label: t("category.room"),
                      value: "1",
                    },
                    {
                      label: t("category.service"),
                      value: "2",
                    },
                    {
                      label: t("category.asset"),
                      value: "3",
                    },
                  ]}
                  value={formData.type}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, type: v }))
                  }
                  placeholder={t("category.createOrUpdate.enterType")}
                  getValue={(i) => i.value}
                  isRequired={true}
                  getLabel={(i) => i.label}
                />
              </div>
              <div className="grid gap-2">
                <label className="block mb-1 font-medium text-[#253150]">
                  {t("category.createOrUpdate.description")}
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t("category.createOrUpdate.enterDescription")}
                  rows={3}
                  className="mt-1"
                />
              </div>
                <DialogFooter>
                <Button variant="outline" onClick={handleClose} disabled={loading}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? t("common.saving") : t("common.save")}
                </Button>
              </DialogFooter>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default CategoryEdit;
