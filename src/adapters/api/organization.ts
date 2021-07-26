import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IGetOrganizationListQuery {
    ordering?: Array<string>,
    search?: string,
    page?: number,
    page_size?: number
}

export interface IGetOrganizationProjectListQuery {
    organization_id: string,
    ordering?: Array<string>,
    search?: string,
    page?: number,
    page_size?: number
}

export interface IOrganization {
    id: number,
    name: string,
    description: string
}

export interface IResponseGetOrganizationList {
    total: number,
    max_page_size: number,
    page_size: number,
    page_number: number,
    page_next: number,
    page_previous: number,
    results: Array<IOrganization>
}

export interface IOrganizationProjects {
    id: number,
    organization_id: number,
    organization: IOrganization,
    name: string,
    description: string
}

export interface IResponseGetOrganizationProjectList {
    total: number,
    max_page_size: number,
    page_size: number,
    page_number: number,
    page_next: number,
    page_previous: number,
    results: Array<IOrganizationProjects>
}

export const organization = createApi({
    reducerPath: 'api/organization',
    tagTypes   : ['organization'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/main'
    }),
    endpoints: (build) => ({
        getOrganizationList: build.query<IResponseGetOrganizationList, { search: string } | undefined>({
            providesTags: ['organization'],
            query       : (params) => ({
                url   : 'organization/',
                method: 'GET',
                params
            })
        }),
        getOrganizationProjectList: build.query<IResponseGetOrganizationProjectList, IGetOrganizationProjectListQuery>({
            providesTags: ['organization'],
            query       : (params) => ({
                url   : 'organization-project/',
                method: 'GET',
                params
            })
        })
    })
});
