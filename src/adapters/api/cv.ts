import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResultCertificate } from 'adapter/api/certificate';
import { IResultPosition } from 'adapter/api/position';
import { IResultCareer } from 'adapter/api/career';
import { IResultEducation } from 'adapter/api/education';
import { CvProjectRead } from 'adapter/types/cv/project/get/code-200';

export interface ICitizenship {
    id: number,
    name: string,
    description: string
}

export interface IPhysicalLimitation {
    id: number,
    name: string,
    description: string
}

export interface IFile {
    id: number,
    file: string,
    file_name: string,
    cv_career_id: string,
    file_ext: string,
    file_size: string
}

export interface ICompetence {
    id: number,
    name: string
}

export interface ICv {
    id?: number,
    first_name?: string,
    middle_name?: string,
    last_name?: string,
    photo?: string,
    gender?: string,
    birth_date?: string,
    is_resource_owner?: true,
    user_id?: number,
    country_id?: number,
    city_id?: number,
    citizenship_id?: number,
    days_to_contact?: string,
    time_to_contact_from?: string,
    time_to_contact_to?: string,
    physical_limitations_ids?: Array<number>,
    competencies_ids?: Array<number>,
    user?: INanoUser,
    country?: ICountry,
    city?: ICity,
    citizenship?: ICitizenship,
    physical_limitations?: Array<IPhysicalLimitation>,
    contacts?: Array<IContact>,
    time_slots?: Array<ITimeSlot>,
    positions?: Array<IResultPosition>,
    career?: Array<IResultCareer>,
    projects?: Array<CvProjectRead>,
    education?: Array<IResultEducation>,
    certificates?: Array<IResultCertificate>,
    files?: Array<IFile>,
    competencies?: Array<ICompetence>
}

export interface IPostCv {
    first_name?: string,
    middle_name?: string,
    last_name?: string,
    gender?: string,
    birth_date?: string,
    is_resource_owner?: boolean,
    user_id?: number,
    country_id?: number,
    city_id?: number,
    citizenship_id?: number,
    days_to_contact?: string,
    time_to_contact_from?: string,
    time_to_contact_to?: string,
    physical_limitations_ids?: Array<number>,
    competencies_ids?: Array<number>
}

export interface IPostCvWithId extends IPostCv {
    id: number
}

export interface INanoUser {
    id: number,
    first_name: string,
    last_name: string,
    photo: string | null
}

export interface ICvRequest {
    count: number,
    next?: string,
    previous?: string,
    results: Array<ICv>
}

export interface IContact {
    cv_id: number,
    id: number,
    contact_type_id: number,
    value: string,
    is_primary: true,
    comment: string,
    contact_type: {
        id: number,
        name: string,
        sorting: number
    }
}

export interface ICountry {
    id: number,
    name: string,
    sorting: number
}

export interface ICity {
    id: number,
    country: ICountry,
    name: string,
    sorting: number
}

export interface ITimeSlot {
    cv_id: number,
    id: number,
    date_from: string,
    date_to: string,
    price: number,
    is_work_permit_required: boolean,
    description: string,
    country_id: number,
    city_id: number,
    type_of_employment_id: number
}

export interface IQueryParamsGetTimeSlot {
    cv_id?: number,
    country_id?: number,
    city_id?: number,
    type_of_employment_id?: number,
    search?: string,
    page?: number,
    page_size?: number
}

export interface ITypeOfEmployment {
    id: number,
    name: string,
    sorting: number
}

export interface IResultGetTimeSlot {
    id: number,
    cv_id: number,
    date_from: string,
    date_to: string,
    price: number,
    is_work_permit_required: boolean,
    description: null,
    country_id: null,
    city_id: null,
    type_of_employment_id: number,
    country: null,
    city: null,
    type_of_employment: ITypeOfEmployment
}

export interface IResponseGetTimeSlot {
    count: number,
    next?: string,
    previous?: string,
    results: Array<IResultGetTimeSlot>
}

export interface IQueryParamsPostTimeSlot {
    cv_id: number,
    id?: number,
    date_from?: string,
    date_to?: string,
    price?: number,
    is_work_permit_required?: boolean,
    description?: string,
    country_id?: number,
    city_id?: number,
    type_of_employment_id: number
}

