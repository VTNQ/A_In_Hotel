export interface franchiseInquiryResponse {
    id:number;
    fullName:string;
    phone:string;
    email:string;
    province:string;
    message:string;
    contacted:boolean;
    propertyLocation:string;
    landArea:string;
    roomCount:string;
    createdAt:string;
}
export interface franchiseInquiryFilterProps {
    search:string;
    onSearchChange:(v:string)=>void;
}
export interface franchiseInquiryTableProps {
    rows:franchiseInquiryResponse[];
    loading:boolean;
    sortKey: keyof franchiseInquiryResponse | null;
    sortDir: "asc" | "desc";
    onSortChange:(key:keyof franchiseInquiryResponse)=>void;
    page:number;
    pageSize:number;
    total:number;
    onPageChange: (page: number) => void;
}