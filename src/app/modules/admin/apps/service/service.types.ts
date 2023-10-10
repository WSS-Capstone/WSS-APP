import {Category, CategoryResponse} from "../category/category.types";
import {CurrentPrice} from "../current-price/current-price.types";

export interface Service
{
    id: string;
    name?: string;
    categoryId?: string;
    category?: Category;
    currentPrices?: CurrentPrice;
    description?: string;
    quantity: string;
    ownerId: string;
    coverUrl: string;
    status: boolean;
}

export interface ServicePagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface ServiceResponse{
    data: Service[];
    page: number;
    size: number;
    total: number;
}
