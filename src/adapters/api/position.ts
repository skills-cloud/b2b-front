import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CvPositionRead } from 'adapter/types/cv/position/get/code-200';
import { CvPosition as IResponsePostPosition } from 'adapter/types/cv/position/post/code-201';
import { CvPosition as IResponsePatchPosition } from 'adapter/types/cv/position/id/patch/code-200';
import { CvPositionFileRead } from 'adapter/types/cv/position/id/upload-file/post/code-201';
import { CvPositionCompetence as IResponsePostCompetence } from 'adapter/types/cv/position/id/competencies-set/post/code-201';

export interface IResponseGetPositionList {
    total: number,
    max_page_size: number,
    page_size: number,
    page_number: number,
    page_next: number,
    page_previous: number,
    results: Array<CvPositionRead>
}

export interface IGetPositionListFilters {
    cv_id?: number,
    position_id?: Array<number>,
    ordering?: string,
    search?: string,
    page?: number,
    page_size?: number
}

export type TDataPostPosition = Omit<IResponsePostPosition, 'id'>;

export interface IDataPostCompetence {
    data: Array<Omit<IResponsePostCompetence, 'cv_position_id'>>,
    id: number
}

export interface IPostPositionFileParams {
    data: FormData,
    id: string
}

export const position = createApi({
    reducerPath: 'api/position',
    tagTypes   : ['position'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/cv'
    }),
    endpoints: (build) => ({
        getPositionList: build.query<IResponseGetPositionList, IGetPositionListFilters | undefined>({
            providesTags: ['position'],
            query       : (params) => ({
                url   : 'position/',
                method: 'GET',
                params
            })
        }),
        getPositionById: build.query<IResponseGetPositionList, { id: string }>({
            providesTags: ['position'],
            query       : (params) => ({
                url   : `position/${params.id}/`,
                method: 'GET'
            })
        }),
        patchPositionById: build.mutation<IResponsePatchPosition, IResponsePatchPosition>({
            invalidatesTags: ['position'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `position/${body.id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            }
        }),
        postPosition: build.mutation<IResponsePostPosition, TDataPostPosition>({
            invalidatesTags: ['position'],
            query          : (body) => ({
                url   : 'position/',
                method: 'POST',
                body
            })
        }),
        postPositionCompetenciesById: build.mutation<IResponsePostPosition, IDataPostCompetence>({
            invalidatesTags: ['position'],
            query          : ({ id, data }) => ({
                url   : `position/${id}/competencies-set/`,
                method: 'POST',
                body  : data
            })
        }),
        postUploadFileToPosition: build.mutation<CvPositionFileRead, IPostPositionFileParams>({
            invalidatesTags: ['position'],
            query          : (body) => ({
                url   : 'position/',
                method: 'POST',
                body
            })
        }),
        deletePositionFileById: build.mutation<undefined, { id: number, file_id: string }>({
            invalidatesTags: ['position'],
            query          : (body) => ({
                url   : `position/${body.id}/delete-file/${body.file_id}/`,
                method: 'DELETE'
            })
        }),
        deletePosition: build.mutation<undefined, { id: number }>({
            invalidatesTags: ['position'],
            query          : (body) => ({
                url   : `position/${body.id}/`,
                method: 'DELETE'
            })
        })
    })
});
