import React, { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';

import useClassnames from 'hook/use-classnames';

import InputSelect from 'component/form/select';
import FormInput from 'component/form/input';
import DateInput from 'component/form/date';
import Button from 'component/button';

import { dictionary } from 'adapter/api/dictionary';
import { mainRequest } from 'adapter/api/main';

import style from './index.module.pcss';


export const SystemUsersCreate = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    const context = useForm({
        mode         : 'onSubmit',
        defaultValues: {
            common       : [{}],
            organizations: [{}]
        }
    });

    const organizations = useFieldArray({
        name   : 'organizations',
        control: context.control
    });

    const { fields, append, remove } = useFieldArray({
        keyName: 'fieldId',
        control: context.control,
        name   : 'common'
    });

    const [getContact] = dictionary.useLazyGetContactTypeQuery();
    const [getOrganizationContractor] = mainRequest.useLazyGetMainOrganizationContractorQuery();

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
                                console.log('payload', payload);
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
                        {organizations.fields.map((field, index) => (
                            <div
                                key={field.id}
                                className={cn('system-users-create__organization')}
                            >
                                <div className={cn('system-users-create__organization-fields')}>
                                    <InputSelect
                                        name={`organizations.${index}.organization_contractor_id`}
                                        direction="column"
                                        label={!index && t('routes.system-create.form.organization_contractor_id.label')}
                                        placeholder={t('routes.system-create.form.organization_contractor_id.placeholder')}
                                        loadOptions={(value, cb) => {
                                            getOrganizationContractor({
                                                search: value
                                            })
                                                .unwrap()
                                                .then(({ results }) => {
                                                    cb(
                                                        results.map((organization) => ({
                                                            value: organization.id,
                                                            label: organization.name
                                                        }))
                                                    );
                                                });
                                        }}
                                    />
                                    <InputSelect
                                        name={`organizations.${index}.role`}
                                        direction="column"
                                        label={!index && t('routes.system-create.form.organization_contractor_id.label')}
                                        placeholder={t('routes.system-create.form.organization_contractor_id.placeholder')}
                                        options={[{
                                            label: 'Специалист',
                                            value: 'employee'
                                        }, {
                                            label: 'Администратор',
                                            value: 'admin'
                                        }, {
                                            label: 'Руководитель портфеля проектов',
                                            value: 'pfm'
                                        }, {
                                            label: 'Руководитель проекта',
                                            value: 'pm'
                                        }, {
                                            label: 'Ресурсный менеджер',
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
                        <div className={cn('system-users-create__contacts-wrapper')}>
                            {fields.map((field, index) => (
                                <div
                                    key={field.fieldId}
                                    className={cn('system-users-create__contacts')}
                                >
                                    <div className={cn('system-users-create__field')}>
                                        <strong>
                                            {t('routes.person.common.fields.contact.title', {
                                                number: index + 1
                                            })}
                                        </strong>
                                        <div className={cn('system-users-create__field-content', 'system-users-create__field-content_ext')}>
                                            <InputSelect
                                                name={`common.${index}.contact_type`}
                                                loadOptions={(value, cb) => {
                                                    getContact({ search: value })
                                                        .unwrap()
                                                        .then(({ results }) => {
                                                            cb(
                                                                results.map((contactItem) => ({
                                                                    value: String(contactItem.id),
                                                                    label: contactItem.name
                                                                }))
                                                            );
                                                        });
                                                }}
                                            />
                                            <FormInput name={`common.${index}.value`} type="text" />
                                        </div>
                                    </div>
                                    <div className={cn('system-users-create__contact-controls')}>
                                        {fields.length > 1 && (
                                            <span
                                                onClick={() => remove(index)}
                                                className={cn('system-users-create__contact-control')}
                                            >
                                                {t('routes.person.common.fields.contact.controls.remove')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <a
                                href="#append"
                                className={cn('system-users-create__link-append')}
                                children={t('routes.person.common.edit.buttons.append')}
                                onClick={(e: MouseEvent) => {
                                    e.preventDefault();

                                    append({});
                                }}
                            />
                        </div>
                        <Button
                            className={cn('system-users-create__button')}
                            type="submit"
                            children={t('routes.system-create.form.buttons.create')}
                        />
                    </form>
                </FormProvider>
            </main>
        </div>
    );
};

export default SystemUsersCreate;
