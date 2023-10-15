import {Service} from "../service/service.types";

export interface Feedback {
    id: string;
    content: string;
    createDate: string;
    rating: number;
    orderDetailId: string;
    userId: string;
    status: string;
    imageUrl: string;
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
