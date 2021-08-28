/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = CvProjectRead;
export type NoName = string;
export type ID = number;
export type NoName1 = boolean;
export type NoName2 = string;
export type ParentId = string;
export type CvId = number;
export type NoName3 = string;
export type NoName4 = string;
export type NoName5 = string;
export type ID1 = number;
export type NoName6 = string;
export type ID2 = number;
export type NoName7 = boolean;
export type NoName8 = string;
export type IndustrySectorId = number;
export type NoName9 = boolean;
export type NoName10 = string;
export type NoName11 = string;
export type ID3 = number;
export type NoName12 = string;
export type OrganizationId = number;
export type NoName13 = string;
export type ID4 = number;
export type NoName14 = boolean;
export type NoName15 = string;
export type PositionId = number;

export interface CvProjectRead {
    competencies?: CompetenceInline[];
    competencies_ids?: number[];
    cv_id: CvId;
    date_from?: NoName3;
    date_to?: NoName4;
    description?: NoName5;
    id?: ID1;
    industry_sector?: IndustrySector;
    industry_sector_id?: IndustrySectorId;
    is_verified?: NoName9;
    name: NoName10;
    organization?: Organization;
    organization_id: OrganizationId;
    position?: Position;
    position_id: PositionId;
}
export interface CompetenceInline {
    description?: NoName;
    id?: ID;
    is_verified?: NoName1;
    name: NoName2;
    parent_id?: ParentId;
}
export interface IndustrySector {
    description?: NoName6;
    id?: ID2;
    is_verified?: NoName7;
    name: NoName8;
}
export interface Organization {
    description?: NoName11;
    id?: ID3;
    name: NoName12;
}
export interface Position {
    description?: NoName13;
    id?: ID4;
    is_verified?: NoName14;
    name: NoName15;
}
