import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AxiosRequestConfig } from 'axios';

import { request } from 'adapter/request';

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

export const getAccWhoAmI = (config?: AxiosRequestConfig) => {
    return request<IUserData>({
        url: '/api/acc/whoami/',
        ...config
    });
};

export const acc = createApi({
    reducerPath: 'api/acc',
    tagTypes   : ['acc'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/acc'
    }),
    endpoints: (build) => ({
        postAccLogin: build.mutation({
            invalidatesTags: ['acc'],
            query          : (body) => ({
                url   : 'login/',
                method: 'POST',
                body
            })
        }),
        postAccLogout: build.mutation({
            invalidatesTags: ['acc'],
            query          : (body) => ({
                url   : 'logout/',
                method: 'POST',
                body
            })
        }),
        postAccSetTimeZone: build.mutation({
            invalidatesTags: ['acc'],
            query          : (body) => ({
                url   : 'set-timezone/',
                method: 'POST',
                body
            })
        }),
        getAccWhoAmI: build.query({
            providesTags: ['acc'],
            query       : (params) => ({
                url   : 'whoami/',
                method: 'GET',
                params
            })
        }),
        postAccWhoAmISetPhoto: build.mutation({
            invalidatesTags: ['acc'],
            query          : (body) => ({
                url   : 'whoami/set-photo/',
                method: 'POST',
                body
            })
        }),
        patchAccWhoAmI: build.mutation({
            invalidatesTags: ['acc'],
            query          : (body) => ({
                url   : 'whoami/',
                method: 'PATCH',
                body
            })
        })
    })
});
