import useBooking from "../../hooks/useBooking"
import BookingStepper from "../../components/Booking/Create/BookingStepper";
import StepGuestInfo from "../../components/Booking/Create/StepGuestInfo";
import StepBookingDateTime from "../../components/Booking/Create/StepBookingDateTime";
import StepRoomSelection from "../../components/Booking/Create/StepRoomSelection/StepRoomSelection";
import StepServiceSelection from "../../components/Booking/Create/StepService/StepServiceSelection";
import StepPayment from "../../components/Booking/Create/StepPayment/StepPayment";
import { useNavigate } from "react-router-dom";

const CreateBooking = () => {
    const { booking, updateBooking,clearBooking } = useBooking();
    const next = () => updateBooking({ step: booking.step + 1 });
    const back = () => updateBooking({ step: booking.step - 1 });
      const navigate = useNavigate();
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <BookingStepper step={booking.step} />

            {booking.step === 1 && (
                <StepGuestInfo
                    onCancel={()=>{
                        navigate("/Dashboard/booking");
                        clearBooking();
                    }}
                    data={booking.guest}
                    onNext={(guest: any) => {
                        updateBooking({ guest });
                        next();
                    }}
                />
            )}

            {booking.step ===2 && (
                <StepBookingDateTime
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
                   onNext={(serviceData: any) => {
                    updateBooking({ services: serviceData.services });
                    next();
                }}
                />
            )}

            {booking.step ===5 && (
                <StepPayment
                    booking={booking}
                    onBack={back}
                    onNext={()=> {
                        clearBooking();
                    }}
                />
            )}
        </div>
    )
}
export default CreateBooking;