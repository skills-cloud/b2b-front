import React from 'react';

import DatePickerCalendar, { IProps, defaultProps } from './';

export default {
    title    : 'Shepherd/Component/Date Picker/Calendar',
    component: DatePickerCalendar,
    args     : {
        ...defaultProps
    }
};

export const Base = (props: IProps) => <DatePickerCalendar {...props} />;

export const SingleSelected = (props: IProps) => <DatePickerCalendar {...props} selected={[new Date()]} />;

const MULTI_SELECTED = [new Date(), new Date(), new Date()];

MULTI_SELECTED[1].setDate(MULTI_SELECTED[1].getDate() + 2);
MULTI_SELECTED[2].setDate(MULTI_SELECTED[2].getDate() + 8);

export const MultiSelected = (props: IProps) => <DatePickerCalendar {...props} selected={MULTI_SELECTED} />;

