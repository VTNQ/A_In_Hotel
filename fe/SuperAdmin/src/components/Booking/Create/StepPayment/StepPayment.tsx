import { useTranslation } from "react-i18next";
import PaymentForm from "./PaymentForm";
import PaymentSummary from "./PaymentSummary";

const StepPayment = ({ booking, onBack, onNext, onCancel }: any) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="grid grid-cols-3 gap-6 items-start">
        {/* LEFT */}
        <div className="col-span-2">
          <PaymentForm
            booking={booking}
            onBack={onBack}
            onSubmit={onNext}
          />
        </div>

        {/* RIGHT */}
        <PaymentSummary booking={booking} />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center mt-8">
        {/* CANCEL - BÊN TRÁI */}
        <button
          onClick={onCancel}
          className="
            px-4 py-2
            rounded-lg
            text-sm font-medium
            text-red-600
            border border-red-200
            bg-red-50
            hover:bg-red-100
            hover:border-red-300
            transition
          "
        >
          {t("payment.actions.cancel")}
        </button>

        {/* BACK */}
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:underline"
        >
         {t("payment.actions.backServices")}
        </button>
      </div>
    </div>
  );
};
export default StepPayment;