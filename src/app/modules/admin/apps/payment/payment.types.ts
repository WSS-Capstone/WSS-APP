import {Service} from "../service/service.types";
import {User} from "../user/user.types";
import {Order} from "../order/order.types";

export interface Payment {
    id: string;
    createDate: string;
    imageUrl: string;
    order: Order;
    orderId: string;
    partner: User;
    partnerId: string;
    status: string;
    total: number;
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
