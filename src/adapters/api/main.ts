import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RequestRead } from 'adapter/types/main/request/id/get/code-200';
import { MainOrganization } from 'adapter/types/main/organization/get/code-200';
import { MainOrganization as PostOrganization } from 'adapter/types/main/organization/post/code-201';
import { MainOrganization as PatchOrganization } from 'adapter/types/main/organization/id/patch/code-200';
import { MainOrganization as OrganizationById } from 'adapter/types/main/organization/id/get/code-200';
import { ProjectRead } from 'adapter/types/main/project/get/code-200';
import { ProjectRead as ProjectReadById } from 'adapter/types/main/project/id/get/code-200';
import { RequestType } from 'adapter/types/main/request-type/get/code-200';
import { RequestType as RequestTypeById } from 'adapter/types/main/request-type/id/get/code-200';
import { RequestRequirementRead, RequestRequirementCompetenceRead } from 'adapter/types/main/request-requirement/id/get/code-200';
import { RequestRequirement } from 'adapter/types/main/request-requirement/post/code-201';
import { OrganizationProjectRead } from 'adapter/types/main/organization-project/get/code-200';
import { OrganizationProject } from 'adapter/types/main/organization-project/post/code-201';
import { OrganizationProjectCardItemReadTree } from 'adapter/types/main/organization-project-card-item/get/code-200';
import { OrganizationProjectCardItem } from 'adapter/types/main/organization-project-card-item/post/code-201';
import { TimeSheetRowRead } from 'adapter/types/main/time-sheet-row/get/code-200';
import { TimeSheetRowRead as ITimeSheetRowReadById } from 'adapter/types/main/time-sheet-row/id/get/code-200';
import { OrganizationProjectCardItemTemplate } from 'adapter/types/main/organization-project-card-item-template/get/code-200';
import { RequestRequirementCvOrganizationProjectCardItem } from 'adapter/types/main/request-requirement/id/cv-link/cv_id/post/code-200';
import { ModuleRead } from 'adapter/types/main/module/get/code-200';
import { ModuleRead as ModuleReadById } from 'adapter/types/main/module/id/get/code-200';
import { ModuleWrite } from 'adapter/types/main/module/post/code-201';
import { ModuleWrite as ModuleWritePatch } from 'adapter/types/main/module/id/patch/code-200';
import { FunPointTypeDifficultyLevelWrite } from 'adapter/types/main/fun-point-type-difficulty-level/post/code-201';
import { FunPointTypeRead } from 'adapter/types/main/fun-point-type/get/code-200';
import { FunPointTypeRead as FunPointTypeReadById } from 'adapter/types/main/fun-point-type/id/get/code-200';
import { FunPointTypeWrite } from 'adapter/types/main/fun-point-type/post/code-201';
import { FunPointTypeWrite as FunPointTypeWritePatch } from 'adapter/types/main/fun-point-type/id/patch/code-200';
import { ModuleFunPointWrite } from 'adapter/types/main/module-fun-point/post/code-201';
import { ModuleFunPointWrite as ModuleFunPointWritePatch } from 'adapter/types/main/module-fun-point/id/patch/code-200';
import { FunPointTypePositionLaborEstimateWrite } from 'adapter/types/main/fun-point-type-position-labor-estimate/post/code-201';
import { FunPointTypePositionLaborEstimateWrite as FunPointTypePositionLaborEstimateWritePatch } from 'adapter/types/main/fun-point-type-position-labor-estimate/id/patch/code-200';
import { ModulePositionLaborEstimateWrite } from 'adapter/types/main/module-position-labor-estimate/post/code-201';
import { OrganizationContractorRead } from 'adapter/types/main/organization-contractor/get/code-200';
import { OrganizationContractorRead as OrganizationContractorReadById } from 'adapter/types/main/organization-contractor/id/get/code-200';

export interface IOrganizationProjectPost extends OrganizationProject {
    id: number
}

interface IBaseGetById {
    id: string
}

interface IQueryParams {
    ordering?: Array<string>,
    search?: string,
    page?: number,
    page_size?: number
}

export interface IResponseBase {
    count: number,
    next?: string,
    previous?: string
}

export interface IGetOrganizationListQueryParams extends IQueryParams {
    is_customer?: boolean,
    is_contractor?: boolean
}

export interface IResponseGetOrganizationProject extends IResponseBase {
    results: Array<OrganizationProjectRead>
}

export interface IGetOrganizationProjectListQueryParams extends IQueryParams {
    organization_customer_id?: Array<number>,
    organization_contractor_id?: Array<number>
}

interface IResponseGetOrganization extends IResponseBase {
    results: Array<MainOrganization>
}

