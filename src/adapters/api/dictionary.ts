import { request } from '../request';
import { AxiosRequestConfig } from 'axios';

export interface ICompetence {
    value: string,
    label: string,
    showCheckbox?: boolean,
    children?: Array<ICompetence>
}

export const getCompetenceTree = (config?: AxiosRequestConfig) => {
    return request<Array<ICompetence>>({
        url: '/dictionary/competence-tree/',
        ...config
    });
};
