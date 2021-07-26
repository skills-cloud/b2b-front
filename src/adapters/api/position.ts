import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IFile {
    id: number,
    file: string,
    file_name: string,
    cv_career_id: string,
    file_ext: string,
    file_size: string
}

export interface IPosition {
    id: number,
    name: string,
    description: string,
    sorting: number
}

export interface ICompetence {
    id: number,
    name: string
}

export interface IResultPosition {
    title?: string,
    id: number,
    cv_id: number,
    position_id: number,
    competencies_ids: Array<number>,
    position: IPosition,
    files: Array<IFile>,
    competencies: Array<ICompetence>
}

export interface IResponseGetPositionList {
    total: number,
    max_page_size: number,
    page_size: number,
    page_number: number,
    page_next: number,
    page_previous: number,
    results: Array<IResultPosition>
}

export interface ISetPositionData {
    cv_id: number,
    position_id: number,
    competencies_ids?: Array<number>
}

export interface ISetPositionRequestData extends ISetPositionData {
    id: number
}

export const position = createApi({
    reducerPath: 'api/position',
    tagTypes   : ['position'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/cv'
    }),
    endpoints: (build) => ({
        getPositionList: build.query<IResponseGetPositionList, { id: string } | undefined>({
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
        patchPositionById: build.mutation<ISetPositionData, ISetPositionRequestData>({
            query: (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `position/${body.id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            }
        }),
        postPosition: build.mutation<ISetPositionData, ISetPositionData>({
            query: (body) => ({
                url   : 'position/',
                method: 'POST',
                body
            })
        })
    })
});
