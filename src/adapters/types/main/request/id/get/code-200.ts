/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = RequestRead;
export type NoName = string;
export type ID = number;
export type NoName1 = string;
export type CustomerId = number;
export type NoName2 = string;
export type NoName3 = string;
export type ID1 = number;
export type NoName4 = string;
export type ID2 = number;
export type NoName5 = boolean;
export type NoName6 = string;
export type IndustrySectorId = number;
export type NoName7 = 10 | 20 | 30;
export type NoName8 = string;
export type NoName9 = string;
export type ID3 = number;
export type NoName10 = string;
export type NoName11 = string;
export type ProjectId = number;
export type NoName12 = string;
export type ID4 = number;
export type NoName13 = string;
export type Photo = string;
export type RecruiterId = number;
export type ID5 = number;
export type NoName14 = string;
export type ParentId = string;
export type CompetenceId = number;
export type NoName15 = 1 | 100 | 3 | 5;
export type ID6 = number;
export type RequestRequirementId = string;
export type NoName16 = number;
export type NoName17 = number;
export type NoName18 = string;
/**
 * float
 */
export type NoName19 = number;
export type ID7 = number;
export type NoName20 = number;
export type NoName21 = string;
export type NoName22 = string;
export type ID8 = number;
export type NoName23 = boolean;
export type NoName24 = string;
export type PositionId = number;
export type RequestId = number;
export type NoName25 = number;
export type NoName26 = string;
export type ID9 = number;
export type NoName27 = boolean;
export type NoName28 = string;
export type TypeOfEmploymentId = number;
export type NoName29 = string;
export type NoName30 = string;
export type ID10 = number;
export type NoName31 = boolean;
export type NoName32 = string;
export type NoName33 = string;
export type ID11 = number;
export type NoName34 = boolean;
export type NoName35 = string;
export type WorkLocationCityId = number;
export type RequirementsCountSum = number;
export type ResourceManagerId = number;
export type NoName36 = string;
export type NoName37 = 'closed' | 'done' | 'draft' | 'in_progress';
export type ID12 = number;
export type NoName38 = string;
export type TypeId = number;

export interface RequestRead {
    customer?: Organization;
    customer_id: CustomerId;
    deadline_date?: NoName2;
    description?: NoName3;
    id?: ID1;
    industry_sector?: IndustrySector;
    industry_sector_id?: IndustrySectorId;
    priority?: NoName7;
    project?: Project;
    project_id?: ProjectId;
    recruiter?: UserInline;
    recruiter_id?: RecruiterId;
    requirements?: RequestRequirementRead[];
    requirements_count_sum?: RequirementsCountSum;
    resource_manager?: UserInline;
    resource_manager_id?: ResourceManagerId;
    start_date?: NoName36;
    status?: NoName37;
    type?: RequestType;
    type_id?: TypeId;
}
export interface Organization {
    description?: NoName;
    id?: ID;
    name: NoName1;
}
export interface IndustrySector {
    description?: NoName4;
    id?: ID2;
    is_verified?: NoName5;
    name: NoName6;
}
export interface Project {
    created_at?: NoName8;
    description?: NoName9;
    id?: ID3;
    name: NoName10;
    recruiters_ids?: number[];
    resource_managers_ids?: number[];
    updated_at?: NoName11;
}
export interface UserInline {
    first_name: NoName12;
    id?: ID4;
    last_name: NoName13;
    photo?: Photo;
}
export interface RequestRequirementRead {
    competencies?: RequestRequirementCompetenceRead[];
    count?: NoName17;
    description?: NoName18;
    experience_years?: NoName19;
    id?: ID7;
    max_price?: NoName20;
    name?: NoName21;
    position?: Position;
    position_id?: PositionId;
    request_id: RequestId;
    sorting?: NoName25;
    type_of_employment?: TypeOfEmployment;
    type_of_employment_id?: TypeOfEmploymentId;
    work_location_address?: NoName29;
    work_location_city?: City;
    work_location_city_id?: WorkLocationCityId;
}
export interface RequestRequirementCompetenceRead {
    competence?: Competence;
    competence_id: CompetenceId;
    experience_years?: NoName15;
    id?: ID6;
    request_requirement_id?: RequestRequirementId;
    sorting?: NoName16;
}
export interface Competence {
    id?: ID5;
    name: NoName14;
    parent_id?: ParentId;
}
export interface Position {
    description?: NoName22;
    id?: ID8;
    is_verified?: NoName23;
    name: NoName24;
}
export interface TypeOfEmployment {
    description?: NoName26;
    id?: ID9;
    is_verified?: NoName27;
    name: NoName28;
}
export interface City {
    country: Country;
    description?: NoName33;
    id?: ID11;
    is_verified?: NoName34;
    name: NoName35;
}
export interface Country {
    description?: NoName30;
    id?: ID10;
    is_verified?: NoName31;
    name: NoName32;
}
export interface RequestType {
    id?: ID12;
    name: NoName38;
}
