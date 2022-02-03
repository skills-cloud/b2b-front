/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = OrganizationProject;
export type NoName = string;
export type NoName1 = string;
export type NoName2 = string;
export type NoName3 = string;
export type NoName4 = string;
export type ID = number;
export type NoName5 = number;
export type NoName6 = number;
export type NoName7 = number;
export type NoName8 = string;
export type NoName9 = number;
export type NoName10 = number;
export type NoName11 = string;
export type NoName12 = 'closed' | 'done' | 'draft' | 'in_progress';
export type NoName13 = string;

export interface OrganizationProject {
    created_at?: NoName;
    date_from?: NoName1;
    date_to?: NoName2;
    description?: NoName3;
    goals?: NoName4;
    id?: ID;
    industry_sector_id?: NoName5;
    manager_pfm_id?: NoName6;
    manager_pm_id?: NoName7;
    name: NoName8;
    organization_contractor_id: NoName9;
    organization_customer_id: NoName10;
    plan_description?: NoName11;
    status?: NoName12;
    updated_at?: NoName13;
}
