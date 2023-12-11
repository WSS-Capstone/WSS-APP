import {Category, CategoryResponse} from "../category/category.types";
import {CurrentPrice} from "../current-price/current-price.types";
import {Account} from "../user/user.types";

export interface Service
{
    id: string;
    code?: string;
    name?: string;
    categoryId?: string;
    category?: Category;
    currentPrices?: CurrentPrice;
    description?: string;
    quantity: string;
    unit?: string;
    ownerId: string;
    coverUrl?: string;
    serviceImages: ImageUrl[];
    createByNavigation?: Account;
    isOwnerService: boolean;
    status: string;
    createBy?: string;
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

export interface ImageUrl {
    imageUrl: string;
}
