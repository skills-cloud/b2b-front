import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { parse, stringify } from 'query-string';
import debounce from 'lodash.debounce';

import SidebarLayout from 'component/layout/sidebar';
import Wrapper from 'component/section/wrapper';
import Section from 'component/section';
import SectionHeader from 'component/section/header';
import AddAction from 'component/section/actions/add';
import { H3 } from 'component/header';
import useClassnames from 'hook/use-classnames';
import Loader from 'component/loader';
import Avatar from 'component/avatar';
import FormInput from 'component/form/input';
import FormSelect from 'component/form/select';
import Button from 'component/button';
import useQuery from 'hook/use-query';
import InputMain from 'component/form/input-main';
import Empty from 'component/empty';

import { acc } from 'adapter/api/acc';

import style from './index.module.pcss';
import { useDebouncedEffect } from 'helper/use-debounce';

export const SystemUsers = () => {
    const { t, i18n } = useTranslation();
    const cn = useClassnames(style);
    const history = useHistory();
    const query = useQuery();
    const qs = useMemo(() => parse(history.location.search), [history.location.search]);
    const context = useForm({
        mode         : 'onSubmit',
        defaultValues: qs
    });

    const values = context.watch();

    const { data, requestId, isFetching } = acc.useGetUserManageQuery({
        search                    : query.get('search') || undefined,
        organization_contractor_id: query.get('organization_contractor_id') ? [query.get('organization_contractor_id') as string] : undefined,
        role                      : query.get('role') ? [query.get('role') as string] : undefined
    });

    const historyPush = debounce(() => {
        history.push({
            search: stringify(values, {
                skipEmptyString: true
            })
        });
    }, 300);

    useEffect(() => {
        historyPush();
    }, [JSON.stringify(values)]);

    const elLoading = useMemo(() => {
        if(isFetching) {
            return <Loader />;
        }
    }, [isFetching]);

    const elUsers = useMemo(() => {
        if(!isFetching) {
            if(!data?.results.length) {
                return <Empty>{t('routes.system-users.main.empty')}</Empty>;
            }

            return (
                <ul className={cn('system-users__users')}>
                    {data?.results.map((user) => (
                        <li
                            key={user.id}
                            className={cn('system-users__user')}
                        >
                            <Avatar />
                            <div className={cn('system-users__user-info')}>
                                <strong
                                    className={cn('system-users__name')}
                                    children={`${user.first_name} ${user.last_name}`}
                                />
                                {user.organization_contractors_roles?.map((organization, index) => (
                                    <span
                                        key={index}
                                        className={cn('system-users__project')}
                                    >
                                        {organization.organization_contractor_name}
                                        <span> | </span>
                                        {t('routes.system-users.role', {
                                            context: organization.role
                                        })}
                                    </span>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            );
        }
    }, [requestId, isFetching, i18n.language]);

    return (
        <SidebarLayout
            sidebar={(
                <div className={cn('system-users__sidebar')}>
                    <Section>
                        <Wrapper>
                            <H3>{t('routes.system-users.sidebar.filters.title')}</H3>
                            <FormProvider {...context}>
                                <form className={cn('system-users__form')}>
                                    <FormInput
                                        name="search"
                                        type="search"
                                        placeholder={t('routes.system-users.sidebar.filters.form.search.placeholder')}
                                    />
                                    <InputMain
                                        name="organization_contractor_id"
                                        direction="column"
                                        requestType={InputMain.requestType.Contractor}
                                        label={t('routes.system-users.sidebar.filters.form.organization_contractor_id.label')}
                                        placeholder={t('routes.system-users.sidebar.filters.form.organization_contractor_id.placeholder')}
                                        isMulti={false}
                                    />
                                    <FormSelect
                                        name="role"
                                        label={t('routes.system-users.sidebar.filters.form.role.label')}
                                        direction="column"
                                        placeholder={t('routes.system-users.sidebar.filters.form.role.placeholder')}
                                        clearable={true}
                                        options={[{
                                            label: t('routes.system-create.form.roles.admin'),
                                            value: 'admin'
                                        }, {
                                            label: t('routes.system-create.form.roles.pfm'),
                                            value: 'pfm'
                                        }, {
                                            label: t('routes.system-create.form.roles.pm'),
                                            value: 'pm'
                                        }, {
                                            label: t('routes.system-create.form.roles.rm'),
                                            value: 'rm'
                                        }]}
                                    />
                                    <Button
                                        type="reset"
                                        isSecondary={true}
                                        disabled={isFetching}
                                        children={t('routes.system-users.sidebar.filters.buttons.clear')}
                                        onClick={() => {
                                            context.setValue('organization_contractor_id', '');
                                            history.replace({
                                                search: ''
                                            });
                                        }}
                                    />
                                </form>
                            </FormProvider>
                        </Wrapper>
                    </Section>
                </div>
            )}
        >
            <Section>
                <Wrapper>
                    <SectionHeader actions={<AddAction to="/system-users/create" />}>
                        {t('routes.system-users.main.title')}
                    </SectionHeader>
                    {elLoading}
                    {elUsers}
                </Wrapper>
            </Section>
        </SidebarLayout>
    );
};
