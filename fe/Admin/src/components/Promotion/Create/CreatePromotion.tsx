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
  const [errors,setErrors] = useState<Record<string, string>>({});
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
  const validate =()=>{
    const newErrors: Record<string,string> = {};
    if(!formData.name?.trim()){
      newErrors.name = t("promotion.validation.nameRequired")
    }else if(formData.name.length<3){
      newErrors.name = t("promotion.validation.nameMinLength")
    }else if(formData.name.length > 100){
       newErrors.name = t("promotion.validation.nameMaxLength");
    }

    if(!formData.priority){
      newErrors.priority = t("promotion.validation.priorityRequired")
    }else if(Number(formData.priority)<1){
      newErrors.priority = t("promotion.validation.priorityMin")
    }

    if(!formData.value){
      newErrors.value = t("promotion.validation.valueRequired")
    }else{
      const value = Number(formData.value);
      if(formData.type === "2"){
        if(value <=0){
          newErrors.value = t("promotion.validation.valueMoneyPositive");
        }else if(value > 100000000){
          newErrors.value = t("promotion.validation.valueMoneyMax");
        }
      }else{
        if(value <=0 || value >100){
          newErrors.value = t("promotion.validation.valuePercentRange");
        }
      }
    }
    if(!formData.startDate){
      newErrors.startDate = t("promotion.validation.startDateRequired");
    }
    if(!formData.endDate){
      newErrors.endDate = t("promotion.validation.endDateRequired");
    }else if(formData.startDate && formData.endDate < formData.startDate){
      newErrors.endDate = t("promotion.endDateAfterStart")
    }

    if(!formData.minNights){
      newErrors.minNights = t("promotion.validation.minNightsRequired")
    }else if(Number(formData.minNights)<=0){
      newErrors.minNights = t("promotion.validation.minNightsPositive")
    }else if(Number(formData.minNights) >30){
      newErrors.minNights = t("promotion.validation.minNightsTooLarge")
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  const handleBlur = (field: string) => {
  setErrors((prev) => {
    const newErrors = { ...prev };

    switch (field) {
      // 🟢 NAME
      case "name":
        if (!formData.name?.trim()) {
          newErrors.name = t("promotion.validation.nameRequired");
        } else if (formData.name.length < 3) {
          newErrors.name = t("promotion.validation.nameMinLength");
        } else if (formData.name.length > 100) {
          newErrors.name = t("promotion.validation.nameMaxLength");
        } else {
          delete newErrors.name;
        }
        break;

      // 🟢 PRIORITY
      case "priority":
        if (!formData.priority) {
          newErrors.priority = t("promotion.validation.priorityRequired");
        } else if (Number(formData.priority) < 1) {
          newErrors.priority = t("promotion.validation.priorityMin");
        } else {
          delete newErrors.priority;
        }
        break;

      // 🟢 VALUE
      case "value":
        if (!formData.value) {
          newErrors.value = t("promotion.validation.valueRequired");
        } else {
          const val = Number(formData.value);

          if (formData.type === "2") {
            if (val <= 0) {
              newErrors.value = t("promotion.validation.valueMoneyPositive");
            } else {
              delete newErrors.value;
            }
          } else {
            if (val <= 0 || val > 100) {
              newErrors.value = t("promotion.validation.valuePercentRange");
            } else {
              delete newErrors.value;
            }
          }
        }
        break;

      // 🟢 START DATE
      case "startDate":
        if (!formData.startDate) {
          newErrors.startDate = t("promotion.validation.startDateRequired");
        } else {
          delete newErrors.startDate;
        }
        break;

      // 🟢 END DATE
      case "endDate":
        if (!formData.endDate) {
          newErrors.endDate = t("promotion.validation.endDateRequired");
        } else if (
          formData.startDate &&
          formData.endDate < formData.startDate
        ) {
          newErrors.endDate = t("promotion.validation.endDateAfterStart");
        } else {
          delete newErrors.endDate;
        }
        break;

      // 🟢 MIN NIGHTS
      case "minNights":
        if (!formData.minNights) {
          newErrors.minNights = t("promotion.validation.minNightsRequired");
        } else if (Number(formData.minNights) <= 0) {
          newErrors.minNights = t("promotion.validation.minNightsPositive");
        } else {
          delete newErrors.minNights;
        }
        break;

      default:
        break;
    }

    return newErrors;
  });
};
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
    
    const isValid = validate();
    if(!isValid) return;
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
    setErrors({})
    setActiveTab("general");
    onClose();
  };
  const isFormValid = () => {
  return Object.values(errors).every((e) => !e);
};
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 
      flex items-center justify-center 
      bg-black/40 backdrop-blur-sm p-4">
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
              formData={formData} 
              setFormData={setFormData}
              handleBlur={handleBlur}
              errors={errors}
              />
            )}
            {activeTab === "offer" && (
              <OfferTab 
              formData={formData} 
              setFormData={setFormData} 
              handleBlur={handleBlur}
              errors={errors}
              />
            )}
            {activeTab === "targeting" && (
              <TargetingTab 
              formData={formData} 
              setFormData={setFormData} 
              handleBlur={handleBlur}
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
                  onClick={handleSubmit}
                  disabled={loading || !isFormValid()}
                  className={`flex items-center justify-center gap-2 px-8
                    h-12 rounded-lg font-semibold
                    ${
                      loading || !isFormValid()
                      ? "bg-gray-400 cursor-not-allowed"
                      :"bg-[#42578E] hover:bg-[#536DB2] text-white"
                    }`}
                >
                  {loading  ? (
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
