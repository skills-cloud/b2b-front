import React, { useState, useEffect, useMemo, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useHistory } from 'react-router';

import { SPECIALIST_ID } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';

import { cv } from 'adapter/api/cv';
import { contact } from 'adapter/api/contact';
import InputSelect, { IValue } from 'component/form/select';
import InputDictionary from 'component/form/input-dictionary';
import FormInput from 'component/form/input';
import DateInput from 'component/form/date';
import Button from 'component/button';
import UserAvatar from 'component/user/avatar';
import Loader from 'component/loader';
import InputMain from 'component/form/input-main';
import ErrorsComponent from 'component/error/errors';

import { acc } from 'adapter/api/acc';
import { dictionary } from 'adapter/api/dictionary';
import { CvCareerRead } from 'adapter/types/cv/career/id/get/code-200';
import { NoName6 as IGenderType } from 'adapter/types/cv/cv/post/code-201';

import style from './index.module.pcss';

export interface ICvForm extends Omit<CvCareerRead, 'gender' | 'country' | 'city' | 'citizenship'> {
    country: IValue,
    city: IValue,
    citizenship: IValue,
    organization_contractor: IValue,
    manager_rm: IValue,
    gender: {
        label: string,
        value: IGenderType
    },
    common: Array<{
        contact_type: {
            value: string,
            id: string
        },
        value: string
    }>
}

