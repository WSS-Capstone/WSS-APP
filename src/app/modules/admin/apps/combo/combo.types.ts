import {Category} from "../category/category.types";
import {CurrentPrice} from "../current-price/current-price.types";
import {Service} from "../service/service.types";

export interface Combo {
    id: string;
    name?: string;
    discountValueCombo?: number;
    totalAmount?: number;
    description?: string;
    imageUrl: string;
    status: boolean;
    comboServices?: ComboService[]
}

export interface ComboService {
    id:string;
    service: Service;
    combo: Combo;
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
