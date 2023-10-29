import { Combo } from "../combo/combo.types";
export interface Order {
    id: string;
    code: string;
    customerId: string;
    ownerId: string;
    weddingInformationId?: string;
    fullname?: string;
    address?: string;
    phone?: string;
    voucherId: string;
    comboId?: string;
    combo: Combo;
    totalAmount?: number;
    totalAmountRequest?: number;
    description?: string;
    createDate?: string;
    statusPayment: string;
    statusOrder: string;
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

export  interface WeddingInformation {
    id: string;
    nameGroom: string;
    nameBride: string;
    nameBrideFather: string;
    nameBrideMother: string;
    nameGroomFather: string;
    nameGroomMother: string;
    weddingDay: string;
    imageUrl: string;
}

export interface WeddingInformationResponse {
    data: WeddingInformation[];
    page: number;
    size: number;
    total: number;
}
