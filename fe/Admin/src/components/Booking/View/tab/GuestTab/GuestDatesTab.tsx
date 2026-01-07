import BookingDateTimeCard from "./BookingDateTimeCard";
import GuestInformationCard from "./GuestInformationCard";



const GuestDatesTab = ({data}:any)=>{
    return(
        <div className="px-6 py-6 custom-scroll">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GuestInformationCard data={data}/>
                <BookingDateTimeCard data={data}/>
            </div>
        </div>
    )
}
export default GuestDatesTab;