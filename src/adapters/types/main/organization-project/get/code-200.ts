/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = OrganizationProjectRead;
export type NoName = string;
export type NoName1 = string;
export type ID = number;
export type NoName2 = string;
export type NoName3 = string;
export type ID1 = number;
export type NoName4 = string;
export type OrganizationId = number;
export type NoName5 = string;

export interface OrganizationProjectRead {
    created_at?: NoName;
    description?: NoName1;
    id?: ID;
    name: NoName2;
    organization: Organization;
    organization_id: OrganizationId;
    updated_at?: NoName5;
}
export interface Organization {
    description?: NoName3;
    id?: ID1;
    name: NoName4;
}
