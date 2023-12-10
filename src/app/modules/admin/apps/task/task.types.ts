import {User} from "../user/user.types";
import {Service} from "../service/service.types";
import {Order, OrderDetail} from "../order/order.types";

export interface Task {
    id: string;
    code: string;
    taskName: string;
    startDate: string;
    endDate: string;
    status: string;
    imageEvidence: string;
    comments?: Comment[];
    partner?: User;
    staff?: User;
    service?: Service;
    order?: Order;
    orderDetail?: OrderDetail;
    createBy?: User;
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

export interface Comment {
    id: string;
    taskId: string;
    createBy?: string;
    createByNavigation?: User;
    createDate: string;
    content: string;
}
