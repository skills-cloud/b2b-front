import React, { MouseEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useHistory } from 'react-router';

import useClassnames from 'hook/use-classnames';

import InputSelect from 'component/form/select';
import FormInput from 'component/form/input';
import DateInput from 'component/form/date';
import Button from 'component/button';
import Error from 'component/error';
import InputMain from 'component/form/input-main';

import { acc } from 'adapter/api/acc';

import style from './index.module.pcss';

export const SystemUsersCreate = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const history = useHistory();

    const context = useForm<{
        email: string,
        first_name?: string,
        middle_name?: string,
        last_name?: string,
        gender?: {
            label: string,
            value: 'M' | 'F' | '-'
        },
        birth_date?: string,
        phone?: string,
        organizations?: Array<{
            role: {
                label: string,
                value: string
            },
            organization_contractor_id: {
                label: string,
                value: number
            }
        }>
    }>({
        mode         : 'onSubmit',
        defaultValues: {
            organizations: [{}]
        }
    });

    const organizations = useFieldArray({
        name   : 'organizations',
        control: context.control
    });

    const [setUserManage, { error, isError, isLoading }] = acc.useSetUserManageMutation();

    const elErrors = useMemo(() => {
        if(!isLoading && isError) {
            const errors = error as {
                data: {
                    details: Record<string, Array<string>> | string
                }
            };

            if(typeof errors.data?.details !== 'string') {
                const keys = Object.keys(errors.data.details);

                return (
                    <div>
                        {keys.map((key) => {
                            if(typeof errors?.data?.details?.[key] === 'string') {
                                return <Error key={key}>{`${key}: ${errors?.data?.details?.[key]}`}</Error>;
                            }

                            return (errors?.data?.details as Record<string, Array<string>>)?.[key]?.map((message, index) => (
                                <Error key={`${key}-${index}}`}>{message}</Error>
                            ));
                        })}
                    </div>
                );
            }

            return <Error>{errors?.data?.details}</Error>;
        }
    }, [isError, isLoading]);

    return (
        <div className={cn('system-users-create')}>
            <main className={cn('system-users-create__main')}>
                <h2
                    className={cn('system-users-create__main-header')}
                    children={t('routes.system-create.title')}
                />
                <FormProvider {...context}>
                    <form
                        className={cn('system-users-create__form')}
                        onSubmit={context.handleSubmit(
                            (payload) => {
                                setUserManage({
                                    ...payload,
                                    gender                        : payload.gender?.value || '-',
                                    organization_contractors_roles: payload.organizations?.filter((item) => item.role && item.organization_contractor_id).map((item) => ({
                                        role                      : item?.role?.value,
                                        organization_contractor_id: item?.organization_contractor_id?.value
                                    }))
                                })
                                    .unwrap()
                                    .then(() => {
                                        history.push('/system-users');
                                    })
                                    .catch(console.error);
                            },
                            console.error
                        )}
                    >
                        <div className={cn('system-users-create__block')}>
                            <h3
                                className={cn('system-users-create__block-title')}
                                children={t('routes.system-create.form.name.label')}
                            />
                            <div className={cn('system-users-create__block-inputs')}>
                                <FormInput
                                    type="text"
                                    name="first_name"
                                    placeholder={t('routes.system-create.form.name.placeholder_first')}
                                />
                                <FormInput
                                    type="text"
                                    name="last_name"
                                    placeholder={t('routes.system-create.form.name.placeholder_last')}
                                />
                                <FormInput
                                    type="text"
                                    name="middle_name"
                                    placeholder={t('routes.system-create.form.name.placeholder_middle')}
                                />
                            </div>
                        </div>
                        <FormInput
                            type="text"
                            name="email"
                            required={true}
                            label={t('routes.system-create.form.email.label')}
                            placeholder={t('routes.system-create.form.email.placeholder')}
                        />
                        <FormInput
                            type="text"
                            name="phone"
                            label={t('routes.system-create.form.phone.label')}
                            placeholder={t('routes.system-create.form.phone.placeholder')}
                        />
                        {organizations.fields.map((field, index) => (
                            <div
                                // @ts-ignore
                                key={field.id}
                                className={cn('system-users-create__organization')}
                            >
                                <div className={cn('system-users-create__organization-fields')}>
                                    <InputMain
                                        name={`organizations.${index}.organization_contractor_id`}
                                        direction="column"
                                        requestType={InputMain.requestType.Contractor}
                                        label={!index && t('routes.system-create.form.organization_contractor_id.label')}
                                        placeholder={t('routes.system-create.form.organization_contractor_id.placeholder')}
                                        isMulti={false}
                                    />
                                    <InputSelect
                                        name={`organizations.${index}.role`}
                                        direction="column"
                                        label={!index && t('routes.system-create.form.organization_role.label')}
                                        placeholder={t('routes.system-create.form.organization_role.placeholder')}
                                        options={[{
                                            label: t('routes.system-create.form.roles.admin'),
                                            value: 'admin'
                                        }, {
                                            label: t('routes.system-create.form.roles.pfm'),
                                            value: 'pfm'
                                        }, {
                                            label: t('routes.system-create.form.roles.pm'),
                                            value: 'pm'
                                        }, {
                                            label: t('routes.system-create.form.roles.rm'),
                                            value: 'rm'
                                        }]}
                                    />
                                </div>
                                {!!index && (
                                    <span
                                        onClick={() => organizations.remove(index)}
                                        className={cn('system-users-create__contact-control')}
                                    >
                                        {t('routes.person.common.fields.contact.controls.remove')}
                                    </span>
                                )}
                            </div>
                        ))}
                        <a
                            href="#append-organization"
                            className={cn('system-users-create__link')}
                            children={t('routes.system-create.links.add-organization')}
                            onClick={(e: MouseEvent) => {
                                e.preventDefault();

                                // @ts-ignore
                                organizations.append({});
                            }}
                        />

                        <div className={cn('system-users-create__last-block')}>
                            <InputSelect
                                name="gender"
                                label={t('routes.specialists-create.main.form.gender.title')}
                                direction="column"
                                placeholder={t('routes.specialists-create.main.form.gender.title')}
                                options={[{
                                    value: 'M',
                                    label: t('routes.specialists-create.main.form.gender.M')
                                }, {
                                    value: 'F',
                                    label: t('routes.specialists-create.main.form.gender.F')
                                }]}
                            />
                            <DateInput
                                direction="column"
                                name="birth_date"
                                label={t('routes.specialists-create.main.form.birth_date')}
                                placeholder={t('routes.specialists-create.main.form.birth_date')}
                            />
                        </div>
                        {elErrors}
                        <Button
                            className={cn('system-users-create__button')}
                            type="submit"
                            children={t('routes.system-create.form.buttons.create')}
                            disabled={isLoading}
                            isLoading={isLoading}
                        />
                    </form>
                </FormProvider>
            </main>
        </div>
    );
};

export default SystemUsersCreate;
