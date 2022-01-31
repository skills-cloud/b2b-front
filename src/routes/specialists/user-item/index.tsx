import React, { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInCalendarYears } from 'date-fns';

import { SPECIALIST_ID } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';

import UserAvatar from 'component/user/avatar';
import StarRating from 'component/star-rating';
import IconApply from 'component/icons/apply';
import IconPlus from 'component/icons/plus';

import { CvListReadFull } from 'adapter/types/cv/cv/get/code-200';

import style from './index.module.pcss';
import Empty from 'component/empty';

export interface IProps {
    cvItem: CvListReadFull,
    showLinkedItems?: boolean,
    hideAdd?: boolean,
    onClickAddToRequest?(cvId: number): void,
    onClickLinked?(cvId: number): void
}

const defaultProps = {
    showLinkedItems: true
};

const UserItem = (props: IProps & typeof defaultProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    const onClickLinked = (cvId?: number) => () => {
        if(cvId) {
            props.onClickLinked?.(cvId);
        }
    };

    const elCompetencies = () => {
        // const competencies = props.cvItem?.positions?.reduce((acc, curr) => {
        //     if(curr.competencies?.length) {
        //         acc.push(...curr.competencies);
        //     }
        //
        //     return acc;
        // }, [] as Array<CvPositionCompetenceRead>);

        if(props.cvItem?.positions?.[0]?.competencies?.length) {
            let competenceToRender = props.cvItem.positions[0].competencies;

            if(competenceToRender.length >= 10) {
                competenceToRender = competenceToRender.slice(0, 9);
            }

            return (
                <div className={cn('user-item__competencies')}>
                    {competenceToRender.map((comp) => (
                        <div key={comp.competence_id} className={cn('user-item__competence')}>
                            {comp.competence?.name}
                        </div>
                    ))}
                </div>
            );
        }

        return <Empty textPosition="left">{t('routes.person.blocks.competencies.empty-text')}</Empty>;
    };

    const elAddButton = (cvId?: number) => {
        if(cvId) {
            if(props.hideAdd) {
                return <IconApply svg={{ className: cn('user-item__user-apply-icon') }} />;
            }

            return (
                <div className={cn('user-item__user-info-exp-add')}>
                    <IconPlus
                        svg={{
                            className: cn('user-item__user-info-exp-add-icon'),
                            onClick  : () => props.onClickAddToRequest?.(cvId)
                        }}
                    />
                </div>
            );
        }
    };

    const elAdditionalBlock = () => {
        const cvItemCareer = props.cvItem?.career?.[0];

        if(props.cvItem) {
            const dateFrom = cvItemCareer?.date_from ? new Date(cvItemCareer.date_from) : new Date();
            const dateTo = cvItemCareer?.date_to ? new Date(cvItemCareer.date_to) : new Date();
            const experience = differenceInCalendarYears(dateTo, dateFrom);
            const showLinkedParam = props.cvItem.linked_ids;

            return (
                <div className={cn('user-item__user-info-block')}>
                    <div className={cn('user-item__user-info-exp')}>
                        <div className={cn('user-item__user-info-exp-years')}>
                            {t('routes.specialists.main.experience', {
                                count: experience
                            })}
                        </div>
                        <StarRating rating={props.cvItem.rating} />
                        {elAddButton(props.cvItem.id)}
                    </div>
                    {showLinkedParam && showLinkedParam.length > 0 && props.showLinkedItems && (
                        <div className={cn('user-item__user-linked')} onClick={onClickLinked(props.cvItem.id)}>
                            {t('routes.specialists.main.show-linked', {
                                count: showLinkedParam.length
                            })}
                        </div>
                    )}
                </div>
            );
        }
    };

    const elUserAvatar = () => {
        const firstName = props.cvItem.first_name;
        const lastName = props.cvItem.last_name;
        let title = `${firstName || ''} ${lastName || ''}`.trim();

        let subTitle: ReactNode = props.cvItem.positions?.[0]?.title || props.cvItem.positions?.[0]?.position?.name || props.cvItem.career?.[0]?.position?.name;

        if(!subTitle) {
            subTitle = <Empty textPosition="left">{t('routes.person.blocks.competencies.empty-text')}</Empty>;
        }

        if(!firstName && !lastName) {
            title = t('routes.specialists.main.first-name');
        }

        return (
            <UserAvatar
                className={cn('user-item__user-info-avatar')}
                title={title}
                subTitle={subTitle}
                titleTo={SPECIALIST_ID(props.cvItem.id)}
                avatar={{
                    src: props.cvItem.photo
                }}
            />
        );
    };

    const elPrice = useMemo(() => {
        if(props.cvItem.price) {
            return (
                <span className={cn('user-item__price')}>
                    {t('routes.person.blocks.competencies.price', { value: props.cvItem.price })}
                </span>
            );
        }

        return <Empty textPosition="left">{t('routes.person.blocks.competencies.empty-text')}</Empty>;
    }, [props.cvItem.price]);

    return (
        <div className={cn('user-item')}>
            <div className={cn('user-item__info')}>
                {elUserAvatar()}
                {elAdditionalBlock()}
            </div>
            <div className={cn('user-item__user-competencies')}>
                <p className={cn('user-item__block-title')}>
                    {t('routes.specialists.main.competencies')}
                </p>
                {elCompetencies()}
            </div>
            <div className={cn('user-item__user-rate')}>
                <p className={cn('user-item__block-title')}>
                    {t('routes.specialists.main.rate')}
                </p>
                {elPrice}
            </div>
        </div>
    );
};

UserItem.defaultProps = defaultProps;

export default UserItem;
