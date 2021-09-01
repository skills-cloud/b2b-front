import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CvTimeSlotRead } from 'adapter/types/cv/time-slot/get/code-200';
import { CvTimeSlot as IResponsePostTimeSlot } from 'adapter/types/cv/time-slot/post/code-201';
import { CvTimeSlot as IResponsePatchTimeSlot } from 'adapter/types/cv/time-slot/id/patch/code-200';

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
    results: Array<CvTimeSlotRead>
}

export type TQueryParamsPostTimeSlot = Omit<IResponsePostTimeSlot, 'id'>;

export const timeslot = createApi({
    reducerPath: 'api/timeslot',
    tagTypes   : ['timeslot'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/cv'
    }),
    endpoints: (build) => ({
        getTimeSlot: build.query<IResponseGetTimeSlot, IQueryParamsGetTimeSlot>({
            providesTags: ['timeslot'],
            query       : (params) => ({
                url   : 'time-slot/',
                method: 'GET',
                params
            })
        }),
        getTimeSlotById: build.query<IResponseGetTimeSlot, { id: number }>({
            providesTags: ['timeslot'],
            query       : (params) => {
                const { id, ...rest } = params;

                return {
                    url   : `time-slot/${id}/`,
                    method: 'GET',
                    params: rest
                };
            }
        }),
        setTimeSlot: build.mutation<IResponsePostTimeSlot, TQueryParamsPostTimeSlot>({
            invalidatesTags: ['timeslot'],
            query          : (body) => ({
                url   : 'time-slot/',
                method: 'POST',
                body
            })
        }),
        patchTimeSlotById: build.mutation<IResponsePatchTimeSlot, IResponsePatchTimeSlot>({
            invalidatesTags: ['timeslot'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `time-slot/${id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            }
        }),
        deleteTimeSlotById: build.mutation<undefined, { id: string }>({
            invalidatesTags: ['timeslot'],
            query          : (body) => ({
                url   : `time-slot/${body.id}/`,
                method: 'DELETE'
            })
        })
    })
});
