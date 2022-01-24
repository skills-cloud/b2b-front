/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = OrganizationProjectRead;
export type NoName = string;
export type NoName1 = string;
export type NoName2 = string;
export type NoName3 = string;
export type NoName4 = string;
export type ID = number;
export type NoName5 = string;
export type ID1 = number;
export type NoName6 = boolean;
export type NoName7 = string;
export type NoName8 = number;
export type NoName9 = string;
export type NoName10 = string;
export type NoName11 = '-' | 'F' | 'M';
export type ID2 = number;
export type NoName12 = string;
export type NoName13 = string;
export type NoName14 = string;
export type Photo = string;
export type NoName15 = number;
export type NoName16 = number;
export type ModulesCount = number;
export type NoName17 = string;
export type NoName18 = string;
export type NoName19 = string;
export type ID3 = number;
export type NoName20 = boolean;
export type NoName21 = boolean;
export type NoName22 = string;
export type NoName23 = string;
export type NoName24 = number;
export type NoName25 = number;
export type NoName26 = string;
export type RequestsCountTotal = number;
export type RequestsRequirementsCountTotal = number;
export type NoName27 = string;

export interface OrganizationProjectRead {
    created_at?: NoName;
    current_user_roles?: ('admin' | 'pfm' | 'pm' | 'rm')[];
    date_from?: NoName1;
    date_to?: NoName2;
    description?: NoName3;
    goals?: NoName4;
    id?: ID;
    industry_sector?: IndustrySector;
    industry_sector_id?: NoName8;
    manager_pfm?: UserInline;
    manager_pfm_id?: NoName15;
    manager_pm?: UserInline;
    manager_pm_id?: NoName16;
    modules_count?: ModulesCount;
    name: NoName17;
    organization_contractor?: MainOrganization;
    organization_contractor_id: NoName24;
    organization_customer?: MainOrganization;
    organization_customer_id: NoName25;
    plan_description?: NoName26;
    requests_count_by_status?: RequestsCountByStatus;
    requests_count_total?: RequestsCountTotal;
    requests_requirements_count_by_status?: RequestsRequirementsCountByStatus;
    requests_requirements_count_total?: RequestsRequirementsCountTotal;
    updated_at?: NoName27;
}
export interface IndustrySector {
    description?: NoName5;
    id?: ID1;
    is_verified?: NoName6;
    name: NoName7;
}
export interface UserInline {
    birth_date?: NoName9;
    first_name?: NoName10;
    gender?: null | NoName11;
    id?: ID2;
    last_name?: NoName12;
    middle_name?: NoName13;
    phone?: NoName14;
    photo?: Photo;
}
export interface MainOrganization {
    created_at?: NoName18;
    current_user_roles?: ('admin' | 'pfm' | 'pm' | 'rm')[];
    description?: NoName19;
    id?: ID3;
    is_contractor?: NoName20;
    is_customer?: NoName21;
    name: NoName22;
    updated_at?: NoName23;
}
export interface RequestsCountByStatus {
    draft: number;
    in_progress: number;
    done: number;
    closed: number;
}
export interface RequestsRequirementsCountByStatus {
    draft: number;
    in_progress: number;
    done: number;
    closed: number;
}
