import {Service} from "../service/service.types";

export interface Feedback {
    id: string;
    name?: string;
    discountValueCombo?: number;
    totalAmount?: number;
    description?: string;
    imageUrl: string;
    status: boolean;
}

export interface FeedbackPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface FeedbackResponse {
    data: Feedback[];
    page: number;
    size: number;
    total: number;
}
