/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code201 = MainOrganization;
export type NoName = string;
export type NoName1 = string;
export type ID = number;
export type NoName2 = boolean;
export type NoName3 = boolean;
export type NoName4 = string;
export type NoName5 = string;

export interface MainOrganization {
    created_at?: NoName;
    current_user_roles?: ('admin' | 'pfm' | 'pm' | 'rm')[];
    description?: NoName1;
    id?: ID;
    is_contractor?: NoName2;
    is_customer?: NoName3;
    name: NoName4;
    updated_at?: NoName5;
}