export const SpecialistsCreate = () => {
    const cn = useClassnames(style);
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const context = useForm<ICvForm>({
        mode         : 'onChange',
        defaultValues: {
            common: [{}]
        }
    });
    const values = context.watch();
    const { isValid } = context.formState;
    const [postCv, { error, isError, isLoading }] = cv.usePostCvMutation();
    const [postContact, { error: postContactError, isError: postContactIsError, isLoading: postContactIsLoading }] = contact.usePostContactMutation();
    const { data, isLoading: isListLoading } = cv.useGetCvListQuery({}, {
        refetchOnMountOrArgChange: true
    });
    const { fields, append, remove } = useFieldArray({
        keyName: 'fieldId',
        control: context.control,
        name   : 'common'
    });
    const [mainContact, setMainContact] = useState<number>(0);

    const { data: whoAmIData } = acc.useGetAccWhoAmIQuery(undefined);
    const { data: contacts } = dictionary.useGetContactTypeQuery({ search: '' });

    const onClickMainContact = (index: number) => () => {
        setMainContact(index);
    };

    const { data: userData, refetch } = acc.useGetUserManageQuery({
        organization_contractor_id: [values.organization_contractor?.value],
        role                      : ['rm']
    }, {
        skip: !values.organization_contractor?.value
    });

    useEffect(() => {
        if(values.organization_contractor?.value) {
            const isUserInCompany = !userData?.results?.find((user) => {
                return user.organization_contractors_roles?.some((orgRole) => {
                    return orgRole.organization_contractor_id === parseInt(values.organization_contractor.value, 10);
                });
            });

            if(!isUserInCompany) {
                refetch();
                context.setValue('manager_rm', {
                    value: '',
                    label: ''
                });
            }
        }
    }, [values.organization_contractor?.value]);

    const usersRm = useMemo(() => {
        if(userData?.results) {
            return userData.results
                .map((item) => ({
                    label: item.last_name || item.first_name ? `${item.last_name} ${item.first_name}` : item.email || '',
                    value: String(item.id)
                }));
        }

        return [];
    }, [JSON.stringify(userData?.results), JSON.stringify(values.organization_contractor)]);

    useEffect(() => {
        if(whoAmIData?.organizations_contractors_roles?.[0]) {
            context.setValue('organization_contractor', {
                value: whoAmIData?.organizations_contractors_roles?.[0].organization_contractor_id as string,
                label: whoAmIData?.organizations_contractors_roles?.[0].organization_contractor_name as string
            });
        }
    }, [whoAmIData]);

    const onSubmit = context.handleSubmit(
        (formData) => {
            const { common, ...rest } = formData;
            const newContacts = common.map((item, index) => ({
                contact_type_id: parseInt(item.contact_type.value, 10),
                value          : item.value,
                is_primary     : index === mainContact
            }));

            postCv({
                ...rest,
                organization_contractor_id: parseInt(formData.organization_contractor?.value, 10),
                manager_rm_id             : parseInt(formData.manager_rm?.value, 10),
                gender                    : formData.gender?.value,
                city_id                   : parseInt(formData.city?.value, 10),
                citizenship_id            : parseInt(formData.citizenship?.value, 10),
                country_id                : parseInt(formData.country?.value, 10)
            })
                .unwrap()
                .then((resp) => {
                    if(resp.id) {
                        Promise.all(newContacts.map((newContact) => {
                            const dataRequest = {
                                ...newContact,
                                cv_id: resp.id as number
                            };

                            return postContact(dataRequest).unwrap();
                        }))
                            .then(() => {
                                history.push(SPECIALIST_ID(resp.id));
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    }
                })
                .catch(console.error);
        },
        (err) => {
            console.error(err);
        }
    );

    const elUsers = useMemo(() => {
        if(isListLoading) {
            return <Loader />;
        }

        if(data?.results?.length) {
            return (
                <div className={cn('specialists-create__users')}>
                    {data.results.map((user, index) => {
                        const name = `${user.last_name || ''} ${user.first_name || ''}`.trim();

                        return (
                            <UserAvatar
                                className={cn('specialists-create__user')}
                                key={index}
                                title={name}
                                titleTo={SPECIALIST_ID(user.id)}
                                avatar={{
                                    src: user.photo
                                }}
                            />
                        );
                    })}
                </div>
            );
        }

        return <span className={cn('specialists-create__users-empty')}>{t('routes.specialists.main.users.empty')}</span>;
    }, [data?.results, i18n.language, isListLoading]);

    return (
        <div className={cn('specialists-create')}>
            <main className={cn('specialists-create__main')}>
                <h2 className={cn('specialists-create__main-header')}>{t('routes.specialists-create.main.title')}</h2>
                <FormProvider {...context}>
                    <form
                        className={cn('specialists-create__form')}
                        onSubmit={onSubmit}
                    >
                        <div className={cn('specialists-create__block')}>
                            <h3 className={cn('specialists-create__block-title')}>??????????????, ??????, ????????????????</h3>
                            <div className={cn('specialists-create__block-inputs')}>
                                <FormInput
                                    type="text"
                                    name="first_name"
                                    placeholder={t('routes.specialists-create.main.form.first_name')}
                                />
                                <FormInput
                                    type="text"
                                    name="last_name"
                                    placeholder={t('routes.specialists-create.main.form.last_name')}
                                />
                                <FormInput
                                    type="text"
                                    name="middle_name"
                                    placeholder={t('routes.specialists-create.main.form.middle_name')}
                                />
                            </div>
                        </div>
                        <div className={cn('specialists-create__contacts-wrapper')}>
                            {fields.map((field, index) => (
                                <div
                                    key={field.fieldId}
                                    className={cn('specialists-create__contacts')}
                                >
                                    <div className={cn('specialists-create__field')}>
                                        <strong>
                                            {t('routes.person.common.fields.contact.title', {
                                                number: index + 1
                                            })}
                                        </strong>
                                        <div className={cn('specialists-create__field-content', 'specialists-create__field-content_ext')}>
                                            <InputSelect
                                                name={`common.${index}.contact_type`}
                                                options={contacts?.results.map((contactItem) => ({
                                                    value: String(contactItem.id),
                                                    label: contactItem.name
                                                })) || []}
                                            />
                                            <FormInput name={`common.${index}.value`} type="text" />
                                        </div>
                                    </div>
                                    <div className={cn('specialists-create__contact-controls')}>
                                        <span
                                            onClick={onClickMainContact(index)}
                                            className={cn('specialists-create__contact-control', {
                                                'specialists-create__contact-control_active': index === mainContact
                                            })}
                                        >
                                            {t('routes.person.common.fields.contact.controls.main', {
                                                context: index === mainContact ? 'default' : 'make'
                                            })}
                                        </span>
                                        {fields.length > 1 && (
                                            <span
                                                onClick={() => remove(index)}
                                                className={cn('specialists-create__contact-control')}
                                            >
                                                {t('routes.person.common.fields.contact.controls.remove')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <a
                                href="#append"
                                className={cn('specialists-create__link-append')}
                                children={t('routes.person.common.edit.buttons.append')}
                                onClick={(e: MouseEvent) => {
                                    e.preventDefault();

                                    append({});
                                }}
                            />
                        </div>
                        <InputDictionary
                            requestType={InputDictionary.requestType.Citizenship}
                            name="citizenship"
                            label={t('routes.specialists-create.main.form.citizenship')}
                            placeholder={t('routes.specialists-create.main.form.citizenship')}
                            direction="column"
                            isMulti={false}
                        />
                        <div className={cn('specialists-create__last-block')}>
                            <InputDictionary
                                requestType={InputDictionary.requestType.Country}
                                direction="column"
                                name="country"
                                label={t('routes.specialists-create.main.form.country')}
                                placeholder={t('routes.specialists-create.main.form.country')}
                                isMulti={false}
                            />
                            <InputDictionary
                                requestType={InputDictionary.requestType.City}
                                name="city"
                                label={t('routes.specialists-create.main.form.city')}
                                placeholder={t('routes.specialists-create.main.form.city')}
                                direction="column"
                                isMulti={false}
                            />
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
                        <InputMain
                            disabled={true}
                            required={true}
                            name="organization_contractor"
                            direction="column"
                            requestType={InputMain.requestType.Contractor}
                            label={t('routes.organization-project.create.organization_contractor.title')}
                            placeholder={t('routes.organization-project.create.organization_contractor.placeholder')}
                            isMulti={false}
                        />
                        <InputSelect
                            disabled={!values.organization_contractor?.value}
                            name="manager_rm"
                            direction="column"
                            label={t('routes.organization-project.create.manager_rm.title')}
                            placeholder={t('routes.organization-project.create.manager_rm.placeholder')}
                            isMulti={false}
                            options={usersRm}
                        />
                        <ErrorsComponent
                            error={error || postContactError}
                            isError={isError || postContactIsError}
                            isLoading={isLoading || postContactIsLoading}
                        />
                        <Button
                            className={cn('specialists-create__button')}
                            type="submit"
                            disabled={isLoading || postContactIsLoading || !isValid}
                            isLoading={isLoading || postContactIsLoading}
                        >
                            {t('routes.specialists-create.main.form.button-submit')}
                        </Button>
                    </form>
                </FormProvider>
            </main>
            <aside>
                <div className={cn('specialists-create__sidebar')}>
                    <h3 className={cn('specialists-create__sidebar-header')}>{t('routes.specialists-create.sidebar.title')}</h3>
                    {elUsers}
                </div>
            </aside>
        </div>
    );
};

export default SpecialistsCreate;
