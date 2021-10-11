import React from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames from 'hook/use-classnames';
import { H4 } from 'component/header';
import Separator from 'component/separator';
import IconPencil from 'component/icons/pencil';
import IconDelete from 'component/icons/delete';
import useFormatDistance from 'component/dates/format-distance';

import { CvCareerRead } from 'adapter/types/cv/career/get/code-200';

import style from './index.module.pcss';

interface ICareerList {
    fields?: Array<CvCareerRead>,
    setCareerId: (id: number) => void,
    nextStep: (isDeleteAction: boolean) => void
}

const CareerList = ({ fields, setCareerId, nextStep }: ICareerList) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const formatDistance = useFormatDistance();

    if(!fields?.length) {
        return (
            <p className={cn('career-list__empty')}>
                {t('routes.person.career.empty')}
            </p>
        );
    }

    return (
        <div className={cn('career-list')}>
            {fields.map((career, index) => {
                const period = career.date_from && career.date_to && formatDistance({ date: new Date(career.date_from), baseDate: new Date(career.date_to) });

                return (
                    <div key={career.id} className={cn('career-list__item')}>
                        <div className={cn('career-list__row')}>
                            <div>
                                <H4>{career.organization?.name}</H4>
                                <p className={cn('career-list__date')}>
                                    {career.date_from}&nbsp;&mdash; {career.date_to}
                                    {' '}
                                    <span className={cn('career-list__date-distance')}>
                                        {period && `(${period})`}
                                    </span>
                                </p>
                            </div>
                            <div className={cn('career-list__actions')}>
                                <button
                                    type="button"
                                    className={cn('career-list__action')}
                                    onClick={() => {
                                        career.id && setCareerId(career.id);
                                        nextStep(false);
                                    }}
                                >
                                    <IconPencil svg={{ className: cn('career-list__icon') }} />
                                </button>
                                <button
                                    type="button"
                                    className={cn('career-list__action')}
                                    onClick={() => {
                                        career.id && setCareerId(career.id);
                                        nextStep(true);
                                    }}
                                >
                                    <IconDelete svg={{ className: cn('career-list__icon') }} />
                                </button>
                            </div>
                        </div>
                        {index !== fields.length - 1 && <Separator />}
                    </div>
                );
            })}
        </div>
    );
};

export default CareerList;
