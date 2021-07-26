import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IEducationPlace {
    id: number,
    name: string,
    sorting: number,
    description: string
}

export interface IEducationSpecialty {
    id: number,
    name: string,
    sorting: number,
    description: string
}

export interface IEducationGraduate {
    id: number,
    name: string,
    sorting: number,
    description: string
}

interface IEducationCompetencies {
    id: number,
    name: string
}

export interface IResultEducation {
    id: number,
    cv_id: number,
    date_from: string,
    date_to: string,
    description: string,
    is_verified: boolean,
    education_place_id: number,
    education_speciality_id: number,
    education_graduate_id: number,
    competencies_ids: Array<number>,
    education_place: IEducationPlace,
    education_speciality: IEducationSpecialty,
    education_graduate: IEducationGraduate,
    competencies: Array<IEducationCompetencies>
}

export interface IResponseGetEducation {
    count: number,
    next: string,
    previous: string,
    results: Array<IResultEducation>
}

export interface IGetEducationQuery {
    cv_id: number,
    date_range?: string,
    ordering?: string,
    search?: string,
    page?: number,
    page_size?: number,
    date_range_from?: string,
    date_range_to?: string
}

export interface IPostEducation {
    id?: number,
    cv_id: number,
    date_from: string,
    date_to: string,
    description: string,
    is_verified: boolean,
    education_place_id: number,
    education_speciality_id: number,
    education_graduate_id: number,
    competencies_ids: Array<number>
}

export const education = createApi({
    reducerPath: 'api/education',
    tagTypes   : ['education'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/cv'
    }),
    endpoints: (build) => ({
        getEducation: build.query<IResponseGetEducation, IGetEducationQuery>({
            providesTags: ['education'],
            query       : (params) => ({
                url   : 'education/',
                method: 'GET',
                params
            })
        }),
        postEducation: build.mutation<IPostEducation, IPostEducation>({
            invalidatesTags: ['education'],
            query          : (body) => ({
                url   : 'education/',
                method: 'POST',
                body
            })
        }),
        patchEducation: build.mutation<IPostEducation, IPostEducation>({ invalidatesTags: ['education'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `education/${id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            } }),
        deleteEducationById: build.mutation<undefined, { id: number }>({
            invalidatesTags: ['education'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `education/${id}/`,
                    method: 'DELETE',
                    body  : rest
                };
            }
        })
    })
});
