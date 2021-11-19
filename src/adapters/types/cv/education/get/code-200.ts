/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = CvEducationRead;
export type NoName = string;
export type ID = number;
export type NoName1 = boolean;
export type NoName2 = string;
export type ParentId = string;
export type NoName3 = number;
export type NoName4 = number;
export type NoName5 = string;
export type NoName6 = string;
export type NoName7 = string;
export type NoName8 = string;
export type NoName9 = string;
export type ID1 = number;
export type NoName10 = boolean;
export type NoName11 = string;
export type NoName12 = number;
export type NoName13 = string;
export type ID2 = number;
export type NoName14 = boolean;
export type NoName15 = string;
export type NoName16 = number;
export type NoName17 = string;
export type ID3 = number;
export type NoName18 = boolean;
export type NoName19 = string;
export type NoName20 = number;
export type ID4 = number;
export type NoName21 = boolean;

export interface CvEducationRead {
    competencies?: CompetenceInline[];
    competencies_ids?: NoName3[];
    cv_id: NoName4;
    date_from?: NoName5;
    date_to?: NoName6;
    description?: NoName7;
    diploma_number?: NoName8;
    education_graduate?: EducationGraduate;
    education_graduate_id: NoName12;
    education_place?: EducationPlace;
    education_place_id: NoName16;
    education_speciality?: EducationSpecialty;
    education_speciality_id: NoName20;
    id?: ID4;
    is_verified?: NoName21;
}
export interface CompetenceInline {
    description?: NoName;
    id?: ID;
    is_verified?: NoName1;
    name: NoName2;
    parent_id?: ParentId;
}
export interface EducationGraduate {
    description?: NoName9;
    id?: ID1;
    is_verified?: NoName10;
    name: NoName11;
}
export interface EducationPlace {
    description?: NoName13;
    id?: ID2;
    is_verified?: NoName14;
    name: NoName15;
}
export interface EducationSpecialty {
    description?: NoName17;
    id?: ID3;
    is_verified?: NoName18;
    name: NoName19;
}
