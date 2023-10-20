export interface Discount {
    id: string;
    code: string;
    name?: string;
    discountValueVoucher?: number;
    minAmount?: number;
    imageUrl?: string;
    startTime: string;
    endTime: string;
    createBy?: string;
    updateBy?: string;
}

export interface DiscountPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface DiscountResponse {
    data: Discount[];
    page: number;
    size: number;
    total: number;
}
