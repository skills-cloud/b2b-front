/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code201 = Request;
export type NoName = string;
export type NoName1 = string;
export type ID = number;
export type NoName2 = number;
export type NoName3 = number;
export type NoName4 = number;
export type NoName5 = 10 | 20 | 30;
/**
 * На текущий момент не используется.<br>Надо задавать связку с проектом заказчика
 */
export type NoName6 = number;
export type NoName7 = number;
export type NoName8 = number;
export type NoName9 = string;
export type NoName10 = 'closed' | 'done' | 'draft' | 'in_progress';
export type NoName11 = string;
export type NoName12 = number;

export interface Request {
    deadline_date?: NoName;
    description?: NoName1;
    id?: ID;
    industry_sector_id?: NoName2;
    manager_id?: NoName3;
    organization_project_id: NoName4;
    priority?: NoName5;
    project_id?: NoName6;
    recruiter_id?: NoName7;
    resource_manager_id?: NoName8;
    start_date?: NoName9;
    status?: NoName10;
    title?: NoName11;
    type_id?: NoName12;
}
