import { Info, Rocket, Tag, Users, X } from "lucide-react";
import {
  TABS,
  type CreatePromotionModalProps,
  type PromotionForm,
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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PromotionForm>({
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
        startDate: "",
        endDate: "",
        bookingType: 1,
        minNights: "",
        customerType: "0",
        roomTypes: [],
      });
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
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setFormData({
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
    });
    setActiveTab("general");
    onClose();
  };
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col">
          <header className="flex items-center justify-between border-b border-gray-100 px-10 py-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-slate-800">
                Promotion Setup
              </h1>
              <p className="text-sm italic text-slate-500">
                Configure your campaign parameters
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
                label="General"
                active={activeTab === "general"}
                onClick={() => setActiveTab("general")}
              />
              <TabButton
                icon={<Tag size={18} />}
                label="Offer"
                active={activeTab === "offer"}
                onClick={() => setActiveTab("offer")}
              />
              <TabButton
                icon={<Users size={18} />}
                label="Targeting"
                active={activeTab === "targeting"}
                onClick={() => setActiveTab("targeting")}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto  py-8 custom-scroll">
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

          <footer className="flex items-center justify-between border-t border-gray-200 px-10 py-6">
            <span className="text-xs italic text-slate-500">
              Auto-saved 10 seconds ago
            </span>
            <div className="flex gap-4">
              {/* Back */}
              {!isFirstTab && (
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className="text-sm font-semibold text-slate-500 hover:text-indigo-600 disabled:opacity-50"
                >
                  Back
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
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-8 h-12 rounded-lg
                   bg-[#42578E] text-white font-semibold
                   hover:bg-[#536DB2]
                   disabled:opacity-60 disabled:cursor-not-allowed"
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
                      <span>Launch Promotion</span>
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
