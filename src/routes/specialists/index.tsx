import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { parse, stringify } from 'query-string';

import { IParams, SPECIALIST_CREATE } from 'helper/url-list';
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
    position?: Array<IValue> | null,
    competencies?: Array<IValue>
}

export const Specialists = () => {
    const cn = useClassnames(style);
    const history = useHistory();
    const { t } = useTranslation();
    const params = useParams<IParams>();
    const qs = useMemo(() => parse(history.location.search), [history.location.search]);

    const context = useForm<IFormValues>({
        mode         : 'all',
        defaultValues: qs
    });
    const values = context.watch();

    const { data, isLoading, isFetching, refetch } = cv.useGetCvListQuery(normalizeObject(qs));
    const { data: requirementData, refetch: reqsRefetch } = mainRequest.useGetMainRequestRequirementByIdQuery(
        { id: params.requirementId },
        { refetchOnMountOrArgChange: true, skip: !params.requirementId }
    );

    const [addToRequest, setAddToRequest] = useState<number | null>();
    const [showModalById, setShowModalById] = useState<number | null>(null);

    useEffect(() => {
        const { country, position, city, competencies, ...otherValues } = values;

        history.push({
            search: stringify({
                ...otherValues,
                ...(country ? { country_id: country?.map((item) => item?.value) } : {}),
                ...(position ? { position_id: position?.map((item) => item?.value) } : {}),
                ...(city ? { city_id: city.map((item) => item?.value) } : {}),
                ...(competencies ? { competencies_ids_any: competencies.map((item) => item?.value) } : {})
            }, {
                skipEmptyString: true
            })
        });
    }, [JSON.stringify(values)]);

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

    const onClearFilter = () => {
        context.reset({
            search      : '',
            years       : '',
            country     : [],
            city        : [],
            competencies: [],
            position    : []
        });
    };

    const onClickLinked = (cvId?: number) => {
        if(cvId) {
            setShowModalById(cvId);
        }
    };

    const onCloseLinked = () => {
        setShowModalById(null);
    };

    // Хз зачем тут сабмит
    const onSubmit = context.handleSubmit(
        () => void(0),
        (formError) => {
            console.error(formError);
        }
    );

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
                            <Button disabled={isFetching} isLoading={isFetching} type="submit">
                                {t('routes.specialists.sidebar.filters.buttons.submit')}
                            </Button>
                            <Button disabled={isFetching} type="button" onClick={onClearFilter} isSecondary={true}>
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
