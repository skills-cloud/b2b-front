/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = CvEducation;
export type CvId = number;
export type NoName = string;
export type NoName1 = string;
export type NoName2 = string;
export type NoName3 = string;
export type EducationGraduateId = number;
export type EducationPlaceId = number;
export type EducationSpecialityId = number;
export type ID = number;
export type NoName4 = boolean;

export interface CvEducation {
    competencies_ids?: number[];
    cv_id: CvId;
    date_from?: NoName;
    date_to?: NoName1;
    description?: NoName2;
    diploma_number?: NoName3;
    education_graduate_id: EducationGraduateId;
    education_place_id: EducationPlaceId;
    education_speciality_id: EducationSpecialityId;
    id?: ID;
    is_verified?: NoName4;
}
