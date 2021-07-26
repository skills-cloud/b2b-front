import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CvProjectRead } from 'adapter/types/cv/project/get/code-200';

export interface IResponseGetProjectsList {
    count: number,
    next?: string,
    previous?: string,
    results: Array<CvProjectRead>
}

export const project = createApi({
    reducerPath: 'api/project',
    tagTypes   : ['project'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/cv'
    }),
    endpoints: (build) => ({
        getProjectsList: build.query<IResponseGetProjectsList, { cv_id: string }>({
            providesTags: ['project'],
            query       : (params) => ({
                url   : 'project/',
                method: 'GET',
                params
            })
        }),
        postProject: build.mutation({
            invalidatesTags: ['project'],
            query          : (body) => ({
                url   : 'project/',
                method: 'POST',
                body
            })
        }),
        patchProjectById: build.mutation({
            invalidatesTags: ['project'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `project/${id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            }
        }),
        deleteProjectById: build.mutation({
            invalidatesTags: ['project'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `project/${id}/`,
                    method: 'DELETE',
                    body  : rest
                };
            }
        })
    })
});
