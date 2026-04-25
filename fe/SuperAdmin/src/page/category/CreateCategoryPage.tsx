import { useAlert } from "@/components/alert-context";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createCategory } from "@/service/api/Categories";
import type { CategoryForm } from "@/type/category.types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CreateCategoryPage = () => {

  const { showAlert } = useAlert();
  const navigate = useNavigate();
 
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid,isSubmitting },
  } = useForm<CategoryForm>({
    mode:"onBlur",
    defaultValues: {
      name: "",
      type: "",
      description: "",
    },
  });
  const onSubmit = async (data: CategoryForm) => {
   
    try {

      const payload = {
        name: data.name,
        type: Number(data.type),
        description: data.description,
      };
      const response = await createCategory(payload);
      showAlert({
        title: response.data.message,
        type: "success",
        autoClose: 4000,
      });
      reset({
        name: "",
        type: null,
        description: "",
      });
    } catch (err: any) {
      showAlert({
        title: t("category.createOrUpdate.createError"),
        description: err?.response.data.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    } 
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("category.createOrUpdate.titleCreate")}
        </h1>
        <Breadcrumb
          items={[
            { label: t("common.home"), href: "/Home" },
            { label: t("common.category"), href: "/Home/category" },
            { label: t("category.createOrUpdate.titleCreate") },
          ]}
        />
      </div>
      <div className="rounded-xl border bg-white p-6 space-y-6">
        <div>
          <label className="text-sm font-medium">
            {t("category.name")} <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder={t("category.createOrUpdate.enterName")}
            {...register("name",{
               required: t("category.validate.nameRequired"),
              maxLength: {
                value: 100,
                message: t("category.validate.nameMaxLength"),
              },
            })}
            onChange={(e)=>{
              setValue("name",e.target.value,{
                  shouldValidate: true,
                  shouldDirty: true,
              })
              trigger("name")
            }}
            className="mt-1"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
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
              value={watch("type")}
              onChange={(v) =>{
                setValue("type", String(v), {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                trigger("type")
              }}
            placeholder={t("category.createOrUpdate.enterType")}
            getValue={(i) => i.value}
            isRequired={true}
            getLabel={(i) => i.label}
          />
           {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
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
            onChange={(e)=>{
              setValue("description", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              trigger("description");
            }}
            placeholder={t("category.createOrUpdate.enterDescription")}
            rows={3}
            className="mt-1"
          />
        </div>
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => navigate("/Home/category")}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || !isValid}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                {t("common.saving")}
              </span>
            ) : (
              t("common.save")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CreateCategoryPage;
