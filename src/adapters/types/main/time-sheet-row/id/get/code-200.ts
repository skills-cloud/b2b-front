/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = TimeSheetRowRead;
export type NoName = string;
export type NoName1 = string;
export type CitizenshipId = number;
export type CityId = number;
export type CountryId = number;
export type NoName2 = 'all' | 'weekends' | 'workdays';
export type NoName3 = string;
export type NoName4 = 'F' | 'M';
export type ID = number;
export type NoName5 = boolean;
export type NoName6 = string;
export type NoName7 = string;
export type Photo = string;
export type NoName8 = number;
export type NoName9 = string;
export type NoName10 = string;
export type UserId = number;
export type NoName11 = number;
export type NoName12 = string;
export type NoName13 = string;
export type ID1 = number;
export type NoName14 = number;
export type NoName15 = string;
/**
 * float
 */
export type NoName16 = number;
export type ID2 = number;
export type NoName17 = number;
export type NoName18 = string;
export type PositionId = number;
export type RequestId = number;
export type NoName19 = number;
export type TypeOfEmploymentId = number;
export type NoName20 = string;
export type WorkLocationCityId = number;
export type NoName21 = number;
export type NoName22 = string;
export type NoName23 = string;
export type NoName24 = string;
export type NoName25 = number;

export interface TimeSheetRowRead {
    created_at?: NoName;
    cv: CvInlineShort;
    cv_id: NoName11;
    date_from?: NoName12;
    date_to?: NoName13;
    id?: ID1;
    request_requirement: RequestRequirementInline;
    request_requirement_id: NoName21;
    task_description?: NoName22;
    task_name: NoName23;
    updated_at?: NoName24;
    work_time: NoName25;
}
export interface CvInlineShort {
    birth_date?: NoName1;
    citizenship_id?: CitizenshipId;
    city_id?: CityId;
    country_id?: CountryId;
    days_to_contact?: null | NoName2;
    first_name?: NoName3;
    gender?: null | NoName4;
    id?: ID;
    is_resource_owner?: NoName5;
    last_name?: NoName6;
    middle_name?: NoName7;
    photo?: Photo;
    price?: NoName8;
    time_to_contact_from?: NoName9;
    time_to_contact_to?: NoName10;
    user_id?: UserId;
}
export interface RequestRequirementInline {
    count?: NoName14;
    description?: NoName15;
    experience_years?: NoName16;
    id?: ID2;
    max_price?: NoName17;
    name?: NoName18;
    position_id?: PositionId;
    request_id: RequestId;
    sorting?: NoName19;
    type_of_employment_id?: TypeOfEmploymentId;
    work_location_address?: NoName20;
    work_location_city_id?: WorkLocationCityId;
}
