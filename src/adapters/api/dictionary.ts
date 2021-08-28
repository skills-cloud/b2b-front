import { AxiosRequestConfig } from 'axios';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { request } from '../request';
import { ContactType } from 'adapter/types/dictionary/contact-type/get/code-200';
import { IndustrySector } from 'adapter/types/dictionary/industry-sector/get/code-200';

export interface ICompetence {
    id: string,
    name: string,
    children?: Array<ICompetence>
}

export interface IDictionaryItem {
    id: number,
    name: string
}

export interface IDictionary {
    results: Array<IDictionaryItem>
}

export interface IBasicResultInterface {
    id: number,
    name: string,
    sorting: string,
    description: string
}

export interface ICompetenceRequest {
    total: number,
    max_page_size: number,
    page_size: number,
    page_number: number,
    page_next: string,
    page_previous: string,
    results: Array<IBasicResultInterface>
}

export interface IGetPositionListQuery {
    count: number,
    next: string,
    previous: string,
    results: Array<IBasicResultInterface>
}

export const getCompetence = (config?: AxiosRequestConfig) => {
    return request<ICompetenceRequest>({
        url: '/api/dictionary/competence/',
        ...config
    });
};

export const getCitizenship = (config?: AxiosRequestConfig) => {
    return request<IDictionary>({
        url: '/api/dictionary/citizenship/',
        ...config
    });
};

export const getCity = (config?: AxiosRequestConfig) => {
    return request<IDictionary>({
        url: '/api/dictionary/city/',
        ...config
    });
};

export const getCountries = (config?: AxiosRequestConfig) => {
    return request<IDictionary>({
        url: '/api/dictionary/country/',
        ...config
    });
};

export const getContactsType = (config?: AxiosRequestConfig) => {
    return request<{ results: Array<ContactType> }>({
        url: '/api/dictionary/contact-type/',
        ...config
    });
};

export interface IEducationResult {
    id: number,
    name: string,
    sorting: number,
    description: string
}

export interface IEducationResponse {
    count: number,
    next: string,
    previous: string,
    results: Array<IEducationResult>
}

interface IIndustrySector {
    count: number,
    next: string,
    previous: string,
    results: Array<IndustrySector>
}

export interface IResultEmployment {
    id: number,
    name: string,
    sorting: number
}

export interface IResponseGetTypeOfEmployment {
    total: number,
    max_page_size: number,
    page_size: number,
    page_number: number,
    page_next: number,
    page_previous: number,
    results: Array<IResultEmployment>
}

export const dictionary = createApi({
    reducerPath: 'api/dictionary',
    tagTypes   : ['dictionary'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/dictionary'
    }),
    endpoints: (build) => ({
        getIndustrySector: build.query<IIndustrySector, { search: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'industry-sector/',
                method: 'GET',
                params
            })
        }),
        getCompetenceTree: build.query<Array<ICompetence>, undefined>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'competence-tree/',
                method: 'GET',
                params
            })
        }),
        getCompetence: build.query<ICompetenceRequest, { search: string }>({
            providesTags: ['dictionary'],
            query       : (params) => ({
                url   : 'competence/',
                method: 'GET',
                params
            })
        }),
        getPositionList: build.query<IGetPositionListQuery, { search: string }>({
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
