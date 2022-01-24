/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = UserManage;
export type NoName = string;
export type Email = string;
export type NoName1 = string;
export type NoName2 = '-' | 'F' | 'M';
export type ID = number;
/**
 * Отметьте, если пользователь должен считаться активным. Уберите эту отметку вместо удаления учётной записи.
 */
export type NoName3 = boolean;
export type NoName4 = string;
export type NoName5 = string;
export type NoName6 = number;
export type OrganizationContractorName = string;
export type NoName7 = 'admin' | 'pfm' | 'pm' | 'rm';
export type Password = string;
export type NoName8 = string;

export interface UserManage {
    birth_date?: NoName;
    email?: Email;
    first_name?: NoName1;
    gender?: null | NoName2;
    id?: ID;
    is_active?: NoName3;
    last_name?: NoName4;
    middle_name?: NoName5;
    organization_contractors_roles?: UserOrganizationContractorRole[];
    password?: Password;
    phone?: NoName8;
}
export interface UserOrganizationContractorRole {
    organization_contractor_id: NoName6;
    organization_contractor_name?: OrganizationContractorName;
    role: NoName7;
}
