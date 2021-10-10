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
import { OrganizationProjectCardItemReadTree } from 'adapter/types/main/organization-project-card-item/get/code-200';
import { OrganizationProjectCardItemTree } from 'adapter/types/main/organization-project-card-item/post/code-201';
import { TimeSheetRowRead } from 'adapter/types/main/time-sheet-row/get/code-200';
import { TimeSheetRowRead as ITimeSheetRowReadById } from 'adapter/types/main/time-sheet-row/id/get/code-200';

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

export interface IResponseBase {
    count: number,
    next?: string,
    previous?: string
}

interface IResponseGetOrganization extends IResponseBase {
    results: Array<Organization>
}

interface IResponseRequestList extends IResponseBase {
    results: Array<RequestRead>
}

interface IResponseGetMainProject extends IResponseBase {
    results: Array<ProjectRead>
}

interface IResponseGetMainRequestType extends IResponseBase {
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
    organization_project_id?: string,
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

export interface IParamsLinkCv {
    data: Record<string, unknown>,
    cv_id: string,
    id: string
}

export enum ERequestStatus {
    Draft = 'draft',
    InProgress = 'in_progress',
    Done = 'done',
    Closed = 'closed'
}

export type TPriority = 10 | 20 | 30;

export interface IPostRequestData {
    organization_project_id: number,
    type_id?: number,
    industry_sector_id?: number,
    project_id?: number,
    manager_id?: number,
    resource_manager_id?: number,
    recruiter_id?: number,
    title?: string,
    description?: string,
    status?: ERequestStatus,
    priority?: TPriority,
    start_date?: string,
    deadline_date?: string
}

export interface IParamsPatchRequest extends IPostRequestData {
    id?: number
}

export interface IResponseTimeSheetList extends IResponseBase {
    results: Array<TimeSheetRowRead>
}

export interface IGetTimeSheetListParams {
    cv_id?: Array<number>,
    request_requirement_id?: Array<number>,
    request_id?: Array<number>,
    organization_project_id?: Array<number>,
    organization_id?: Array<number>,
    task_name?: string,
    ordering?: Array<string>,
    search?: string,
    page?: number,
    page_size?: number
}

export interface IDataPostTimeSheet {
    id?: number,
    request_id: number,
    cv_id: number,
    date_from?: string,
    date_to?: string,
    task_name: string,
    task_description?: string,
    work_time: number
}

export interface IResponsePostTimeSheet extends IDataPostTimeSheet {
    id?: number,
    created_at?: string,
    updated_at?: string
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
        getMainOrganizationById: build.query<OrganizationById, IBaseGetById>({
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
        getMainOrganizationCustomerById: build.query<OrganizationById, IBaseGetById>({
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
        getOrganizationProjectCardItem: build.query<Array<OrganizationProjectCardItemReadTree>,
        { organization_id?: Array<string>, organization_project_id?: Array<string>}>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/organization-project-card-item/',
                method: 'GET',
                params
            })
        }),
        getMainOrganizationProjectById: build.query<OrganizationProjectRead, IBaseGetById>({
            providesTags: ['main'],
            query       : ({ id }) => ({
                url   : `/organization-project/${id}/`,
                method: 'GET'
            })
        }),
        deleteMainOrganizationProjectCardById: build.mutation<OrganizationProjectCardItemTree, IBaseGetById>({
            invalidatesTags: ['main'],
            query          : ({ id }) => ({
                url   : `/organization-project-card-item/${id}`,
                method: 'DELETE'
            })
        }),
        postMainOrganizationProjectCard: build.mutation<OrganizationProjectCardItemTree, OrganizationProjectCardItemTree>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/organization-project-card-item/',
                method: 'POST',
                body
            })
        }),
        patchMainOrganizationProjectCard: build.mutation<OrganizationProjectCardItemTree, OrganizationProjectCardItemTree>({
            invalidatesTags: ['main'],
            query          : ({ id, ...body }) => ({
                url   : `/organization-project-card-item/${id}/`,
                method: 'PATCH',
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
        getMainRequest: build.query<IResponseRequestList, IGetRequestListParams | undefined>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/request/',
                method: 'GET',
                params
            })
        }),
        postMainRequest: build.mutation<IPostBaseResponse, IPostRequestData>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/request/',
                method: 'POST',
                body
            })
        }),
        getMainRequestById: build.query<RequestRead, IBaseGetById>({
            providesTags: ['main'],
            query       : ({ id }) => ({
                url   : `/request/${id}/`,
                method: 'GET'
            })
        }),
        patchMainRequest: build.mutation<IPostBaseResponse, IParamsPatchRequest>({
            invalidatesTags: ['main'],
            query          : ({ id, ...rest }) => ({
                url   : `/request/${id}/`,
                method: 'PATCH',
                body  : rest
            })
        }),
        postRequestRequirementCvSetDetails: build.mutation<{ status: string }, IParamsLinkCv>({
            invalidatesTags: ['main'],
            query          : ({ id, cv_id, data }) => ({
                url   : `/request-requirement/${id}/cv-set-details/${cv_id}/`,
                method: 'POST',
                body  : data
            })
        }),
        deleteMainRequestById: build.mutation<undefined, IBaseGetById>({
            invalidatesTags: ['main'],
            query          : ({ id }) => ({
                url   : `/request/${id}/`,
                method: 'DELETE'
            })
        }),
        getMainTimeSheetRow: build.query<IResponseTimeSheetList, IGetTimeSheetListParams | undefined>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/time-sheet-row/',
                method: 'GET',
                params
            })
        }),
        postMainTimeSheetRow: build.mutation<IResponsePostTimeSheet, IDataPostTimeSheet>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/time-sheet-row/',
                method: 'POST',
                body
            })
        }),
        getMainTimeSheetRowById: build.query<ITimeSheetRowReadById, IBaseGetById>({
            providesTags: ['main'],
            query       : ({ id }) => ({
                url   : `/time-sheet-row/${id}/`,
                method: 'GET'
            })
        }),
        patchMainTimeSheetRow: build.mutation<IResponsePostTimeSheet, IDataPostTimeSheet>({
            invalidatesTags: ['main'],
            query          : ({ id, ...rest }) => ({
                url   : `/time-sheet-row/${id}/`,
                method: 'PATCH',
                body  : rest
            })
        }),
        deleteMainTimeSheetRowById: build.mutation<undefined, IBaseGetById>({
            invalidatesTags: ['main'],
            query          : ({ id }) => ({
                url   : `/time-sheet-row/${id}/`,
                method: 'DELETE'
            })
        })
    })
});
