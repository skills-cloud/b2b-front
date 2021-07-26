import { request } from '../request';
import { AxiosRequestConfig } from 'axios';

export interface ICompetence {
    value: string,
    label: string,
    showCheckbox?: boolean,
    children?: Array<ICompetence>
}

export interface IDictionaryItem {
    id: number,
    name: string
}

export interface IDictionary {
    results: Array<IDictionaryItem>
}

export const getCompetenceTree = (config?: AxiosRequestConfig) => {
    return request<Array<ICompetence>>({
        url: '/dictionary/competence-tree/',
        ...config
    });
};

export const getCitizenship = (config?: AxiosRequestConfig) => {
    return request<IDictionary>({
        url: '/dictionary/citizenship/',
        ...config
    });
};

export const getCity = (config?: AxiosRequestConfig) => {
    return request<IDictionary>({
        url: '/dictionary/city/',
        ...config
    });
};

export const getCountries = (config?: AxiosRequestConfig) => {
    return request<IDictionary>({
        url: '/dictionary/country/',
        ...config
    });
};
