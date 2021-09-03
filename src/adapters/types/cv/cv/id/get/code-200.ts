/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Code200 = CvDetailRead;
export type NoName = string;
export type NoName1 = string;
export type ID = number;
export type NoName2 = boolean;
export type NoName3 = string;
export type ParentId = string;
export type CvId = number;
export type NoName4 = string;
export type NoName5 = string;
export type NoName6 = string;
export type CvCareerId = string;
export type NoName7 = string;
export type FileExt = string;
export type NoName8 = string;
export type FileSize = string;
export type ID1 = number;
export type ID2 = number;
export type NoName9 = boolean;
export type NoName10 = string;
export type ID3 = number;
export type NoName11 = boolean;
export type NoName12 = string;
export type OrganizationId = number;
export type NoName13 = string;
export type ID4 = number;
export type NoName14 = boolean;
export type NoName15 = string;
export type PositionId = number;
export type NoName16 = string;
export type NoName17 = string;
export type ID5 = number;
export type NoName18 = string;
export type OrganizationId1 = number;
export type NoName19 = string;
export type CvId1 = number;
export type NoName20 = string;
export type NoName21 = string;
export type NoName22 = string;
export type ID6 = number;
export type NoName23 = boolean;
export type NoName24 = string;
export type EducationGraduateId = number;
export type NoName25 = string;
export type ID7 = number;
export type NoName26 = boolean;
export type NoName27 = string;
export type EducationPlaceId = number;
export type NoName28 = string;
export type ID8 = number;
export type NoName29 = boolean;
export type NoName30 = string;
export type EducationSpecialityId = number;
export type ID9 = number;
export type NoName31 = boolean;
export type NoName32 = string;
export type NoName33 = string;
export type NoName34 = string;
export type ID10 = number;
export type NoName35 = boolean;
export type NoName36 = string;
export type CitizenshipId = number;
export type NoName37 = string;
export type ID11 = number;
export type NoName38 = boolean;
export type NoName39 = string;
export type NoName40 = string;
export type ID12 = number;
export type NoName41 = boolean;
export type NoName42 = string;
export type CityId = number;
export type ID13 = number;
export type NoName43 = string;
export type ParentId1 = string;
export type CompetenceId = number;
export type CvId2 = number;
export type ID14 = number;
export type Years = number;
export type NoName44 = string;
export type NoName45 = string;
export type ID15 = number;
export type NoName46 = boolean;
export type NoName47 = string;
export type ContactTypeId = number;
export type CvId3 = number;
export type ID16 = number;
export type NoName48 = boolean;
export type NoName49 = string;
export type CountryId = number;
export type NoName50 = 'all' | 'weekends' | 'workdays';
export type CvId4 = number;
export type NoName51 = string;
export type NoName52 = string;
export type NoName53 = string;
export type EducationGraduateId1 = number;
export type EducationPlaceId1 = number;
export type EducationSpecialityId1 = number;
export type ID17 = number;
export type NoName54 = boolean;
export type CvId5 = string;
export type NoName55 = string;
export type FileExt1 = string;
export type NoName56 = string;
export type FileSize1 = string;
export type ID18 = number;
export type NoName57 = string;
export type NoName58 = 'F' | 'M';
export type ID19 = number;
export type NoName59 = boolean;
export type NoName60 = string;
export type NoName61 = string;
export type Photo = string;
export type NoName62 = string;
export type ID20 = number;
export type NoName63 = boolean;
export type NoName64 = string;
export type CvId6 = number;
export type CvPositionId = string;
export type NoName65 = string;
export type FileExt2 = string;
export type NoName66 = string;
export type FileSize2 = string;
export type ID21 = number;
export type ID22 = number;
export type PositionId1 = number;
export type NoName67 = string;
export type NoName68 = number;
export type CvId7 = number;
export type NoName69 = string;
export type NoName70 = string;
export type NoName71 = string;
export type ID23 = number;
export type NoName72 = string;
export type ID24 = number;
export type NoName73 = boolean;
export type NoName74 = string;
export type IndustrySectorId = number;
export type NoName75 = boolean;
export type NoName76 = string;
export type OrganizationId2 = number;
export type PositionId2 = number;
export type CityId1 = number;
export type CountryId1 = number;
export type CvId8 = number;
export type NoName77 = string;
export type NoName78 = string;
export type NoName79 = string;
export type ID25 = number;
export type NoName80 = boolean;
export type NoName81 = number;
export type NoName82 = string;
export type ID26 = number;
export type NoName83 = boolean;
export type NoName84 = string;
export type TypeOfEmploymentId = number;
export type NoName85 = string;
export type NoName86 = string;
export type NoName87 = string;
export type ID27 = number;
export type NoName88 = string;
export type Photo1 = string;
export type UserId = number;

