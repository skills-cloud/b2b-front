import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IQueryParamsGetTimeSlot {
    cv_id?: number,
    country_id?: number,
    city_id?: number,
    type_of_employment_id?: number,
    search?: string,
    page?: number,
    page_size?: number
}

export interface IResponseGetTimeSlot {
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

export interface IQueryParamsPostTimeSlot {
    cv_id: number,
    id?: number,
    date_from?: string,
    date_to?: string,
    price?: number,
    is_work_permit_required?: boolean,
    description?: string,
    country_id?: number,
    city_id?: number,
    type_of_employment_id: number
}

export interface IResponsePostTimeSlot {
    cv_id: number,
    id?: number,
    date_from?: string,
    date_to?: string,
    price?: number,
    is_work_permit_required?: boolean,
    description?: string,
    country_id?: number,
    city_id?: number,
    type_of_employment_id: number
}

export const cv = createApi({
    reducerPath: 'api/cv',
    tagTypes   : ['cv'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/cv'
    }),
    endpoints: (build) => ({
        getTimeSlot: build.query<IResponseGetTimeSlot, IQueryParamsGetTimeSlot>({
            providesTags: ['cv'],
            query       : (params) => ({
                url   : 'time-slot/',
                method: 'GET',
                params
            })
        }),
        setTimeSlot: build.mutation<IResponsePostTimeSlot, IQueryParamsPostTimeSlot>({
            invalidatesTags: ['cv'],
            query          : (body) => ({
                url   : 'time-slot/',
                method: 'POST',
                body
            })
        })
    })
});
