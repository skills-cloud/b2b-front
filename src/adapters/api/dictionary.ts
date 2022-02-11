import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ContactType } from 'adapter/types/dictionary/contact-type/get/code-200';
import { IndustrySector } from 'adapter/types/dictionary/industry-sector/get/code-200';
import { IndustrySector as IndustrySectorById } from 'adapter/types/dictionary/industry-sector/id/get/code-200';
import { Country, NoName } from 'adapter/types/dictionary/country/get/code-200';
import { Country as CountryById } from 'adapter/types/dictionary/country/id/get/code-200';
import { City } from 'adapter/types/dictionary/city/get/code-200';
import { City as CityById } from 'adapter/types/dictionary/city/id/get/code-200';
import { TypeOfEmployment } from 'adapter/types/dictionary/type-of-employment/get/code-200';
import { TypeOfEmployment as TypeOfEmploymentById } from 'adapter/types/dictionary/type-of-employment/id/get/code-200';
import { EducationGraduate } from 'adapter/types/dictionary/education-graduate/get/code-200';
import { EducationGraduate as EducationGraduateById } from 'adapter/types/dictionary/education-graduate/id/get/code-200';
import { EducationPlace } from 'adapter/types/dictionary/education-place/get/code-200';
import { EducationPlace as EducationPlaceById } from 'adapter/types/dictionary/education-place/id/get/code-200';
import { EducationSpecialty } from 'adapter/types/dictionary/education-specialty/get/code-200';
import { EducationSpecialty as EducationSpecialtyById } from 'adapter/types/dictionary/education-specialty/id/get/code-200';
import { Position } from 'adapter/types/dictionary/position/get/code-200';
import { Position as PositionById } from 'adapter/types/dictionary/position/id/get/code-200';
import { Competence } from 'adapter/types/dictionary/competence/get/code-200';
import { Competence as CompetenceById } from 'adapter/types/dictionary/competence/id/get/code-200';
import { Citizenship } from 'adapter/types/dictionary/citizenship/get/code-200';
import { Citizenship as CitizenshipById } from 'adapter/types/dictionary/citizenship/id/get/code-200';
import { CompetenceTree } from 'adapter/types/dictionary/competence-tree/get/code-200';
import { Code200 as Code200Organization } from 'adapter/types/dictionary/organization/get/code-200';

export interface IResponseGetOrganization {
    results: Array<Code200Organization>
}

export interface IResponseGetCityList {
    count: number,
    next?: string,
    previous?: string,
    results: Array<City>
}

export interface IResponseGetCitizenshipList {
    count: number,
    next?: string,
    previous?: string,
    results: Array<Citizenship>
}

export interface IResponseGetCountryList {
    count: number,
    next?: string,
    previous?: string,
    results: Array<Country>
}

export interface IResponseGetContactList {
    count: number,
    next?: string,
    previous?: string,
    results: Array<ContactType>
}

export interface IResponseGetCompetenceList {
    results: Array<Competence>
}

export interface IResponseGetPositionList {
    count: number,
    next: string,
    previous: string,
    results: Array<Position>
}

export interface IEducationResponse {
    count: number,
    next: string,
    previous: string,
    results: Array<EducationGraduate | EducationPlace | EducationSpecialty>
}

interface IResponseIndustrySector {
    count: number,
    next: string,
    previous: string,
    results: Array<IndustrySector>
}

export interface IResponseGetTypeOfEmployment {
    results: Array<TypeOfEmployment>
}

export interface IGetCompetenceListParams {
    search?: string,
    id?: Array<number>
}

export interface IDictionary {
    attributes?: NoName,
    description?: string,
    id?: number,
    is_verified?: boolean,
    name: string
}

export interface IDictionaryKey {
    key: string
}

export interface IDictionaryParams {
    search?: string,
    page?: number,
    page_size?: number,
    country_id?: string | number
}

