import {environment} from "../../environments/environment";

export const PrefixAPI = environment.wssApi + '/api/v1';

export const RESOURCE = {

    auth: PrefixAPI + '/auth',
};

export const ENDPOINTS = {
    userInfo: RESOURCE.auth + '/userInfo',
};
