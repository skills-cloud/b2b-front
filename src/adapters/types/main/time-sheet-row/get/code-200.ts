/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = TimeSheetRowRead;
export type NoName = string;
export type NoName1 = string;
export type NoName2 = number;
export type NoName3 = number;
export type NoName4 = number;
export type NoName5 = 'all' | 'weekends' | 'workdays';
export type NoName6 = string;
export type NoName7 = 'F' | 'M';
export type ID = number;
export type NoName8 = string;
export type NoName9 = number;
export type NoName10 = string;
export type NoName11 = number;
export type Photo = string;
export type NoName12 = number;
export type NoName13 = string;
export type NoName14 = string;
export type NoName15 = number;
export type NoName16 = number;
export type NoName17 = string;
export type NoName18 = string;
export type ID1 = number;
export type NoName19 = string;
export type NoName20 = string;
export type ID2 = number;
export type NoName21 = number;
export type NoName22 = string;
export type NoName23 = string;
export type NoName24 = '-' | 'F' | 'M';
export type ID3 = number;
export type NoName25 = string;
export type NoName26 = string;
export type NoName27 = string;
export type Photo1 = string;
export type NoName28 = number;
export type NoName29 = string;
export type NoName30 = string;
export type NoName31 = string;
export type DifficultyFactor = number;
export type NoName32 = string;
export type NoName33 = string;
export type NoName34 = string;
export type NoName35 = number;
export type NoName36 = number;
export type ID4 = number;
export type NoName37 = string;
export type NoName38 = number;
export type NoName39 = string;
export type NoName40 = number;
export type NoName41 = string;
export type NoName42 = string;
export type ID5 = number;
export type NoName43 = string;
export type NoName44 = string;
export type EMail = string;
export type NoName45 = string;
export type NoName46 = string;
export type NoName47 = string;
export type NoName48 = string;
export type ID6 = number;
export type NoName49 = boolean;
export type NoName50 = boolean;
export type NoName51 = boolean;
export type NoName52 = string;
export type NoName53 = string;
export type NoName54 = string;
export type NoName55 = string;
export type NoName56 = number;
export type NoName57 = string;
export type NoName58 = number;
/**
 * в часах
 */
export type NoName59 = number;
export type ID7 = number;
export type NoName61 = string;
export type ID8 = number;
export type NoName62 = boolean;
export type NoName63 = string;
export type NoName64 = number;
export type NoName65 = number;
export type NoName66 = string;
export type NoName67 = string;
export type NoName68 = number;
export type ID9 = number;
export type NoName69 = number;
export type NoName70 = string;
export type NoName71 = number;
export type NoName72 = string;
export type NoName73 = string;
export type ID10 = number;
export type NoName74 = string;
export type NoName75 = string;
export type NoName76 = string;
export type NoName77 = string;
export type NoName78 = string;
export type NoName79 = string;
export type ID11 = number;
export type NoName81 = string;
export type ID12 = number;
export type NoName82 = boolean;
export type NoName83 = string;
export type NoName84 = number;
export type NoName85 = number;
export type NoName86 = number;
export type NoName87 = string;
export type NoName88 = number;
export type NoName89 = number;
export type NoName90 = string;
export type RequestsRequirementsCountTotal = number;
export type NoName91 = 'closed' | 'done' | 'draft' | 'in_progress';
export type NoName92 = string;
export type NoName93 = number;
export type NoName94 = number;
export type NoName95 = string;
export type NoName96 = number;
export type ID13 = number;
export type NoName97 = number;
export type NoName98 = number;
export type NoName99 = number;
export type NoName100 = string;
export type NoName101 = number;
export type NoName102 = string;
export type NoName103 = string;
/**
 * если пусто, заполнится автоматически из расчета пятидневной рабочей недели<br>ПН-ПТ deadline_date-start_date
 */
export type NoName104 = number;
export type NoName105 = number;
export type NoName106 = number;
export type NoName107 = 10 | 20 | 30;
export type NoName108 = string;
export type NoName109 = 'closed' | 'done' | 'draft' | 'in_progress';
export type NoName110 = string;
export type NoName111 = number;
export type NoName112 = number;
export type NoName113 = string;
export type NoName114 = string;
export type NoName115 = string;
export type NoName116 = number;

