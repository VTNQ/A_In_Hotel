import RoomInformationCard from "./RoomInformationCard/RoomInformationCard";
import SwitchRoomHistoryCard from "./SwitchRoomHistoryCard/SwitchRoomHistoryCard";

const RoomsSwitchTab = ({data}:any)=>{
    return(
        <div className="p-6 space-y-6  overflow-y-auto">
            <RoomInformationCard data={data}/>
            <SwitchRoomHistoryCard data={data}/>
        </div>
    )
}
export default RoomsSwitchTab;