import { getPromotionById, updatePromotion } from "@/service/api/Promotion";
import {
  TABS,
  type PromotionForm,
  type TabType,
  type UpdatePromotionModalProps,
} from "@/type/Promotion.types";
import { useEffect, useState } from "react";
import { useAlert } from "../alert-context";
import { useTranslation } from "react-i18next";
import { Info, Rocket, Tag, Users, X } from "lucide-react";

import { Button } from "../ui/button";
import TabButton from "./Create/TabButton";
import GeneralTab from "./Update/GeneralTab";
import OfferTab from "./Update/OfferTab";
import TargetingTab from "./Update/TargetingTab";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const UpdatePromotion = ({
  open,
  promotionId,
  onClose,
  onSubmit,
}: UpdatePromotionModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const currentIndex = TABS.indexOf(activeTab);
  const isFirstTab = currentIndex === 0;
  const { t } = useTranslation();
  const promotionSchema = z
    .object({
      id: z.string(),
      name: z
        .string()
        .min(1, t("promotion.validation.nameRequired"))
        .min(3, t("promotion.validation.nameMinLength"))
        .max(100, t("promotion.validation.nameMaxLength")),
      description: z.string().optional(),
      type: z.string(),
      value: z.string().min(1, t("promotion.validation.valueRequired")),
      priority: z.string().min(1, t("promotion.validation.priorityRequired")),
      startDate: z.string().min(1, t("promotion.validation.startDateRequired")),
      endDate: z.string().min(1, t("promotion.validation.endDateRequired")),
      bookingType: z.number(),

      minNights: z.string().min(1, t("promotion.validation.minNightsRequired")),

      customerType: z.string(),

      roomTypes: z.array(
        z.object({
          id: z.any(),
          excluded: z.boolean(),
        }),
      ),
    })
    .superRefine((data, ctx) => {
      // priority
      if (Number(data.priority) < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["priority"],
          message: t("promotion.validation.priorityMin"),
        });
      }

      // value
      const value = Number(data.value);

      if (data.type === "2") {
        if (value <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["value"],
            message: t("promotion.validation.valueMoneyPositive"),
          });
        }

        if (value > 100000000) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["value"],
            message: t("promotion.validation.valueMoneyMax"),
          });
        }
      } else {
        if (value <= 0 || value > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["value"],
            message: t("promotion.validation.valuePercentRange"),
          });
        }
      }

      // endDate > startDate
      if (data.startDate && data.endDate && data.endDate < data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: t("promotion.validation.endDateAfterStart"),
        });
      }

      // min nights
      if (Number(data.minNights) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["minNights"],
          message: t("promotion.validation.minNightsPositive"),
        });
      }

      if (Number(data.minNights) > 30) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["minNights"],
          message: t("promotion.validation.minNightsTooLarge"),
        });
      }
    });
  type FormData = z.infer<typeof promotionSchema>;

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(promotionSchema),
    mode: "onChange",
    defaultValues: {
      id: "",
      name: "",
      description: "",
      type: "2",
      value: "",
      priority: "",
      startDate: "",
      endDate: "",
      bookingType: 1,
      minNights: "",
      customerType: "0",
      roomTypes: [],
    },
  });

  const { showAlert } = useAlert();
  const isLastTab = currentIndex === TABS.length - 1;
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!isLastTab) {
      setActiveTab(TABS[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    if (!isFirstTab) {
      setActiveTab(TABS[currentIndex - 1]);
    }
  };
  const onSubmitForm = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        type: data.type,
        value: data.value,
        priority: data.priority,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        bookingType: data.bookingType,
        customerType: data.customerType,
        minNights: data.minNights,
        promotionRoomTypeRequests: data.roomTypes.map((r) => ({
          roomTypeId: r.id,
          excluded: r.excluded,
        })),
      };
      const response = await updatePromotion(promotionId ?? 0, payload);
      showAlert({
        title:
          response?.data?.message || t("promotion.createOrUpdate.updateSucess"),
        type: "success",
        autoClose: 3000,
      });
      reset({
        name: "",
        description: "",
        type: "2",
        value: "",
        priority: "",
        startDate: undefined,
        endDate: undefined,
        bookingType: 1,
        minNights: "",
        customerType: "0",
        roomTypes: [],
      });
      setActiveTab("general");
      onSubmit();
      onClose();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          t("promotion.createOrUpdate.updateError"),
        type: "error",
        autoClose: 3000,
      });
    }
  };
  useEffect(() => {
    if (!open || !promotionId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPromotionById(promotionId);
        const data = response?.data?.data;
        reset({
          name: data.name ?? "",
          description: data.description ?? "",
          type: String(data.type ?? "2"),
          value: data.value ? String(data.value) : "",
          priority: data.priority ? String(data.priority) : "",
          startDate: data.startDate ?? "",
          endDate: data.endDate ?? "",
          bookingType: data.bookingType ?? 1,
          minNights: data.minNights ? String(data.minNights) : "",
          customerType: data.customerType ? String(data.customerType) : "0",

          // 🔥 QUAN TRỌNG NHẤT
          roomTypes: (data.promotionRoomTypeResponses || []).map((rt: any) => ({
            id: rt.roomTypeId,
            excluded: rt.excluded, // true = chọn
          })),
        });
      } catch (err: any) {
        console.error(err);
        showAlert({
          title: t("promotion.errorLoad"),
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [open, promotionId]);
  const handleCancel = () => {
    reset({
      name: "",
      description: "",
      type: "2",
      value: "",
      priority: "",
      startDate: undefined,
      endDate: undefined,
      bookingType: 1,
      minNights: "",
      customerType: "0",
      roomTypes: [],
    });
    setActiveTab("general");
    onClose();
  };
  if (!open || !promotionId) return <></>;
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col">
          <header className="flex items-center justify-between border-b border-gray-100 px-10 py-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold">
                {t("promotion.createOrUpdate.editTitle")}
              </h1>
              <p className="text-sm italic text-slate-500">
                {t("promotion.createOrUpdate.description")}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </header>
          <div className="border-b px-10 py-4 border-gray-200 bg-white sticky top-0 z-10 ">
            <div className="flex gap-10">
              <TabButton
                icon={<Info size={18} />}
                label={t("promotion.tabs.general")}
                disabled={loading}
                active={activeTab === "general"}
                onClick={() => setActiveTab("general")}
              />
              <TabButton
                icon={<Tag size={18} />}
                label={t("promotion.tabs.offer")}
                disabled={loading}
                active={activeTab === "offer"}
                onClick={() => setActiveTab("offer")}
              />
              <TabButton
                icon={<Users size={18} />}
                label={t("promotion.tabs.targeting")}
                disabled={loading}
                active={activeTab === "targeting"}
                onClick={() => setActiveTab("targeting")}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto  py-8 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                  <svg
                    className="animate-spin h-8 w-8 text-[#42578E]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
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
                  <span className="text-sm text-slate-500">
                    {t("common.loading") || "Loading promotion data..."}
                  </span>
                </div>
              </div>
            ) : (
              <>
                {activeTab === "general" && (
                  <GeneralTab
                    watch={watch}
                    setValue={setValue}
                    trigger={trigger}
                    errors={errors}
                  />
                )}
                {activeTab === "offer" && (
                  <OfferTab
                    watch={watch}
                    setValue={setValue}
                    trigger={trigger}
                    errors={errors}
                  />
                )}
                {activeTab === "targeting" && (
                  <TargetingTab
                    watch={watch}
                    setValue={setValue}
                    trigger={trigger}
                    errors={errors}
                  />
                )}
              </>
            )}
          </div>
          <footer className="flex items-center justify-end border-t border-slate-200 bg-white px-10 py-5">
            <div className="flex gap-3">
              {!isFirstTab && (
                <Button
                  variant="secondary"
                  onClick={handleBack}
                  disabled={loading || isSubmitting}
                >
                  {t("promotion.back")}
                </Button>
              )}

              {!isLastTab ? (
                <Button onClick={handleNext} disabled={loading}>
                  {t("promotion.next")}
                </Button>
              ) : (
                <Button onClick={handleSubmit(onSubmitForm)} disabled={loading || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      <span>{t("common.saving")}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {t("promotion.createOrUpdate.saveUpdateButton")}
                      </span>
                      <Rocket size={18} />
                    </>
                  )}
                </Button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};
export default UpdatePromotion;