export const dictionary = createApi({
    reducerPath: 'api/dictionary',
    tagTypes   : ['dictionary'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/dictionary'
    }),
    endpoints: (build) => ({
        getIndustrySector: build.query<IResponseIndustrySector, { search?: string } | undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'industry-sector/',
                method: 'GET',
                params
            })
        }),
        getIndustrySectorById: build.query<IndustrySectorById, { id: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : `competence/${params.id}/`,
                method: 'GET'
            })
        }),
        getCompetenceTree: build.query<Array<CompetenceTree>, undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'competence-tree/',
                method: 'GET',
                params
            })
        }),
        getCompetence: build.query<IResponseGetCompetenceList, IGetCompetenceListParams | undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'competence/',
                method: 'GET',
                params: {
                    page_size: 1000,
                    ...params
                }
            })
        }),
        getCompetenceById: build.query<CompetenceById, { id: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : `competence/${params.id}/`,
                method: 'GET'
            })
        }),
        getPositionById: build.query<PositionById, { id: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : `position/${params.id}/`,
                method: 'GET'
            })
        }),
        getContactType: build.query<IResponseGetContactList, { search?: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'contact-type/',
                method: 'GET',
                params
            })
        }),
        getCountryList: build.query<IResponseGetCountryList, IDictionaryParams | undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'country/',
                method: 'GET',
                params
            })
        }),
        getCountryById: build.query<CountryById, { id: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : `country/${params.id}/`,
                method: 'GET'
            })
        }),
        getCityList: build.query<IResponseGetCityList, { search?: string, country_id?: string } | undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'city/',
                method: 'GET',
                params
            })
        }),
        getCityById: build.query<CityById, { id: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : `city/${params.id}/`,
                method: 'GET'
            })
        }),
        getCitizenshipList: build.query<IResponseGetCitizenshipList, { search?: string } | undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'citizenship/',
                method: 'GET',
                params
            })
        }),
        getCitizenshipById: build.query<CitizenshipById, { id: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : `citizenship/${params.id}/`,
                method: 'GET'
            })
        }),
        getPositionList: build.query<IResponseGetPositionList, { search?: string } | undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'position/',
                method: 'GET',
                params
            })
        }),
        getEducationGraduate: build.query<IEducationResponse, { search?: string } | undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'education-graduate/',
                method: 'GET',
                params
            })
        }),
        getEducationGraduateById: build.query<EducationGraduateById, { id: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : `education-graduate/${params.id}/`,
                method: 'GET'
            })
        }),
        getEducationPlace: build.query<IEducationResponse, { search?: string } | undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'education-place/',
                method: 'GET',
                params
            })
        }),
        getEducationPlaceById: build.query<EducationPlaceById, { id: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : `education-place/${params.id}/`,
                method: 'GET'
            })
        }),
        getEducationSpeciality: build.query<IEducationResponse, { search?: string } | undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'education-specialty/',
                method: 'GET',
                params
            })
        }),
        getEducationSpecialityById: build.query<EducationSpecialtyById, { id: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : `education-specialty/${params.id}/`,
                method: 'GET'
            })
        }),
        getTypeOfEmployment: build.query<IResponseGetTypeOfEmployment, { search?: string } | undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'type-of-employment/',
                method: 'GET',
                params
            })
        }),
        getTypeOfEmploymentById: build.query<TypeOfEmploymentById, { id: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : `type-of-employment/${params.id}/`,
                method: 'GET'
            })
        }),
        getOrganization: build.query<IResponseGetOrganization, { search?: string, page_size?: number } | undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'organization/',
                method: 'GET',
                params
            })
        }),
        getOrganizationById: build.query<Code200Organization, { id: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : `organization/${params.id}/`,
                method: 'GET'
            })
        }),
        getDictionaryList: build.query<IResponseGetCountryList, IDictionaryKey & IDictionaryParams>({
            providesTags: ['dictionary'],
            query       : ({ key, ...params }) => ({
                url   : `${key}/`,
                method: 'GET',
                params
            })
        }),
        deleteDictionaryItem: build.mutation<void, IDictionaryKey & { id: number }>({
            query: ({ key, id }) => ({
                url   : `${key}/${id}/`,
                method: 'DELETE'
            }),
            invalidatesTags: ['dictionary']
        }),
        patchDictionaryItem: build.mutation<IDictionary, Omit<IDictionaryKey & IDictionary, 'attributes'>>({
            query: ({ key, ...body }) => ({
                url   : `${key}/${body.id}/`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['dictionary']
        }),
        postDictionaryItem: build.mutation<IDictionary, Omit<IDictionaryKey & IDictionary, 'id' | 'attributes'>>({
            query: ({ key, ...body }) => ({
                url   : `${key}/`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['dictionary']
        })
    })
});
