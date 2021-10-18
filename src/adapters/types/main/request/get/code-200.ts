/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = RequestRead;
export type NoName = string;
export type NoName1 = string;
export type ID = number;
export type NoName2 = string;
export type ID1 = number;
export type NoName3 = boolean;
export type NoName4 = string;
export type NoName5 = number;
export type NoName6 = number;
export type NoName7 = string;
export type NoName8 = string;
export type NoName9 = string;
export type NoName10 = string;
export type ID2 = number;
export type NoName11 = number;
export type NoName12 = string;
export type ID3 = number;
export type NoName13 = string;
export type Photo = string;
export type NoName14 = number;
export type NoName15 = string;
export type NoName16 = string;
export type ID4 = number;
export type NoName17 = boolean;
export type NoName18 = string;
export type NoName19 = number;
export type NoName20 = number;
export type RequestsCount = number;
export type NoName21 = number;
export type NoName22 = string;
export type NoName23 = number;
export type NoName24 = 10 | 20 | 30;
export type NoName25 = string;
export type NoName26 = string;
export type ID5 = number;
export type NoName27 = string;
export type NoName28 = string;
/**
 * На текущий момент не используется.<br>Надо задавать связку с проектом заказчика
 */
export type NoName29 = number;
export type NoName30 = number;
export type ID6 = number;
export type NoName31 = string;
export type ParentId = string;
export type CompetenceId = number;
/**
 * `1` : *Менее года*
 * `3` : *1 – 3 года*
 * `5` : *3 - 5 лет*
 * `100` : *Более 5 лет*
 */
export type NoName32 = 1 | 100 | 3 | 5;
export type ID7 = number;
export type RequestRequirementId = string;
export type NoName33 = number;
export type NoName34 = number;
export type NoName35 = string;
export type NoName36 = string;
export type CitizenshipId = number;
export type CityId = number;
export type CountryId = number;
export type NoName37 = 'all' | 'weekends' | 'workdays';
export type NoName38 = string;
export type NoName39 = 'F' | 'M';
export type ID8 = number;
export type NoName40 = boolean;
export type NoName41 = string;
export type NoName42 = string;
export type Photo1 = string;
export type NoName43 = number;
export type NoName44 = string;
export type NoName45 = string;
export type UserId = number;
export type CvId = string;
export type NoName46 = string;
export type NoName47 = string;
export type ID9 = number;
export type Date = string;
export type Id = number;
export type NoName48 = number;
export type RequestRequirementId1 = string;
export type NoName49 = 'canceled' | 'candidate' | 'pre-candidate' | 'worker';
export type NoName50 = string;
export type NoName51 = string;
export type NoName52 = string;
export type NoName53 = string;
/**
 * float
 */
export type NoName54 = number;
export type ID10 = number;
export type NoName55 = number;
export type NoName56 = string;
export type NoName57 = string;
export type ID11 = number;
export type NoName58 = boolean;
export type NoName59 = string;
export type PositionId = number;
export type RequestId = number;
export type NoName60 = number;
export type NoName61 = string;
export type ID12 = number;
export type NoName62 = boolean;
export type NoName63 = string;
export type TypeOfEmploymentId = number;
export type NoName64 = string;
export type NoName65 = string;
export type ID13 = number;
export type NoName66 = boolean;
export type NoName67 = string;
export type NoName68 = string;
export type ID14 = number;
export type NoName69 = boolean;
export type NoName70 = string;
export type WorkLocationCityId = number;
export type RequirementsCountSum = number;
export type NoName71 = number;
export type NoName72 = string;
export type NoName73 = 'closed' | 'done' | 'draft' | 'in_progress';
export type NoName74 = string;
export type ID15 = number;
export type NoName75 = string;
export type NoName76 = number;

