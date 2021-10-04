/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = CvCareerRead;
export type NoName = string;
export type ID = number;
export type NoName1 = boolean;
export type NoName2 = string;
export type ParentId = string;
export type CvId = number;
export type NoName3 = string;
export type NoName4 = string;
export type NoName5 = string;
export type CvCareerId = string;
export type NoName6 = string;
export type FileExt = string;
export type NoName7 = string;
export type FileSize = string;
export type ID1 = number;
export type ID2 = number;
export type NoName8 = boolean;
export type NoName9 = string;
export type ID3 = number;
export type NoName10 = boolean;
export type NoName11 = string;
export type OrganizationId = number;
export type NoName12 = string;
export type ID4 = number;
export type NoName13 = boolean;
export type NoName14 = string;
export type PositionId = number;
export type NoName15 = string;
export type NoName16 = string;
export type NoName17 = string;
export type NoName18 = string;
export type ID5 = number;
export type NoName19 = number;
export type NoName20 = number;
export type NoName21 = string;
export type NoName22 = number;
export type NoName23 = number;
export type NoName24 = number;
export type NoName25 = string;

export interface CvCareerRead {
    competencies?: CompetenceInline[];
    competencies_ids?: number[];
    cv_id: CvId;
    date_from?: NoName3;
    date_to?: NoName4;
    description?: NoName5;
    files?: CvCareerFileRead[];
    id?: ID2;
    is_verified?: NoName8;
    organization?: Organization;
    organization_id: OrganizationId;
    position?: Position;
    position_id?: PositionId;
    projects?: OrganizationProject[];
    projects_ids?: number[];
}
export interface CompetenceInline {
    description?: NoName;
    id?: ID;
    is_verified?: NoName1;
    name: NoName2;
    parent_id?: ParentId;
}
export interface CvCareerFileRead {
    cv_career_id?: CvCareerId;
    file?: NoName6;
    file_ext?: FileExt;
    file_name?: NoName7;
    file_size?: FileSize;
    id?: ID1;
}
export interface Organization {
    description?: NoName9;
    id?: ID3;
    is_customer?: NoName10;
    name: NoName11;
}
export interface Position {
    description?: NoName12;
    id?: ID4;
    is_verified?: NoName13;
    name: NoName14;
}
export interface OrganizationProject {
    created_at?: NoName15;
    date_from?: NoName16;
    date_to?: NoName17;
    description?: NoName18;
    id?: ID5;
    industry_sector_id?: NoName19;
    manager_id?: NoName20;
    name: NoName21;
    organization_id: NoName22;
    recruiters_ids?: NoName23[];
    resource_managers_ids?: NoName24[];
    updated_at?: NoName25;
}
