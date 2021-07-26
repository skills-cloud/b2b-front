import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IQueryParamsGetCertificateList {
    ordering?: Array<string>,
    search?: string,
    page?: number,
    page_size?: number,
    cv_id: string
}

export interface IEducationItem {
    id?: number,
    name: string,
    sorting?: number,
    description?: string
}

export interface ICompetence {
    id: number,
    name: string
}

export interface IResultCertificate {
    id?: number,
    cv_id: number,
    date?: string,
    description?: string,
    is_verified?: boolean,
    education_place_id: number,
    education_speciality_id: number,
    education_graduate_id: number,
    competencies_ids?: Array<number>,
    competencies?: Array<ICompetence>,
    education_place?: IEducationItem,
    education_speciality?: IEducationItem,
    education_graduate?: IEducationItem
}

export interface IQueryParamsPostCertificate {
    id?: number,
    cv_id: number,
    date?: string,
    name?: string,
    number?: string,
    description?: string,
    is_verified?: boolean,
    education_place_id: number,
    education_speciality_id: number,
    education_graduate_id: number,
    competencies_ids?: Array<number>
}

export interface IResponsePostCertificate extends IQueryParamsPostCertificate {
    id?: number
}

export interface IQueryParamsPatchCertificateById extends IQueryParamsPostCertificate {
    id: number
}

export interface IResponseGetCertificateList {
    count: number,
    next: string,
    previous: string,
    results: Array<IResultCertificate>
}

export const certificate = createApi({
    reducerPath: 'api/certificate',
    tagTypes   : ['certificate'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/cv'
    }),
    endpoints: (build) => ({
        getCertificateList: build.query<IResponseGetCertificateList, IQueryParamsGetCertificateList>({
            providesTags: ['certificate'],
            query       : (params) => ({
                url   : 'certificate/',
                method: 'GET',
                params
            })
        }),
        postCertificate: build.mutation<IResponsePostCertificate, IQueryParamsPostCertificate>({
            invalidatesTags: ['certificate'],
            query          : (body) => ({
                url   : 'certificate/',
                method: 'POST',
                body
            })
        }),
        patchCertificateById: build.mutation<IResponsePostCertificate, IQueryParamsPatchCertificateById>({
            invalidatesTags: ['certificate'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `certificate/${id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            }
        }),
        deleteCertificateById: build.mutation<undefined, { id: number }>({
            invalidatesTags: ['certificate'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `certificate/${id}/`,
                    method: 'DELETE',
                    body  : rest
                };
            }
        })
    })
});
