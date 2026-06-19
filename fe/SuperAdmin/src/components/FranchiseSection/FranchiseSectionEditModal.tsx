import {
  getFranchiseSectionById,
  updateFranchiseSection,
} from "@/service/api/FranchiseSection";
import type { FranchiseSectionEditProps } from "@/type/franchiseSection.types";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { useAlert } from "../alert-context";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";

const FranchiseSectionEditModal: React.FC<FranchiseSectionEditProps> = ({
  open,
  franchiseSectionId,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
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
  const [fetching, setFetching] = useState(false);
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
  useEffect(() => {
    if (!open || !franchiseSectionId) return;
    const fetchData = async () => {
      setFetching(true);
      try {
        const res = await getFranchiseSectionById(Number(franchiseSectionId));
        const franchiseSection = res.data.data;
        reset({
          title: franchiseSection.title,
          code: franchiseSection.code,
          subTitle: franchiseSection.subTitle,
          description: franchiseSection.description,
          sortOrder: franchiseSection.sortOrder,
          active: franchiseSection.active,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [open, franchiseSectionId]);
  const onSubmitForm = async (data: FranchiseSectionForm) => {
    try {
      await updateFranchiseSection(Number(franchiseSectionId), data);
      showAlert({
        title: t("franchiseSection.message.updateSuccess"),
        type: "success",
        autoClose: 3000,
      });
      onClose();
      onSubmit();
    } catch (err) {
      showAlert({
        title: t("franchiseSection.message.updateFailed"),
        type: "error",
        autoClose: 3000,
      });
    }
  };
  const handleClose = () => {
    reset({
      title: "",
      code: "",
      subTitle: "",
      description: "",
      sortOrder: 0,
      active: true,
    });
    onClose();
  };
  if (!open || !franchiseSectionId) return null;
  return (
    <Dialog open={!!open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="
          p-0
          w-[calc(100vw-20px)] sm:w-full
          max-w-[96vw] sm:max-w-xl lg:max-w-3xl
          max-h-[90vh]
          overflow-y-auto
          custom-scrollbar"
      >
        {/* HEADER sticky */}
        <div className="sticky top-0 z-10 border-b bg-white dark:bg-background px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {/* {t("asset.createOrUpdate.titleEdit")} */}
              {t("franchiseSection.editTitle")}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* BODY */}
        <div className="custom-scrollbar overflow-y-auto px-6 py-5">
          {fetching ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700" />
              <span className="ml-3 text-sm text-gray-500">
                {t("common.loading")}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("franchiseSection.fields.title")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder={t("franchiseSection.placeholder.title")}
                  {...register("title")}
                  className="
              mt-1
              bg-white
              dark:bg-neutral-900
              border-slate-200
              dark:border-neutral-800
              text-slate-900
              dark:text-slate-100
            "
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("franchiseSection.fields.code")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder={t("franchiseSection.placeholder.code")}
                  {...register("code")}
                  className="
              mt-1
              bg-white
              dark:bg-neutral-900
              border-slate-200
              dark:border-neutral-800
              text-slate-900
              dark:text-slate-100
            "
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.code.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("franchiseSection.fields.subTitle")}
                </label>
                <Input
                  placeholder={t("franchiseSection.placeholder.subTitle")}
                  {...register("subTitle")}
                  className="
              mt-1
              bg-white
              dark:bg-neutral-900
              border-slate-200
              dark:border-neutral-800
              text-slate-900
              dark:text-slate-100
            "
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("franchiseSection.fields.description")}
                </label>
                <Textarea
                  placeholder={t("franchiseSection.placeholder.description")}
                  {...register("description")}
                  rows={3}
                  className="
              mt-1
              bg-white
              dark:bg-neutral-900
              border-slate-200
              dark:border-neutral-800
              text-slate-900
              dark:text-slate-100
            "
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("franchiseSection.fields.sortOrder")}
                </label>
                <Input
                  placeholder={t("franchiseSection.placeholder.sortOrder")}
                  {...register("sortOrder")}
                  className="
              mt-1
              bg-white
              dark:bg-neutral-900
              border-slate-200
              dark:border-neutral-800
              text-slate-900
              dark:text-slate-100
            "
                />
              </div>
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
                      {" "}
                      {t("franchiseSection.fields.active")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t("franchiseSection.activeDescription")}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER fixed */}
        <div className="border-t bg-white dark:bg-background px-6 py-4">
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleSubmit(onSubmitForm)}
              disabled={isSubmitting || !isValid}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default FranchiseSectionEditModal;
