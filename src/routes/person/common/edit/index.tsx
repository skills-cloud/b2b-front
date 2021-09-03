import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import useClassnames, { IStyle } from 'hook/use-classnames';
import FormInput from 'component/form/input';
import Button from 'component/button';

import Modal from 'component/modal';
import InputSelect from 'component/form/select';
import DateInput from 'component/form/date';
import InputCity from 'component/form/input-city';
import InputCountry from 'component/form/input-country';
import InputCitizenship from 'component/form/input-citizenship';

import { cv } from 'adapter/api/cv';
import { contact } from 'adapter/api/contact';
import { CvDetailRead, NoName57 as IGenderType } from 'adapter/types/cv/cv/id/get/code-200';
import { CvDetailWrite } from 'adapter/types/cv/cv/post/code-201';

import style from './index.module.pcss';
import { dictionary } from 'adapter/api/dictionary';

export interface IProps {
    className?: string | IStyle,
    fields: CvDetailRead,
    id: string,
    onSubmit?(payload?: CvDetailWrite): void,
    onCancel?(): void
}

export interface IFormValues {
    common: {
        gender: {
            value: IGenderType,
            label: string
        },
        city: {
            value: string,
            label: string
        },
        country: {
            value: string,
            label: string
        },
        citizenship: {
            value: string,
            label: string
        }
    },
    contacts: Array<{
        value: string,
        id: number,
        contact_type: {
            label: string,
            value: number
        }
    }>,
    main_contact: number | null
}

