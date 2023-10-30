import {ImageUrl, Service} from "../service/service.types";
import {Category} from "../category/category.types";
import {CurrentPrice} from "../current-price/current-price.types";

export interface ApproveService {
    id: string;
    code?: string;
    name?: string;
    categoryId?: string;
    category?: Category;
    currentPrices?: CurrentPrice;
    description?: string;
    quantity: string;
    ownerId: string;
    serviceImages: ImageUrl[];
    status: string;
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
