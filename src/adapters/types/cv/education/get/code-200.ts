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
export type CvId = number;
export type NoName3 = string;
export type NoName4 = string;
export type NoName5 = string;
export type NoName6 = string;
export type ID1 = number;
export type NoName7 = boolean;
export type NoName8 = string;
export type EducationGraduateId = number;
export type NoName9 = string;
export type ID2 = number;
export type NoName10 = boolean;
export type NoName11 = string;
export type EducationPlaceId = number;
export type NoName12 = string;
export type ID3 = number;
export type NoName13 = boolean;
export type NoName14 = string;
export type EducationSpecialityId = number;
export type ID4 = number;
export type NoName15 = boolean;

export interface CvEducationRead {
    competencies?: CompetenceInline[];
    competencies_ids?: number[];
    cv_id: CvId;
    date_from?: NoName3;
    date_to?: NoName4;
    description?: NoName5;
    education_graduate?: EducationGraduate;
    education_graduate_id: EducationGraduateId;
    education_place?: EducationPlace;
    education_place_id: EducationPlaceId;
    education_speciality?: EducationSpecialty;
    education_speciality_id: EducationSpecialityId;
    id?: ID4;
    is_verified?: NoName15;
}
export interface CompetenceInline {
    description?: NoName;
    id?: ID;
    is_verified?: NoName1;
    name: NoName2;
    parent_id?: ParentId;
}
export interface EducationGraduate {
    description?: NoName6;
    id?: ID1;
    is_verified?: NoName7;
    name: NoName8;
}
export interface EducationPlace {
    description?: NoName9;
    id?: ID2;
    is_verified?: NoName10;
    name: NoName11;
}
export interface EducationSpecialty {
    description?: NoName12;
    id?: ID3;
    is_verified?: NoName13;
    name: NoName14;
}
