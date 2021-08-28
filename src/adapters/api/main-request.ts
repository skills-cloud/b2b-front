import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RequestRead } from 'adapter/types/main/request/id/get/code-200';

interface IGetMainRequestById {
    id: number
}

export const mainRequest = createApi({
    reducerPath: 'api/main/request',
    tagTypes   : ['main/request'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/main'
    }),
    endpoints: (build) => ({
        getMainRequestById: build.query<RequestRead, IGetMainRequestById>({
            providesTags: ['main/request'],
            query       : ({ id }) => ({
                url   : `/request/${id}`,
                method: 'GET'
            })
        })
    })
});