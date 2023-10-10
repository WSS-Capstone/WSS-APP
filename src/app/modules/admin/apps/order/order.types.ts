export interface Order {
    id: string;
    customerId: string;
    ownerId: string;
    weddingInformationId?: string;
    fullname?: string;
    address?: string;
    phone?: string;
    vouncherId: string;
    comboId?: string;
    totalAmount?: number;
    totalAmountRequest?: number;
    description?: string;
    status: boolean;
}

export interface OrderPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface OrderResponse {
    data: Order[];
    page: number;
    size: number;
    total: number;
}
