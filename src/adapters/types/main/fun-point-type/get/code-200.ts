/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = FunPointTypeRead;
export type NoName = string;
export type NoName1 = string;
export type NoName2 = string;
export type NoName3 = number;
export type NoName4 = number;
export type ID = number;
export type NoName5 = string;
export type NoName6 = number;
export type NoName7 = string;
export type ID1 = number;
export type NoName8 = string;
export type NoName9 = string;
export type EMail = string;
export type NoName10 = string;
export type NoName11 = string;
export type NoName12 = string;
export type NoName13 = string;
export type ID2 = number;
export type NoName14 = boolean;
export type NoName15 = boolean;
export type NoName16 = boolean;
export type NoName17 = string;
export type NoName18 = string;
export type NoName19 = string;
export type NoName20 = string;
export type NoName21 = number;
export type NoName22 = string;
export type NoName23 = number;
/**
 * в часах
 */
export type NoName24 = number;
export type ID3 = number;
export type NoName25 = string;
export type ID4 = number;
export type NoName26 = boolean;
export type NoName27 = string;
export type NoName28 = number;
export type NoName29 = number;
export type NoName30 = string;
export type NoName31 = string;

export interface FunPointTypeRead {
    created_at?: NoName;
    description?: NoName1;
    difficulty_levels?: FunPointTypeDifficultyLevelInline[];
    id?: ID1;
    name: NoName8;
    organization_customer?: MainOrganization;
    organization_customer_id?: NoName21;
    positions_labor_estimates?: FunPointTypePositionLaborEstimateInline[];
    updated_at?: NoName31;
}
export interface FunPointTypeDifficultyLevelInline {
    created_at?: NoName2;
    factor?: NoName3;
    fun_point_type_id: NoName4;
    id?: ID;
    name: NoName5;
    sorting?: NoName6;
    updated_at?: NoName7;
}
export interface MainOrganization {
    contact_person?: NoName9;
    contacts_email?: EMail;
    contacts_phone?: NoName10;
    created_at?: NoName11;
    current_user_roles?: ('admin' | 'pfm' | 'pm' | 'rm')[];
    description?: NoName12;
    general_manager_name?: NoName13;
    id?: ID2;
    is_contractor?: NoName14;
    is_customer?: NoName15;
    is_partner?: NoName16;
    legal_name?: NoName17;
    name: NoName18;
    short_name?: NoName19;
    updated_at?: NoName20;
}
export interface FunPointTypePositionLaborEstimateInline {
    created_at?: NoName22;
    fun_point_type_id: NoName23;
    hours?: NoName24;
    id?: ID3;
    position?: Position;
    position_id: NoName28;
    sorting?: NoName29;
    updated_at?: NoName30;
}
export interface Position {
    description?: NoName25;
    id?: ID4;
    is_verified?: NoName26;
    name: NoName27;
}
