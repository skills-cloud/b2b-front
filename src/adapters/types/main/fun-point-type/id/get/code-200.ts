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
export type NoName10 = string;
export type ID2 = number;
export type NoName11 = boolean;
export type NoName12 = boolean;
export type NoName13 = string;
export type NoName14 = string;
export type NoName15 = number;
export type NoName16 = string;
export type NoName17 = number;
/**
 * в часах
 */
export type NoName18 = number;
export type ID3 = number;
export type NoName19 = string;
export type ID4 = number;
export type NoName20 = boolean;
export type NoName21 = string;
export type NoName22 = number;
export type NoName23 = number;
export type NoName24 = string;
export type NoName25 = string;

export interface FunPointTypeRead {
    created_at?: NoName;
    description?: NoName1;
    difficulty_levels?: FunPointTypeDifficultyLevelInline[];
    id?: ID1;
    name: NoName8;
    organization_customer?: MainOrganization;
    organization_customer_id?: NoName15;
    positions_labor_estimates?: FunPointTypePositionLaborEstimateInline[];
    updated_at?: NoName25;
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
    created_at?: NoName9;
    description?: NoName10;
    id?: ID2;
    is_contractor?: NoName11;
    is_customer?: NoName12;
    name: NoName13;
    updated_at?: NoName14;
}
export interface FunPointTypePositionLaborEstimateInline {
    created_at?: NoName16;
    fun_point_type_id: NoName17;
    hours?: NoName18;
    id?: ID3;
    position?: Position;
    position_id: NoName22;
    sorting?: NoName23;
    updated_at?: NoName24;
}
export interface Position {
    description?: NoName19;
    id?: ID4;
    is_verified?: NoName20;
    name: NoName21;
}