export interface TimeSheetRowRead {
    created_at?: NoName;
    cv: CvInlineShort;
    cv_id: NoName16;
    date_from?: NoName17;
    date_to?: NoName18;
    id?: ID1;
    request: RequestInline;
    request_id: NoName112;
    task_description?: NoName113;
    task_name: NoName114;
    updated_at?: NoName115;
    work_time: NoName116;
}
export interface CvInlineShort {
    birth_date?: NoName1;
    citizenship_id?: NoName2;
    city_id?: NoName3;
    country_id?: NoName4;
    days_to_contact?: null | NoName5;
    first_name?: NoName6;
    gender?: null | NoName7;
    id?: ID;
    last_name?: NoName8;
    manager_rm_id?: NoName9;
    middle_name?: NoName10;
    organization_contractor_id: NoName11;
    photo?: Photo;
    price?: NoName12;
    time_to_contact_from?: NoName13;
    time_to_contact_to?: NoName14;
    user_id?: NoName15;
}
export interface RequestInline {
    deadline_date?: NoName19;
    description?: NoName20;
    id?: ID2;
    industry_sector_id?: NoName21;
    manager_rm?: UserInline;
    manager_rm_id?: NoName28;
    module?: ModuleInline;
    module_id: NoName106;
    priority?: NoName107;
    start_date?: NoName108;
    status?: NoName109;
    title?: NoName110;
    type_id?: NoName111;
}
export interface UserInline {
    birth_date?: NoName22;
    first_name?: NoName23;
    gender?: null | NoName24;
    id?: ID3;
    last_name?: NoName25;
    middle_name?: NoName26;
    phone?: NoName27;
    photo?: Photo1;
}
export interface ModuleInline {
    created_at?: NoName29;
    deadline_date?: NoName30;
    description?: NoName31;
    difficulty_factor?: DifficultyFactor;
    fun_points?: ModuleFunPointInline[];
    goals?: NoName73;
    id?: ID10;
    name: NoName74;
    organization_project?: OrganizationProjectInline;
    organization_project_id: NoName93;
    positions_labor_estimates?: ModulePositionLaborEstimateInline[];
    sorting?: NoName101;
    start_date?: NoName102;
    updated_at?: NoName103;
    work_days_count?: NoName104;
    work_days_hours_count?: NoName105;
}
export interface ModuleFunPointInline {
    created_at?: NoName32;
    description?: NoName33;
    difficulty_level?: FunPointTypeDifficultyLevelInline;
    difficulty_level_id: NoName40;
    fun_point_type?: FunPointTypeInline;
    fun_point_type_id: NoName68;
    id?: ID9;
    module_id: NoName69;
    name: NoName70;
    sorting?: NoName71;
    updated_at?: NoName72;
}
export interface FunPointTypeDifficultyLevelInline {
    created_at?: NoName34;
    factor?: NoName35;
    fun_point_type_id: NoName36;
    id?: ID4;
    name: NoName37;
    sorting?: NoName38;
    updated_at?: NoName39;
}
export interface FunPointTypeInline {
    created_at?: NoName41;
    description?: NoName42;
    difficulty_levels?: FunPointTypeDifficultyLevelInline[];
    id?: ID5;
    name: NoName43;
    organization_customer?: MainOrganization;
    organization_customer_id?: NoName56;
    positions_labor_estimates?: FunPointTypePositionLaborEstimateInline[];
    updated_at?: NoName67;
}
export interface MainOrganization {
    contact_person?: NoName44;
    contacts_email?: EMail;
    contacts_phone?: NoName45;
    created_at?: NoName46;
    current_user_roles?: ('admin' | 'pfm' | 'pm' | 'rm')[];
    description?: NoName47;
    general_manager_name?: NoName48;
    id?: ID6;
    is_contractor?: NoName49;
    is_customer?: NoName50;
    is_partner?: NoName51;
    legal_name?: NoName52;
    name: NoName53;
    short_name?: NoName54;
    updated_at?: NoName55;
}
export interface FunPointTypePositionLaborEstimateInline {
    created_at?: NoName57;
    fun_point_type_id: NoName58;
    hours?: NoName59;
    id?: ID7;
    position?: Position;
    position_id: NoName64;
    sorting?: NoName65;
    updated_at?: NoName66;
}
export interface Position {
    attributes?: NoName60;
    description?: NoName61;
    id?: ID8;
    is_verified?: NoName62;
    name: NoName63;
}
/**
 * если вы не до конца понимаете назначение этого поля, вам лучше избежать редактирования
 */
export interface NoName60 {}
export interface OrganizationProjectInline {
    created_at?: NoName75;
    current_user_roles?: ('admin' | 'pfm' | 'pm' | 'rm')[];
    date_from?: NoName76;
    date_to?: NoName77;
    description?: NoName78;
    goals?: NoName79;
    id?: ID11;
    industry_sector?: IndustrySector;
    industry_sector_id?: NoName84;
    manager_pfm?: UserInline;
    manager_pfm_id?: NoName85;
    manager_pm?: UserInline;
    manager_pm_id?: NoName86;
    name: NoName87;
    organization_contractor?: MainOrganization;
    organization_contractor_id: NoName88;
    organization_customer?: MainOrganization;
    organization_customer_id: NoName89;
    plan_description?: NoName90;
    requests_requirements_count_by_status?: RequestsRequirementsCountByStatus;
    requests_requirements_count_total?: RequestsRequirementsCountTotal;
    status?: NoName91;
    updated_at?: NoName92;
}
export interface IndustrySector {
    attributes?: NoName80;
    description?: NoName81;
    id?: ID12;
    is_verified?: NoName82;
    name: NoName83;
}
/**
 * если вы не до конца понимаете назначение этого поля, вам лучше избежать редактирования
 */
export interface NoName80 {}
export interface RequestsRequirementsCountByStatus {}
export interface ModulePositionLaborEstimateInline {
    count?: NoName94;
    created_at?: NoName95;
    hours?: NoName96;
    id?: ID13;
    module_id: NoName97;
    position?: Position;
    position_id: NoName98;
    sorting?: NoName99;
    updated_at?: NoName100;
}
