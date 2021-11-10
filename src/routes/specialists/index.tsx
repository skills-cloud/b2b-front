import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { parse, stringify } from 'query-string';

import { SPECIALIST_CREATE } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';
import { normalizeObject } from 'src/helper/normalize-object';

import FormInput from 'component/form/input';
import InputDictionary from 'component/form/input-dictionary';
import Loader from 'component/loader';
import { H3 } from 'component/header';
import Button from 'component/button';
import Request from 'component/request';
import SectionHeader from 'component/section/header';
import AddAction from 'component/section/actions/add';
import Section from 'component/section';
import SidebarLayout from 'component/layout/sidebar';
import Wrapper from 'component/section/wrapper';
import Linked from 'route/specialists/linked';

import { cv } from 'adapter/api/cv';
import { mainRequest } from 'adapter/api/main';
import { IValue } from 'component/form/select';

import UserItem from './user-item';
import style from './index.module.pcss';

export interface IFormValues {
    search?: string,
    years?: string,
    country?: Array<IValue> | null,
    city?: Array<IValue> | null,
    competencies?: Array<IValue>
}

export const Specialists = () => {
    const cn = useClassnames(style);
    const history = useHistory();
    const { t } = useTranslation();
    const params = useParams<{ requirementId: string, requestId: string, projectId: string }>();
    const qs = useMemo(() => parse(history.location.search), [history.location.search]);

    const defaultValues = {
        country     : [],
        city        : [],
        competencies: [],
        position    : []
    };

    const context = useForm<IFormValues>({
        mode: 'all',
        defaultValues
    });

    const { data, isLoading, refetch } = cv.useGetCvListQuery(normalizeObject(qs), { refetchOnMountOrArgChange: true });
    const { data: requirementData, refetch: reqsRefetch } = mainRequest.useGetMainRequestRequirementByIdQuery(
        { id: params.requirementId },
        { refetchOnMountOrArgChange: true, skip: !params.requirementId }
    );

    const [addToRequest, setAddToRequest] = useState<number | null>();
    const [showModalById, setShowModalById] = useState<number | null>(null);

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
        reqsRefetch();
    }, [JSON.stringify(qs), params]);

    const onClickAddToRequest = useCallback((cvItemId?: number) => {
        setAddToRequest(cvItemId);
    }, [params.requestId]);

    const onClickClose = () => {
        setShowModalById(null);
        setAddToRequest(null);
    };

    const onSubmit = context.handleSubmit(
        (formData) => {
            const objectToNormalize = {
                search              : formData.search,
                years               : formData.years,
                country_id          : formData.country?.map((item) => item?.value),
                city_id             : formData.city?.map((item) => item?.value),
                competencies_ids_any: formData.competencies?.map((comp: IValue) => comp.value)
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

    const onClickLinked = (cvId?: number) => {
        if(cvId) {
            setShowModalById(cvId);
        }
    };

    const onCloseLinked = () => {
        setShowModalById(null);
    };

    const elModal = useMemo(() => {
        if(showModalById) {
            const linkedIds = data?.results.find((item) => item.id === showModalById)?.linked_ids;

            if(linkedIds) {
                return (
                    <Linked
                        linkedIds={linkedIds}
                        onClose={onCloseLinked}
                    />
                );
            }
        }

        if(addToRequest) {
            return (
                <Request
                    projectId={params.projectId}
                    requirementId={params.requirementId}
                    requestId={params.requestId}
                    specialistId={addToRequest}
                    onClickClose={onClickClose}
                />
            );
        }
    }, [showModalById, addToRequest, params.requestId, params.requirementId]);

    const elUsers = () => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.results?.length) {
            return (
                <div className={cn('specialists__users')}>
                    {data.results.map((cvItem) => {
                        const hideAdd = requirementData?.cv_list_ids?.find((item) => String(item) === String(cvItem.id));

                        return (
                            <UserItem
                                key={cvItem.id}
                                cvItem={cvItem}
                                hideAdd={!!hideAdd}
                                onClickAddToRequest={onClickAddToRequest}
                                onClickLinked={onClickLinked}
                            />
                        );
                    })}
                </div>
            );
        }

        return <span className={cn('specialists__users-empty')}>{t('routes.specialists.main.users.empty')}</span>;
    };

    const elSidebar = () => {
        return (
            <Section>
                <Wrapper>
                    <H3>{t('routes.specialists.sidebar.filters.title')}</H3>
                    <FormProvider {...context}>
                        <form className={cn('specialists__form')} onSubmit={onSubmit}>
                            <FormInput
                                name="search"
                                type="search"
                                label={t('routes.specialists.sidebar.filters.form.search.label')}
                                placeholder={t('routes.specialists.sidebar.filters.form.search.placeholder')}
                            />
                            <InputDictionary
                                requestType={InputDictionary.requestType.Position}
                                defaultValue={Array.isArray(qs.position_id) ? qs.position_id : [qs.position_id as string]}
                                name="position"
                                direction="column"
                                placeholder={t('routes.specialists.sidebar.filters.form.position.placeholder')}
                                label={t('routes.specialists.sidebar.filters.form.position.label')}
                                clearable={true}
                            />
                            <InputDictionary
                                requestType={InputDictionary.requestType.Country}
                                defaultValue={Array.isArray(qs.country_id) ? qs.country_id : [qs.country_id as string]}
                                name="country"
                                direction="column"
                                placeholder={t('routes.specialists.sidebar.filters.form.country.placeholder')}
                                label={t('routes.specialists.sidebar.filters.form.country.label')}
                                clearable={true}
                            />
                            <InputDictionary
                                requestType={InputDictionary.requestType.City}
                                defaultValue={Array.isArray(qs.city_id) ? qs.city_id : [qs.city_id as string]}
                                name="city"
                                direction="column"
                                placeholder={t('routes.specialists.sidebar.filters.form.city.placeholder')}
                                label={t('routes.specialists.sidebar.filters.form.city.label')}
                                clearable={true}
                            />
                            <InputDictionary
                                requestType={InputDictionary.requestType.Competence}
                                defaultValue={qs.competencies_ids_any as Array<string>}
                                clearable={true}
                                name="competencies"
                                direction="column"
                                placeholder={t('routes.specialists.sidebar.filters.form.competencies.placeholder')}
                                label={t('routes.specialists.sidebar.filters.form.competencies.label')}
                            />
                            <FormInput
                                name="years"
                                type="text"
                                label={t('routes.specialists.sidebar.filters.form.years.label')}
                                placeholder={t('routes.specialists.sidebar.filters.form.years.placeholder')}
                            />
                            <Button type="submit">
                                {t('routes.specialists.sidebar.filters.buttons.submit')}
                            </Button>
                            <Button type="button" onClick={onClearFilter} isSecondary={true}>
                                {t('routes.specialists.sidebar.filters.buttons.clear')}
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
                    <SectionHeader actions={<AddAction to={SPECIALIST_CREATE} />}>
                        {t('routes.specialists.main.title')}
                    </SectionHeader>
                    {elUsers()}
                </Wrapper>
            </Section>
            {elModal}
        </SidebarLayout>
    );
};

export default Specialists;
