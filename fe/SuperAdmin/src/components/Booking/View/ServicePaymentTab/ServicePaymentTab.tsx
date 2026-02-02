import BillSummaryCard from "./BillPayment/BillSummaryCard";
import PaymentStatusCard from "./BillPayment/PaymentStatusCard";
import ExtraServiceTable from "./service/ExtraServiceTable"

const ServicePaymentTab =({data}:any)=>{
    return(
        <div className="p-6 space-y-6  overflow-y-auto">
            <ExtraServiceTable items={data?.details}/>
            <div className="grid grid-col-1 md:grid-cols-2 gap-6">
                <BillSummaryCard data={data}/>
                <PaymentStatusCard data={data}/>
            </div>
        </div>
    )
}
export default ServicePaymentTab;