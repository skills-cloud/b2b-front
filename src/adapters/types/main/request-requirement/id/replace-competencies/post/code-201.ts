/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code201 = RequestRequirementCompetence;
export type CompetenceId = number;
export type NoName = 1 | 100 | 3 | 5;
export type ID = number;
export type RequestRequirementId = string;
export type NoName1 = number;

export interface RequestRequirementCompetence {
    competence_id: CompetenceId;
    experience_years?: NoName;
    id?: ID;
    request_requirement_id?: RequestRequirementId;
    sorting?: NoName1;
}