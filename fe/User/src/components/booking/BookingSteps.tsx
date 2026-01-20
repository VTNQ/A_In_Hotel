const BookingSteps = ({ currentStep }: any) => {
  const steps = [
    {
      id: 1,
      title: "Guest Information",
      desc: "Enter your details",
    },
    {
      id: 2,
      title: "Payment Information",
      desc: "Use the information below to complete your transfer",
    },
    {
      id: 3,
      title: "Booking Confirmation",
      desc: "Booking confirmed",
    },
  ];
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center w-full">
          <div className="flex items-start gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                ${
                  currentStep > step.id
                    ? "bg-[#9c7a5b] text-white"
                    : currentStep === step.id
                      ? "border-2 border-[#9c7a5b] text-[#9c7a5b]"
                      : "border border-gray-300 text-gray-400"
                }`}
            >
              {currentStep > step.id ? "✓" : step.id}
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  currentStep === step.id ? "text-[#9c7a5b]" : "text-gray-500"
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs text-gray-400">{step.desc}</p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-px bg-gray-200 mx-4 mt-3" />
          )}
        </div>
      ))}
    </div>
  );
};
export default BookingSteps;