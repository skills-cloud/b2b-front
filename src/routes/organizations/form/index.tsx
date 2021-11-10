import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import { useClassnames } from 'hook/use-classnames';

import Input from 'component/form/input';
import Textarea from 'component/form/textarea';
import Checkbox from 'component/form/checkbox';

import { mainRequest } from 'adapter/api/main';
import { Organization } from 'adapter/types/main/organization/get/code-200';

import style from './index.module.pcss';

export interface IProps {
    formId: string,
    onSuccess: (id: number) => void,
    defaultValues?: Organization
}

const OrganizationCreateForm = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const context = useForm({
        mode         : 'onChange',
        defaultValues: props.defaultValues
    });

    const [post] = mainRequest.usePostMainOrganizationMutation();
    const [patch] = mainRequest.usePatchMainOrganizationMutation();

    const onSubmit = context.handleSubmit(
        (formData) => {
            const method = props.defaultValues ? patch : post;
            const request = method(formData);

            request
                .unwrap()
                .then((response) => {
                    const id = response.id;

                    if(id) {
                        props.onSuccess(id);
                    }
                })
                .catch((err) => {
                    // TODO обработка ошибок
                    console.error(err);
                });
        },
        (formError) => {
            console.error(formError);
        }
    );

    const errorMessage = t('routes.organization.create.required-error');

    return (
        <FormProvider {...context}>
            <form id={props.formId} className={cn('form')} onSubmit={onSubmit}>
                <Input
                    required={errorMessage}
                    type="text"
                    name="name"
                    label={t('routes.organization.create.name.label')}
                    placeholder={t('routes.organization.create.name.placeholder')}
                />
                <Textarea
                    rows={6}
                    name="description"
                    label={t('routes.organization.create.description')}
                />
                <Checkbox
                    name="is_customer"
                    label={t('routes.organization.create.customer')}
                />
            </form>
        </FormProvider>
    );
};

export default OrganizationCreateForm;
