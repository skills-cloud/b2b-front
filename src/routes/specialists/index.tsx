import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import useClassnames from 'hook/use-classnames';
import { useCancelToken } from 'hook/cancel-token';

import Avatar from 'component/avatar';
import IconPlus from 'component/icons/plus';
import FormInput from 'component/form/input';

import { getCvList, ICv } from 'adapter/api/cv';

import style from './index.module.pcss';
import axios from 'axios';

export const Specialists = () => {
    const cn = useClassnames(style);
    const { t, i18n } = useTranslation();
    const token = useCancelToken();
    const context = useForm({
        mode         : 'onChange',
        defaultValues: {
            search: ''
        }
    });
    const search = context.watch('search');

    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<Array<ICv>>([]);

    useEffect(() => {
        setLoading(true);

        getCvList({
            params: {
                count: 10,
                search
            },
            cancelToken: token.new()
        })
            .then((resp) => {
                const results = resp.results.filter((user) => user.user_id);

                setLoading(false);
                setUsers(results);
            })
            .catch((err) => {
                if(!axios.isCancel(err)) {
                    console.error(err);
                }
            });
    }, []);


    const elUsers = useMemo(() => {
        if(users.length) {
            return (
                <div className={cn('specialists__users')}>
                    {users.map((user, index) => (
                        <div key={index} className={cn('specialists__user')}>
                            <Avatar src={user.photo} />
                            <Link to={`/user/${user.user_id}`}>{`${user.first_name} ${user.last_name}`}</Link>
                            <span>Mock</span>
                        </div>
                    ))}
                </div>
            );
        }

        return <span className={cn('specialists__users-empty')}>{t('routes.specialists.main.users.empty')}</span>;
    }, [users, i18n.language]);

    return (
        <div className={cn('specialists')}>
            <main className={cn('specialists__main')}>
                <h2 className={cn('specialists__main-header')}>{t('routes.specialists.main.title')}</h2>
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
