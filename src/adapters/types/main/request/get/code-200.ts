/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = RequestRead;
export type NoName = string;
export type NoName1 = string;
export type ID = number;
export type NoName2 = string;
export type ID1 = number;
export type NoName3 = boolean;
export type NoName4 = string;
export type NoName5 = number;
export type NoName6 = string;
export type NoName7 = string;
export type NoName8 = '-' | 'F' | 'M';
export type ID2 = number;
export type NoName9 = string;
export type NoName10 = string;
export type NoName11 = string;
export type Photo = string;
export type NoName12 = number;
export type NoName13 = string;
export type NoName14 = string;
export type NoName15 = string;
export type DifficultyFactor = number;
export type NoName16 = string;
export type NoName17 = string;
export type NoName18 = string;
export type NoName19 = number;
export type NoName20 = number;
export type ID3 = number;
export type NoName21 = string;
export type NoName22 = number;
export type NoName23 = string;
export type NoName24 = number;
export type NoName25 = string;
export type NoName26 = string;
export type ID4 = number;
export type NoName27 = string;
export type NoName28 = string;
export type NoName29 = string;
export type ID5 = number;
export type NoName30 = boolean;
export type NoName31 = boolean;
export type NoName32 = string;
export type NoName33 = string;
export type NoName34 = number;
export type NoName35 = string;
export type NoName36 = number;
/**
 * в часах
 */
export type NoName37 = number;
export type ID6 = number;
export type NoName38 = string;
export type ID7 = number;
export type NoName39 = boolean;
export type NoName40 = string;
export type NoName41 = number;
export type NoName42 = number;
export type NoName43 = string;
export type NoName44 = string;
export type NoName45 = number;
export type ID8 = number;
export type NoName46 = number;
export type NoName47 = string;
export type NoName48 = number;
export type NoName49 = string;
export type NoName50 = string;
export type ID9 = number;
export type NoName51 = number;
export type NoName52 = string;
export type NoName53 = string;
export type NoName54 = string;
export type NoName55 = string;
export type NoName56 = string;
export type NoName57 = string;
export type ID10 = number;
export type NoName58 = number;
export type NoName59 = number;
export type NoName60 = number;
export type NoName61 = string;
export type NoName62 = number;
export type NoName63 = number;
export type NoName64 = string;
export type RequestsRequirementsCountTotal = number;
export type NoName65 = 'closed' | 'done' | 'draft' | 'in_progress';
export type NoName66 = string;
export type NoName67 = number;
export type NoName68 = number;
export type NoName69 = string;
export type NoName70 = number;
export type ID11 = number;
export type NoName71 = number;
export type NoName72 = number;
export type NoName73 = number;
export type NoName74 = string;
export type NoName75 = number;
export type NoName76 = string;
export type NoName77 = string;
/**
 * если пусто, заполнится автоматически из расчета пятидневной рабочей недели<br>ПН-ПТ deadline_date-start_date
 */
export type NoName78 = number;
export type NoName79 = number;
export type NoName80 = number;
export type NoName81 = 10 | 20 | 30;
export type ID12 = number;
export type NoName82 = string;
export type ParentId = string;
export type NoName83 = number;
/**
 * `1` : *Менее года*
 * `3` : *1 – 3 года*
 * `5` : *3 - 5 лет*
 * `100` : *Более 5 лет*
 */
export type NoName84 = 1 | 100 | 3 | 5;
export type ID13 = number;
export type RequestRequirementId = string;
export type NoName85 = number;
export type NoName86 = number;
export type NoName87 = string;
export type NoName88 = string;
export type NoName89 = number;
export type NoName90 = number;
export type NoName91 = number;
export type NoName92 = 'all' | 'weekends' | 'workdays';
export type NoName93 = string;
export type NoName94 = 'F' | 'M';
export type ID14 = number;
export type NoName95 = string;
export type NoName96 = number;
export type NoName97 = string;
export type NoName98 = number;
export type Photo1 = string;
export type NoName99 = number;
export type NoName100 = string;
export type NoName101 = string;
export type NoName102 = number;
export type CvId = string;
export type NoName103 = string;
export type NoName104 = string;
export type ID15 = number;
export type Date = string;
export type NoName105 = number;
export type NoName106 = number;
export type RequestRequirementId1 = string;
export type NoName107 = 'canceled' | 'candidate' | 'pre-candidate' | 'worker';
export type NoName108 = string;
export type NoName109 = string;
export type NoName110 = string;
export type NoName111 = string;
/**
 * float
 */
