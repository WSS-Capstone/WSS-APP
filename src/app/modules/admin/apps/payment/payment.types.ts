import {Service} from "../service/service.types";
import {User} from "../user/user.types";

export interface Payment {
    id: string;
    content: string;
    createDate: string;
    rating: number;
    orderDetailId: string;
    userId: string;
    status: string;
    imageUrl: string;
    user: User;
    service: Service;
}

export interface PaymentPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface PaymentResponse {
    data: Payment[];
    page: number;
    size: number;
    total: number;
}
