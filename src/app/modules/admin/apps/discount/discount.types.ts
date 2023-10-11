export interface Discount {
    id: string;
    name?: string;
    discountValueCombo?: number;
    totalAmount?: number;
    description?: string;
    imageUrl: string;
    status: boolean;
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
