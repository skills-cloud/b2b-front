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
export type NoName10 = string;
export type ID1 = number;
export type NoName11 = boolean;
export type NoName12 = string;
export type NoName13 = number;
export type NoName15 = string;
export type ID2 = number;
export type NoName16 = boolean;
export type NoName17 = string;
export type NoName18 = number;
export type NoName20 = string;
export type ID3 = number;
export type NoName21 = boolean;
export type NoName22 = string;
export type NoName23 = number;
export type ID4 = number;
export type NoName24 = boolean;

export interface CvEducationRead {
    competencies?: CompetenceInline[];
    competencies_ids?: NoName3[];
    cv_id: NoName4;
    date_from?: NoName5;
    date_to?: NoName6;
    description?: NoName7;
    diploma_number?: NoName8;
    education_graduate?: EducationGraduate;
    education_graduate_id: NoName13;
    education_place?: EducationPlace;
    education_place_id: NoName18;
    education_speciality?: EducationSpecialty;
    education_speciality_id: NoName23;
    id?: ID4;
    is_verified?: NoName24;
}
export interface CompetenceInline {
    description?: NoName;
    id?: ID;
    is_verified?: NoName1;
    name: NoName2;
    parent_id?: ParentId;
}
export interface EducationGraduate {
    attributes?: NoName9;
    description?: NoName10;
    id?: ID1;
    is_verified?: NoName11;
    name: NoName12;
}
/**
 * если вы не до конца понимаете назначение этого поля, вам лучше избежать редактирования
 */
export interface NoName9 {}
export interface EducationPlace {
    attributes?: NoName14;
    description?: NoName15;
    id?: ID2;
    is_verified?: NoName16;
    name: NoName17;
}
/**
 * если вы не до конца понимаете назначение этого поля, вам лучше избежать редактирования
 */
export interface NoName14 {}
export interface EducationSpecialty {
    attributes?: NoName19;
    description?: NoName20;
    id?: ID3;
    is_verified?: NoName21;
    name: NoName22;
}
/**
 * если вы не до конца понимаете назначение этого поля, вам лучше избежать редактирования
 */
export interface NoName19 {}
