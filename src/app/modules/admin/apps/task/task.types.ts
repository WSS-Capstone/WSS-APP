import {User} from "../user/user.types";
import {Service} from "../service/service.types";
import {Order} from "../order/order.types";

export interface Task {
    id: string;
    code: string;
    taskName: string;
    startDate: string;
    endDate: string;
    status: string;
    comments: string[];
    partner?: User;
    staff?: User;
    service: Service;
    order: Order;
}

export interface TaskPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface TaskResponse {
    data: Task[];
    page: number;
    size: number;
    total: number;
}
