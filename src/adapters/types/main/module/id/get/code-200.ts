/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = ModuleRead;
export type NoName = string;
export type NoName1 = string;
export type NoName2 = string;
export type DifficultyFactor = number;
export type NoName3 = string;
export type NoName4 = string;
export type NoName5 = string;
export type NoName6 = number;
export type NoName7 = number;
export type ID = number;
export type NoName8 = string;
export type NoName9 = number;
export type NoName10 = string;
export type NoName11 = number;
export type NoName12 = string;
export type NoName13 = string;
export type ID1 = number;
export type NoName14 = string;
export type NoName15 = string;
export type NoName16 = string;
export type ID2 = number;
export type NoName17 = boolean;
export type NoName18 = boolean;
export type NoName19 = string;
export type NoName20 = string;
export type NoName21 = number;
export type NoName22 = string;
export type NoName23 = number;
/**
 * в часах
 */
export type NoName24 = number;
export type ID3 = number;
export type NoName25 = string;
export type ID4 = number;
export type NoName26 = boolean;
export type NoName27 = string;
export type NoName28 = number;
export type NoName29 = number;
export type NoName30 = string;
export type NoName31 = string;
export type NoName32 = number;
export type ID5 = number;
export type NoName33 = number;
export type NoName34 = string;
export type NoName35 = number;
export type NoName36 = string;
export type NoName37 = string;
export type ID6 = number;
export type NoName38 = string;
export type NoName39 = string;
export type NoName40 = '-' | 'F' | 'M';
export type ID7 = number;
export type NoName41 = string;
export type NoName42 = string;
export type NoName43 = string;
export type Photo = string;
export type NoName44 = number;
export type NoName45 = string;
export type NoName46 = string;
export type NoName47 = string;
export type NoName48 = string;
export type NoName49 = string;
export type NoName50 = string;
export type ID8 = number;
export type NoName51 = string;
export type ID9 = number;
export type NoName52 = boolean;
export type NoName53 = string;
export type NoName54 = number;
export type NoName55 = number;
export type NoName56 = number;
export type NoName57 = string;
export type NoName58 = number;
export type NoName59 = number;
export type NoName60 = string;
export type RequestsRequirementsCountTotal = number;
export type NoName61 = 'closed' | 'done' | 'draft' | 'in_progress';
export type NoName62 = string;
export type NoName63 = number;
export type NoName64 = number;
export type NoName65 = string;
export type NoName66 = number;
export type ID10 = number;
export type NoName67 = number;
export type NoName68 = number;
export type NoName69 = number;
export type NoName70 = string;
export type NoName71 = number;
export type NoName72 = string;
export type NoName73 = string;
/**
 * если пусто, заполнится автоматически из расчета пятидневной рабочей недели<br>ПН-ПТ deadline_date-start_date
 */
export type NoName74 = number;
export type NoName75 = number;

export interface ModuleRead {
    created_at?: NoName;
    deadline_date?: NoName1;
    description?: NoName2;
    difficulty_factor?: DifficultyFactor;
    fun_points?: ModuleFunPointInline[];
    goals?: NoName37;
    id?: ID6;
    manager?: UserInline;
    manager_id?: NoName44;
    name: NoName45;
    organization_project?: OrganizationProjectInline;
    organization_project_id: NoName63;
    positions_labor_estimates?: ModulePositionLaborEstimateInline[];
    sorting?: NoName71;
    start_date?: NoName72;
    updated_at?: NoName73;
    work_days_count?: NoName74;
    work_days_hours_count?: NoName75;
}
export interface ModuleFunPointInline {
    created_at?: NoName3;
    description?: NoName4;
    difficulty_level?: FunPointTypeDifficultyLevelInline;
    difficulty_level_id: NoName11;
    fun_point_type?: FunPointTypeInline;
    fun_point_type_id: NoName32;
    id?: ID5;
    module_id: NoName33;
    name: NoName34;
    sorting?: NoName35;
    updated_at?: NoName36;
}
export interface FunPointTypeDifficultyLevelInline {
    created_at?: NoName5;
    factor?: NoName6;
    fun_point_type_id: NoName7;
    id?: ID;
    name: NoName8;
    sorting?: NoName9;
    updated_at?: NoName10;
}
export interface FunPointTypeInline {
    created_at?: NoName12;
    description?: NoName13;
    difficulty_levels?: FunPointTypeDifficultyLevelInline[];
    id?: ID1;
    name: NoName14;
    organization_customer?: MainOrganization;
    organization_customer_id?: NoName21;
    positions_labor_estimates?: FunPointTypePositionLaborEstimateInline[];
    updated_at?: NoName31;
}
export interface MainOrganization {
    created_at?: NoName15;
    current_user_roles?: ('admin' | 'pfm' | 'pm' | 'rm')[];
    description?: NoName16;
    id?: ID2;
    is_contractor?: NoName17;
    is_customer?: NoName18;
    name: NoName19;
    updated_at?: NoName20;
}
export interface FunPointTypePositionLaborEstimateInline {
    created_at?: NoName22;
    fun_point_type_id: NoName23;
    hours?: NoName24;
    id?: ID3;
    position?: Position;
    position_id: NoName28;
    sorting?: NoName29;
    updated_at?: NoName30;
}
export interface Position {
    description?: NoName25;
    id?: ID4;
    is_verified?: NoName26;
    name: NoName27;
}
export interface UserInline {
    birth_date?: NoName38;
    first_name?: NoName39;
    gender?: null | NoName40;
    id?: ID7;
    last_name?: NoName41;
    middle_name?: NoName42;
    phone?: NoName43;
    photo?: Photo;
}
export interface OrganizationProjectInline {
    created_at?: NoName46;
    current_user_roles?: ('admin' | 'pfm' | 'pm' | 'rm')[];
    date_from?: NoName47;
    date_to?: NoName48;
    description?: NoName49;
    goals?: NoName50;
    id?: ID8;
    industry_sector?: IndustrySector;
    industry_sector_id?: NoName54;
    manager_pfm?: UserInline;
    manager_pfm_id?: NoName55;
    manager_pm?: UserInline;
    manager_pm_id?: NoName56;
    name: NoName57;
    organization_contractor?: MainOrganization;
    organization_contractor_id: NoName58;
    organization_customer?: MainOrganization;
    organization_customer_id: NoName59;
    plan_description?: NoName60;
    requests_requirements_count_by_status?: RequestsRequirementsCountByStatus;
    requests_requirements_count_total?: RequestsRequirementsCountTotal;
    status?: NoName61;
    updated_at?: NoName62;
}
export interface IndustrySector {
    description?: NoName51;
    id?: ID9;
    is_verified?: NoName52;
    name: NoName53;
}
export interface RequestsRequirementsCountByStatus {}
export interface ModulePositionLaborEstimateInline {
    count?: NoName64;
    created_at?: NoName65;
    hours?: NoName66;
    id?: ID10;
    module_id: NoName67;
    position?: Position;
    position_id: NoName68;
    sorting?: NoName69;
    updated_at?: NoName70;
}
