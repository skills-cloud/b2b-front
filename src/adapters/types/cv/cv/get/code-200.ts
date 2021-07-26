/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = CvList;
export type NoName = string;
export type CitizenshipId = number;
export type CityId = number;
export type CountryId = number;
export type NoName1 = string;
export type NoName2 = 'F' | 'М';
export type NoName3 = boolean;
export type NoName4 = boolean;
export type NoName5 = string;
export type NoName6 = string;
export type Photo = string;
export type UserId = number;

export interface CvList {
    birth_date?: NoName;
    citizenship_id?: CitizenshipId;
    city_id?: CityId;
    country_id?: CountryId;
    first_name?: NoName1;
    gender?: NoName2;
    is_resource_owner?: NoName3;
    is_with_disabilities?: NoName4;
    last_name?: NoName5;
    middle_name?: NoName6;
    photo?: Photo;
    user_id?: UserId;
}