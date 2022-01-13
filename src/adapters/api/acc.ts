import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Code200 as Code200UserManageGet } from 'adapter/types/acc/user-manage/get/code-200';

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

interface IQueryParams {
    ordering?: Array<string>,
    search?: string,
    page?: number,
    page_size?: number
}

interface IResponseGetAccUser {
    results: Array<IUserData>
}

export const acc = createApi({
    reducerPath: 'api/acc',
    tagTypes   : ['acc'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/acc'
    }),
    endpoints: (build) => ({
        getAccUser: build.query<IResponseGetAccUser, IQueryParams | undefined>({
            providesTags: ['acc'],
            query       : (params) => ({
                url   : 'user-manage/',
                method: 'GET',
                params
            })
        }),
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
        getUserManage: build.query<{
            results: Array<Code200UserManageGet>
        }, {
            search?: string,
            organization_contractor_id?: Array<string>,
            organization_project_id?: Array<string>,
            ordering?: string,
            page?: number,
            page_size?: number
        } | void>({
            query: (params) => ({
                url   : 'user-manage/',
                method: 'GET',
                params: { ...params }
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
