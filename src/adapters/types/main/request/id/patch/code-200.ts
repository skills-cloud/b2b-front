/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = Request;
export type CustomerId = number;
export type NoName = string;
export type NoName1 = string;
export type ID = number;
export type IndustrySectorId = number;
export type NoName2 = 10 | 20 | 30;
export type ProjectId = number;
export type RecruiterId = number;
export type ResourceManagerId = number;
export type NoName3 = string;
export type NoName4 = 'closed' | 'done' | 'draft' | 'in_progress';
export type TypeId = number;

export interface Request {
    customer_id: CustomerId;
    deadline_date?: NoName;
    description?: NoName1;
    id?: ID;
    industry_sector_id?: IndustrySectorId;
    priority?: NoName2;
    project_id?: ProjectId;
    recruiter_id?: RecruiterId;
    resource_manager_id?: ResourceManagerId;
    start_date?: NoName3;
    status?: NoName4;
    type_id?: TypeId;
}