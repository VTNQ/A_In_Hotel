import { BOOKING_TYPE_OPTIONS, CUSTOMER_TYPE_OPTIONS } from "../type/promotion.types";

export const getBookingTypeLabelKey = (value?: number) => {
  return BOOKING_TYPE_OPTIONS.find((opt) => opt.value === value)?.labelKey;
};
export const getCustomerTypeLabelKey = (value?: number)=>{
  return CUSTOMER_TYPE_OPTIONS.find((opt)=>opt.value===value)?.labelKey;

}