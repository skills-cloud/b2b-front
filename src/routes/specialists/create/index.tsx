import React, { useState, useEffect, useMemo, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';

import useClassnames from 'hook/use-classnames';
import InputSelect from 'component/form/select';
import Avatar from 'component/avatar';
import FormInput from 'component/form/input';
import DateInput from 'component/form/date';
import Button from 'component/button';
import { getCitizenship, getCity, getCountries, IDictionaryItem } from 'adapter/api/dictionary';

import style from './index.module.pcss';
import { useCancelTokens } from 'hook/cancel-token';

export interface IUser {
    name: string,
    position: string,
    photo: string
}

export const SpecialistsCreate = () => {
    const cn = useClassnames(style);
    const { t, i18n } = useTranslation();
    const [token, token2, token3] = useCancelTokens(3);
    const [users, setUsers] = useState<Array<IUser>>([]);
    const context = useForm({
        mode         : 'onChange',
        defaultValues: {
            common: [{}]
        }
    });
    const { fields, append, remove } = useFieldArray({
        control: context.control,
        name   : 'common'
    });
    const [mainContact, setMainContact] = useState<number>(0);

    const [cities, setCities] = useState<Array<IDictionaryItem>>([]);
    const [citizenship, setCitizenship] = useState<Array<IDictionaryItem>>([]);
    const [countries, setCountries] = useState<Array<IDictionaryItem>>([]);

    useEffect(() => {
        void getCity({
            cancelToken: token.new()
        })
            .then((payload) => {
                setCities(payload.results);
            });

        void getCitizenship({
            cancelToken: token2.new()
        })
            .then((payload) => {
                setCitizenship(payload.results);
            });

        void getCountries({
            cancelToken: token3.new()
        })
            .then((payload) => {
                setCountries(payload.results);
            });

        return () => {
            token.remove();
            token2.remove();
            token3.remove();
        };
    }, []);

    const onClickMainContact = (index: number) => () => {
        setMainContact(index);
    };

    const elUsers = useMemo(() => {
        if(users.length) {
            return (
                <div className={cn('specialists-create__users')}>
                    {users.map((user, index) => (
                        <div key={index} className={cn('specialists-create__user')}>
                            <Avatar src={user.photo} />
                            <Link to={`/user/${index}`}>{user.name}</Link>
                            <span>{user.position}</span>
                        </div>
                    ))}
                </div>
            );
        }

        return <span className={cn('specialists-create__users-empty')}>{t('routes.specialists.main.users.empty')}</span>;
    }, [users, i18n.language]);

    useEffect(() => {
        import('../mock.json')
            .then((payload) => {
                setUsers(payload.default);
            })
            .catch(console.error);
    }, []);

    return (
        <div className={cn('specialists-create')}>
            <main className={cn('specialists-create__main')}>
                <h2 className={cn('specialists-create__main-header')}>{t('routes.specialists-create.main.title')}</h2>
                <FormProvider {...context}>
                    <form
                        className={cn('specialists-create__form')}
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <div className={cn('specialists-create__block')}>
                            <h3 className={cn('specialists-create__block-title')}>Фамилия, имя, отчество</h3>
                            <div className={cn('specialists-create__block-inputs')}>
                                <FormInput
                                    type="text"
                                    name="name"
                                    placeholder="Имя"
                                />
                                <FormInput
                                    type="text"
                                    name="surname"
                                    placeholder="Фамилия"
                                />
                                <FormInput
                                    type="text"
                                    name="lastname"
                                    placeholder="Отчество"
                                />
                            </div>
                        </div>
                        <div className={cn('specialists-create__contacts-wrapper')}>
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
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
                            options={citizenship.map((item) => ({ label: item.name, value: String(item.id) }))}
                            name="citizenship"
                            label="Гражданство"
                            placeholder="Гражданство"
                            direction="column"
                        />
                        <div className={cn('specialists-create__last-block')}>
                            <InputSelect
                                options={countries.map((city) => ({ label: city.name, value: String(city.id) }))}
                                direction="column"
                                name="country"
                                label="Страна"
                                placeholder="Страна"
                            />
                            <InputSelect
                                options={cities.map((city) => ({ label: city.name, value: String(city.id) }))}
                                name="city"
                                label="Город"
                                placeholder="Город"
                                direction="column"
                            />
                            <InputSelect
                                name="gender"
                                label="Пол"
                                direction="column"
                                placeholder="Пол"
                                options={[{
                                    value: 'М',
                                    label: 'Мужской'
                                }, {
                                    value: 'F',
                                    label: 'Женский'
                                }]}
                            />
                            <DateInput
                                direction="column"
                                name="date_of_birth"
                                label="Дата рождения"
                                placeholder="Дата рождения"
                            />
                        </div>
                        <Button className={cn('specialists-create__button')} type="submit">Создать резюме</Button>
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
