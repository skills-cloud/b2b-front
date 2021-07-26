import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IFile {
    id: number,
    file: string,
    file_name: string,
    cv_career_id: number,
    file_ext: string,
    file_size: number
}

export interface IOrganization {
    id: number,
    name: string,
    description: string
}

export interface IPosition {
    id: number,
    name: string,
    sorting: number,
    description: string
}

export interface IProject {
    id: number,
    organization_id: number,
    organization: {
        id: number,
        name: string,
        description: string
    },
    name: string,
    description: string
}

export interface ICompetence {
    id: number,
    name: string
}

export interface IResultCareer {
    id: number,
    cv_id: number,
    date_from: string,
    date_to: string,
    description: string,
    is_verified: boolean,
    organization_id: number,
    position_id: number,
    competencies_ids: Array<number>,
    projects_ids: Array<number>,
    organization: IOrganization,
    position: IPosition,
    projects: Array<IProject>,
    files: Array<IFile>,
    competencies?: Array<ICompetence>
}

export interface IResponseGetCareer {
    total: number,
    max_page_size: number,
    page_size: number,
    page_number: number,
    page_next: number,
    page_previous: number,
    results: Array<IResultCareer>
}

export interface IGetCareerQuery {
    cv_id: number,
    position_id?: Array<number>,
    organization_id?: Array<number>,
    ordering?: string,
    search?: string,
    page?: number,
    page_size?: number
}

export interface IPostCareer {
    cv_id: number,
    date_from?: string,
    date_to?: string,
    description?: string,
    is_verified?: boolean,
    organization_id: number,
    position_id: number,
    competencies_ids?: Array<number>,
    projects_ids?: Array<number>
}

export interface IPatchCareer {
    id: number,
    cv_id: number,
    date_from?: string,
    date_to?: string,
    description?: string,
    is_verified?: boolean,
    organization_id: number,
    position_id: number,
    competencies_ids?: Array<number>,
    projects_ids?: Array<number>
}

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
        postCareer: build.mutation<IPostCareer, IPostCareer>({
            invalidatesTags: ['career'],
            query          : (body) => ({
                url   : 'career/',
                method: 'POST',
                body
            })
        }),
        patchCareerById: build.mutation<IPostCareer, IPatchCareer>({
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
        })
    })
});
