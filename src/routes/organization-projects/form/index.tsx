import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';
import debounce from 'lodash.debounce';

import { useClassnames } from 'hook/use-classnames';
import { useDispatch } from 'component/core/store';

import Input from 'component/form/input';
import InputDictionary from 'component/form/input-dictionary';
import DateInput from 'component/form/date';
import Textarea from 'component/form/textarea';
import Select from 'component/form/select';

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

interface IFormValues extends Omit<OrganizationProjectRead, 'industry_sector'> {
    resource_manager: ISelect,
    recruiter: ISelect,
    industry_sector: ISelect
}

const OrganizationProjectCreateForm = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const params = useParams<{ organizationId: string }>();
    const context = useForm({
        mode         : 'onChange',
        defaultValues: {
            ...props.defaultValues,
            recruiter: props.defaultValues?.recruiters ? {
                value: props.defaultValues?.recruiters[0]?.id,
                label: `${props.defaultValues?.recruiters[0]?.last_name} ${props.defaultValues?.recruiters[0]?.first_name}`
            } : '',
            resource_manager: props.defaultValues?.resource_managers ? {
                value: props.defaultValues?.resource_managers[0]?.id,
                label: `${props.defaultValues?.resource_managers[0]?.last_name} ${props.defaultValues?.resource_managers[0]?.first_name}`
            } : '',
            industry_sector: props.defaultValues?.industry_sector ? {
                value: props.defaultValues?.industry_sector?.id,
                label: props.defaultValues?.industry_sector?.name
            } : ''
        }
    });

    const onLoadAccUsers = debounce((search: string, callback) => {
        dispatch(acc.endpoints.getAccUser.initiate({ search: search || undefined }))
            .then(({ data }) => {
                if(data?.results?.length) {
                    callback(data.results.map((item) => ({
                        label: `${item.last_name} ${item.first_name}`,
                        value: String(item.id)
                    })));
                } else {
                    callback(null);
                }
            })
            .catch(console.error);
    }, 150);

    const [post] = mainRequest.usePostMainOrganizationProjectMutation();
    const [patch] = mainRequest.usePatchMainOrganizationProjectMutation();

    const onSubmit = context.handleSubmit(
        ({ industry_sector, resource_manager, recruiter, ...data }: IFormValues) => {
            const postData = { ...data };

            if(industry_sector) {
                postData.industry_sector_id = parseInt(industry_sector.value, 10);
            }

            if(resource_manager) {
                postData.resource_managers_ids = [parseInt(resource_manager.value, 10)];
            }

            if(recruiter) {
                postData.recruiters_ids = [parseInt(recruiter.value, 10)];
            }

            const method = props.defaultValues ? patch : post;
            const { id: requestId, ...rest } = postData;

            const request = method({
                ...rest,
                organization_id: parseInt(params.organizationId, 10),
                id             : requestId as number
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

    const errorMessage = t('routes.project.create.required-error');

    return (
        <FormProvider {...context}>
            <form id={props.formId} className={cn('form')} onSubmit={onSubmit}>
                <Input
                    required={errorMessage}
                    type="text"
                    name="name"
                    label={t('routes.project.create.name.title')}
                    placeholder={t('routes.project.create.name.placeholder')}
                />
                <InputDictionary
                    requestType={InputDictionary.requestType.IndustrySector}
                    name="industry_sector"
                    direction="column"
                    label={t('routes.project.create.industry_sector.title')}
                    placeholder={t('routes.project.create.industry_sector.placeholder')}
                    isMulti={false}
                />
                <div className={cn('form__fields')}>
                    <DateInput
                        name="date_from"
                        direction="column"
                        label={t('routes.project.create.date-from')}
                    />
                    <DateInput
                        name="date_to"
                        direction="column"
                        label={t('routes.project.create.date-to')}
                    />
                </div>
                <Select
                    name="resource_manager"
                    direction="column"
                    label={t('routes.project.create.resource_manager.title')}
                    placeholder={t('routes.project.create.resource_manager.placeholder')}
                    loadOptions={onLoadAccUsers}
                />
                <Select
                    name="recruiter"
                    direction="column"
                    label={t('routes.project.create.recruiter.title')}
                    placeholder={t('routes.project.create.recruiter.placeholder')}
                    loadOptions={onLoadAccUsers}
                />
                <Textarea
                    rows={6}
                    name="description"
                    label={t('routes.project.create.description')}
                />
            </form>
        </FormProvider>
    );
};

export default OrganizationProjectCreateForm;
