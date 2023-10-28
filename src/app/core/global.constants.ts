import {environment} from "../../environments/environment";

export const PrefixAPI = environment.wssApi + '/api/v1';

export const RESOURCE = {

    auth: PrefixAPI + '/auth',
    account: PrefixAPI + '/account',
    cart: PrefixAPI + '/cart',
    category: PrefixAPI + '/category',
    combo: PrefixAPI + '/combo',
    commission: PrefixAPI + '/commission',
    customer: PrefixAPI + '/customer',
    file: PrefixAPI + '/file',
    order: PrefixAPI + '/order',
    partner: PrefixAPI + '/partner',
    service: PrefixAPI + '/service',
    staff: PrefixAPI + '/staff',
    task: PrefixAPI + '/task',
    feedback: PrefixAPI + '/feedback',
    voucher: PrefixAPI + '/voucher'
};

export const ENDPOINTS = {
    userInfo: RESOURCE.auth + '/userInfo',

    category: RESOURCE.category,
    service: RESOURCE.service,
    combo: RESOURCE.combo,
    commission: RESOURCE.commission,
    customer: RESOURCE.customer,
    order: RESOURCE.order,
    file: RESOURCE.file,
    feedback: RESOURCE.feedback,
    voucher: RESOURCE.voucher,
    account: RESOURCE.account,
    task: RESOURCE.task,
};
