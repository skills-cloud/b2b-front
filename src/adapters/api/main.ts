import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RequestRead } from 'adapter/types/main/request/id/get/code-200';
import { Organization } from 'adapter/types/main/organization/get/code-200';
import { Organization as OrganizationById } from 'adapter/types/main/organization/id/get/code-200';
import { ProjectRead } from 'adapter/types/main/project/get/code-200';
import { ProjectRead as ProjectReadById } from 'adapter/types/main/project/id/get/code-200';
import { RequestType } from 'adapter/types/main/request-type/get/code-200';
import { RequestType as RequestTypeById } from 'adapter/types/main/request-type/id/get/code-200';
import { RequestRequirementRead, RequestRequirementCompetenceRead } from 'adapter/types/main/request-requirement/id/get/code-200';
import { RequestRequirement } from 'adapter/types/main/request-requirement/post/code-201';
import { OrganizationProjectRead } from 'adapter/types/main/organization-project/get/code-200';

interface IBaseGetById {
    id: string
}

interface IQueryParams {
    ordering?: Array<string>,
    search?: string,
    page?: number,
    page_size?: number
}

export interface IGetOrganizationListQueryParams extends IQueryParams {
    is_customer?: 'true' | 'false'
}

export interface IResponseGetOrganizationProject {
    total: number,
    max_page_size: number,
    page_size: number,
    page_number: number,
    page_next: number,
    page_previous: number,
    results: Array<OrganizationProjectRead>
}

export interface IGetOrganizationProjectListQueryParams extends IQueryParams {
    organization_id?: string
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

export interface IGetRequestListParams {
    type_id?: string,
    customer_id?: string,
    status?: string,
    priority?: string,
    industry_sector_id?: string,
    project_id?: string,
    resource_manager_id?: string,
    recruiter_id?: string,
    ordering?: Array<string>,
    search?: string,
    page?: number,
    page_size?: number
}

interface IResponseGetRequestList {
    count: number,
    next: string,
    previous: string,
    results: Array<RequestRead>
}

export interface IParamsLinkCv {
    data: Record<string, unknown>,
    cv_id: string,
    id: string
}

export const mainRequest = createApi({
    reducerPath: 'api/main/request',
    tagTypes   : ['main'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/main'
    }),
    endpoints: (build) => ({
        getRequestList: build.query<IResponseGetRequestList, IGetRequestListParams | undefined>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : 'request/',
                method: 'GET',
                params
            })
        }),
        getMainRequestRequirementById: build.query<RequestRequirementRead, IBaseGetById>({
            providesTags: ['main'],
            query       : ({ id }) => ({
                url   : `/request-requirement/${id}/`,
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
        patchMainRequestRequirement: build.mutation<IPostBaseResponse, RequestRequirement>({
            invalidatesTags: ['main'],
            query          : ({ id, ...body }) => ({
                url   : `/request-requirement/${id}/`,
                method: 'PATCH',
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
        getMainRequestType: build.query<IResponseGetMainRequestType, IQueryParams | undefined>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/request-type/',
                method: 'GET',
                params
            })
        }),
        getMainRequestTypeById: build.query<RequestTypeById, IBaseGetById>({
            providesTags: ['main'],
            query       : ({ id }) => ({
                url   : `/request-type/${id}/`,
                method: 'GET'
            })
        }),
        getMainProject: build.query<IResponseGetMainProject, IQueryParams | undefined>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/project/',
                method: 'GET',
                params
            })
        }),
        getMainProjectById: build.query<ProjectReadById, IBaseGetById>({
            providesTags: ['main'],
            query       : ({ id }) => ({
                url   : `/project/${id}/`,
                method: 'GET'
            })
        }),
        getMainOrganization: build.query<IResponseGetOrganization, IGetOrganizationListQueryParams | undefined>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/organization/',
                method: 'GET',
                params
            })
        }),
        getMainOrganizationById: build.query<OrganizationById, { id: string }>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : `/organization/${params.id}/`,
                method: 'GET'
            })
        }),
        getMainOrganizationCustomer: build.query<IResponseGetOrganization, IGetOrganizationListQueryParams | undefined>({
            providesTags     : ['main'],
            transformResponse: (resp: IResponseGetOrganization) => ({
                ...resp,
                results: resp.results.filter((item) => item.is_customer)
            }),
            query: (params) => ({
                url   : '/organization/',
                method: 'GET',
                params
            })
        }),
        getMainOrganizationCustomerById: build.query<OrganizationById, { id: string }>({
            providesTags     : ['main'],
            transformResponse: (resp: OrganizationById) => {
                if(resp?.is_customer) {
                    return resp;
                }

                return Promise.reject(new Error('No response'));
            },
            query: (params) => ({
                url   : `/organization/${params.id}/`,
                method: 'GET'
            })
        }),
        getMainOrganizationProjectList: build.query<IResponseGetOrganizationProject, IGetOrganizationProjectListQueryParams | undefined>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/organization-project/',
                method: 'GET',
                params
            })
        }),
        getMainRequestById: build.query<RequestRead, IBaseGetById>({
            providesTags: ['main'],
            query       : ({ id }) => ({
                url   : `/request/${id}/`,
                method: 'GET'
            })
        }),
        deleteMainRequestById: build.mutation<RequestRead, IBaseGetById>({
            invalidatesTags: ['main'],
            query          : ({ id }) => ({
                url   : `/request/${id}`,
                method: 'DELETE'
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
        postRequestRequirementLinkCv: build.mutation<{ status: string }, IParamsLinkCv>({
            invalidatesTags: ['main'],
            query          : ({ id, cv_id, data }) => ({
                url   : `/request-requirement/${id}/cv-link/${cv_id}/`,
                method: 'POST',
                body  : data
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
