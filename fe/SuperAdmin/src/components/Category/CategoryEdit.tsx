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
import { useForm } from "react-hook-form";

const CategoryEdit: React.FC<CategoryEditProps> = ({
  open,
  categoryId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [fetching, setFetching] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CategoryForm>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      type: "",
      description: "",
    },
  });
  const handleClose = () => {
    reset({
      name: "",
      type: null,
      description: "",
    });
    onClose();
  };
  const onSubmitForm = async (data: CategoryForm) => {
    try {
      const payload = {
        name: data.name,
        type: Number(data.type),
        description: data.description,
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
    }
  };
  useEffect(() => {
    if (!open || !categoryId) return;
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await getCategoryById(Number(categoryId));
        reset({
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
        <DialogHeader className="px-6 py-4 border-b bg-gray-50 dark:bg-background">
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
                  {...register("name", {
                    required: t("category.validate.nameRequired"),
                    maxLength: {
                      value: 100,
                      message: t("category.validate.nameMaxLength"),
                    },
                  })}
                  onChange={(e) => {
                    setValue("name", e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    trigger("name");
                  }}
                  placeholder={t("category.createOrUpdate.enterName")}
                  className="h-11"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
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
                  value={watch("type")}
                  onChange={(v) => {
                    setValue("type", String(v), {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    trigger("type");
                  }}
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
                  {...register("description", {
                    maxLength: {
                      value: 255,
                      message: t("category.validate.descriptionMax"),
                    },
                  })}
                  value={watch("description")}
                  onChange={(e) => {
                    setValue("description", e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    trigger("description");
                  }}
                  rows={3}
                />
              </div>
            </div>

            {/* FOOTER */}
            <DialogFooter className="px-6 py-4 border-t bg-gray-50 dark:bg-background flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleClose}

              >
                {t("common.cancel")}
              </Button>

              <Button
                onClick={handleSubmit(onSubmitForm)}
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? t("common.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default CategoryEdit;
