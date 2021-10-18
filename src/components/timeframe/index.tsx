import React from 'react';
import { format } from 'date-fns';

const FORMAT_DATE = 'dd.MM.yyyy';

interface ITimeframe {
    startDate?: string,
    endDate?: string
}

const Timeframe = ({ startDate, endDate }: ITimeframe) => {
    if(!(startDate && endDate)) {
        return null;
    }
    const dateFrom = format(new Date(startDate), FORMAT_DATE);
    const dateTo = format(new Date(endDate), FORMAT_DATE);

    return <React.Fragment>{dateFrom}&nbsp;&mdash; {dateTo}</React.Fragment>;
};

export default Timeframe;
