import { useAlert } from "@/components/alert-context";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createFranchiseSection } from "@/service/api/FranchiseSection";

import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import z from "zod";

const CreateFranchiseSectionPage = () => {
  const { t } = useTranslation();
  const navigate =useNavigate();
  const schema = z.object({
    title: z.string().min(
      1,
      t("validation.required", {
        field: t("franchiseSection.fields.title"),
      }),
    ),
    code: z.string().min(
      1,
      t("validation.required", {
        field: t("franchiseSection.fields.code"),
      }),
    ),

    subTitle: z.string().optional(),
    description: z.string().optional(),
    sortOrder: z.coerce.number().default(0),
    active: z.boolean().default(true),
  });

  const { showAlert } = useAlert();
  type FranchiseSectionForm = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FranchiseSectionForm>({
    defaultValues: {
      title: "",
      code: "",
      subTitle: "",
      description: "",
      sortOrder: 0,
      active: true,
    },
  });
  const onSubmit = async (data: FranchiseSectionForm) => {
    try {
      await createFranchiseSection(data);
      showAlert({
        title: t("franchiseSection.messages.createSuccess"),
        type: "success",
        autoClose: 3000,
      });
      reset();
    } catch (err) {
      showAlert({
        title: t("franchiseSection.messages.createFailed"),
        type: "error",
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {t("franchiseSection.createTitle")}
        </h1>

        <Breadcrumb
          items={[
            { label: "Home", href: "/Home" },
            { label: "Franchise Section", href: "/Home/franchise-section" },
            { label: "Create Franchise Section" },
          ]}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          bg-white dark:bg-neutral-900
          border border-slate-200 dark:border-neutral-800
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-neutral-800">
          <h2 className="text-lg font-semibold">
            {t("franchiseSection.information")}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t("franchiseSection.description")}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("franchiseSection.fields.title")}{" "}
                <span className="text-red-500">*</span>
              </label>

              <Input
                placeholder={t("franchiseSection.placeholder.title")}
                {...register("title")}
              />

              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("franchiseSection.fields.code")}{" "}
                <span className="text-red-500">*</span>
              </label>

              <Input
                placeholder={t("franchiseSection.placeholder.code")}
                {...register("code")}
              />

              {errors.code && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("franchiseSection.fields.subTitle")}
              </label>

              <Input
                placeholder={t("franchiseSection.placeholder.subTitle")}
                {...register("subTitle")}
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("franchiseSection.fields.sortOrder")}
              </label>

              <Input
                type="number"
                placeholder={t("franchiseSection.placeholder.sortOrder")}
                {...register("sortOrder")}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                {t("franchiseSection.fields.description")}
              </label>

              <Textarea
                rows={5}
                placeholder={t("franchiseSection.placeholder.description")}
                {...register("description")}
              />
            </div>

            {/* Active */}
            <div className="md:col-span-2">
              <label
                className="
                flex items-center gap-3
                rounded-lg border border-slate-200
                dark:border-neutral-800
                p-4 cursor-pointer
                hover:bg-slate-50
                dark:hover:bg-neutral-800
                transition-colors
                "
              >
                <Controller
                  control={control}
                  name="active"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <div>
                  <p className="font-medium">
                    {t("franchiseSection.fields.active")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("franchiseSection.activeDescription")}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            px-6 py-4
            border-t border-slate-200 dark:border-neutral-800
            flex justify-end gap-3
            bg-slate-50 dark:bg-neutral-950
          "
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/Home/franchise-section")}
          >
            {t("common.cancel")}
          </Button>

          <Button type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default CreateFranchiseSectionPage;
