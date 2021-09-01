import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CvPositionRead } from 'adapter/types/cv/position/get/code-200';
import { CvPosition as IResponsePostPosition } from 'adapter/types/cv/position/post/code-201';
import { CvPosition as IResponsePatchPosition } from 'adapter/types/cv/position/id/patch/code-200';
import { CvPositionFileRead } from 'adapter/types/cv/position/id/upload-file/post/code-201';

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
            query: (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `position/${body.id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            }
        }),
        postPosition: build.mutation<IResponsePostPosition, TDataPostPosition>({
            query: (body) => ({
                url   : 'position/',
                method: 'POST',
                body
            })
        }),
        postUploadFileToPosition: build.mutation<CvPositionFileRead, IPostPositionFileParams>({
            query: (body) => ({
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
            query: (body) => ({
                url   : `position/${body.id}`,
                method: 'DELETE'
            })
        })
    })
});