export interface RequestRead {
    deadline_date?: NoName;
    description?: NoName1;
    id?: ID;
    industry_sector?: IndustrySector;
    industry_sector_id?: NoName5;
    manager_id?: NoName6;
    organization_project?: OrganizationProjectInline;
    organization_project_id: NoName23;
    priority?: NoName24;
    project?: ProjectInline;
    project_id?: NoName29;
    recruiter?: UserInline;
    recruiter_id?: NoName30;
    requirements?: RequestRequirementRead[];
    requirements_count_sum?: RequirementsCountSum;
    resource_manager?: UserInline;
    resource_manager_id?: NoName71;
    start_date?: NoName72;
    status?: NoName73;
    title?: NoName74;
    type?: RequestType;
    type_id?: NoName76;
}
export interface IndustrySector {
    description?: NoName2;
    id?: ID1;
    is_verified?: NoName3;
    name: NoName4;
}
export interface OrganizationProjectInline {
    created_at?: NoName7;
    date_from?: NoName8;
    date_to?: NoName9;
    description?: NoName10;
    id?: ID2;
    industry_sector?: IndustrySector;
    industry_sector_id?: NoName11;
    manager?: UserInline;
    manager_id?: NoName14;
    name: NoName15;
    organization?: Organization;
    organization_id: NoName19;
    recruiters?: UserInline[];
    recruiters_ids?: NoName20[];
    requests_count?: RequestsCount;
    resource_managers?: UserInline[];
    resource_managers_ids?: NoName21[];
    updated_at?: NoName22;
}
export interface UserInline {
    first_name: NoName12;
    id?: ID3;
    last_name: NoName13;
    photo?: Photo;
}
export interface Organization {
    description?: NoName16;
    id?: ID4;
    is_customer?: NoName17;
    name: NoName18;
}
export interface ProjectInline {
    created_at?: NoName25;
    description?: NoName26;
    id?: ID5;
    name: NoName27;
    recruiters?: UserInline[];
    recruiters_ids?: number[];
    resource_managers?: UserInline[];
    resource_managers_ids?: number[];
    updated_at?: NoName28;
}
export interface RequestRequirementRead {
    competencies?: RequestRequirementCompetenceRead[];
    count?: NoName34;
    cv_list?: RequestRequirementCvRead[];
    cv_list_ids?: string[];
    date_from?: NoName51;
    date_to?: NoName52;
    description?: NoName53;
    experience_years?: NoName54;
    id?: ID10;
    max_price?: NoName55;
    name?: NoName56;
    position?: Position;
    position_id?: PositionId;
    request_id: RequestId;
    sorting?: NoName60;
    type_of_employment?: TypeOfEmployment;
    type_of_employment_id?: TypeOfEmploymentId;
    work_location_address?: NoName64;
    work_location_city?: City;
    work_location_city_id?: WorkLocationCityId;
}
export interface RequestRequirementCompetenceRead {
    competence?: Competence;
    competence_id: CompetenceId;
    experience_years?: NoName32;
    id?: ID7;
    request_requirement_id?: RequestRequirementId;
    sorting?: NoName33;
}
export interface Competence {
    id?: ID6;
    name: NoName31;
    parent_id?: ParentId;
}
export interface RequestRequirementCvRead {
    created_at?: NoName35;
    cv?: CvInlineShort;
    cv_id?: CvId;
    date_from?: NoName46;
    date_to?: NoName47;
    id?: ID9;
    organization_project_card_items?: RequestRequirementCvOrganizationProjectCardItem[];
    rating?: NoName48;
    request_requirement_id?: RequestRequirementId1;
    status?: NoName49;
    updated_at?: NoName50;
}
export interface CvInlineShort {
    birth_date?: NoName36;
    citizenship_id?: CitizenshipId;
    city_id?: CityId;
    country_id?: CountryId;
    days_to_contact?: null | NoName37;
    first_name?: NoName38;
    gender?: null | NoName39;
    id?: ID8;
    is_resource_owner?: NoName40;
    last_name?: NoName41;
    middle_name?: NoName42;
    photo?: Photo1;
    price?: NoName43;
    time_to_contact_from?: NoName44;
    time_to_contact_to?: NoName45;
    user_id?: UserId;
}
export interface RequestRequirementCvOrganizationProjectCardItem {
    date?: Date;
    id: Id;
}
export interface Position {
    description?: NoName57;
    id?: ID11;
    is_verified?: NoName58;
    name: NoName59;
}
export interface TypeOfEmployment {
    description?: NoName61;
    id?: ID12;
    is_verified?: NoName62;
    name: NoName63;
}
export interface City {
    country: Country;
    description?: NoName68;
    id?: ID14;
    is_verified?: NoName69;
    name: NoName70;
}
export interface Country {
    description?: NoName65;
    id?: ID13;
    is_verified?: NoName66;
    name: NoName67;
}
export interface RequestType {
    id?: ID15;
    name: NoName75;
}
