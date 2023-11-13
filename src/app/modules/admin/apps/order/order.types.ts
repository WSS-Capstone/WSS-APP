import { Combo } from "../combo/combo.types";
import {Service} from "../service/service.types";
import {Task} from "../task/task.types";
import {Discount} from "../discount/discount.types";
export interface Order {
    id: string;
    code: string;
    customerId: string;
    ownerId: string;
    weddingInformationId?: string;
    weddingInformation: WeddingInformation;
    fullname?: string;
    address?: string;
    phone?: string;
    voucherId: string;
    voucher: Discount;
    orderDetails: OrderDetail[];
    comboId?: string;
    combo: Combo;
    totalAmount?: number;
    totalAmountRequest?: number;
    description?: string;
    createDate?: string;
    statusPayment: string;
    statusOrder: string;
}

export interface OrderDetail {
    id: string;
    address: string;
    description: string;
    orderId: string;
    price: string;
    service: Service;
    serviceId: string;
    startTime: string;
    endTime: string;
    status: string;
    tasks: Task[];
    order: Order;
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
