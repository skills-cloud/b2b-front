/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code201 = CvEducation;
export type NoName = number;
export type NoName1 = number;
export type NoName2 = string;
export type NoName3 = string;
export type NoName4 = string;
export type NoName5 = string;
export type NoName6 = number;
export type NoName7 = number;
export type NoName8 = number;
export type ID = number;
export type NoName9 = boolean;

export interface CvEducation {
    competencies_ids?: NoName[];
    cv_id: NoName1;
    date_from?: NoName2;
    date_to?: NoName3;
    description?: NoName4;
    diploma_number?: NoName5;
    education_graduate_id: NoName6;
    education_place_id: NoName7;
    education_speciality_id: NoName8;
    id?: ID;
    is_verified?: NoName9;
}
