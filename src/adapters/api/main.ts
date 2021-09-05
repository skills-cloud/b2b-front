import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RequestRead } from 'adapter/types/main/request/id/get/code-200';
import { Organization } from 'adapter/types/main/organization/get/code-200';
import { ProjectRead } from 'adapter/types/main/project/get/code-200';
import { RequestType } from 'adapter/types/main/request-type/get/code-200';
import { RequestRequirementRead, RequestRequirementCompetenceRead } from 'adapter/types/main/request-requirement/id/get/code-200';
import { RequestRequirement } from 'adapter/types/main/request-requirement/post/code-201';

interface IBaseGetById {
    id: number
}

interface IQueryParams {
    ordering?: Array<string>,
    search?: string,
    page?: number,
    page_size?: number
}

interface IResponseGetOrganization {
    count: number,
    next: string,
    previous: string,
    results: Array<Organization>
}

interface IResponseGetMainProject {
    count: number,
    next: string,
    previous: string,
    results: Array<ProjectRead>
}

interface IResponseGetMainRequestType {
    count: number,
    next: string,
    previous: string,
    results: Array<RequestType>
}

interface IPostBaseResponse {
    id: number
}

interface IParamsBaseDeleteById {
    id: number
}

interface IParamsCompetenciesSet {
    id: number,
    competencies: Array<RequestRequirementCompetenceRead>
}


export const mainRequest = createApi({
    reducerPath: 'api/main/request',
    tagTypes   : ['main'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/main'
    }),
    endpoints: (build) => ({
        getMainRequestRequirementById: build.query<RequestRequirementRead, IBaseGetById>({
            providesTags: ['main'],
            query       : ({ id }) => ({
                url   : `/request-requirement/${id}`,
                method: 'GET'
            })
        }),
        postMainRequestRequirement: build.mutation<IPostBaseResponse, RequestRequirement>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/request-requirement/',
                method: 'POST',
                body
            })
        }),
        deleteMainRequestRequirementById: build.mutation<IPostBaseResponse, IParamsBaseDeleteById>({
            invalidatesTags: ['main'],
            query          : ({ id }) => ({
                url   : `/request-requirement/${id}/`,
                method: 'DELETE'
            })
        }),
        getMainRequestType: build.query<IResponseGetMainRequestType, IQueryParams>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/request-type/',
                method: 'GET',
                params
            })
        }),
        getMainProject: build.query<IResponseGetMainProject, IQueryParams>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/project/',
                method: 'GET',
                params
            })
        }),
        getMainOrganization: build.query<IResponseGetOrganization, IQueryParams | undefined>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/organization/',
                method: 'GET',
                params
            })
        }),
        getMainRequestById: build.query<RequestRead, IBaseGetById>({
            providesTags: ['main'],
            query       : ({ id }) => ({
                url   : `/request/${id}`,
                method: 'GET'
            })
        }),
        postMainRequest: build.mutation<IPostBaseResponse, RequestRead>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/request/',
                method: 'POST',
                body
            })
        }),
        postRequestRequirementCompetenciesSet: build.mutation<IPostBaseResponse, IParamsCompetenciesSet>({
            invalidatesTags: ['main'],
            query          : ({ id, competencies }) => ({
                url   : `/request-requirement/${id}/competencies-set/`,
                method: 'POST',
                body  : competencies
            })
        }),
        patchMainRequest: build.mutation<IPostBaseResponse, RequestRead>({
            invalidatesTags: ['main'],
            query          : ({ id, ...body }) => ({
                url   : `/request/${id}/`,
                method: 'PATCH',
                body
            })
        })
    })
});
