import React from 'react';

import useClassnames from 'hook/use-classnames';
import { H3 } from 'component/header';
import Separator from 'component/separator';
import IconPencil from 'component/icons/pencil';
import IconDelete from 'component/icons/delete';
import useFormatDistance from 'component/dates/format-distance';

import { CvEducationRead } from 'adapter/types/cv/education/get/code-200';

import style from './index.module.pcss';

interface IEducationList {
    fields?: Array<CvEducationRead>,
    setEducationId: (id: number) => void,
    nextStep: (isDeleteAction: boolean) => void
}

const EducationList = ({ fields, setEducationId, nextStep }: IEducationList) => {
    const cn = useClassnames(style);
    const formatDistance = useFormatDistance();

    if(!fields) {
        return null;
    }

    return (
        <React.Fragment>
            {fields.map(({ education_place, id, date_from, date_to }, index) => {
                const period = formatDistance({ date: new Date(date_from as string), baseDate: new Date(date_to as string) });

                return (
                    <div key={id} className={cn('education')}>
                        <div className={cn('education__row')}>
                            <div>
                                <H3>{education_place?.name}</H3>
                                <p className={cn('education__date')}>
                                    {date_from}&nbsp;&mdash; {date_to}
                                    {' '}
                                    <span className={cn('education__date-distance')}>
                                        {period && `(${period})`}
                                    </span>
                                </p>
                            </div>
                            <div className={cn('education__actions')}>
                                <button
                                    type="button"
                                    className={cn('education__action')}
                                    onClick={() => {
                                        setEducationId(id as number);
                                        nextStep(false);
                                    }}
                                >
                                    <IconPencil svg={{ className: cn('education__icon') }} />
                                </button>
                                <button
                                    type="button"
                                    className={cn('education__action')}
                                    onClick={() => {
                                        setEducationId(id as number);
                                        nextStep(true);
                                    }}
                                >
                                    <IconDelete svg={{ className: cn('education__icon') }} />
                                </button>
                            </div>
                        </div>
                        {index !== fields.length - 1 && <Separator />}
                    </div>
                );
            })}
        </React.Fragment>
    );
};

export default EducationList;
