import {Category} from "../category/category.types";
import {CurrentPrice} from "../current-price/current-price.types";
import {Service} from "../service/service.types";

export interface Combo {
    id: string;
    name?: string;
    discountValueCombo?: number;
    disountPrice?: number;
    totalAmount?: number;
    description?: string;
    imageUrl: string;
    status: boolean;
    rating: number;
    tempPrice?: number;
    comboServices?: ComboServiceType[]
}

export interface ComboServiceType {
    id:string;
    name: string;
    categoryId: string;
    currentPrices: CurrentPrice;
    quantity: number;
    unit: string;
}

export interface ComboPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface ComboResponse {
    data: Combo[];
    page: number;
    size: number;
    total: number;
}
