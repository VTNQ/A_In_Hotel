import { useAlert } from "@/components/alert-context";
import Breadcrumb from "@/components/Breadcrumb";
import GeneralTab from "@/components/Promotion/Create/GeneralTab";
import OfferTab from "@/components/Promotion/Create/OfferTab";
import TabButton from "@/components/Promotion/Create/TabButton";
import TargetingTab from "@/components/Promotion/Create/TargetingTab";
import { Button } from "@/components/ui/button";
import { createPromotion } from "@/service/api/Promotion";
import { TABS, type PromotionForm, type TabType } from "@/type/Promotion.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Tag, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import z from "zod";

const CreatePromotionPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const currentIndex = TABS.indexOf(activeTab);
  const isFirstTab = currentIndex === 0;
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const isLastTab = currentIndex === TABS.length - 1;
  const navigate = useNavigate();
  const promotionSchema = z
    .object({
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
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(promotionSchema),
    mode: "onChange",
    defaultValues: {
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
  const formData = watch();
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

  const onSubmit = async (data: FormData) => {
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
      const response = await createPromotion(payload);
      showAlert({
        title:
          response?.data?.message || t("promotion.createOrUpdate.createSucess"),
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
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          t("promotion.createOrUpdate.createError"),
        type: "error",
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("promotion.createOrUpdate.titleCreate")}
        </h1>
        <p className="text-sm italic text-slate-500">
          {t("promotion.createOrUpdate.description")}
        </p>
        <Breadcrumb
          items={[
            { label: t("common.home"), href: "/Home" },
            { label: t("promotion.title"), href: "/Home/coupon/promotion" },
            { label: t("promotion.createOrUpdate.titleCreate") },
          ]}
        />
      </div>

      <div className="rounded-xl border bg-white">
        {/* Tabs */}
        <div className="flex overflow-x-auto px-4 sm:px-6 lg:px-10 pt-6 gap-6 sm:gap-8">
          <TabButton
            icon={<Info size={18} />}
            label={t("promotion.tabs.general")}
            active={activeTab === "general"}
            onClick={() => setActiveTab("general")}
          />
          <TabButton
            icon={<Tag size={18} />}
            label={t("promotion.tabs.offer")}
            active={activeTab === "offer"}
            onClick={() => setActiveTab("offer")}
          />
          <TabButton
            icon={<Users size={18} />}
            label={t("promotion.tabs.targeting")}
            active={activeTab === "targeting"}
            onClick={() => setActiveTab("targeting")}
          />
        </div>
        <div className="mt-2 border-b" />

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
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
        </div>
        <div
          className="flex flex-col gap-4
          sm:flex-row sm:items-center sm:justify-between
          border-t px-4 sm:px-6 lg:px-10
          py-4"
        >
          {/* LEFT ACTIONS */}
          <div
            className="flex flex-col gap-3
            sm:flex-row sm:gap-3
            w-full sm:w-auto"
          >
            <Button
              variant="outline"
              onClick={() => navigate("/Home/coupon/promotion")}
              className="w-full sm:w-auto text-slate-600"
            >
              {t("common.cancel")}
            </Button>

            {!isFirstTab && (
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {t("promotion.back")}
              </Button>
            )}
          </div>

          {/* RIGHT ACTION */}
          <div className="w-full sm:w-auto">
            {!isLastTab ? (
              <Button
                onClick={handleNext}
                disabled={isSubmitting || !isValid}
                className="w-full sm:w-auto"
              >
                {t("promotion.next")}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || !isValid}
                className="w-full sm:w-auto min-w-[120px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
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
                  t("promotion.launch")
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePromotionPage;
