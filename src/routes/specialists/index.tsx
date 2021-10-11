import React, { useMemo, useState, Fragment, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { differenceInCalendarYears } from 'date-fns';
import { parse, stringify } from 'query-string';

import useClassnames from 'hook/use-classnames';
import { normalizeObject } from 'src/helper/normalize-object';
import useModalClose from 'component/modal/use-modal-close';

import IconPlus from 'component/icons/plus';
import IconStar from 'component/icons/star';
import IconClose from 'component/icons/close';
import FormInput from 'component/form/input';
import InputDictionary from 'component/form/input-dictionary';
import UserAvatar from 'component/user/avatar';
import Loader from 'component/loader';
import Modal from 'component/modal';
import { H2, H3 } from 'component/header';
import Button from 'component/button';
import Request from 'component/request';
import SectionHeader from 'component/section/header';

import { mainRequest } from 'adapter/api/main';
import { cv } from 'adapter/api/cv';
import { CvListReadFull, CvCareerRead, CvPositionCompetenceRead } from 'adapter/types/cv/cv/get/code-200';
import { IValue } from 'component/form/select';

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
    const { t, i18n } = useTranslation();
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
    const [postLinkCv, { isLoading: isLoadingRequest }] = mainRequest.usePostRequestRequirementLinkCvMutation();

    const [fromRequestId, setFromRequestId] = useState<string>('');
    const [addToRequest, setAddToRequest] = useState<number | null>();
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        if(Object.values(qs).length) {
            const newDefaultValues = {
                ...defaultValues,
                ...qs
            };

            if(qs.from_request_id) {
                setFromRequestId(qs.from_request_id as string);
            }

            context.reset(newDefaultValues);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [JSON.stringify(qs)]);

    useModalClose(showModal, setShowModal);

    const showLinkedParam = true;

    const onClickLinked = (cvId?: number) => () => {
        if(cvId) {
            setShowModal(true);
        }
    };

    const onClickAddToRequest = useCallback((cvItemId?: number) => () => {
        if(fromRequestId) {
            if(cvItemId) {
                postLinkCv({
                    id   : fromRequestId,
                    cv_id: String(cvItemId),
                    data : {}
                })
                    .then(() => {
                        console.info('OK');
                    })
                    .catch(console.error);
            }
        } else {
            setAddToRequest(cvItemId);
        }
    }, [fromRequestId]);

    const onClickClose = () => {
        setShowModal(false);
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

    const elModalHeader = () => {
        return (
            <Fragment>
                <H2 className={cn('specialists__modal-header-text')}>
                    {t('routes.specialists.main.linked.title')}
                </H2>
                <div className={cn('specialists__modal-header-close')} onClick={onClickClose}>
                    <IconClose svg={{ className: cn('specialists__modal-header-close-icon') }} />
                </div>
            </Fragment>
        );
    };

    const elAddButton = (cvItemId?: number) => {
        if(isLoadingRequest) {
            return (
                <div className={cn('specialists__user-info-exp-add')}>
                    <Loader />
                </div>
            );
        }

        return (
            <div className={cn('specialists__user-info-exp-add')}>
                <IconPlus
                    svg={{
                        className: cn('specialists__user-info-exp-add-icon'),
                        onClick  : onClickAddToRequest(cvItemId)
                    }}
                />
            </div>
        );
    };

    const elAdditionalBlock = (cvItem?: CvCareerRead, showLinkedItems?: boolean, cvId?: number) => {
        if(cvItem) {
            const dateFrom = cvItem.date_from ? new Date(cvItem.date_from) : new Date();
            const dateTo = cvItem.date_to ? new Date(cvItem.date_to) : new Date();
            const experience = differenceInCalendarYears(dateTo, dateFrom);

            return (
                <div className={cn('specialists__user-info-block')}>
                    <div className={cn('specialists__user-info-exp')}>
                        <div className={cn('specialists__user-info-exp-years')}>
                            {t('routes.specialists.main.experience', {
                                count: experience
                            })}
                        </div>
                        <div className={cn('specialists__user-info-exp-stars')}>
                            <IconStar svg={{ className: cn('specialists__user-info-exp-star-icon') }} />
                            {experience}
                        </div>
                        {elAddButton(cvId)}
                    </div>
                    {showLinkedParam && showLinkedItems && (
                        <div className={cn('specialists__user-linked')} onClick={onClickLinked(cvItem.id)}>
                            {t('routes.specialists.main.show-linked', {
                                count: cvItem.id
                            })}
                        </div>
                    )}
                </div>
            );
        }
    };

    const elCompetencies = (competencies?: Array<CvPositionCompetenceRead>) => {
        if(competencies?.length) {
            return (
                <div className={cn('specialists__competencies')}>
                    {competencies.map((comp) => (
                        <div key={comp.competence_id} className={cn('specialists__competence')}>
                            {comp.competence?.name}
                        </div>
                    ))}
                </div>
            );
        }

        return '\u2014';
    };

    const elUserItem = (cvItem: CvListReadFull, showLinkedItems = true) => {
        const firstName = cvItem.first_name;
        const lastName = cvItem.last_name;
        let title = `${firstName || ''} ${lastName || ''}`.trim();
        const subTitle = cvItem.career?.[0]?.position?.name || '\u2014';

        if(!firstName && !lastName) {
            title = t('routes.specialists.main.first-name');
        }

        return (
            <div key={cvItem.id} className={cn('specialists__user')}>
                <div className={cn('specialists__user-info')}>
                    <UserAvatar
                        className={cn('specialists__user-info-avatar')}
                        title={title}
                        subTitle={subTitle}
                        titleTo={`/specialists/${cvItem.id}`}
                        avatar={{
                            src: cvItem.photo
                        }}
                    />
                    {elAdditionalBlock(cvItem.career?.[0], showLinkedItems, cvItem.id)}
                </div>
                <div className={cn('specialists__user-competencies')}>
                    <p className={cn('specialists__block-title')}>
                        {t('routes.specialists.main.competencies')}
                    </p>
                    {elCompetencies(cvItem.positions?.[0]?.competencies)}
                </div>
                <div className={cn('specialists__user-rate')}>
                    <p className={cn('specialists__block-title')}>
                        {t('routes.specialists.main.rate')}
                    </p>
                    {'\u2014'}
                </div>
            </div>
        );
    };

    const elModal = useMemo(() => {
        if(showModal) {
            return (
                <Modal header={elModalHeader()}>
                    <div className={cn('specialists__users-modal')}>
                        <div className={cn('specialists__users')}>
                            {data?.results.map((cvItem) => elUserItem(cvItem, false))}
                        </div>
                    </div>
                </Modal>
            );
        }

        if(addToRequest) {
            return <Request showModal={Boolean(addToRequest)} specialistId={addToRequest} onClickClose={onClickClose} />;
        }
    }, [showModal, addToRequest]);

    const elUsers = useMemo(() => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.results?.length) {
            return (
                <div className={cn('specialists__users')}>
                    {data.results.map((cvItem) => elUserItem(cvItem))}
                </div>
            );
        }

        return <span className={cn('specialists__users-empty')}>{t('routes.specialists.main.users.empty')}</span>;
    }, [JSON.stringify(data?.results), i18n.language, isLoading]);

    return (
        <main className={cn('specialists')}>
            <section className={cn('specialists__main')}>
                <div className={cn('specialists__main-top')}>
                    <SectionHeader>{t('routes.specialists.main.title')}</SectionHeader>
                    <Link
                        to="/specialists/create"
                        className={cn('specialists__main-button')}
                    >
                        <IconPlus />
                    </Link>
                </div>
                {elUsers}
            </section>
            <aside>
                <div className={cn('specialists__search')}>
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
                </div>
            </aside>
            {elModal}
        </main>
    );
};

export default Specialists;