interface IResponseGetOrganizationContractor extends IResponseBase {
    results: Array<OrganizationContractorRead>
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
    organization_project_id?: Array<number>,
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

export enum EStatus {
    PreCandidate = 'pre-candidate',
    Candidate = 'candidate',
    Cancelled = 'canceled',
    Worker = 'worker'
}

export interface IParamsLinkCv {
    cv_id: string,
    id: string,
    status?: EStatus,
    date_from?: string,
    date_to?: string,
    rating?: number,
    organization_project_card_items?: Array<RequestRequirementCvOrganizationProjectCardItem>
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

export interface IPostResponseOrganizationProjectCardItem extends OrganizationProjectCardItem {
    id?: number
}

export interface IGetProjectCardParams {
    organization_project_id?: Array<number>,
    organization_customer_id?: Array<number>
}

export interface IResponseGetModuleList extends IResponseBase {
    results: Array<ModuleRead>
}

export interface IGetModuleParams {
    organization_id?: Array<number>,
    organization_project_id?: Array<number>,
    manager_id?: Array<number>,
    ordering?: Array<string>,
    search?: string,
    page?: number,
    page_size?: number
}

export interface IResponseGetFunPointTypeList extends IResponseBase {
    results: Array<FunPointTypeRead>
}

export const mainRequest = createApi({
    reducerPath: 'api/main/request',
    tagTypes   : ['main', 'expected-labor-estimate', 'create-request-for-saved-labor-estimate'],
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
        getBaseProjectCardTemplate: build.query<Array<OrganizationProjectCardItemTemplate>, undefined>({
            providesTags: ['main'],
            query       : () => ({
                url   : '/organization-project-card-item-template/',
                method: 'GET'
            })
        }),
        getBaseProjectCard: build.query<Array<OrganizationProjectCardItemReadTree>, IGetProjectCardParams | undefined>({
            providesTags: ['main'],
            query       : () => ({
                url   : '/organization-project-card-item/',
                method: 'GET'
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
        postMainOrganizationProjectCard: build.mutation<IPostResponseOrganizationProjectCardItem, OrganizationProjectCardItem>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/organization-project-card-item/',
                method: 'POST',
                body
            })
        }),
        postBaseProjectCard: build.mutation<OrganizationProjectCardItemReadTree, { project_id: string, root_card_item_id: string }>({
            invalidatesTags: ['main'],
            query          : ({ project_id, root_card_item_id }) => ({
                url   : `/organization-project-card-item/create-tree-by-template/${project_id}/${root_card_item_id}/`,
                method: 'POST'
            })
        }),
        patchMainOrganizationProjectCard: build.mutation<IPostResponseOrganizationProjectCardItem, IPostResponseOrganizationProjectCardItem>({
            invalidatesTags: ['main'],
            query          : ({ id, ...body }) => ({
                url   : `/organization-project-card-item/${id}/`,
                method: 'PATCH',
                body
            })
        }),
        deleteMainOrganizationProjectCardById: build.mutation<undefined, IBaseGetById>({
            invalidatesTags: ['main'],
            query          : ({ id }) => ({
                url   : `/organization-project-card-item/${id}`,
                method: 'DELETE'
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
        getMainOrganizationById: build.query<OrganizationById, IBaseGetById>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : `/organization/${params.id}/`,
                method: 'GET'
            })
        }),
        postMainOrganization: build.mutation<PostOrganization, PostOrganization>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/organization/',
                method: 'POST',
                body
            })
        }),
        patchMainOrganization: build.mutation<PatchOrganization, PatchOrganization>({
            invalidatesTags: ['main'],
            query          : ({ id, ...body }) => ({
                url   : `/organization/${id}/`,
                method: 'PATCH',
                body
            })
        }),
        getMainOrganization: build.query<IResponseGetOrganization, IGetOrganizationListQueryParams | undefined | void>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/organization/',
                method: 'GET',
                params: { ...params }
            })
        }),
        getMainOrganizationContractorById: build.query<OrganizationContractorReadById, IBaseGetById>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : `/organization-contractor/${params.id}/`,
                method: 'GET'
            })
        }),
        postMainOrganizationContractor: build.mutation<PostOrganization, PostOrganization>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/organization-contractor/',
                method: 'POST',
                body
            })
        }),
        patchMainOrganizationContractor: build.mutation<PatchOrganization, PatchOrganization>({
            invalidatesTags: ['main'],
            query          : ({ id, ...body }) => ({
                url   : `/organization-contractor/${id}/`,
                method: 'PATCH',
                body
            })
        }),
        getMainOrganizationContractor: build.query<IResponseGetOrganizationContractor, IQueryParams | undefined>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/organization-contractor/',
                method: 'GET',
                params
            })
        }),
        getMainOrganizationCustomerById: build.query<OrganizationById, IBaseGetById>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : `/organization-customer/${params.id}/`,
                method: 'GET'
            })
        }),
        postMainOrganizationCustomer: build.mutation<PostOrganization, PostOrganization>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/organization-customer/',
                method: 'POST',
                body
            })
        }),
        patchMainOrganizationCustomer: build.mutation<PatchOrganization, PatchOrganization>({
            invalidatesTags: ['main'],
            query          : ({ id, ...body }) => ({
                url   : `/organization-customer/${id}/`,
                method: 'PATCH',
                body
            })
        }),
        getMainOrganizationCustomer: build.query<IResponseGetOrganization, IQueryParams | undefined>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/organization-customer/',
                method: 'GET',
                params
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
        postMainOrganizationProject: build.mutation<IOrganizationProjectPost, OrganizationProject>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/organization-project/',
                method: 'POST',
                body
            })
        }),
        patchMainOrganizationProject: build.mutation<IOrganizationProjectPost, IOrganizationProjectPost>({
            invalidatesTags: ['main'],
            query          : ({ id, ...rest }) => ({
                url   : `/organization-project/${id}/`,
                method: 'PATCH',
                body  : rest
            })
        }),
        getMainOrganizationProjectById: build.query<OrganizationProjectRead, IBaseGetById>({
            providesTags: ['main'],
            query       : ({ id, ...params }) => ({
                url   : `/organization-project/${id}/`,
                method: 'GET',
                params
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
            query          : ({ id, cv_id, ...rest }) => ({
                url   : `/request-requirement/${id}/cv-link/${cv_id}/`,
                method: 'POST',
                body  : rest
            })
        }),
        getMainRequest: build.query<IResponseRequestList, IGetRequestListParams | undefined>({
            providesTags: ['main', 'create-request-for-saved-labor-estimate'],
            query       : (params) => ({
                url   : '/request/',
                method: 'GET',
                params
            })
        }),
        postMainRequest: build.mutation<IPostBaseResponse, IParamsPatchRequest>({
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
            query          : ({ id, cv_id, ...rest }) => ({
                url   : `/request-requirement/${id}/cv-set-details/${cv_id}/`,
                method: 'POST',
                body  : rest
            })
        }),
        deleteMainRequestById: build.mutation<undefined, IBaseGetById>({
            invalidatesTags: ['main'],
            query          : ({ id }) => ({
                url   : `/request/${id}/`,
                method: 'DELETE'
            })
        }),
        deleteMainRequestCvUnlinkById: build.mutation<undefined, IParamsLinkCv>({
            invalidatesTags: ['main'],
            query          : ({ id, cv_id }) => ({
                url   : `/request-requirement/${id}/cv-unlink/${cv_id}/`,
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
        }),
        getMainModule: build.query<IResponseGetModuleList, IGetModuleParams | undefined>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/module/',
                method: 'GET',
                params
            })
        }),
        postMainModule: build.mutation<ModuleWrite, ModuleWrite>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/module/',
                method: 'POST',
                body
            })
        }),
        getMainModuleById: build.query<ModuleReadById, IBaseGetById>({
            providesTags: ['main', 'expected-labor-estimate'],
            query       : ({ id }) => ({
                url   : `/module/${id}/`,
                method: 'GET'
            })
        }),
        setExpectedLaborEstimateAsSavedByModuleId: build.mutation<void, IBaseGetById>({
            invalidatesTags: ['expected-labor-estimate'],
            query          : ({ id }) => ({
                url   : `/module/${id}/set-expected-labor-estimate-as-saved/`,
                method: 'POST'
            })
        }),
        createRequestForSavedLaborEstimateByModuleId: build.mutation<void, IBaseGetById>({
            invalidatesTags: ['create-request-for-saved-labor-estimate'],
            query          : ({ id }) => ({
                url   : `/module/${id}/create-request-for-saved-labor-estimate/`,
                method: 'POST'
            })
        }),
        patchMainModule: build.mutation<ModuleWritePatch, ModuleWrite>({
            invalidatesTags: ['main'],
            query          : ({ id, ...rest }) => ({
                url   : `/module/${id}/`,
                method: 'PATCH',
                body  : rest
            })
        }),
        deleteMainModuleById: build.mutation<undefined, IBaseGetById>({
            invalidatesTags: ['main'],
            query          : ({ id }) => ({
                url   : `/module/${id}/`,
                method: 'DELETE'
            })
        }),
        postMainFunPointDifficultyLevel: build.mutation<FunPointTypeDifficultyLevelWrite, FunPointTypeDifficultyLevelWrite>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/fun-point-type-difficulty-level/',
                method: 'POST',
                body
            })
        }),
        patchMainFunPointDifficultyLevel: build.mutation<FunPointTypeDifficultyLevelWrite, FunPointTypeDifficultyLevelWrite>({
            invalidatesTags: ['main'],
            query          : ({ id, ...body }) => ({
                url   : `/fun-point-type-difficulty-level/${id}/`,
                method: 'PATCH',
                body
            })
        }),
        getMainFunPointType: build.query<IResponseGetFunPointTypeList, IQueryParams | undefined>({
            providesTags: ['main'],
            query       : (params) => ({
                url   : '/fun-point-type/',
                method: 'GET',
                params
            })
        }),
        postMainFunPointType: build.mutation<FunPointTypeWrite, FunPointTypeWrite>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/fun-point-type/',
                method: 'POST',
                body
            })
        }),
        getMainFunPointTypeById: build.query<FunPointTypeReadById, IBaseGetById>({
            providesTags: ['main'],
            query       : ({ id }) => ({
                url   : `/fun-point-type/${id}/`,
                method: 'GET'
            })
        }),
        patchMainFunPointType: build.mutation<FunPointTypeWritePatch, FunPointTypeWritePatch>({
            invalidatesTags: ['main'],
            query          : ({ id, ...rest }) => ({
                url   : `/fun-point-type/${id}/`,
                method: 'PATCH',
                body  : rest
            })
        }),
        deleteMainFunPointTypeById: build.mutation<undefined, IBaseGetById>({
            invalidatesTags: ['main'],
            query          : ({ id }) => ({
                url   : `/fun-point-type/${id}/`,
                method: 'DELETE'
            })
        }),
        postMainModuleFunPoint: build.mutation<ModuleFunPointWrite, ModuleFunPointWrite>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/module-fun-point/',
                method: 'POST',
                body
            })
        }),
        patchMainModuleFunPoint: build.mutation<ModuleFunPointWritePatch, ModuleFunPointWritePatch>({
            invalidatesTags: ['main'],
            query          : ({ id, ...rest }) => ({
                url   : `/module-fun-point/${id}/`,
                method: 'PATCH',
                body  : rest
            })
        }),
        deleteMainModuleFunPointById: build.mutation<undefined, IBaseGetById>({
            invalidatesTags: ['main'],
            query          : ({ id }) => ({
                url   : `/module-fun-point/${id}/`,
                method: 'DELETE'
            })
        }),
        postMainModulePositionLaborEstimates: build.mutation<ModuleFunPointWrite, ModuleFunPointWrite>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/module-position-labor-estimates/',
                method: 'POST',
                body
            })
        }),
        postMainModulePositionLaborEstimate: build.mutation<ModulePositionLaborEstimateWrite, ModulePositionLaborEstimateWrite>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/module-position-labor-estimate/',
                method: 'POST',
                body
            })
        }),
        patchMainModulePositionLaborEstimate: build.mutation<ModulePositionLaborEstimateWrite, ModulePositionLaborEstimateWrite>({
            invalidatesTags: ['main'],
            query          : ({ id, ...rest }) => ({
                url   : `/module-position-labor-estimate/${id}`,
                method: 'PATCH',
                body  : rest
            })
        }),
        deleteMainModulePositionLaborEstimate: build.mutation<undefined, IBaseGetById>({
            invalidatesTags: ['main'],
            query          : ({ id }) => ({
                url   : `/module-position-labor-estimate/${id}`,
                method: 'DELETE'
            })
        }),
        patchMainModulePositionLaborEstimates: build.mutation<ModuleFunPointWritePatch, ModuleFunPointWritePatch>({
            invalidatesTags: ['main'],
            query          : ({ id, ...rest }) => ({
                url   : `/module-position-labor-estimates/${id}/`,
                method: 'PATCH',
                body  : rest
            })
        }),
        deleteMainModulePositionLaborEstimatesById: build.mutation<undefined, IBaseGetById>({
            invalidatesTags: ['main'],
            query          : ({ id }) => ({
                url   : `/module-position-labor-estimates/${id}/`,
                method: 'DELETE'
            })
        }),
        postMainFunPointTypePositionLaborEstimates: build.mutation<FunPointTypePositionLaborEstimateWrite, FunPointTypePositionLaborEstimateWrite>({
            invalidatesTags: ['main'],
            query          : (body) => ({
                url   : '/fun-point-type-position-labor-estimate/',
                method: 'POST',
                body
            })
        }),
        patchMainFunPointTypePositionLaborEstimates: build.mutation<FunPointTypePositionLaborEstimateWritePatch, FunPointTypePositionLaborEstimateWritePatch>({
            invalidatesTags: ['main'],
            query          : ({ id, ...rest }) => ({
                url   : `/fun-point-type-position-labor-estimate/${id}/`,
                method: 'PATCH',
                body  : rest
            })
        }),
        deleteMainFunPointTypePositionLaborEstimates: build.mutation<undefined, IBaseGetById>({
            invalidatesTags: ['main'],
            query          : ({ id }) => ({
                url   : `/fun-point-type-position-labor-estimate/${id}/`,
                method: 'DELETE'
            })
        })
    })
});
