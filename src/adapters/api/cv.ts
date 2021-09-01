import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { CvList } from 'adapter/types/cv/cv/get/code-200';
import { CvDetailRead } from 'adapter/types/cv/cv/id/get/code-200';
import { CvDetailWrite as IPostCvResponse } from 'adapter/types/cv/cv/post/code-201';
import { CvDetailWrite as IPatchCvResponse } from 'adapter/types/cv/cv/id/patch/code-200';

export interface ICvRequest {
    count: number,
    next?: string,
    previous?: string,
    results: Array<CvList>
}

export type TQueryParamsPostTimeSlot = Omit<IPostCvResponse, 'id'>;

export type TOrderingValues = 'id' | '-id' | 'first_name' | '-first_name' | 'middle_name' | '-middle_name' | 'last_name' | '-last_name' | 'created_at' | '-created_at' | 'updated_at' | '-updated_at';

export interface IGetCvListFilters {
    country_id?: Array<number>,
    city_id?: Array<number>,
    citizenship_id?: Array<number>,
    competencies_ids_any?: Array<number>,
    competencies_ids_all?: Array<number>,
    ordering?: Array<TOrderingValues>,
    search?: string,
    page?: number,
    page_size?: number
}

export const cv = createApi({
    reducerPath: 'api/cv',
    tagTypes   : ['cv'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/cv'
    }),
    endpoints: (build) => ({
        postCv: build.mutation<IPostCvResponse, TQueryParamsPostTimeSlot>({
            query: (body) => ({
                url   : 'cv/',
                method: 'POST',
                body
            })
        }),
        patchCvById: build.mutation<IPatchCvResponse, IPatchCvResponse>({
            query: (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `cv/${body.id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            }
        }),
        getCvList: build.query<ICvRequest, IGetCvListFilters | undefined>({
            providesTags: ['cv'],
            query       : (params) => ({
                url   : 'cv/',
                method: 'GET',
                params
            })
        }),
        getCvById: build.query<CvDetailRead, { id: string }>({
            providesTags: ['cv'],
            query       : (params) => ({
                url   : `cv/${params.id}/`,
                method: 'GET'
            })
        }),
        setCvPhotoById: build.mutation<CvDetailRead, { id: string, data: FormData }>({
            invalidatesTags: ['cv'],
            query          : (body) => {
                const { id, data } = body;

                return {
                    url   : `cv/${id}/set-photo/`,
                    method: 'POST',
                    body  : data
                };
            }
        }),
        uploadCvFileById: build.mutation<CvDetailRead, { id: string, data: FormData }>({
            invalidatesTags: ['cv'],
            query          : (body) => {
                const { id, data } = body;

                return {
                    url   : `cv/${id}/upload-file/`,
                    method: 'POST',
                    body  : data
                };
            }
        }),
        deleteCvFileById: build.mutation<undefined, { id: string, file_id: string }>({
            invalidatesTags: ['cv'],
            query          : (body) => {
                const { id, file_id } = body;

                return {
                    url   : `cv/${id}/delete-file/${file_id}/`,
                    method: 'DELETE'
                };
            }
        })
    })
});
