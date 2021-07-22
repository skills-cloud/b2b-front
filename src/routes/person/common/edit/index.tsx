import React, { MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import useClassnames, { IStyle } from 'hook/use-classnames';
import FormInput from 'component/form/input';
import Button from 'component/button';

import style from './index.module.pcss';
import Modal from 'component/modal';
import InputSelect from 'component/form/select';
import DateInput from 'component/form/date';

export interface IContact {
    type: 'phone' | 'email',
    value: string
}

export interface IField {
    first_name?: string,
    last_name?: string,
    middle_name?: string,
    citizenship?: string,
    location?: {
        country?: string,
        city?: string
    },
    gender?: 'male' | 'female',
    birth_date?: string,
    contact?: Array<IContact>
}

export interface IProps {
    className?: string | IStyle,
    fields?: Array<IField>,
    onSubmit?(payload: Array<IField>): void,
    onCancel?(): void
}

export const CommonEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const methods = useForm({
        defaultValues: {
            common: props.fields || [{}]
        }
    });
    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name   : 'common'
    });
    const [activeTab, setActiveTab] = useState<'main' | 'contacts'>('main');
    const [mainContact, setMainContact] = useState<number>(0);

    const onSetActiveTab = (tab: 'main' | 'contacts') => () => {
        setActiveTab(tab);
    };

    const onClickMainContact = (index: number) => () => {
        setMainContact(index);
    };

    const elAppend = useMemo(() => {
        if(activeTab === 'contacts') {
            return (
                <a
                    href="#append"
                    className={cn('common-edit__link-append')}
                    children={t('routes.person.common.edit.buttons.append')}
                    onClick={(e: MouseEvent) => {
                        e.preventDefault();

                        append({});
                    }}
                />
            );
        }
    }, [activeTab]);

    const elFooter = useMemo(() => {
        return (
            <div className={cn('common-edit__form-footer')}>
                {elAppend}
                <Button isSecondary={true} onClick={props.onCancel} className={cn('common-edit__button-secondary')}>
                    {t('routes.person.common.edit.buttons.cancel')}
                </Button>
                <Button type="submit">{t('routes.person.common.edit.buttons.save')}</Button>
            </div>
        );
    }, [activeTab]);

    const elFormContent = () => {
        if(activeTab === 'main') {
            return (
                <div className={cn('common-edit__common-data')}>
                    <div className={cn('common-edit__field', 'common-edit__field_extend')}>
                        <strong>{t('routes.person.common.fields.name')}</strong>
                        <FormInput name="last_name" type="text" placeholder={t('routes.person.common.fields.last_name')} />
                        <FormInput name="first_name" type="text" placeholder={t('routes.person.common.fields.first_name')} />
                        <FormInput name="middle_name" type="text" placeholder={t('routes.person.common.fields.middle_name')} />
                    </div>
                    <div className={cn('common-edit__field')}>
                        <strong>{t('routes.person.common.fields.citizenship.title')}</strong>
                        <FormInput name="citizenship" type="text" placeholder={t('routes.person.common.fields.citizenship.placeholder')} />
                    </div>
                    <div className={cn('common-edit__field', 'common-edit__field_ext')}>
                        <strong>{t('routes.person.common.fields.location.title')}</strong>
                        <FormInput name="citizenship" type="text" placeholder={t('routes.person.common.fields.location.country')} />
                        <FormInput name="citizenship" type="text" placeholder={t('routes.person.common.fields.location.city')} />
                    </div>
                    <div className={cn('common-edit__field')}>
                        <strong>{t('routes.person.common.fields.gender.title')}</strong>
                        <InputSelect
                            name="gender"
                            options={[{
                                value: 'male',
                                label: t('routes.person.common.fields.gender.male')
                            }, {
                                value: 'female',
                                label: t('routes.person.common.fields.gender.female')
                            }]}
                        />
                    </div>
                    <div className={cn('common-edit__field')}>
                        <strong>{t('routes.person.common.fields.birth_date')}</strong>
                        <DateInput name="birth_date" />
                    </div>
                </div>
            );
        }

        return (
            <div className={cn('common-edit__common-data')}>
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className={cn('common-edit__contacts')}
                    >
                        <div className={cn('common-edit__field', 'common-edit__field_ext')}>
                            <strong>
                                {t('routes.person.common.fields.contact.title', {
                                    number: index + 1
                                })}
                            </strong>
                            <InputSelect
                                name="contact_type"
                                options={[{
                                    value: 'phone',
                                    label: t('routes.person.common.fields.contact.types.phone')
                                }, {
                                    value: 'email',
                                    label: t('routes.person.common.fields.contact.types.email')
                                }]}
                            />
                            <FormInput name={`common.${index}.contact`} type="text" />
                        </div>
                        <div className={cn('common-edit__contact-controls')}>
                            <span
                                onClick={onClickMainContact(index)}
                                className={cn('common-edit__contact-control', {
                                    'common-edit__contact-control_active': index === mainContact
                                })}
                            >
                                {t('routes.person.common.fields.contact.controls.main', {
                                    context: index === mainContact ? 'default' : 'make'
                                })}
                            </span>
                            {fields.length > 1 && (
                                <span
                                    onClick={() => remove(index)}
                                    className={cn('common-edit__contact-control')}
                                >
                                    {t('routes.person.common.fields.contact.controls.remove')}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Modal className={cn('common-edit')} footer={elFooter} header={t('routes.person.common.header')}>
            <div className={cn('common-edit__tabs')}>
                <div
                    className={cn('common-edit__tab', {
                        'common-edit__tab_active': activeTab === 'main'
                    })}
                    onClick={onSetActiveTab('main')}
                >
                    {t('routes.person.common.tabs.main')}
                </div>
                <div
                    className={cn('common-edit__tab', {
                        'common-edit__tab_active': activeTab === 'contacts'
                    })}
                    onClick={onSetActiveTab('contacts')}
                >
                    {t('routes.person.common.tabs.contacts')}
                </div>
            </div>
            <form
                onSubmit={methods.handleSubmit(({ common }) => {
                    if(props.onSubmit) {
                        props.onSubmit(common);
                    }
                })}
            >
                <FormProvider {...methods}>
                    {elFormContent()}
                </FormProvider>
            </form>
        </Modal>
    );
};

export default CommonEdit;
