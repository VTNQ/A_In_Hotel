import {
  type CategoryEditProps,
  type CategoryForm,
} from "@/type/category.types";
import { useAlert } from "../alert-context";
import { useEffect, useState } from "react";
import { getCategoryById, updateCategoryById } from "@/service/api/Categories";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
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
  const handleClose = () => {
    setFormData({
      name: "",
      type: null,
      description: "",
    });
    onClose();
  };
  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        type: Number(formData.type),
        description: formData.description,
      };
      const response = await updateCategoryById(Number(categoryId), payload);
      showAlert({
        title:
          response?.data?.message || t("category.createOrUpdate.updateSuccess"),
        type: "success",
        autoClose: 4000,
      });
      onSubmit();
      onClose();
    } catch (err: any) {
      showAlert({
        title: t("category.createOrUpdate.updateError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
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
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        {/* HEADER */}
        <DialogHeader className="px-6 py-4 border-b bg-gray-50">
          <DialogTitle className="text-lg font-semibold">
            {t("category.createOrUpdate.titleEdit")}
          </DialogTitle>
        </DialogHeader>

        {fetching ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* BODY */}
            <div className="px-6 py-6 space-y-6">
              {/* NAME */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("category.name")} <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("category.createOrUpdate.enterName")}
                  className="h-11"
                />
              </div>

              {/* TYPE */}
              <div className="space-y-2">
                <SelectField
                  label={t("category.type")}
                  items={[
                    { label: t("category.room"), value: "1" },
                    { label: t("category.service"), value: "2" },
                    { label: t("category.asset"), value: "3" },
                  ]}
                  value={formData.type}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, type: v }))
                  }
                  isRequired
                  getValue={(i) => i.value}
                  getLabel={(i) => i.label}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("category.createOrUpdate.description")}
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            {/* FOOTER */}
            <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                {t("common.cancel")}
              </Button>

              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? t("common.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default CategoryEdit;
