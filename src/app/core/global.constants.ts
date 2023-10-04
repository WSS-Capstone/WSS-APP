import {environment} from "../../environments/environment";

export const PrefixAPI = environment.wssApi + '/api/v1';

export const RESOURCE = {

    auth: PrefixAPI + '/auth',
    category: PrefixAPI + '/category',
};

export const ENDPOINTS = {
    userInfo: RESOURCE.auth + '/userInfo',

    category: RESOURCE.category,

};
