import {User} from "../../../modules/admin/apps/user/user.types";

export interface Notification
{
    id: string;
    title?: string;
    content?: string;
    createdAt: string;
    userId?: string;
    user?: User;
    isRead: string;
    read: boolean;
}


export interface NotificationResonponse
{
    data: Notification[] | any;
    page: number;
    size: number;
    total: number;
}