export type NoName112 = number;
export type ID16 = number;
export type NoName113 = number;
export type NoName114 = string;
export type NoName115 = number;
export type NoName116 = number;
export type NoName117 = number;
export type Status = string;
export type NoName118 = string;
export type ID17 = number;
export type NoName119 = boolean;
export type NoName120 = string;
export type NoName121 = number;
export type NoName122 = string;
export type NoName123 = string;
export type ID18 = number;
export type NoName124 = boolean;
export type NoName125 = string;
export type NoName126 = string;
export type ID19 = number;
export type NoName127 = boolean;
export type NoName128 = string;
export type NoName129 = number;
export type RequirementsCountSum = number;
export type NoName130 = string;
export type NoName131 = 'closed' | 'done' | 'draft' | 'in_progress';
export type NoName132 = string;
export type ID20 = number;
export type NoName133 = string;
export type NoName134 = number;

export interface RequestRead {
    deadline_date?: NoName;
    description?: NoName1;
    id?: ID;
    industry_sector?: IndustrySector;
    industry_sector_id?: NoName5;
    manager_rm?: UserInline;
    manager_rm_id?: NoName12;
    module?: ModuleInline;
    module_id: NoName80;
    priority?: NoName81;
    requirements?: RequestRequirementRead[];
    requirements_count_sum?: RequirementsCountSum;
    start_date?: NoName130;
    status?: NoName131;
    title?: NoName132;
    type?: RequestType;
    type_id?: NoName134;
}
export interface IndustrySector {
    description?: NoName2;
    id?: ID1;
    is_verified?: NoName3;
    name: NoName4;
}
export interface UserInline {
    birth_date?: NoName6;
    first_name?: NoName7;
    gender?: null | NoName8;
    id?: ID2;
    last_name?: NoName9;
    middle_name?: NoName10;
    phone?: NoName11;
    photo?: Photo;
}
export interface ModuleInline {
    created_at?: NoName13;
    deadline_date?: NoName14;
    description?: NoName15;
    difficulty_factor?: DifficultyFactor;
    fun_points?: ModuleFunPointInline[];
    goals?: NoName50;
    id?: ID9;
    manager?: UserInline;
    manager_id?: NoName51;
    name: NoName52;
    organization_project?: OrganizationProjectInline;
    organization_project_id: NoName67;
    positions_labor_estimates?: ModulePositionLaborEstimateInline[];
    sorting?: NoName75;
    start_date?: NoName76;
    updated_at?: NoName77;
    work_days_count?: NoName78;
    work_days_hours_count?: NoName79;
}
export interface ModuleFunPointInline {
    created_at?: NoName16;
    description?: NoName17;
    difficulty_level?: FunPointTypeDifficultyLevelInline;
    difficulty_level_id: NoName24;
    fun_point_type?: FunPointTypeInline;
    fun_point_type_id: NoName45;
    id?: ID8;
    module_id: NoName46;
    name: NoName47;
    sorting?: NoName48;
    updated_at?: NoName49;
}
export interface FunPointTypeDifficultyLevelInline {
    created_at?: NoName18;
    factor?: NoName19;
    fun_point_type_id: NoName20;
    id?: ID3;
    name: NoName21;
    sorting?: NoName22;
    updated_at?: NoName23;
}
export interface FunPointTypeInline {
    created_at?: NoName25;
    description?: NoName26;
    difficulty_levels?: FunPointTypeDifficultyLevelInline[];
    id?: ID4;
    name: NoName27;
    organization_customer?: MainOrganization;
    organization_customer_id?: NoName34;
    positions_labor_estimates?: FunPointTypePositionLaborEstimateInline[];
    updated_at?: NoName44;
}
export interface MainOrganization {
    created_at?: NoName28;
    current_user_roles?: ('admin' | 'pfm' | 'pm' | 'rm')[];
    description?: NoName29;
    id?: ID5;
    is_contractor?: NoName30;
    is_customer?: NoName31;
    name: NoName32;
    updated_at?: NoName33;
}
export interface FunPointTypePositionLaborEstimateInline {
    created_at?: NoName35;
    fun_point_type_id: NoName36;
    hours?: NoName37;
    id?: ID6;
    position?: Position;
    position_id: NoName41;
    sorting?: NoName42;
    updated_at?: NoName43;
}
export interface Position {
    description?: NoName38;
    id?: ID7;
    is_verified?: NoName39;
    name: NoName40;
}
export interface OrganizationProjectInline {
    created_at?: NoName53;
    current_user_roles?: ('admin' | 'pfm' | 'pm' | 'rm')[];
    date_from?: NoName54;
    date_to?: NoName55;
    description?: NoName56;
    goals?: NoName57;
    id?: ID10;
    industry_sector?: IndustrySector;
    industry_sector_id?: NoName58;
    manager_pfm?: UserInline;
    manager_pfm_id?: NoName59;
    manager_pm?: UserInline;
    manager_pm_id?: NoName60;
    name: NoName61;
    organization_contractor?: MainOrganization;
    organization_contractor_id: NoName62;
    organization_customer?: MainOrganization;
    organization_customer_id: NoName63;
    plan_description?: NoName64;
    requests_requirements_count_by_status?: RequestsRequirementsCountByStatus;
    requests_requirements_count_total?: RequestsRequirementsCountTotal;
    status?: NoName65;
    updated_at?: NoName66;
}
export interface RequestsRequirementsCountByStatus {}
export interface ModulePositionLaborEstimateInline {
    count?: NoName68;
    created_at?: NoName69;
    hours?: NoName70;
    id?: ID11;
    module_id: NoName71;
    position?: Position;
    position_id: NoName72;
    sorting?: NoName73;
    updated_at?: NoName74;
}
export interface RequestRequirementRead {
    competencies?: RequestRequirementCompetenceRead[];
    count?: NoName86;
    cv_list?: RequestRequirementCvRead[];
    cv_list_ids?: string[];
    date_from?: NoName109;
    date_to?: NoName110;
    description?: NoName111;
    experience_years?: NoName112;
    id?: ID16;
    max_price?: NoName113;
    name?: NoName114;
    position?: Position;
    position_id?: NoName115;
    request_id: NoName116;
    sorting?: NoName117;
    status?: Status;
    type_of_employment?: TypeOfEmployment;
    type_of_employment_id?: NoName121;
    work_location_address?: NoName122;
    work_location_city?: City;
    work_location_city_id?: NoName129;
}
export interface RequestRequirementCompetenceRead {
    competence?: Competence;
    competence_id: NoName83;
    experience_years?: NoName84;
    id?: ID13;
    request_requirement_id?: RequestRequirementId;
    sorting?: NoName85;
}
export interface Competence {
    id?: ID12;
    name: NoName82;
    parent_id?: ParentId;
}
export interface RequestRequirementCvRead {
    created_at?: NoName87;
    cv?: CvInlineShort;
    cv_id?: CvId;
    date_from?: NoName103;
    date_to?: NoName104;
    id?: ID15;
    organization_project_card_items?: RequestRequirementCvOrganizationProjectCardItem[];
    rating?: NoName106;
    request_requirement_id?: RequestRequirementId1;
    status?: NoName107;
    updated_at?: NoName108;
}
export interface CvInlineShort {
    birth_date?: NoName88;
    citizenship_id?: NoName89;
    city_id?: NoName90;
    country_id?: NoName91;
    days_to_contact?: null | NoName92;
    first_name?: NoName93;
    gender?: null | NoName94;
    id?: ID14;
    last_name?: NoName95;
    manager_rm_id?: NoName96;
    middle_name?: NoName97;
    organization_contractor_id: NoName98;
    photo?: Photo1;
    price?: NoName99;
    time_to_contact_from?: NoName100;
    time_to_contact_to?: NoName101;
    user_id?: NoName102;
}
export interface RequestRequirementCvOrganizationProjectCardItem {
    date?: Date;
    id: NoName105;
}
export interface TypeOfEmployment {
    description?: NoName118;
    id?: ID17;
    is_verified?: NoName119;
    name: NoName120;
}
export interface City {
    country: Country;
    description?: NoName126;
    id?: ID19;
    is_verified?: NoName127;
    name: NoName128;
}
export interface Country {
    description?: NoName123;
    id?: ID18;
    is_verified?: NoName124;
    name: NoName125;
}
export interface RequestType {
    id?: ID20;
    name: NoName133;
}
