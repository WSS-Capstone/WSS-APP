import {Service} from "../service/service.types";

export interface ApproveService {
    id: string;
    name?: string;
    discountValueCombo?: number;
    totalAmount?: number;
    description?: string;
    imageUrl: string;
    status: boolean;
}

export interface ApproveServicePagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface ApproveServiceResponse {
    data: ApproveService[];
    page: number;
    size: number;
    total: number;
}
