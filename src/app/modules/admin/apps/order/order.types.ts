import { Combo } from "../combo/combo.types";

export enum OrderStatus
{
    ACTIVE = 1,
    INACTIVE = 2,
    DELETED = 3,
}

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
    combo: Combo;
    totalAmount?: number;
    totalAmountRequest?: number;
    description?: string;
    createDate?: string;
    status: OrderStatus;
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
