import React from 'react';
import { useClassnames } from 'hook/use-classnames';

import FormDate from 'component/form/date';

import style from './index.module.pcss';

interface IDeadlineDates {
    nameDateFrom?: string,
    nameDateTo?: string,
    defaultValues?: {
        dateFrom?: string,
        dateTo?: string
    },
    labels: {
        dateFrom?: string,
        dateTo?: string
    }
}

const DeadlineDates = ({ nameDateFrom = 'date_from', nameDateTo = 'date_to', defaultValues, labels }: IDeadlineDates) => {
    const cn = useClassnames(style);

    return (
        <div className={cn('deadline-dates')}>
            <FormDate
                name={nameDateFrom}
                label={labels.dateFrom}
                direction="column"
                defaultValue={defaultValues?.dateFrom}
            />
            <div className={cn('deadline-dates__separator')} />
            <FormDate
                name={nameDateTo}
                label={labels.dateTo}
                direction="column"
                defaultValue={defaultValues?.dateTo}
            />
        </div>
    );
};

export default DeadlineDates;
