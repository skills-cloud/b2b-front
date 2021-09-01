import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CvCareerRead as ICareer } from 'adapter/types/cv/career/get/code-200';
import { CvCareer as IResponsePostCareer } from 'adapter/types/cv/career/post/code-201';
import { CvCareer as IResponsePatchCareer } from 'adapter/types/cv/career/id/patch/code-200';
import { CvCareerFileRead } from 'adapter/types/cv/career/id/upload-file/post/code-201';

export interface IResponseGetCareer {
    count: number,
    next: string,
    previous: string,
    results: Array<ICareer>
}

export interface IGetCareerQuery {
    cv_id?: number,
    position_id?: Array<number>,
    organization_id?: Array<number>,
    ordering?: string,
    search?: string,
    page?: number,
    page_size?: number
}

export interface IPostCareerFileParams {
    data: FormData,
    id: string
}

export type TPostCareerParams = Omit<IResponsePostCareer, 'id'>;

export const career = createApi({
    reducerPath: 'api/career',
    tagTypes   : ['career'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/cv'
    }),
    endpoints: (build) => ({
        getCareer: build.query<IResponseGetCareer, IGetCareerQuery>({
            providesTags: ['career'],
            query       : (params) => ({
                url   : 'career/',
                method: 'GET',
                params
            })
        }),
        postCareer: build.mutation<IResponsePostCareer, TPostCareerParams>({
            invalidatesTags: ['career'],
            query          : (body) => ({
                url   : 'career/',
                method: 'POST',
                body
            })
        }),
        patchCareerById: build.mutation<IResponsePatchCareer, IResponsePatchCareer>({
            invalidatesTags: ['career'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `career/${id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            }
        }),
        deleteCareerById: build.mutation<undefined, { id: number }>({
            invalidatesTags: ['career'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `career/${id}/`,
                    method: 'DELETE',
                    body  : rest
                };
            }
        }),
        uploadCareerFileById: build.mutation<CvCareerFileRead, IPostCareerFileParams>({
            invalidatesTags: ['career'],
            query          : (body) => {
                const { id, data } = body;

                return {
                    url   : `career/${id}/upload-file/`,
                    method: 'POST',
                    body  : data
                };
            }
        }),
        deleteCareerFileById: build.mutation<undefined, { id: number, file_id: string }>({
            invalidatesTags: ['career'],
            query          : (body) => ({
                url   : `career/${body.id}/delete-file/${body.file_id}/`,
                method: 'DELETE'
            })
        })
    })
});
