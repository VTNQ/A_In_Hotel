import PaymentForm from "./PaymentForm";
import PaymentSummary from "./PaymentSummary";

const StepPayment = ({ booking, onBack, onNext }: any) => {
  return (
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
  );
};

export default StepPayment;
