/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = RequestRequirement;
export type NoName = number;
export type NoName1 = string;
/**
 * float
 */
export type NoName2 = number;
export type ID = number;
export type NoName3 = number;
export type NoName4 = string;
export type PositionId = number;
export type RequestId = number;
export type NoName5 = number;
export type TypeOfEmploymentId = number;
export type NoName6 = string;
export type WorkLocationCityId = number;

export interface RequestRequirement {
    count?: NoName;
    description?: NoName1;
    experience_years?: NoName2;
    id?: ID;
    max_price?: NoName3;
    name?: NoName4;
    position_id?: PositionId;
    request_id: RequestId;
    sorting?: NoName5;
    type_of_employment_id?: TypeOfEmploymentId;
    work_location_address?: NoName6;
    work_location_city_id?: WorkLocationCityId;
}
