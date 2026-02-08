export interface CustomerActionMenuProps {
  customer: {
    blocked?: boolean;
    [key: string]: any;
  };
  onView?: (customer: any) => void;
}
