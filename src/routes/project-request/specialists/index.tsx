import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { differenceInCalendarYears } from 'date-fns';

import useClassnames from 'hook/use-classnames';

import IconStar from 'component/icons/star';
import UserAvatar from 'component/user/avatar';
import Loader from 'component/loader';

import { mainRequest } from 'adapter/api/main';
import { CvInline, CvCareerRead, CvPositionCompetenceRead } from 'adapter/types/main/request-requirement/id/get/code-200';

import style from './index.module.pcss';

export const Specialists = () => {
    const cn = useClassnames(style);
    const { hash } = useLocation();
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();

    const { data, isLoading } = mainRequest.useGetMainRequestByIdQuery({ id });
    const [cvList, setCvList] = useState<Array<CvInline>>([]);

    useEffect(() => {
        const reqsList = data?.requirements?.reduce((acc, current) => {
            if(current.cv_list) {
                current.cv_list.forEach((cv) => {
                    if(!acc.find((item) => item.id === cv.id)) {
                        acc.push(cv);
                    }
                });
            }

            return acc;
        }, [] as Array<CvInline>);

        if(reqsList) {
            setCvList(reqsList);
        }
    }, [JSON.stringify(data)]);

    const elAdditionalBlock = (cvItem?: CvCareerRead) => {
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
                    </div>
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

    const elUserItem = (cvItem: CvInline) => {
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
                    {elAdditionalBlock(cvItem.career?.[0])}
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
                    {cvItem.price || '\u2014'}
                </div>
            </div>
        );
    };

    const elUsers = useMemo(() => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.requirements?.length) {
            const hashValue = hash.slice(1);

            const dataToRender = hashValue === 'all' ? cvList : data?.requirements?.find((item) => String(item.id) === hashValue)?.cv_list;

            if(dataToRender) {
                return (
                    <div className={cn('specialists__users')}>
                        {dataToRender.map((cvItem) => elUserItem(cvItem))}
                    </div>
                );
            }
        }

        return <span className={cn('specialists__users-empty')}>{t('routes.specialists.main.users.empty')}</span>;
    }, [JSON.stringify(data?.requirements), JSON.stringify(cvList), hash, i18n.language, isLoading]);

    return (
        <section className={cn('specialists')}>
            <h2 className={cn('specialists__header')}>{t('routes.specialists.main.title')}</h2>
            {elUsers}
        </section>
    );
};

export default Specialists;
