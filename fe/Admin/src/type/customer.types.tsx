export interface CustomerActionMenuProps {
  customer: Customer;
  onView?: (customer: Customer) => void;
}

export interface Customer {
  id: number;
  customerCode: string;
  email: string;
  fullName: string;
  phone: string;
  blocked: boolean;
  totalCompletedBookings: number;
  rewardBalance: number;
  lastBookingAt: string;
}
export interface CustomerDetail {
  customerCode: string;
  phone: string;
  email: string;
  fullName: string;
  nationality: string;
  totalPoint: number;
  availablePoint: number;
  usedPoint: number;
  blocked: boolean;
}
export interface BookingSummaryResponse {
  totalBookings: number;
  nightsStayed: number;
  totalRevenue: number;
}
