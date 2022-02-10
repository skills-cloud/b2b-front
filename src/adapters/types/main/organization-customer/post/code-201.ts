/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code201 = OrganizationCustomer;
export type NoName = string;
export type EMail = string;
export type NoName1 = string;
export type NoName2 = string;
export type NoName3 = string;
export type NoName4 = string;
export type ID = number;
export type NoName5 = boolean;
export type NoName6 = boolean;
export type NoName7 = string;
export type NoName8 = string;
export type NoName9 = string;
export type NoName10 = string;

export interface OrganizationCustomer {
    contact_person?: NoName;
    contacts_email?: EMail;
    contacts_phone?: NoName1;
    created_at?: NoName2;
    current_user_roles?: ('admin' | 'pfm' | 'pm' | 'rm')[];
    description?: NoName3;
    general_manager_name?: NoName4;
    id?: ID;
    is_contractor?: NoName5;
    is_partner?: NoName6;
    legal_name?: NoName7;
    name: NoName8;
    short_name?: NoName9;
    updated_at?: NoName10;
}
