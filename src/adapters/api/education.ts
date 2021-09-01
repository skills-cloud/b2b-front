import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CvEducationRead } from 'adapter/types/cv/education/get/code-200';
import { CvEducation as IResponsePostEducation } from 'adapter/types/cv/education/post/code-201';
import { CvEducation as IResponsePatchEducation } from 'adapter/types/cv/education/id/patch/code-200';

export interface IResponseGetEducation {
    count: number,
    next: string,
    previous: string,
    results: Array<CvEducationRead>
}

export interface IGetEducationQuery {
    cv_id: number,
    date_range?: string,
    ordering?: string,
    search?: string,
    page?: number,
    page_size?: number,
    date_range_from?: string,
    date_range_to?: string
}

export type TDataPostEducation = Omit<IResponsePostEducation, 'id'>;

export const education = createApi({
    reducerPath: 'api/education',
    tagTypes   : ['education'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/cv'
    }),
    endpoints: (build) => ({
        getEducation: build.query<IResponseGetEducation, IGetEducationQuery>({
            providesTags: ['education'],
            query       : (params) => ({
                url   : 'education/',
                method: 'GET',
                params
            })
        }),
        postEducation: build.mutation<IResponsePostEducation, TDataPostEducation>({
            invalidatesTags: ['education'],
            query          : (body) => ({
                url   : 'education/',
                method: 'POST',
                body
            })
        }),
        patchEducation: build.mutation<IResponsePatchEducation, IResponsePatchEducation>({
            invalidatesTags: ['education'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `education/${id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            }
        }),
        deleteEducationById: build.mutation<undefined, { id: number }>({
            invalidatesTags: ['education'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `education/${id}/`,
                    method: 'DELETE',
                    body  : rest
                };
            }
        })
    })
});
