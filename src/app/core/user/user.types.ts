export interface User
{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
    roleName?: string;
    owner?: UserInfo;
    partner?: UserInfo;
    customer?: UserInfo;
    staff?: UserInfo;
    refId?: string;
    username?: string;
}


export interface UserInfo{
    id?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    fullname?: string;
    gender?: string;
    imageUrl?: string;
}
