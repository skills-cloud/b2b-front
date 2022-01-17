import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parse } from 'query-string';
import axios from 'axios';
import { useHistory, Redirect } from 'react-router';
import { useForm, FormProvider } from 'react-hook-form';

import { useClassnames } from 'hook/use-classnames';
import { DASHBOARD } from 'helper/url-list';


import Button from 'component/button';
import Error from 'component/error';
import Input from 'component/form/input';
import Loader from 'component/loader';

import { acc } from 'adapter/api/acc';

import style from './index.module.pcss';

const Login = () => {
    const history = useHistory();
    const cn = useClassnames(style);
    const { t, i18n } = useTranslation();
    const qs = useMemo(() => parse(history.location.search), [history.location.search]);
    const [postAccLogin] = acc.usePostAccLoginMutation();
    const { data, isLoading } = acc.useGetAccWhoAmIQuery({});

    const methods = useForm();

    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = methods.handleSubmit(
        (formData) => {
            setPending(true);

            postAccLogin({
                email   : formData.email,
                password: formData.password
            })
                .unwrap()
                .then(() => {
                    setPending(false);
                })
                .catch((err) => {
                    if(!axios.isCancel(err)) {
                        console.error(err);

                        setPending(false);
                        setError(err?.data?.details || 'Error');
                    }
                });
        },
        () => {
            setError('Fields error');
        }
    );

    const elError = useMemo(() => {
        if(error) {
            return (
                <Error className={cn('login__error')}>
                    {error}
                </Error>
            );
        }
    }, [error, i18n.language]);

    if(isLoading) {
        return <Loader />;
    }

    if(!isLoading && data?.id) {
        if(typeof qs.from === 'string') {
            return <Redirect to={qs.from} />;
        }

        return <Redirect to={DASHBOARD} />;
    }

    return (
        <div className={cn('login')}>
            <FormProvider {...methods}>
                <form className={cn('login__form')}>
                    <h2 className={cn('login__header')}>{t('routes.login.title')}</h2>
                    <Input
                        name="email"
                        type="text"
                        label={t('routes.login.form.email')}
                    />
                    <Input
                        name="password"
                        type="password"
                        label={t('routes.login.form.password')}
                    />
                    <Button onClick={onSubmit} disabled={pending} isLoading={pending}>
                        {t('routes.login.form.button')}
                    </Button>
                    {elError}
                </form>
            </FormProvider>
        </div>
    );
};

export default Login;
