import { Info, Rocket, Tag, Users, X } from "lucide-react";
import {
  TABS,
  type CreatePromotionModalProps,
  type TabType,
} from "../../../type/promotion.types";
import { useState } from "react";
import TabButton from "./TabButton";
import GeneralTab from "./GeneralTab";
import OfferTab from "./OfferTab";
import TargetingTab from "./TargetingTab";
import { useAlert } from "../../alert-context";
import { useTranslation } from "react-i18next";
import { createPromotion } from "../../../service/api/Promotion";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CreatePromotion = ({
  isOpen,
  onClose,
  onSuccess,
}: CreatePromotionModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const currentIndex = TABS.indexOf(activeTab);
  const isFirstTab = currentIndex === 0;
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const isLastTab = currentIndex === TABS.length - 1;
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
  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const payload = {
        name: data.name,
        description: data.description,
        type: formData.type,
        value: formData.value,
        priority: formData.priority,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        bookingType: formData.bookingType,
        customerType: formData.customerType,
        minNights: formData.minNights,
        promotionRoomTypeRequests: formData.roomTypes.map((r) => ({
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
      reset();
      setActiveTab("general");
      onSuccess();
      onClose();
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

  const handleCancel = () => {
    reset();
    setActiveTab("general");
    onClose();
  };

  if (!isOpen) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-50 
      flex items-center justify-center 
      bg-black/40 backdrop-blur-sm p-4"
      >
        <div className="w-full max-w-4xl h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-hidden rounded-xl  bg-white shadow-2xl flex flex-col">
          <header className="flex items-center justify-between border-b border-gray-100 px-10 py-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-slate-800">
                {t("promotion.createOrUpdate.titleCreate")}
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
          <div className="border-b border-gray-200 bg-white px-4 sm:px-8">
            <div className="flex gap-6 sm:gap-10 overflow-x-auto whitespace-nowrap">
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
          </div>
          <div className="flex-1 overflow-y-auto  py-8 custom-scroll">
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

          <footer className="border-t border-gray-200 items-end px-4 sm:px-8 py-4 sm:py-6 bg-white flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            <div className="flex gap-4">
              {/* Back */}
              {!isFirstTab && (
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className="text-sm font-semibold text-slate-500 hover:text-indigo-600 disabled:opacity-50"
                >
                  {t("promotion.back")}
                </button>
              )}

              {/* Next / Launch */}
              {!isLastTab ? (
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="px-8 h-12 rounded-lg bg-[#42578E] text-white font-semibold
                   hover:bg-[#536DB2] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("promotion.next")}
                </button>
              ) : (
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting || !isValid}
                  className={`flex items-center justify-center gap-2 px-8
                    h-12 rounded-lg font-semibold
                    ${
                      isSubmitting || !isValid
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#42578E] hover:bg-[#536DB2] text-white"
                    }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                      <span>{t("common.saving") || "Creating..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("promotion.launch")}</span>
                      <Rocket size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};
export default CreatePromotion;
