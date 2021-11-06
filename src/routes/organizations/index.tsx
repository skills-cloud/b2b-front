import React, { useMemo, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { parse, stringify } from 'query-string';
import { Link } from 'react-router-dom';

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

import { mainRequest } from 'adapter/api/main';

import style from './index.module.pcss';
import AddAction from 'component/section/actions/add';

export interface IFormValues {
    search?: string,
    is_customer?: boolean
}

export const Organizations = () => {
    const cn = useClassnames(style);
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const qs = useMemo(() => parse(history.location.search), [history.location.search]);

    const defaultValues = {
        search     : '',
        is_customer: false
    };

    const context = useForm<IFormValues>({
        mode: 'all',
        defaultValues
    });

    const { data, isLoading, refetch } = mainRequest.useGetMainOrganizationQuery(normalizeObject(qs), { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if(Object.values(qs).length) {
            const newDefaultValues = {
                ...defaultValues,
                ...qs
            };

            context.reset(newDefaultValues);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [JSON.stringify(qs)]);

    const onSubmit = context.handleSubmit(
        (formData) => {
            const objectToNormalize = {
                search: formData.search,
                ...(formData.is_customer ? {
                    is_customer: formData.is_customer
                } : undefined)
            };

            history.replace({
                search: stringify(normalizeObject(objectToNormalize))
            });
        },
        (formError) => {
            console.error(formError);
        }
    );

    const onClearFilter = () => {
        history.replace({
            search: ''
        });
        context.reset(defaultValues);
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
                                    <Link to={`/organizations/${item.id}`} className={cn('organizations__list-item-link')}>
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

        return <span className={cn('organizations__organizations-empty')}>{t('routes.organizations.main.list.empty')}</span>;
    }, [JSON.stringify(data?.results), i18n.language, isLoading]);

    const elSidebar = () => {
        return (
            <Section>
                <Wrapper>
                    <H3>{t('routes.organizations.sidebar.filters.title')}</H3>
                    <FormProvider {...context}>
                        <form className={cn('organizations__form')} onSubmit={onSubmit}>
                            <Checkbox
                                name="is_customer"
                                label={t('routes.organizations.sidebar.filters.form.customer.label')}
                            />
                            <FormInput
                                name="search"
                                type="text"
                                label={t('routes.organizations.sidebar.filters.form.search.label')}
                                placeholder={t('routes.organizations.sidebar.filters.form.search.placeholder')}
                            />
                            <Button type="submit">
                                {t('routes.organizations.sidebar.filters.buttons.submit')}
                            </Button>
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
                    <SectionHeader actions={<AddAction to="/organizations/create" />}>
                        {t('routes.organizations.main.title')}
                    </SectionHeader>
                    {elOrganizations}
                </Wrapper>
            </Section>
        </SidebarLayout>
    );
};

export default Organizations;
