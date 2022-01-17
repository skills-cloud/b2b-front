import React, { useEffect, useMemo, useState } from 'react';
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

import { mainRequest } from 'adapter/api/main';
import { acc } from 'adapter/api/acc';
import { OrganizationProjectRead } from 'adapter/types/main/organization-project/get/code-200';

import style from './index.module.pcss';
import InputMain from 'component/form/input-main';
import Error from 'component/error';

export interface IProps {
    formId: string,
    onSuccess: () => void,
    defaultValues?: OrganizationProjectRead
}

interface ISelect {
    value: string,
    label: string
}

interface IFormValues extends Omit<OrganizationProjectRead, 'industry_sector' | 'manager' | 'organization_customer' | 'organization_contractor'> {
    manager: ISelect,
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
            manager: props.defaultValues?.manager ? {
                value: props.defaultValues?.manager_id,
                label: `${props.defaultValues?.manager.last_name} ${props.defaultValues?.manager.first_name}`
            } : '',
            organization_contractor: props.defaultValues?.organization_contractor ? {
                value: props.defaultValues?.organization_contractor?.id,
                label: props.defaultValues?.organization_contractor?.name
            } : '',
            organization_customer: props.defaultValues?.organization_customer ? {
                value: props.defaultValues?.organization_customer?.id,
                label: props.defaultValues?.organization_customer?.name
            } : '',
            industry_sector: props.defaultValues?.industry_sector ? {
                value: props.defaultValues?.industry_sector?.id,
                label: props.defaultValues?.industry_sector?.name
            } : ''
        }
    });

    const { data: userData } = acc.useGetAccUserQuery({});

    const [error, setError] = useState<Array<string> | null>(null);

    const values = context.watch();

    useEffect(() => {
        setError(null);
    }, [JSON.stringify(values)]);

    const users = useMemo(() => {
        if(userData?.results) {
            return userData.results.map((item) => ({
                label: item.last_name || item.first_name ? `${item.last_name} ${item.first_name}` : item.email,
                value: String(item.id)
            }));
        }

        return [];
    }, [JSON.stringify(userData?.results)]);


    const [post] = mainRequest.usePostMainOrganizationProjectMutation();
    const [patch] = mainRequest.usePatchMainOrganizationProjectMutation();

    const onSubmit = context.handleSubmit(
        ({ industry_sector, manager, organization_customer, organization_contractor, ...data }: IFormValues) => {
            const postData = { ...data };

            if(industry_sector) {
                postData.industry_sector_id = parseInt(industry_sector.value, 10);
            }

            if(manager) {
                postData.manager_id = parseInt(manager.value, 10);
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
                .catch((err) => {
                    console.error(err);
                    const errors = Object.values<Array<string>>(err?.data?.details).map((item: Array<string>) => {
                        return item[0];
                    });

                    setError(errors);
                });
        },
        (formError) => {
            console.error(formError);
        }
    );

    const elError = () => {
        if(error?.length) {
            return error.map((err, index) => <Error key={index}>{err}</Error>);
        }
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
                    disabled={true}
                    defaultValue={[props.defaultValues?.organization_customer?.id as number]}
                    name="organization_customer"
                    direction="column"
                    requestType={InputMain.requestType.Customer}
                    label={t('routes.organization-project.create.organization_customer.title')}
                    placeholder={t('routes.organization-project.create.organization_customer.placeholder')}
                    isMulti={false}
                />
                <InputMain
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
                    name="manager"
                    direction="column"
                    label={t('routes.organization-project.create.resource_manager.title')}
                    placeholder={t('routes.organization-project.create.resource_manager.placeholder')}
                    options={users}
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
