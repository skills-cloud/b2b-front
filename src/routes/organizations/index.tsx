import React, { useMemo, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { parse, stringify } from 'query-string';
import { Link } from 'react-router-dom';

import { ORGANIZATION_CREATE, ORGANIZATION_ID } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';
import { normalizeObject } from 'src/helper/normalize-object';

import FormInput from 'component/form/input';
import Loader from 'component/loader';
import { H3 } from 'component/header';
import Button from 'component/button';
import SectionHeader from 'component/section/header';
import Checkbox from 'component/form/checkbox';
import SidebarLayout from 'component/layout/sidebar';
import Section from 'component/section';
import Wrapper from 'component/section/wrapper';
import AddAction from 'component/section/actions/add';
import Empty from 'component/empty';

import { mainRequest } from 'adapter/api/main';

import style from './index.module.pcss';

export interface IFormValues {
    search?: string,
    is_customer?: boolean,
    is_contractor?: boolean
}

export const Organizations = () => {
    const cn = useClassnames(style);
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const qs = useMemo(() => parse(history.location.search, { parseBooleans: true }), [history.location.search]);
    const timer = useRef<ReturnType<typeof setTimeout>>();

    const context = useForm<IFormValues>({
        mode         : 'all',
        defaultValues: qs
    });
    const values = context.watch();
    const { data, isLoading } = mainRequest.useGetMainOrganizationQuery(normalizeObject(qs), { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if(timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            history.push({
                search: stringify({
                    search: values.search,
                    ...(values.is_customer ? {
                        is_customer: values.is_customer
                    } : undefined),
                    ...(values.is_contractor ? {
                        is_contractor: values.is_contractor
                    } : undefined)
                }, {
                    skipEmptyString: true
                })
            });
        }, 300);

        return () => {
            if(timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [JSON.stringify(values)]);

    const onClearFilter = () => {
        context.reset({
            search       : '',
            is_contractor: false,
            is_customer  : false
        });
    };

    const elOrganizations = useMemo(() => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.results?.length) {
            return (
                <div className={cn('organizations__list')}>
                    {data.results.map((item) => {
                        return (
                            <div key={item.id} className={cn('organizations__list-item')}>
                                <div className={cn('organizations__list-item-block')}>
                                    <Link to={ORGANIZATION_ID(item.id)} className={cn('organizations__list-item-link')}>
                                        {item.name}
                                    </Link>
                                    {item.is_customer && t('routes.organizations.main.list.customer')}
                                </div>
                                <div className={cn('organizations__list-item-block', 'organizations__list-item-block_row')}>
                                    <span className={cn('organizations__list-item-span')}>{t('routes.organizations.main.list.description.title')}</span>
                                    <p className={cn('organizations__list-item-text')}>
                                        {item.description || t('routes.organizations.main.list.description.empty')}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return <Empty>{t('routes.organizations.main.list.empty')}</Empty>;
    }, [JSON.stringify(data?.results), i18n.language, isLoading]);

    const elSidebar = () => {
        return (
            <Section>
                <Wrapper>
                    <H3>{t('routes.organizations.sidebar.filters.title')}</H3>
                    <FormProvider {...context}>
                        <form className={cn('organizations__form')}>
                            <Checkbox
                                name="is_customer"
                                label={t('routes.organizations.sidebar.filters.form.customer.label')}
                            />
                            <Checkbox
                                name="is_contractor"
                                label={t('routes.organizations.sidebar.filters.form.contractor.label')}
                            />
                            <FormInput
                                name="search"
                                type="text"
                                label={t('routes.organizations.sidebar.filters.form.search.label')}
                                placeholder={t('routes.organizations.sidebar.filters.form.search.placeholder')}
                            />
                            <Button type="button" onClick={onClearFilter} isSecondary={true}>
                                {t('routes.organizations.sidebar.filters.buttons.clear')}
                            </Button>
                        </form>
                    </FormProvider>
                </Wrapper>
            </Section>
        );
    };

    return (
        <SidebarLayout sidebar={elSidebar()}>
            <Section>
                <Wrapper>
                    <SectionHeader actions={<AddAction to={ORGANIZATION_CREATE} />}>
                        {t('routes.organizations.main.title')}
                    </SectionHeader>
                    {elOrganizations}
                </Wrapper>
            </Section>
        </SidebarLayout>
    );
};

export default Organizations;
