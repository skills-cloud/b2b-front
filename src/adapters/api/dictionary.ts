import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ContactType } from 'adapter/types/dictionary/contact-type/get/code-200';
import { IndustrySector } from 'adapter/types/dictionary/industry-sector/get/code-200';
import { Country } from 'adapter/types/dictionary/country/get/code-200';
import { Country as CountryById } from 'adapter/types/dictionary/country/id/get/code-200';
import { City } from 'adapter/types/dictionary/city/get/code-200';
import { City as CityById } from 'adapter/types/dictionary/city/id/get/code-200';
import { TypeOfEmployment } from 'adapter/types/dictionary/type-of-employment/get/code-200';
import { EducationGraduate } from 'adapter/types/dictionary/education-graduate/get/code-200';
import { EducationPlace } from 'adapter/types/dictionary/education-place/get/code-200';
import { EducationSpecialty } from 'adapter/types/dictionary/education-specialty/get/code-200';
import { Position } from 'adapter/types/dictionary/position/get/code-200';
import { Competence } from 'adapter/types/dictionary/competence/get/code-200';
import { Competence as CompetenceById } from 'adapter/types/dictionary/competence/id/get/code-200';
import { Citizenship } from 'adapter/types/dictionary/citizenship/get/code-200';
import { CompetenceTree } from 'adapter/types/dictionary/competence-tree/get/code-200';

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
    total: number,
    max_page_size: number,
    page_size: number,
    page_number: number,
    page_next: string,
    page_previous: string,
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
    total: number,
    max_page_size: number,
    page_size: number,
    page_number: number,
    page_next: number,
    page_previous: number,
    results: Array<TypeOfEmployment>
}

export const dictionary = createApi({
    reducerPath: 'api/dictionary',
    tagTypes   : ['dictionary'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/dictionary'
    }),
    endpoints: (build) => ({
        getIndustrySector: build.query<IResponseIndustrySector, { search: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'industry-sector/',
                method: 'GET',
                params
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
        getCompetence: build.query<IResponseGetCompetenceList, { search: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'competence/',
                method: 'GET',
                params
            })
        }),
        getCompetenceById: build.query<CompetenceById, { id: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : `competence/${params.id}/`,
                method: 'GET'
            })
        }),
        getContactType: build.query<IResponseGetContactList, { search: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'contact-type/',
                method: 'GET',
                params
            })
        }),
        getCountryList: build.query<IResponseGetCountryList, { search: string }>({
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
        getCityList: build.query<IResponseGetCityList, { search: string, country_id: string }>({
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
        getCitizenshipList: build.query<IResponseGetCitizenshipList, { search: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'citizenship/',
                method: 'GET',
                params
            })
        }),
        getPositionList: build.query<IResponseGetPositionList, { search: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'position/',
                method: 'GET',
                params
            })
        }),
        getEducationGraduate: build.query<IEducationResponse, { search: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'education-graduate/',
                method: 'GET',
                params
            })
        }),
        getEducationPlace: build.query<IEducationResponse, { search: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'education-place/',
                method: 'GET',
                params
            })
        }),
        getEducationSpeciality: build.query<IEducationResponse, { search: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'education-specialty/',
                method: 'GET',
                params
            })
        }),
        getTypeOfEmployment: build.query<IResponseGetTypeOfEmployment, { search: string } | undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'type-of-employment/',
                method: 'GET',
                params
            })
        })
    })
});
