
export interface CurrentPrice
{
    id: string;
    dateOfApply?: Date;
    serviceId?: string;
    price?: number;
    createDate?: Date;
    updateDate: Date;
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
    data: CurrentPrice[];
    page: number;
    size: number;
    total: number;
}
