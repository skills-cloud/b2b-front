import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import useClassnames from 'hook/use-classnames';

import Avatar from 'component/avatar';
import IconPlus from 'component/icons/plus';
import FormInput from 'component/form/input';

import style from './index.module.pcss';

export interface IUser {
    name: string,
    position: string,
    photo: string
}

export const Specialists = () => {
    const cn = useClassnames(style);
    const { t, i18n } = useTranslation();
    const [users, setUsers] = useState<Array<IUser>>([]);
    const context = useForm({
        mode         : 'onChange',
        defaultValues: {
            search: ''
        }
    });
    const search = context.watch('search');


    const elUsers = useMemo(() => {
        if(users.length) {
            return (
                <div className={cn('specialists__users')}>
                    {users.map((user, index) => (
                        <div key={index} className={cn('specialists__user')}>
                            <Avatar src={user.photo} />
                            <Link to={`/user/${index}`}>{user.name}</Link>
                            <span>{user.position}</span>
                        </div>
                    ))}
                </div>
            );
        }

        return <span className={cn('specialists__users-empty')}>{t('routes.specialists.main.users.empty')}</span>;
    }, [users, i18n.language]);

    useEffect(() => {
        import('./mock.json')
            .then((payload) => {
                setUsers(payload.default.filter(({ name }) => name.includes(search)));
            })
            .catch(console.error);
    }, [search]);

    return (
        <div className={cn('specialists')}>
            <main className={cn('specialists__main')}>
                <h1 className={cn('specialists__main-header')}>{t('routes.specialists.main.title')}</h1>
                {elUsers}
                <Link
                    to="/specialists/create"
                    className={cn('specialists__main-button')}
                >
                    <IconPlus />
                </Link>
            </main>
            <aside>
                <div className={cn('specialists__search')}>
                    <h3 className={cn('specialists__search-header')}>{t('routes.specialists.sidebar.search.title')}</h3>
                    <FormProvider {...context}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <FormInput
                                name="search"
                                type="search"
                                placeholder={t('routes.specialists.sidebar.search.form.input.placeholder')}
                            />
                        </form>
                    </FormProvider>
                </div>
            </aside>
        </div>
    );
};

export default Specialists;
