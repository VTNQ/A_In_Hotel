import useBooking from "../../hooks/useBooking";
import BookingStepper from "../../components/Booking/Create/BookingStepper";
import StepGuestInfo from "../../components/Booking/Create/StepGuestInfo";
import StepBookingDateTime from "../../components/Booking/Create/StepBookingDateTime";
import StepRoomSelection from "../../components/Booking/Create/StepRoomSelection/StepRoomSelection";
import StepServiceSelection from "../../components/Booking/Create/StepService/StepServiceSelection";
import StepPayment from "../../components/Booking/Create/StepPayment/StepPayment";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../components/alert-context";
import { useTranslation } from "react-i18next";

const CreateBooking = () => {
  const { booking, updateBooking, clearBooking } = useBooking();
  const next = () => updateBooking({ step: booking.step + 1 });
  const back = () => updateBooking({ step: booking.step - 1 });
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const handleCancel = () => {
    showAlert({
      type: "warning",
      title: t("booking.cancelConfirm.title"),
      description: t("booking.cancelConfirm.description"),

      primaryAction: {
        label: t("booking.cancelConfirm.confirm"),
        onClick: () => {
          clearBooking();
          navigate("/Dashboard/booking");
        },
      },

      secondaryAction: {
        label: t("booking.cancelConfirm.continue"),
        onClick: () => {},
      },
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen px-3 sm:px-6 py-4 sm:py-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <BookingStepper step={booking.step} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          {booking.step === 1 && (
            <StepGuestInfo
              onCancel={handleCancel}
              data={booking.guest}
              onNext={(guest: any) => {
                updateBooking({ guest });
                next();
              }}
            />
          )}
          {booking.step === 2 && (
            <StepBookingDateTime
              onCancel={handleCancel}
              data={booking.selectDate}
              onBack={back}
              onNext={(selectDate: any) => {
                updateBooking({ selectDate });
                next();
              }}
            />
          )}

          {booking.step === 3 && (
            <StepRoomSelection
              booking={booking}
              onBack={back}
              onCancel={handleCancel}
              onNext={(roomData: any) => {
                updateBooking({ rooms: roomData.rooms });
                next();
              }}
            />
          )}

          {booking.step === 4 && (
            <StepServiceSelection
              booking={booking}
              onBack={back}
              onCancel={handleCancel}
              onNext={(serviceData: any) => {
                updateBooking({ services: serviceData.services });
                next();
              }}
            />
          )}

          {booking.step === 5 && (
            <StepPayment
              booking={booking}
              onCancel={handleCancel}
              onBack={back}
              onNext={() => {
                clearBooking();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default CreateBooking;
