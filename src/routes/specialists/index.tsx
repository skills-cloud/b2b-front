import React, { useMemo, useState, Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { differenceInCalendarYears } from 'date-fns';
import { parse, stringify } from 'query-string';
import debounce from 'lodash.debounce';

import useClassnames from 'hook/use-classnames';

import { useDispatch } from 'component/core/store';
import IconPlus from 'component/icons/plus';
import IconStar from 'component/icons/star';
import IconClose from 'component/icons/close';
import FormInput from 'component/form/input';
import InputSelect from 'component/form/select';
import InputSkills from 'component/form/input-skills';
import InputCountry from 'component/form/input-country';
import UserAvatar from 'component/user/avatar';
import Loader from 'component/loader';
import Modal from 'component/modal';
import useModalClose from 'component/modal/use-modal-close';
import { H2 } from 'component/header';

import { cv } from 'adapter/api/cv';
import { dictionary } from 'adapter/api/dictionary';
import { CvList, CvCareerRead, CvPositionCompetenceRead } from 'adapter/types/cv/cv/get/code-200';
import { IValue } from 'component/form/select/types';

import { normalizeObject } from 'src/helper/normalize-object';

import style from './index.module.pcss';
import InputCity from 'component/form/input-city';

export const Specialists = () => {
    const cn = useClassnames(style);
    const history = useHistory();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const qs = useMemo(() => parse(history.location.search), [history.location.search]);

    const context = useForm({
        mode         : 'all',
        defaultValues: {
            search : qs.search,
            country: {
                value: ''
            },
            city: {
                value: ''
            },
            competencies: []
        }
    });

    const onChangeFilters = () => {
        const formData = context.getValues();
        const objectToNormalize = {
            search              : formData.search || qs.search,
            country_id          : formData.country?.value || qs.country_id,
            city_id             : formData.city?.value || qs.city_id,
            competencies_ids_any: formData.competencies.length ? formData.competencies.map((comp: IValue) => comp.value) : qs.competencies_ids_any
        };

        const searchString = normalizeObject(objectToNormalize);
        const isReplace = Object.values(objectToNormalize).some((item) => {
            if(Array.isArray(item)) {
                return item?.length > 0;
            }

            return !!item;
        });

        if(isReplace) {
            history.replace({
                search: stringify(searchString)
            });
        }
    };

    useEffect(() => {
        onChangeFilters();
    }, [JSON.stringify(context.getValues())]);

    const { data, isLoading, refetch } = cv.useGetCvListQuery(normalizeObject(qs), { refetchOnMountOrArgChange: true });

    useEffect(() => {
        refetch();
    }, [JSON.stringify(qs)]);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [countryId, setCountryId] = useState<string>(qs.country_id as string);

    useModalClose(showModal, setShowModal);

    const fromProject = true;
    const showLinkedParam = true;

    const onLoadPositionOptions = debounce((search_string: string, callback) => {
        dispatch(dictionary.endpoints.getPositionList.initiate({
            search: search_string
        }))
            .then(({ data: loadData }) => {
                if(loadData?.results?.length) {
                    const res = loadData.results.map((item) => ({
                        label: item.name,
                        value: String(item.id)
                    }));

                    callback(res);
                } else {
                    callback(null);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, 150);

    const onChangeCountry = (countryValue: IValue) => {
        setCountryId(countryValue.value);
    };

    const onClickLinked = (cvId?: number) => () => {
        if(cvId) {
            setShowModal(true);
        }
    };

    const onClickClose = () => {
        setShowModal(false);
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

    const elAdditionalBlock = (cvItem?: CvCareerRead, showLinkedItems?: boolean) => {
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
                        {fromProject && (
                            <div className={cn('specialists__user-info-exp-add')}>
                                <IconPlus svg={{ className: cn('specialists__user-info-exp-add-icon') }} />
                            </div>
                        )}
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

    const elUserItem = (cvItem: CvList, showLinkedItems = true) => {
        const firstName = cvItem.first_name;
        const lastName = cvItem.last_name;
        let title = `${firstName || ''} ${lastName || ''}`.trim();
        const subTitle = cvItem.career?.[0].position?.name || '\u2014';

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
                    {elAdditionalBlock(cvItem.career?.[0], showLinkedItems)}
                </div>
                <div className={cn('specialists__user-competencies')}>
                    <p className={cn('specialists__block-title')}>
                        {t('routes.specialists.main.competencies')}
                    </p>
                    {elCompetencies(cvItem.positions?.[0].competencies)}
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
    }, [showModal]);

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
                    <h3 className={cn('specialists__search-header')}>{t('routes.specialists.sidebar.filters.title')}</h3>
                    <FormProvider {...context}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                            onChange={onChangeFilters}
                            className={cn('specialists__form')}
                        >
                            <FormInput
                                name="search"
                                type="search"
                                label={t('routes.specialists.sidebar.filters.form.search.label')}
                                placeholder={t('routes.specialists.sidebar.filters.form.search.placeholder')}
                            />
                            <InputSelect
                                name="position"
                                loadOptions={onLoadPositionOptions}
                                direction="column"
                                placeholder={t('routes.specialists.sidebar.filters.form.position.placeholder')}
                                label={t('routes.specialists.sidebar.filters.form.position.label')}
                                isMulti={true}
                            />
                            <InputCountry
                                defaultValue={[qs.country_id as string]}
                                name="country"
                                direction="column"
                                placeholder={t('routes.specialists.sidebar.filters.form.country.placeholder')}
                                label={t('routes.specialists.sidebar.filters.form.country.label')}
                                onChange={onChangeCountry}
                            />
                            <InputCity
                                defaultValue={[qs.city_id as string]}
                                countryId={countryId}
                                name="city"
                                direction="column"
                                disabled={!countryId}
                                placeholder={t('routes.specialists.sidebar.filters.form.city.placeholder')}
                                label={t('routes.specialists.sidebar.filters.form.city.label')}
                            />
                            <InputSkills
                                defaultValue={qs.competencies_ids_any as Array<string>}
                                name="competencies"
                                direction="column"
                                placeholder={t('routes.specialists.sidebar.filters.form.competencies.placeholder')}
                                label={t('routes.specialists.sidebar.filters.form.competencies.label')}
                            />

                        </form>
                    </FormProvider>
                </div>
            </aside>
            {elModal}
        </div>
    );
};

export default Specialists;
