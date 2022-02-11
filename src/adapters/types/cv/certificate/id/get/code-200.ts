/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = CvCertificateRead;
export type NoName = string;
export type ID = number;
export type NoName1 = boolean;
export type NoName2 = string;
export type ParentId = string;
export type NoName3 = number;
export type NoName4 = number;
export type NoName5 = string;
export type NoName6 = string;
export type NoName8 = string;
export type ID1 = number;
export type NoName9 = boolean;
export type NoName10 = string;
export type NoName11 = number;
export type NoName13 = string;
export type ID2 = number;
export type NoName14 = boolean;
export type NoName15 = string;
export type NoName16 = number;
export type NoName18 = string;
export type ID3 = number;
export type NoName19 = boolean;
export type NoName20 = string;
export type NoName21 = number;
export type ID4 = number;
export type NoName22 = boolean;
export type NoName23 = string;
export type NoName24 = string;

export interface CvCertificateRead {
    competencies?: CompetenceInline[];
    competencies_ids?: NoName3[];
    cv_id: NoName4;
    date?: NoName5;
    description?: NoName6;
    education_graduate?: EducationGraduate;
    education_graduate_id: NoName11;
    education_place?: EducationPlace;
    education_place_id: NoName16;
    education_speciality?: EducationSpecialty;
    education_speciality_id: NoName21;
    id?: ID4;
    is_verified?: NoName22;
    name?: NoName23;
    number?: NoName24;
}
export interface CompetenceInline {
    description?: NoName;
    id?: ID;
    is_verified?: NoName1;
    name: NoName2;
    parent_id?: ParentId;
}
export interface EducationGraduate {
    attributes?: NoName7;
    description?: NoName8;
    id?: ID1;
    is_verified?: NoName9;
    name: NoName10;
}
/**
 * если вы не до конца понимаете назначение этого поля, вам лучше избежать редактирования
 */
export interface NoName7 {}
export interface EducationPlace {
    attributes?: NoName12;
    description?: NoName13;
    id?: ID2;
    is_verified?: NoName14;
    name: NoName15;
}
/**
 * если вы не до конца понимаете назначение этого поля, вам лучше избежать редактирования
 */
export interface NoName12 {}
export interface EducationSpecialty {
    attributes?: NoName17;
    description?: NoName18;
    id?: ID3;
    is_verified?: NoName19;
    name: NoName20;
}
/**
 * если вы не до конца понимаете назначение этого поля, вам лучше избежать редактирования
 */
export interface NoName17 {}
