import { useAlert } from "@/components/alert-context";
import BookingStepper from "@/components/Booking/Create/BookingStepper";
import StepBookingDateTime from "@/components/Booking/Create/StepBookingDateTime/StepBookingDateTime";
import StepGuestInfo from "@/components/Booking/Create/StepGuestInfo";
import StepPayment from "@/components/Booking/Create/StepPayment/StepPayment";
import StepRoomSection from "@/components/Booking/Create/StepRoomSelection/StepRoomSelection";
import StepServiceSelection from "@/components/Booking/Create/StepService/StepServiceSelection";
import Breadcrumb from "@/components/Breadcrumb";
import useBooking from "@/hooks/useBooking";
import { BookingStep } from "@/type/booking.types";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CreateBookingPage = () => {
  const { booking, updateBooking, clearBooking } = useBooking();
  const next = () => updateBooking({ step: booking.step + 1 });
  const back = () => updateBooking({ step: booking.step - 1 });
  const { showAlert } = useAlert();
  const navigate = useNavigate();
 const handleCancel = () => {
        showAlert({
            type: "warning",
            title: t("booking.cancelConfirm.title"),
            description: t("booking.cancelConfirm.description"),

            primaryAction: {
                label: t("booking.cancelConfirm.confirm"),
                onClick: () => {
                    clearBooking();
                    navigate("/Home/booking");
                },
            },

            secondaryAction: {
                label: t("booking.cancelConfirm.continue"),
                onClick: () => {
                },
            },
        });
    };

  const { t } = useTranslation();
  const renderStep = () => {
    switch (booking.step) {
      case BookingStep.GuestInfo:
        return (
          <StepGuestInfo
           onCancel={handleCancel}
            data={booking.guest}
            onNext={(guest: any) => {
              updateBooking({ guest });
              next();
            }}
          />
        );

      case BookingStep.DateTime:
        return (
          <StepBookingDateTime
           onCancel={handleCancel}
            data={booking.selectDate}
            onBack={back}
            onNext={(selectDate: any) => {
              updateBooking({ selectDate });
              next();
            }}
          />
        );

      case BookingStep.Room:
        return (
          <StepRoomSection
            booking={booking}
           onCancel={handleCancel}
            onBack={back}
            onNext={(roomData: any) => {
              updateBooking({
                rooms: roomData.rooms,
                hotelId: roomData.hotelId,
              });
              next();
            }}
          />
        );

      case BookingStep.Services:
        return (
          <StepServiceSelection
            booking={booking}
            onCancel={handleCancel}
            onBack={back}
            onNext={(serviceData: any) => {
              updateBooking({ services: serviceData.services });
              next();
            }}
          />
        );

      case BookingStep.Payment:
        return (
          <StepPayment
            booking={booking}
          onCancel={handleCancel}
            onBack={back}
            onNext={() => {
              clearBooking();
            }}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("booking.createOrUpdate.titleCreate")}
        </h1>
        <Breadcrumb
          items={[
            { label: t("common.home"), href: "/Home" },
            { label: t("sidebar.booking"), href: "/Home/booking" },
            { label: t("booking.createOrUpdate.titleCreate") },
          ]}
        />
      </div>
      <BookingStepper currentStep={booking.step} />
      <div className="rounded-xl border bg-white p-6">{renderStep()}</div>
    </div>
  );
};
export default CreateBookingPage;