export interface CvDetailRead {
    birth_date?: NoName;
    career?: CvCareerRead[];
    certificates?: CvCertificateRead[];
    citizenship?: Citizenship;
    citizenship_id?: CitizenshipId;
    city?: City;
    city_id?: CityId;
    competencies?: CvCompetenceRead[];
    contacts?: CvContactRead[];
    country?: Country;
    country_id?: CountryId;
    days_to_contact?: null | NoName50;
    education?: CvEducationRead[];
    files?: CvFileRead[];
    first_name?: NoName57;
    gender?: null | NoName58;
    id?: ID19;
    is_resource_owner?: NoName59;
    last_name?: NoName60;
    linked_ids?: number[];
    middle_name?: NoName61;
    photo?: Photo;
    physical_limitations?: PhysicalLimitation[];
    physical_limitations_ids?: number[];
    positions?: CvPositionRead[];
    price?: NoName68;
    projects?: CvProjectRead[];
    time_slots?: CvTimeSlotRead[];
    time_to_contact_from?: NoName85;
    time_to_contact_to?: NoName86;
    types_of_employment?: TypeOfEmployment[];
    types_of_employment_ids?: number[];
    user?: UserInline;
    user_id?: UserId;
}
export interface CvCareerRead {
    competencies?: CompetenceInline[];
    competencies_ids?: number[];
    cv_id: CvId;
    date_from?: NoName4;
    date_to?: NoName5;
    description?: NoName6;
    files?: CvCareerFileRead[];
    id?: ID2;
    is_verified?: NoName9;
    organization?: Organization;
    organization_id: OrganizationId;
    position?: Position;
    position_id?: PositionId;
    projects?: OrganizationProject[];
    projects_ids?: number[];
}
export interface CompetenceInline {
    description?: NoName1;
    id?: ID;
    is_verified?: NoName2;
    name: NoName3;
    parent_id?: ParentId;
}
export interface CvCareerFileRead {
    cv_career_id?: CvCareerId;
    file?: NoName7;
    file_ext?: FileExt;
    file_name?: NoName8;
    file_size?: FileSize;
    id?: ID1;
}
export interface Organization {
    description?: NoName10;
    id?: ID3;
    is_customer?: NoName11;
    name: NoName12;
}
export interface Position {
    description?: NoName13;
    id?: ID4;
    is_verified?: NoName14;
    name: NoName15;
}
export interface OrganizationProject {
    created_at?: NoName16;
    description?: NoName17;
    id?: ID5;
    name: NoName18;
    organization_id: OrganizationId1;
    updated_at?: NoName19;
}
export interface CvCertificateRead {
    competencies?: CompetenceInline[];
    competencies_ids?: number[];
    cv_id: CvId1;
    date?: NoName20;
    description?: NoName21;
    education_graduate?: EducationGraduate;
    education_graduate_id: EducationGraduateId;
    education_place?: EducationPlace;
    education_place_id: EducationPlaceId;
    education_speciality?: EducationSpecialty;
    education_speciality_id: EducationSpecialityId;
    id?: ID9;
    is_verified?: NoName31;
    name?: NoName32;
    number?: NoName33;
}
export interface EducationGraduate {
    description?: NoName22;
    id?: ID6;
    is_verified?: NoName23;
    name: NoName24;
}
export interface EducationPlace {
    description?: NoName25;
    id?: ID7;
    is_verified?: NoName26;
    name: NoName27;
}
export interface EducationSpecialty {
    description?: NoName28;
    id?: ID8;
    is_verified?: NoName29;
    name: NoName30;
}
export interface Citizenship {
    description?: NoName34;
    id?: ID10;
    is_verified?: NoName35;
    name: NoName36;
}
export interface City {
    country: Country;
    description?: NoName40;
    id?: ID12;
    is_verified?: NoName41;
    name: NoName42;
}
export interface Country {
    description?: NoName37;
    id?: ID11;
    is_verified?: NoName38;
    name: NoName39;
}
export interface CvCompetenceRead {
    competence?: Competence;
    competence_id: CompetenceId;
    cv_id: CvId2;
    id?: ID14;
    years?: Years;
}
export interface Competence {
    id?: ID13;
    name: NoName43;
    parent_id?: ParentId1;
}
export interface CvContactRead {
    comment?: NoName44;
    contact_type?: ContactType;
    contact_type_id: ContactTypeId;
    cv_id: CvId3;
    id?: ID16;
    is_primary?: NoName48;
    value: NoName49;
}
export interface ContactType {
    description?: NoName45;
    id?: ID15;
    is_verified?: NoName46;
    name: NoName47;
}
export interface CvEducationRead {
    competencies?: CompetenceInline[];
    competencies_ids?: number[];
    cv_id: CvId4;
    date_from?: NoName51;
    date_to?: NoName52;
    description?: NoName53;
    education_graduate?: EducationGraduate;
    education_graduate_id: EducationGraduateId1;
    education_place?: EducationPlace;
    education_place_id: EducationPlaceId1;
    education_speciality?: EducationSpecialty;
    education_speciality_id: EducationSpecialityId1;
    id?: ID17;
    is_verified?: NoName54;
}
export interface CvFileRead {
    cv_id?: CvId5;
    file?: NoName55;
    file_ext?: FileExt1;
    file_name?: NoName56;
    file_size?: FileSize1;
    id?: ID18;
}
export interface PhysicalLimitation {
    description?: NoName62;
    id?: ID20;
    is_verified?: NoName63;
    name: NoName64;
}
export interface CvPositionRead {
    competencies?: CompetenceInline[];
    competencies_ids?: number[];
    cv_id: CvId6;
    files?: CvPositionFileRead[];
    id?: ID22;
    position?: Position;
    position_id?: PositionId1;
    title?: NoName67;
}
export interface CvPositionFileRead {
    cv_position_id?: CvPositionId;
    file?: NoName65;
    file_ext?: FileExt2;
    file_name?: NoName66;
    file_size?: FileSize2;
    id?: ID21;
}
export interface CvProjectRead {
    competencies?: CompetenceInline[];
    competencies_ids?: number[];
    cv_id: CvId7;
    date_from?: NoName69;
    date_to?: NoName70;
    description?: NoName71;
    id?: ID23;
    industry_sector?: IndustrySector;
    industry_sector_id?: IndustrySectorId;
    is_verified?: NoName75;
    name: NoName76;
    organization?: Organization;
    organization_id: OrganizationId2;
    position?: Position;
    position_id: PositionId2;
}
export interface IndustrySector {
    description?: NoName72;
    id?: ID24;
    is_verified?: NoName73;
    name: NoName74;
}
export interface CvTimeSlotRead {
    city?: City;
    city_id?: CityId1;
    country?: Country;
    country_id?: CountryId1;
    cv_id: CvId8;
    date_from?: NoName77;
    date_to?: NoName78;
    description?: NoName79;
    id?: ID25;
    is_work_permit_required?: NoName80;
    price?: NoName81;
    type_of_employment?: TypeOfEmployment;
    type_of_employment_id: TypeOfEmploymentId;
}
export interface TypeOfEmployment {
    description?: NoName82;
    id?: ID26;
    is_verified?: NoName83;
    name: NoName84;
}
export interface UserInline {
    first_name: NoName87;
    id?: ID27;
    last_name: NoName88;
    photo?: Photo1;
}
