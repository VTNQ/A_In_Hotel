import { Repeat } from "lucide-react";
import SwitchHistoryItem from "./SwitchHistoryItem";

const SwitchRoomHistoryCard = ({data}:any)=>{
    return(
        <div className="border rounded-xl border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                    <Repeat size={18}/>
                </div>
                <div>
                    <h3 className="font-semibold text-[#1D263E]"> 
                        Switch Room History
                    </h3>
                    <p className="text-sm text-slate-500">
                        Record of all room changes during stay
                    </p>
                </div>
            </div>
            {data?.roomSwitchHistories?.length > 0 && (
                <>
                    {data?.roomSwitchHistories.map((item:any,index:number)=>(
                        <SwitchHistoryItem 
                         key={item.id ?? index}
                        data={item}/>
                    ))}
                </>
            )}
        </div>
    )
}
export default SwitchRoomHistoryCard;