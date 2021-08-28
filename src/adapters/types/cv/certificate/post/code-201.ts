/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code201 = CvCertificate;
export type CvId = number;
export type NoName = null | string;
export type NoName1 = null | string;
export type EducationGraduateId = number;
export type EducationPlaceId = number;
export type EducationSpecialityId = number;
export type ID = number;
export type NoName2 = boolean;
export type NoName3 = null | string;
export type NoName4 = null | string;

export interface CvCertificate {
    competencies_ids?: (number | null)[];
    cv_id: CvId;
    date?: NoName;
    description?: NoName1;
    education_graduate_id: EducationGraduateId;
    education_place_id: EducationPlaceId;
    education_speciality_id: EducationSpecialityId;
    id?: ID;
    is_verified?: NoName2;
    name?: NoName3;
    number?: NoName4;
}
