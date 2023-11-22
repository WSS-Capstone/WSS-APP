export interface Category {
    id: string;
    categoryId?: string;
    name?: string;
    description?: string;
    imageUrl: string;
    isOrderLimit: boolean;
    commission: Commission;
    status: string;
}

export interface Commission {
    "id": string,
    "dateOfApply": Date,
    "commisionValue": number
}


export interface CategoryPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface CategoryResponse {
    data: Category[];
    page: number;
    size: number;
    total: number;
}

export interface InventoryCategory {
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface InventoryBrand {
    id: string;
    name: string;
    slug: string;
}

export interface InventoryTag {
    id?: string;
    title?: string;
}

export interface InventoryVendor {
    id: string;
    name: string;
    slug: string;
}

export interface FileInfo {
    filename: string;
    link: string;
    size: string;
    type: string;
}
