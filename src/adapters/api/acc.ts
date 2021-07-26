import { request } from '../request';
import { AxiosRequestConfig } from 'axios';

export interface IUserData {
    id?: number,
    last_login?: string,
    is_superuser?: boolean,
    is_staff?: boolean,
    is_active?: boolean,
    date_joined?: string,
    email: string,
    first_name: string,
    last_name: string,
    photo?: string
}

export const postAccLogin = (config?: AxiosRequestConfig) => {
    return request({
        url   : '/acc/login/',
        method: 'post',
        ...config
    });
};

export const postAccLogout = (config?: AxiosRequestConfig) => {
    return request({
        url   : '/acc/logout/',
        method: 'post',
        ...config
    });
};

export const postAccSetTimezone = (config?: AxiosRequestConfig) => {
    return request({
        url   : '/acc/set-timezone/',
        method: 'post',
        ...config
    });
};

export const getAccWhoAmI = (config?: AxiosRequestConfig) => {
    return request<IUserData>({
        url: '/acc/whoami/',
        ...config
    });
};

export const patchAccWhoAmI = (config?: AxiosRequestConfig) => {
    return request({
        url   : '/acc/whoami/',
        method: 'patch',
        ...config
    });
};

export const postAccWhoAmISetPhoto = (config?: AxiosRequestConfig) => {
    return request<IUserData>({
        url   : '/acc/whoami/set-photo/',
        method: 'post',
        ...config
    });
};
