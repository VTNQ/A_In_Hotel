import { useAlert } from "@/components/alert-context";
import Breadcrumb from "@/components/Breadcrumb";
import GeneralTab from "@/components/Promotion/Create/GeneralTab";
import OfferTab from "@/components/Promotion/Create/OfferTab";
import TabButton from "@/components/Promotion/Create/TabButton";
import TargetingTab from "@/components/Promotion/Create/TargetingTab";
import { Button } from "@/components/ui/button";
import { createPromotion } from "@/service/api/Promotion";
import { TABS, type PromotionForm, type TabType } from "@/type/Promotion.types";
import { Info, Tag, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CreatePromotionPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const currentIndex = TABS.indexOf(activeTab);
  const isFirstTab = currentIndex === 0;
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const isLastTab = currentIndex === TABS.length - 1;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PromotionForm>({
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

  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        description: formData.description,
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
      setFormData({
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
    } finally {
      setLoading(false);
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
            <GeneralTab formData={formData} setFormData={setFormData} />
          )}
          {activeTab === "offer" && (
            <OfferTab formData={formData} setFormData={setFormData} />
          )}
          {activeTab === "targeting" && (
            <TargetingTab formData={formData} setFormData={setFormData} />
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
                disabled={loading}
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
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {t("promotion.next")}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto min-w-[120px]"
              >
                {loading ? (
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
