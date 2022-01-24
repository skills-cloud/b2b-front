import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Code200 as Code200UserManageGet, UserManageRead } from 'adapter/types/acc/user-manage/get/code-200';
import { Code201 as Code201UserManagePost } from 'adapter/types/acc/user-manage/post/code-201';
import { Code200 as Code200UserManagePatch } from 'adapter/types/acc/user-manage/id/patch/code-200';
import { Code200 as Code200WhoAmI} from 'adapter/types/acc/whoami/get/code-200';

interface IQueryParams {
    organization_contractor_id?: Array<number>,
    organization_project_id?: Array<number>,
    ordering?: Array<string>,
    role?: Array<string>,
    search?: string,
    page?: number,
    page_size?: number
}

interface IResponseGetAccUser {
    results: Array<UserManageRead>
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
        getAccWhoAmI: build.query<Code200WhoAmI, undefined>({
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
            role?: Array<string>,
            organization_contractor_id?: Array<string>,
            organization_project_id?: Array<string>,
            ordering?: string,
            page?: number,
            page_size?: number
        } | void>({
            providesTags: ['acc'],
            query       : (params) => ({
                url   : 'user-manage/',
                method: 'GET',
                params: { ...params }
            })
        }),
        getUserManageById: build.query<UserManageRead, { id: number }>({
            providesTags: ['acc'],
            query       : ({ id }) => ({
                url   : `user-manage/${id}/`,
                method: 'GET'
            })
        }),
        setUserManage: build.mutation<Code201UserManagePost, {
            email: string,
            first_name?: string,
            middle_name?: string,
            last_name?: string,
            gender?: 'M' | 'F' | '-',
            birth_date?: string,
            phone?: string,
            password?: string,
            organization_contractors_roles?: Array<{
                role: string,
                organization_contractor_id: number
            }>,
            organization_projects_roles?: Array<{
                role: string,
                organization_project_id?: number
            }>
        }>({
            invalidatesTags: ['acc'],
            query          : (body) => ({
                url   : 'user-manage/',
                method: 'POST',
                body
            })
        }),
        patchUserManage: build.mutation<Code200UserManagePatch, {
            id: string,
            email: string,
            first_name?: string,
            middle_name?: string,
            last_name?: string,
            gender?: 'M' | 'F' | '-',
            birth_date?: string,
            phone?: string,
            password?: string,
            organization_contractors_roles?: Array<{
                role: string,
                organization_contractor_id: number
            }>,
            organization_projects_roles?: Array<{
                role: string,
                organization_project_id?: number
            }>
        }>({
            invalidatesTags: ['acc'],
            query          : ({ id, ...body }) => ({
                url   : `user-manage/${id}/`,
                method: 'PATCH',
                body
            })
        }),
        deleteUserManage: build.mutation<undefined, { id: string }>({
            invalidatesTags: ['acc'],
            query          : (body) => ({
                url   : `user-manage/${body.id}/`,
                method: 'DELETE'
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
