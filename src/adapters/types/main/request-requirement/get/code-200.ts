/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = RequestRequirementRead;
export type ID = number;
export type NoName = string;
export type ParentId = string;
export type CompetenceId = number;
/**
 * `1` : *Менее года*
 * `3` : *1 – 3 года*
 * `5` : *3 - 5 лет*
 * `100` : *Более 5 лет*
 */
export type NoName1 = 1 | 100 | 3 | 5;
export type ID1 = number;
export type RequestRequirementId = string;
export type NoName2 = number;
export type NoName3 = number;
export type NoName4 = string;
export type NoName5 = string;
export type CitizenshipId = number;
export type CityId = number;
export type CountryId = number;
export type NoName6 = 'all' | 'weekends' | 'workdays';
export type NoName7 = string;
export type NoName8 = 'F' | 'M';
export type ID2 = number;
export type NoName9 = boolean;
export type NoName10 = string;
export type NoName11 = string;
export type Photo = string;
export type NoName12 = number;
export type NoName13 = string;
export type NoName14 = string;
export type UserId = number;
export type CvId = string;
export type NoName15 = string;
export type NoName16 = string;
export type ID3 = number;
export type RequestRequirementId1 = string;
export type NoName17 = 'canceled' | 'candidate' | 'pre-candidate' | 'worker';
export type NoName18 = string;
export type NoName19 = string;
export type NoName20 = string;
export type NoName21 = string;
/**
 * float
 */
export type NoName22 = number;
export type ID4 = number;
export type NoName23 = number;
export type NoName24 = string;
export type NoName25 = string;
export type ID5 = number;
export type NoName26 = boolean;
export type NoName27 = string;
export type PositionId = number;
export type RequestId = number;
export type NoName28 = number;
export type NoName29 = string;
export type ID6 = number;
export type NoName30 = boolean;
export type NoName31 = string;
export type TypeOfEmploymentId = number;
export type NoName32 = string;
export type NoName33 = string;
export type ID7 = number;
export type NoName34 = boolean;
export type NoName35 = string;
export type NoName36 = string;
export type ID8 = number;
export type NoName37 = boolean;
export type NoName38 = string;
export type WorkLocationCityId = number;

export interface RequestRequirementRead {
    competencies?: RequestRequirementCompetenceRead[];
    count?: NoName3;
    cv_list?: RequestRequirementCvRead[];
    cv_list_ids?: string[];
    date_from?: NoName19;
    date_to?: NoName20;
    description?: NoName21;
    experience_years?: NoName22;
    id?: ID4;
    max_price?: NoName23;
    name?: NoName24;
    position?: Position;
    position_id?: PositionId;
    request_id: RequestId;
    sorting?: NoName28;
    type_of_employment?: TypeOfEmployment;
    type_of_employment_id?: TypeOfEmploymentId;
    work_location_address?: NoName32;
    work_location_city?: City;
    work_location_city_id?: WorkLocationCityId;
}
export interface RequestRequirementCompetenceRead {
    competence?: Competence;
    competence_id: CompetenceId;
    experience_years?: NoName1;
    id?: ID1;
    request_requirement_id?: RequestRequirementId;
    sorting?: NoName2;
}
export interface Competence {
    id?: ID;
    name: NoName;
    parent_id?: ParentId;
}
export interface RequestRequirementCvRead {
    created_at?: NoName4;
    cv?: CvInlineShort;
    cv_id?: CvId;
    date_from?: NoName15;
    date_to?: NoName16;
    id?: ID3;
    organization_project_card_items_ids?: number[];
    request_requirement_id?: RequestRequirementId1;
    status?: NoName17;
    updated_at?: NoName18;
}
export interface CvInlineShort {
    birth_date?: NoName5;
    citizenship_id?: CitizenshipId;
    city_id?: CityId;
    country_id?: CountryId;
    days_to_contact?: null | NoName6;
    first_name?: NoName7;
    gender?: null | NoName8;
    id?: ID2;
    is_resource_owner?: NoName9;
    last_name?: NoName10;
    middle_name?: NoName11;
    photo?: Photo;
    price?: NoName12;
    time_to_contact_from?: NoName13;
    time_to_contact_to?: NoName14;
    user_id?: UserId;
}
export interface Position {
    description?: NoName25;
    id?: ID5;
    is_verified?: NoName26;
    name: NoName27;
}
export interface TypeOfEmployment {
    description?: NoName29;
    id?: ID6;
    is_verified?: NoName30;
    name: NoName31;
}
export interface City {
    country: Country;
    description?: NoName36;
    id?: ID8;
    is_verified?: NoName37;
    name: NoName38;
}
export interface Country {
    description?: NoName33;
    id?: ID7;
    is_verified?: NoName34;
    name: NoName35;
}
