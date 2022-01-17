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
export type NoName3 = string;
export type NoName4 = '-' | 'F' | 'M';
export type ID = number;
/**
 * Отметьте, если пользователь должен считаться активным. Уберите эту отметку вместо удаления учётной записи.
 */
export type NoName5 = boolean;
/**
 * Отметьте, если пользователь может входить в административную часть сайта.
 */
export type NoName6 = boolean;
/**
 * Указывает, что пользователь имеет все права без явного их назначения.
 */
export type NoName7 = boolean;
export type NoName8 = string;
export type NoName9 = string;
export type NoName10 = string;
export type NoName11 = string;
export type Photo = string;

export interface WhoAmI {
    birth_date?: NoName;
    date_joined?: NoName1;
    email: NoName2;
    first_name?: NoName3;
    gender?: null | NoName4;
    id?: ID;
    is_active?: NoName5;
    is_staff?: NoName6;
    is_superuser?: NoName7;
    last_login?: NoName8;
    last_name?: NoName9;
    middle_name?: NoName10;
    phone?: NoName11;
    photo?: Photo;
    roles?: string[];
}