export interface IResponsePostTimeSlot {
    cv_id: number,
    id?: number,
    date_from?: string,
    date_to?: string,
    price?: number,
    is_work_permit_required?: boolean,
    description?: string,
    country_id?: number,
    city_id?: number,
    type_of_employment_id: number
}

export interface IResponseGetTimeSlotById {
    id: number,
    cv_id: number,
    date_from: string,
    date_to: string,
    price: number,
    is_work_permit_required: boolean,
    description: string,
    country_id: number,
    city_id: number,
    type_of_employment_id: number,
    country: {
        id: number,
        name: string,
        sorting: number
    },
    city: {
        id: number,
        country: {
            id: number,
            name: string,
            sorting: number
        },
        name: string,
        sorting: number
    },
    type_of_employment: ITypeOfEmployment
}

export type TOrderingValues = 'id' | '-id' | 'first_name' | '-first_name' | 'middle_name' | '-middle_name' | 'last_name' | '-last_name' | 'created_at' | '-created_at' | 'updated_at' | '-updated_at';

export interface IGetCvListFilters {
    country_id?: Array<number>,
    city_id?: Array<number>,
    citizenship_id?: Array<number>,
    competencies_ids_any?: Array<number>,
    competencies_ids_all?: Array<number>,
    ordering?: Array<TOrderingValues>,
    search?: string,
    page?: number,
    page_size?: number
}

export const cv = createApi({
    reducerPath: 'api/cv',
    tagTypes   : ['cv'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/cv'
    }),
    endpoints: (build) => ({
        getTimeSlot: build.query<IResponseGetTimeSlot, IQueryParamsGetTimeSlot>({
            providesTags: ['cv'],
            query       : (params) => ({
                url   : 'time-slot/',
                method: 'GET',
                params
            })
        }),
        getTimeSlotById: build.query<IResponseGetTimeSlot, { id: number }>({
            providesTags: ['cv'],
            query       : (params) => {
                const { id, ...rest } = params;

                return {
                    url   : `time-slot/${id}/`,
                    method: 'GET',
                    params: rest
                };
            }
        }),
        setTimeSlot: build.mutation<IResponsePostTimeSlot, IQueryParamsPostTimeSlot>({
            invalidatesTags: ['cv'],
            query          : (body) => ({
                url   : 'time-slot/',
                method: 'POST',
                body
            })
        }),
        patchTimeSlotById: build.mutation<IResponsePostTimeSlot, IQueryParamsPostTimeSlot>({
            invalidatesTags: ['cv'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `time-slot/${id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            }
        }),
        postCv: build.mutation<IPostCvWithId, IPostCv>({
            query: (body) => ({
                url   : 'cv/',
                method: 'POST',
                body
            })
        }),
        patchCvById: build.mutation<IPostCv, IPostCvWithId>({
            query: (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `cv/${body.id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            }
        }),
        getCvList: build.query<ICvRequest, IGetCvListFilters | undefined>({
            providesTags: ['cv'],
            query       : (params) => ({
                url   : 'cv/',
                method: 'GET',
                params
            })
        }),
        getCvById: build.query<ICv, { id: string }>({
            providesTags: ['cv'],
            query       : (params) => ({
                url   : `cv/${params.id}/`,
                method: 'GET'
            })
        }),
        setCvPhotoById: build.mutation<ICv, { id: string, data: FormData }>({
            invalidatesTags: ['cv'],
            query          : (body) => {
                const { id, data } = body;

                return {
                    url   : `cv/${id}/set-photo/`,
                    method: 'POST',
                    body  : data
                };
            }
        }),
        uploadCvFileById: build.mutation<ICv, { id: string, data: FormData }>({
            invalidatesTags: ['cv'],
            query          : (body) => {
                const { id, data } = body;

                return {
                    url   : `cv/${id}/upload-file/`,
                    method: 'POST',
                    body  : data
                };
            }
        }),
        deleteCvFileById: build.mutation<ICv, { id: string, file_id: string }>({
            invalidatesTags: ['cv'],
            query          : (body) => {
                const { id, file_id } = body;

                return {
                    url   : `cv/${id}/delete-file/${file_id}/`,
                    method: 'DELETE'
                };
            }
        })
    })
});
