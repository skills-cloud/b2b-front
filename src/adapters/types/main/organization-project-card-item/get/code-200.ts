/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = OrganizationProjectCardItemReadTree;
export type NoName = string;
export type ID = number;
export type NoName1 = string;
/**
 * необходимо задавать только для корневой карточки
 */
export type NoName2 = number;
export type NoName3 = number;
export type NoName4 = number;

export interface OrganizationProjectCardItemReadTree {
    children: OrganizationProjectCardItemReadTree[];
    description?: NoName;
    id?: ID;
    name: NoName1;
    organization_project_id?: NoName2;
    parent_id?: NoName3;
    positions_ids?: NoName4[];
}
