import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IQueryParamsGetContactList {
    cv_id: number,
    contact_type_id: number,
    value: string,
    is_primary: boolean,
    comment: string
}

export interface IResponseGetContact {
    count: number,
    next?: string,
    previous?: string,
    results: Array<{
        cv_id: number,
        id?: number,
        date_from?: string,
        date_to?: string
    }>
}

export interface IQueryParamsPostContact {
    cv_id: number,
    contact_type_id: number,
    value: string,
    is_primary?: boolean,
    comment?: string
}

export interface IQueryParamsPatchContact {
    cv_id: number,
    contact_type_id: number,
    value: string,
    is_primary?: boolean,
    comment?: string
}

export interface IQueryParamsPatchContactExtended extends IQueryParamsPatchContact {
    id: number
}

export const contact = createApi({
    reducerPath: 'api/contact',
    tagTypes   : ['contact'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/cv'
    }),
    endpoints: (build) => ({
        getContactList: build.query({
            providesTags: ['contact'],
            query       : (params) => ({
                url   : 'contact/',
                method: 'GET',
                params
            })
        }),
        postContact: build.mutation<IQueryParamsPostContact, IQueryParamsPostContact>({
            invalidatesTags: ['contact'],
            query          : (body) => ({
                url   : 'contact/',
                method: 'POST',
                body
            })
        }),
        patchContact: build.mutation<IQueryParamsPatchContact, IQueryParamsPatchContactExtended>({
            invalidatesTags: ['contact'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `contact/${id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            }
        }),
        deleteContact: build.mutation<IQueryParamsPatchContact, { id: number }>({
            invalidatesTags: ['contact'],
            query          : (body) => ({
                url   : `contact/${body.id}/`,
                method: 'DELETE'
            })
        })
    })
});
