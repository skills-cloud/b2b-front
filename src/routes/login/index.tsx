import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { parse } from 'query-string';
import axios from 'axios';
import { useHistory, Redirect } from 'react-router';
import { useForm, FormProvider } from 'react-hook-form';

import { useClassnames } from 'hook/use-classnames';
import { useCancelTokens } from 'hook/cancel-token';

import Button from 'component/button';
import Error from 'component/error';
import Input from 'component/form/input';

import { useDispatch, useSelector } from 'component/core/store';
import { postAccLogin } from 'adapter/api/acc';
import { key as keyUser } from 'component/user/reducer';

import style from './style.pcss';

const Login = () => {
    const history = useHistory();
    const cn = useClassnames(style);
    const { t, i18n } = useTranslation();
    const qs = useMemo(() => parse(history.location.search), [history.location.search]);
    const dispatch = useDispatch();
    const [cancelTokenLogin, cancelTokenUserSelfInfo] = useCancelTokens(2);

    const { isAuth } = useSelector((store) => ({
        isAuth: !!store[keyUser].id
    }));

    const methods = useForm();

    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            cancelTokenLogin.remove();
            cancelTokenUserSelfInfo.remove();
        };
    }, []);

    const onSubmit = methods.handleSubmit(
        (formData) => {
            setPending(true);

            postAccLogin({
                cancelToken: cancelTokenLogin.new(),
                data       : {
                    email   : formData.email,
                    password: formData.password
                }
            })
                .then(() => {
                    setPending(false);
                })
                .catch((err) => {
                    if(!axios.isCancel(err)) {
                        console.error(err);
                    }
                });
        },
        (formErr) => {
            console.log('FORM ERR', formErr)
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

    if(isAuth) {
        if(typeof qs.from === 'string') {
            return <Redirect to={qs.from} />;
        }

        return <Redirect to="/" />;
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
                    <Button onClick={onSubmit}>
                        {t('routes.login.form.button')}
                    </Button>
                    {elError}
                </form>
            </FormProvider>
        </div>
    );
};

export default Login;
