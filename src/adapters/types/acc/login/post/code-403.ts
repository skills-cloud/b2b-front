/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code403 = Status;
export type Details = string;
export type Status1 = 'error' | 'ok' | 'warning';

export interface Status {
    details?: Details;
    status: Status1;
}
