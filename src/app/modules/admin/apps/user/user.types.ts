export interface Account {
    id: string;
    code: string;
    username: string;
    roleName: string;
    status: string;
    user?: User;
}

export interface User {
    id:string;
    fullname: string;
    phone: string;
    address: string;
    categoryId?: string;
    dateOfBirth? : string;
    gender: string;
    imageUrl: string;
}

export interface AccountPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface AccountResponse {
    data: Account[];
    page: number;
    size: number;
    total: number;
}

export interface AccountRequest {
    email: string;
    password?: string;
    fullname?: string;
    phone?: string;
    address?: string;
    categoryId?: string;
    dateOfBirth? : string;
    gender?: number;
    imageUrl?: string;
    roleName?: string;
    status?: string;
    reason?: string;
}
