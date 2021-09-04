/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = CvPositionRead;
export type ID = number;
export type NoName = string;
export type ParentId = string;
export type CompetenceId = number;
export type CvPositionId = string;
export type Years = number;
export type CvId = number;
export type CvPositionId1 = string;
export type NoName1 = string;
export type FileExt = string;
export type NoName2 = string;
export type FileSize = string;
export type ID1 = number;
export type ID2 = number;
export type NoName3 = string;
export type ID3 = number;
export type NoName4 = boolean;
export type NoName5 = string;
export type PositionId = number;
export type NoName6 = string;
export type YearStarted = number;
export type Years1 = number;

export interface CvPositionRead {
    competencies?: CvPositionCompetenceRead[];
    competencies_ids?: number[];
    cv_id: CvId;
    files?: CvPositionFileRead[];
    id?: ID2;
    position?: Position;
    position_id?: PositionId;
    title?: NoName6;
    year_started?: YearStarted;
    years?: Years1;
}
export interface CvPositionCompetenceRead {
    competence?: Competence;
    competence_id: CompetenceId;
    cv_position_id?: CvPositionId;
    years?: Years;
}
export interface Competence {
    id?: ID;
    name: NoName;
    parent_id?: ParentId;
}
export interface CvPositionFileRead {
    cv_position_id?: CvPositionId1;
    file?: NoName1;
    file_ext?: FileExt;
    file_name?: NoName2;
    file_size?: FileSize;
    id?: ID1;
}
export interface Position {
    description?: NoName3;
    id?: ID3;
    is_verified?: NoName4;
    name: NoName5;
}
