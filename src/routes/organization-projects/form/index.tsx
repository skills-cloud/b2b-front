import React, { useMemo } from 'react';
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

export interface IProps {
    formId: string,
    onSuccess: () => void,
    defaultValues?: OrganizationProjectRead
}

interface ISelect {
    value: string,
    label: string
}

interface IFormValues extends Omit<OrganizationProjectRead, 'industry_sector' | 'manager'> {
    manager: ISelect,
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
            industry_sector: props.defaultValues?.industry_sector ? {
                value: props.defaultValues?.industry_sector?.id,
                label: props.defaultValues?.industry_sector?.name
            } : ''
        }
    });

    const { data: userData } = acc.useGetAccUserQuery({});

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
        ({ industry_sector, manager, ...data }: IFormValues) => {
            const postData = { ...data };

            if(industry_sector) {
                postData.industry_sector_id = parseInt(industry_sector.value, 10);
            }

            if(manager) {
                postData.manager_id = parseInt(manager.value, 10);
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
                });
        },
        (formError) => {
            console.error(formError);
        }
    );

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
                    defaultValue={[props.defaultValues?.organization_customer?.id as number]}
                    name="organization_customer"
                    direction="column"
                    requestType={InputMain.requestType.Customer}
                    label={t('routes.organization-project.create.organization_customer.title')}
                    placeholder={t('routes.organization-project.create.organization_customer.placeholder')}
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
            </form>
        </FormProvider>
    );
};

export default OrganizationProjectCreateForm;