export const CommonEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const { contacts, ...other } = props.fields;
    const methods = useForm<IFormValues>({
        defaultValues: {
            common: {
                ...other,
                gender: other.gender ? {
                    label: t(`routes.person.common.fields.gender.${other.gender}`),
                    value: other.gender
                } : {
                    label: '',
                    value: undefined
                },
                city       : { label: other.city?.name, value: String(other.city?.id) },
                citizenship: { label: other.citizenship?.name, value: String(other.citizenship?.id) },
                country    : { label: other.country?.name, value: String(other.country?.id) }
            },
            contacts: contacts?.map((contactElem) => ({
                value       : contactElem.value,
                id          : contactElem.id,
                contact_type: {
                    label: contactElem.contact_type?.name,
                    value: contactElem.contact_type?.id
                }
            })),
            main_contact: null
        }
    });
    const [patchCvById] = cv.usePatchCvByIdMutation();
    const [postContact] = contact.usePostContactMutation();
    const [patchContact] = contact.usePatchContactMutation();
    const [deleteContact] = contact.useDeleteContactMutation();

    const { data } = dictionary.useGetContactTypeQuery({ search: '' });

    const { fields, append, remove } = useFieldArray({
        keyName: 'fieldId',
        control: methods.control,
        name   : 'contacts'
    });
    const [activeTab, setActiveTab] = useState<'main' | 'contacts'>('main');
    const [mainContact, setMainContact] = useState<number>();

    useEffect(() => {
        if(props.fields?.contacts) {
            const primary = props.fields.contacts.find((field) => field.is_primary);

            if(primary) {
                setMainContact(primary.id);
            }
        }
    }, [JSON.stringify(props.fields.contacts)]);

    const onSetActiveTab = (tab: 'main' | 'contacts') => () => {
        setActiveTab(tab);
    };

    const onClickMainContact = (contactId: number) => () => {
        setMainContact(contactId);
        methods.setValue('main_contact', contactId);
    };

    const onRemove = (index: number, id: number) => () => {
        const itemExist = props.fields.contacts?.find((item) => item.id === id);

        if(itemExist) {
            deleteContact({
                id
            })
                .unwrap()
                .then(() => {
                    remove(index);
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            remove(index);
        }
    };

    const onSubmit = methods.handleSubmit(
        (formData: IFormValues) => {
            if(activeTab === 'main') {
                patchCvById({
                    ...formData.common,
                    gender        : formData.common.gender.value,
                    city_id       : parseInt(formData.common.city?.value, 10),
                    citizenship_id: parseInt(formData.common.citizenship?.value, 10),
                    country_id    : parseInt(formData.common.country?.value, 10),
                    id            : parseInt(props.id, 10)
                })
                    .unwrap()
                    .then((resp) => {
                        props.onSubmit?.(resp);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }

            if(activeTab === 'contacts') {
                Promise.all(formData.contacts.map((item) => {
                    const itemExist = props.fields.contacts?.find((contactItem) => contactItem.id === item.id);
                    const dataRequest = {
                        id             : item.id,
                        contact_type_id: item.contact_type.value,
                        value          : item.value,
                        is_primary     : item.id === formData.main_contact || itemExist?.is_primary,
                        cv_id          : parseInt(props.id, 10)
                    };

                    if(!itemExist) {
                        return postContact(dataRequest).unwrap();
                    }

                    return patchContact(dataRequest).unwrap();
                }))
                    .then(() => {
                        props.onSubmit?.();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        },
        (formError) => {
            console.info('ERR', formError);
        }
    );

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
                <Button onClick={onSubmit}>{t('routes.person.common.edit.buttons.save')}</Button>
            </div>
        );
    }, [activeTab]);

    const elFormContent = () => {
        if(activeTab === 'main') {
            return (
                <div className={cn('common-edit__common-data')}>
                    <div className={cn('common-edit__field', 'common-edit__field_extend')}>
                        <strong>{t('routes.person.common.fields.name')}</strong>
                        <FormInput
                            name="common.last_name"
                            type="text"
                            placeholder={t('routes.person.common.fields.last_name')}
                        />
                        <FormInput name="common.first_name" type="text" placeholder={t('routes.person.common.fields.first_name')} />
                        <FormInput name="common.middle_name" type="text" placeholder={t('routes.person.common.fields.middle_name')} />
                    </div>
                    <div className={cn('common-edit__field')}>
                        <strong>{t('routes.person.common.fields.citizenship.title')}</strong>
                        <InputCitizenship
                            name="common.citizenship"
                            placeholder={t('routes.specialists-create.main.form.citizenship')}
                        />
                    </div>
                    <div className={cn('common-edit__field', 'common-edit__field_ext')}>
                        <strong>{t('routes.person.common.fields.location.title')}</strong>
                        <InputCountry
                            direction="column"
                            name="common.country"
                            placeholder={t('routes.specialists-create.main.form.country')}
                        />
                        <InputCity
                            name="common.city"
                            placeholder={t('routes.specialists-create.main.form.city')}
                            direction="column"
                        />
                    </div>
                    <div className={cn('common-edit__field')}>
                        <strong>{t('routes.person.common.fields.gender.title')}</strong>
                        <InputSelect
                            name="common.gender"
                            options={[{
                                value: 'M',
                                label: t('routes.person.common.fields.gender.M')
                            }, {
                                value: 'F',
                                label: t('routes.person.common.fields.gender.F')
                            }]}
                        />
                    </div>
                    <div className={cn('common-edit__field')}>
                        <strong>{t('routes.person.common.fields.birth_date')}</strong>
                        <DateInput name="common.birth_date" />
                    </div>
                </div>
            );
        }

        if(fields.length) {
            return (
                <div className={cn('common-edit__common-data')}>
                    {fields.map((field, index) => {
                        return (
                            <div
                                key={field.fieldId}
                                className={cn('common-edit__contacts')}
                            >
                                <FormInput name={`contacts[${index}].id`} type="text" className={cn('common-edit__field_hidden')} />
                                <div className={cn('common-edit__field', 'common-edit__field_ext')}>
                                    <strong>
                                        {t('routes.person.common.fields.contact.title', {
                                            number: index + 1
                                        })}
                                    </strong>
                                    <InputSelect
                                        name={`contacts[${index}].contact_type`}
                                        options={data?.results.map((contactItem) => ({
                                            value: String(contactItem.id),
                                            label: contactItem.name
                                        })) || []}
                                    />
                                    <FormInput name={`contacts[${index}].value`} type="text" />
                                </div>
                                <div className={cn('common-edit__contact-controls')}>
                                    <span
                                        onClick={onClickMainContact(field.id)}
                                        className={cn('common-edit__contact-control', {
                                            'common-edit__contact-control_active': mainContact && field.id === mainContact
                                        })}
                                    >
                                        {t('routes.person.common.fields.contact.controls.main', {
                                            context: mainContact && field.id === mainContact ? 'default' : 'make'
                                        })}
                                    </span>
                                    {fields.length > 1 && (
                                        <span
                                            onClick={onRemove(index, field.id)}
                                            className={cn('common-edit__contact-control')}
                                        >
                                            {t('routes.person.common.fields.contact.controls.remove')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className={cn('common-edit__contacts-empty')}>
                {t('routes.person.common.empty-contacts')}
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
            <form>
                <FormProvider {...methods}>
                    {elFormContent()}
                </FormProvider>
            </form>
        </Modal>
    );
};

export default CommonEdit;
