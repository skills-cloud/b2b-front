import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import { useClassnames } from 'hook/use-classnames';

import Input from 'component/form/input';
import InputDictionary from 'component/form/input-dictionary';
import DateInput from 'component/form/date';
import Textarea from 'component/form/textarea';
import Select from 'component/form/select';
import InputMain from 'component/form/input-main';
import ErrorsComponent from 'component/error/errors';

import { mainRequest } from 'adapter/api/main';
import { acc } from 'adapter/api/acc';
import { OrganizationProjectRead } from 'adapter/types/main/organization-project/get/code-200';

import style from './index.module.pcss';

export interface IProps {
    formId: string,
    onSuccess: () => void,
    defaultValues?: OrganizationProjectRead
}

interface ISelect {
    value: string,
    label: string
}

interface IFormValues extends Omit<OrganizationProjectRead, 'industry_sector' | 'manager_pm' | 'manager_pfm' | 'organization_customer' | 'organization_contractor'> {
    manager_pm: ISelect,
    manager_pfm: ISelect,
    organization_contractor: ISelect,
    organization_customer: ISelect,
    recruiter: ISelect,
    industry_sector: ISelect
}

const OrganizationProjectCreateForm = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const params = useParams<IParams>();
    const context = useForm({
        mode         : 'onChange',
        defaultValues: {
            ...props.defaultValues,
            manager_pm: props.defaultValues?.manager_pm ? {
                value: props.defaultValues?.manager_pm_id,
                label: `${props.defaultValues?.manager_pm.last_name} ${props.defaultValues?.manager_pm.first_name}`
            } : undefined,
            manager_pfm: props.defaultValues?.manager_pfm ? {
                value: props.defaultValues?.manager_pfm_id,
                label: `${props.defaultValues?.manager_pfm.last_name} ${props.defaultValues?.manager_pfm.first_name}`
            } : undefined,
            organization_contractor: props.defaultValues?.organization_contractor ? {
                value: String(props.defaultValues?.organization_contractor?.id),
                label: props.defaultValues?.organization_contractor?.name
            } : undefined,
            organization_customer: props.defaultValues?.organization_customer ? {
                value: props.defaultValues?.organization_customer?.id,
                label: props.defaultValues?.organization_customer?.name
            } : undefined,
            industry_sector: props.defaultValues?.industry_sector ? {
                value: props.defaultValues?.industry_sector?.id,
                label: props.defaultValues?.industry_sector?.name
            } : undefined
        }
    });

    const values = context.watch();

    const { data: userData } = acc.useGetAccUserQuery({
        organization_contractor_id: [parseInt(values?.organization_contractor?.value as string, 10)]
    }, {
        skip                     : !values?.organization_contractor?.value,
        refetchOnMountOrArgChange: true
    });
    const { data: whoAmIData } = acc.useGetAccWhoAmIQuery(undefined);

    useEffect(() => {
        const contractorValue = values.organization_contractor?.value;

        if(contractorValue && (parseInt(contractorValue, 10) !== props.defaultValues?.organization_contractor_id)) {
            context.setValue('manager_pm', {
                value: undefined,
                label: ''
            });

            context.setValue('manager_pfm', {
                value: undefined,
                label: ''
            });
        }
    }, [JSON.stringify(values.organization_contractor)]);

    useEffect(() => {
        if(whoAmIData?.organizations_contractors_roles?.[0] && whoAmIData.organizations_contractors_roles[0]?.organization_contractor_id) {
            context.setValue('organization_contractor', {
                value: whoAmIData.organizations_contractors_roles[0].organization_contractor_id,
                label: whoAmIData.organizations_contractors_roles[0].organization_contractor_name || ''
            });
        }
    }, [JSON.stringify(whoAmIData?.organizations_contractors_roles)]);

    const usersPfm = useMemo(() => {
        if(userData?.results) {
            return userData.results
                .filter((user) => {
                    return user?.organization_contractors_roles?.filter((orgRoles) => {
                        if(values.organization_contractor?.value) {
                            return orgRoles.organization_contractor_id === parseInt(values.organization_contractor?.value, 10);
                        }

                        return void(0);
                    }).some((role) => role.role === 'pfm');
                })
                .map((item) => ({
                    label: item.last_name || item.first_name ? `${item.last_name} ${item.first_name}` : item.email || '',
                    value: String(item.id)
                }));
        }

        return [];
    }, [JSON.stringify(userData?.results), JSON.stringify(values.organization_contractor)]);

    const usersPm = useMemo(() => {
        if(userData?.results) {
            return userData.results
                .filter((user) => {
                    return user?.organization_contractors_roles?.filter((orgRoles) => {
                        if(values.organization_contractor?.value) {
                            return orgRoles.organization_contractor_id === parseInt(values.organization_contractor?.value, 10);
                        }

                        return void(0);
                    }).some((role) => role.role === 'pm');
                })
                .map((item) => ({
                    label: item.last_name || item.first_name ? `${item.last_name} ${item.first_name}` : item.email || '',
                    value: String(item.id)
                }));
        }

        return [];
    }, [JSON.stringify(userData?.results), JSON.stringify(values.organization_contractor)]);


    const [post, { isError, isLoading, error }] = mainRequest.usePostMainOrganizationProjectMutation();
    const [patch, { isError: isPatchError, isLoading: isPatchLoading, error: patchError }] = mainRequest.usePatchMainOrganizationProjectMutation();

    const onSubmit = context.handleSubmit(
        ({ industry_sector, manager_pm, manager_pfm, organization_customer, organization_contractor, ...data }: IFormValues) => {
            const postData = { ...data };

            if(industry_sector) {
                postData.industry_sector_id = parseInt(industry_sector.value, 10);
            }

            if(manager_pm) {
                postData.manager_pm_id = parseInt(manager_pm.value, 10);
            }


            if(manager_pfm) {
                postData.manager_pfm_id = parseInt(manager_pfm.value, 10);
            }

            if(organization_customer) {
                postData.organization_customer_id = parseInt(organization_customer.value, 10);
            }

            if(organization_contractor) {
                postData.organization_contractor_id = parseInt(organization_contractor.value, 10);
            }

            const method = props.defaultValues ? patch : post;
            const { id: requestId, ...rest } = postData;

            const request = method({
                ...rest,
                date_from               : rest.date_from || undefined,
                date_to                 : rest.date_to || undefined,
                organization_customer_id: parseInt(params.organizationId, 10),
                id                      : requestId as number
            });

            request
                .unwrap()
                .then((response) => {
                    const id = response.id;

                    if(id) {
                        props.onSuccess();
                    }
                })
                .catch(console.error);
        },
        (formError) => {
            console.error(formError);
        }
    );

    const elError = () => {
        return (
            <ErrorsComponent
                error={error || patchError}
                isError={isError || isPatchError}
                isLoading={isLoading || isPatchLoading}
            />
        );
    };

    const errorMessage = t('routes.organization-project.create.required-error');

    return (
        <FormProvider {...context}>
            <form id={props.formId} className={cn('form')} onSubmit={onSubmit}>
                <Input
                    required={errorMessage}
                    type="text"
                    name="name"
                    label={t('routes.organization-project.create.name.title')}
                    placeholder={t('routes.organization-project.create.name.placeholder')}
                />
                <InputMain
                    required={errorMessage}
                    disabled={!!props.defaultValues || !!params.organizationId || !!whoAmIData?.organizations_contractors_roles?.length}
                    defaultValue={[props.defaultValues?.organization_customer?.id as number || params.organizationId]}
                    name="organization_customer"
                    direction="column"
                    requestType={InputMain.requestType.Customer}
                    label={t('routes.organization-project.create.organization_customer.title')}
                    placeholder={t('routes.organization-project.create.organization_customer.placeholder')}
                    isMulti={false}
                />
                <InputMain
                    required={errorMessage}
                    defaultValue={[props.defaultValues?.organization_contractor?.id as number]}
                    name="organization_contractor"
                    direction="column"
                    requestType={InputMain.requestType.Contractor}
                    label={t('routes.organization-project.create.organization_contractor.title')}
                    placeholder={t('routes.organization-project.create.organization_contractor.placeholder')}
                    isMulti={false}
                />
                <InputDictionary
                    requestType={InputDictionary.requestType.IndustrySector}
                    name="industry_sector"
                    direction="column"
                    label={t('routes.organization-project.create.industry_sector.title')}
                    placeholder={t('routes.organization-project.create.industry_sector.placeholder')}
                    isMulti={false}
                />
                <Select
                    clearable={true}
                    disabled={!values.organization_contractor?.value}
                    name="manager_pm"
                    direction="column"
                    label={t('routes.organization-project.create.manager_pm.title')}
                    placeholder={t('routes.organization-project.create.manager_pm.placeholder')}
                    options={usersPm}
                    isMulti={false}
                />
                <Select
                    disabled={!values.organization_contractor?.value}
                    clearable={true}
                    name="manager_pfm"
                    direction="column"
                    label={t('routes.organization-project.create.manager_pfm.title')}
                    placeholder={t('routes.organization-project.create.manager_pfm.placeholder')}
                    options={usersPfm}
                    isMulti={false}
                />
                <div className={cn('form__fields')}>
                    <DateInput
                        name="date_from"
                        direction="column"
                        label={t('routes.organization-project.create.date-from')}
                    />
                    <DateInput
                        name="date_to"
                        direction="column"
                        label={t('routes.organization-project.create.date-to')}
                    />
                </div>
                <Textarea
                    name="goals"
                    label={t('routes.organization-project.create.goals')}
                />
                <Textarea
                    name="description"
                    label={t('routes.organization-project.create.description')}
                />
                <Input
                    type="text"
                    name="value"
                    label={t('routes.organization-project.create.value')}
                />
                <Textarea
                    name="plan_description"
                    label={t('routes.organization-project.create.plan_description')}
                />
                {elError()}
            </form>
        </FormProvider>
    );
};

export default OrganizationProjectCreateForm;
