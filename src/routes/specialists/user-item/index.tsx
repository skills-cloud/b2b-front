import React from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInCalendarYears } from 'date-fns';

import { SPECIALIST_ID } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';

import UserAvatar from 'component/user/avatar';
import StarRating from 'component/star-rating';
import IconApply from 'component/icons/apply';
import IconPlus from 'component/icons/plus';

import { CvListReadFull, CvPositionCompetenceRead } from 'adapter/types/cv/cv/get/code-200';

import style from './index.module.pcss';

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

    const elCompetencies = (competencies?: Array<CvPositionCompetenceRead>) => {
        if(competencies?.length) {
            return (
                <div className={cn('user-item__competencies')}>
                    {competencies.map((comp) => (
                        <div key={comp.competence_id} className={cn('user-item__competence')}>
                            {comp.competence?.name}
                        </div>
                    ))}
                </div>
            );
        }

        return '\u2014';
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

        if(props.cvItem && cvItemCareer) {
            const dateFrom = cvItemCareer.date_from ? new Date(cvItemCareer.date_from) : new Date();
            const dateTo = cvItemCareer.date_to ? new Date(cvItemCareer.date_to) : new Date();
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
                        {elAddButton(cvItemCareer.id)}
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
        const subTitle = props.cvItem.career?.[0]?.position?.name || '\u2014';

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
                {'\u2014'}
            </div>
        </div>
    );
};

UserItem.defaultProps = defaultProps;

export default UserItem;
