/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = WhoAmI;
export type NoName = string;
export type NoName1 = string;
export type NoName2 = string;
export type ID = number;
/**
 * Отметьте, если пользователь должен считаться активным. Уберите эту отметку вместо удаления учётной записи.
 */
export type NoName3 = boolean;
/**
 * Отметьте, если пользователь может входить в административную часть сайта.
 */
export type NoName4 = boolean;
/**
 * Указывает, что пользователь имеет все права без явного их назначения.
 */
export type NoName5 = boolean;
export type NoName6 = string;
export type NoName7 = string;
export type Photo = string;

export interface WhoAmI {
    date_joined?: NoName;
    email: NoName1;
    first_name: NoName2;
    id?: ID;
    is_active?: NoName3;
    is_staff?: NoName4;
    is_superuser?: NoName5;
    last_login?: NoName6;
    last_name: NoName7;
    photo?: Photo;
}
