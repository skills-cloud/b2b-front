import React, { useState, useEffect, useMemo, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useHistory } from 'react-router';

import { ICv, cv } from 'adapter/api/cv';
import { contact } from 'adapter/api/contact';
import { useCancelTokens } from 'hook/cancel-token';
import useClassnames from 'hook/use-classnames';
import InputSelect from 'component/form/select';
import FormInput from 'component/form/input';
import DateInput from 'component/form/date';
import Button from 'component/button';
import UserAvatar from 'component/user/avatar';
import Loader from 'component/loader';
import { getCitizenship, getCity, getContactsType, getCountries } from 'adapter/api/dictionary';

import style from './index.module.pcss';

export interface IBasicType {
    label: string,
    value: string
}

export interface ICvForm extends Omit<ICv, 'gender' | 'country' | 'city' | 'citizenship'> {
    country: IBasicType,
    city: IBasicType,
    citizenship: IBasicType,
    gender: IBasicType,
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
    const [
        tokenCity,
        tokenCountry,
        tokenCitizenship,
        tokenCvList,
        tokenCreateCv,
        tokenContacts
    ] = useCancelTokens(6);
    const history = useHistory();
    const context = useForm<ICvForm>({
        mode         : 'onChange',
        defaultValues: {
            common: [{}]
        }
    });
    const { isValid } = context.formState;
    const [postCv] = cv.usePostCvMutation();
    const [postContact] = contact.usePostContactMutation();
    const { data, isLoading } = cv.useGetCvListQuery({}, {
        refetchOnMountOrArgChange: true
    });
    const { fields, append, remove } = useFieldArray({
        keyName: 'fieldId',
        control: context.control,
        name   : 'common'
    });
    const [mainContact, setMainContact] = useState<number>(0);
    const [postCvLoading, setPostCvLoading] = useState<boolean>(false);
    const [cities, setCities] = useState<Array<IBasicType>>([]);
    const [citizenship, setCitizenship] = useState<Array<IBasicType>>([]);
    const [countries, setCountries] = useState<Array<IBasicType>>([]);
    const [contacts, setContacts] = useState<Array<IBasicType>>([]);

    useEffect(() => {
        getCity({
            cancelToken: tokenCity.new()
        })
            .then((payload) => {
                setCities(payload.results?.map((item) => ({ label: item.name, value: String(item.id) })));
            })
            .catch((err) => {
                console.error(err);
            });

        getCitizenship({
            cancelToken: tokenCitizenship.new()
        })
            .then((payload) => {
                setCitizenship(payload.results?.map((item) => ({ label: item.name, value: String(item.id) })));
            })
            .catch((err) => {
                console.error(err);
            });

        getCountries({
            cancelToken: tokenCountry.new()
        })
            .then((payload) => {
                setCountries(payload.results?.map((item) => ({ label: item.name, value: String(item.id) })));
            })
            .catch((err) => {
                console.error(err);
            });

        getContactsType({
            cancelToken: tokenContacts.new()
        })
            .then((payload) => {
                setContacts(payload.results?.map((item) => ({ label: item.name, value: String(item.id) })));
            })
            .catch((err) => {
                console.error(err);
            });

        return () => {
            tokenCountry.remove();
            tokenCvList.remove();
            tokenCity.remove();
            tokenCitizenship.remove();
            tokenCreateCv.remove();
            tokenContacts.remove();
        };
    }, []);

    const onClickMainContact = (index: number) => () => {
        setMainContact(index);
    };

    const onSubmit = context.handleSubmit(
        (formData) => {
            setPostCvLoading(true);
            const { common, ...rest } = formData;
            const newContacts = common.map((item, index) => ({
                contact_type_id: parseInt(item.contact_type.value, 10),
                value          : item.value,
                is_primary     : index === mainContact
            }));

            postCv({
                ...rest,
                gender        : formData.gender?.value,
                city_id       : parseInt(formData.city?.value, 10),
                citizenship_id: parseInt(formData.citizenship?.value, 10),
                country_id    : parseInt(formData.country?.value, 10)
            })
                .unwrap()
                .then((resp) => {
                    setPostCvLoading(false);

                    if(resp.id) {
                        Promise.all(newContacts.map((newContact) => {
                            const dataRequest = {
                                ...newContact,
                                cv_id: resp.id
                            };

                            return postContact(dataRequest).unwrap();
                        }))
                            .then(() => {
                                history.push(`/specialists/${resp.id}`);
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    }
                })
                .catch((err) => {
                    setPostCvLoading(false);
                    console.error(err);
                });
        },
        (err) => {
            console.error(err);
        }
    );

    const elUsers = useMemo(() => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.results?.length) {
            return (
                <div className={cn('specialists-create__users')}>
                    {data.results.map((user, index) => {
                        const name = `${user.last_name || ''} ${user.first_name || ''}`.trim();

                        return (
                            <UserAvatar
                                key={index}
                                title={name}
                                titleTo={`/specialists/${user.id}`}
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
    }, [data?.results, i18n.language, isLoading]);

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
                            <h3 className={cn('specialists-create__block-title')}>Фамилия, имя, отчество</h3>
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
                                                options={contacts}
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
                        <InputSelect
                            options={citizenship}
                            name="citizenship"
                            label={t('routes.specialists-create.main.form.citizenship')}
                            placeholder={t('routes.specialists-create.main.form.citizenship')}
                            direction="column"
                            disableAutocomplete={true}
                        />
                        <div className={cn('specialists-create__last-block')}>
                            <InputSelect
                                options={countries}
                                direction="column"
                                name="country"
                                label={t('routes.specialists-create.main.form.country')}
                                placeholder={t('routes.specialists-create.main.form.country')}
                                disableAutocomplete={true}
                            />
                            <InputSelect
                                options={cities}
                                name="city"
                                label={t('routes.specialists-create.main.form.city')}
                                placeholder={t('routes.specialists-create.main.form.city')}
                                direction="column"
                                disableAutocomplete={true}
                            />
                            <InputSelect
                                name="gender"
                                label={t('routes.specialists-create.main.form.gender.title')}
                                direction="column"
                                placeholder={t('routes.specialists-create.main.form.gender.title')}
                                options={[{
                                    value: 'М',
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
                        <Button
                            className={cn('specialists-create__button')}
                            type="submit"
                            disabled={postCvLoading || !isValid}
                            isLoading={postCvLoading}
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
