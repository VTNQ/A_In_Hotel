export interface GetAllOptions {
    page?: number;
    size?: number;
    sort?: string;
    filter?: string;
    searchField?: string;
    searchValue?: string
    all?: boolean;
}
export interface Tokens {
    accessToken: string;
    refreshToken?: string;
    accessTokenAt: number;
    refreshTokenAt?: number;
}

export interface ApiResponse<T> {
    data?: T;
    message?: string;
    status?: number;
}

export interface PageResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}



export interface CalendarUIProps {
    selectedDates?: string[];
    disabledDates?: string[];
    onSelect: (date: string) => void;
}