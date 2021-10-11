import React, { useCallback, useState, MouseEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    parse,
    isWithinInterval,
    addMonths,
    getMonth,
    setMonth,
    startOfWeek,
    isWeekend,
    lastDayOfWeek,
    startOfYear,
    lastDayOfYear,
    eachMonthOfInterval,
    eachDayOfInterval,
    isThisMonth,
    isSameMonth,
    isSameYear,
    format,
    eachWeekOfInterval,
    startOfMonth,
    endOfMonth,
    endOfWeek,
    isSameDay,
    Locale,
    isAfter
} from 'date-fns';
import { ru } from 'date-fns/locale';

import useClassnames, { IStyle } from 'hook/use-classnames';
import { useDispatch } from 'component/core/store';

import IconArrowLeft from 'component/icons/arrow-left';
import IconArrowRight from 'component/icons/arrow-right';
import IconBurger from 'component/icons/burger';
import Tooltip from 'component/tooltip';

import { mainRequest } from 'adapter/api/main';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    locale?: Locale,
    initialDate?: Date,
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
    minDate?: Date,
    maxDate?: Date,
    hidePastDate?: boolean,
    selected?: Array<Date>,
    onClickDay?(date: Date): void,
    busyPeriods?: Array<{
        dates: Array<string>,
        emp_id: number,
        organization_project_id?: number
    }>
}

export const defaultProps = {
    initialDate : new Date(),
    weekStartsOn: 1,
    hidePastDate: false,
    locale      : ru
};

interface IOrganizationProject {
    name: string,
    id: number
}

export const DatePickerCalendar = (props: IProps & typeof defaultProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [firstDate, setFirstDate] = useState(props.initialDate);
    const [secondDate, setSecondDate] = useState(addMonths(props.initialDate, 1));
    const [showMonthModal, setShowMonthModal] = useState<boolean>(false);
    const [organizationsNames, setOrganizationsNames] = useState<Array<IOrganizationProject>>([]);

    useEffect(() => {
        if(props.busyPeriods) {
            const organizationIds = props.busyPeriods.reduce((acc, curr) => {
                if(!acc.includes(curr.organization_project_id as number)) {
                    acc.push(curr.organization_project_id as number);
                }

                return acc;
            }, [] as Array<number>);

            Promise.all(organizationIds.map((orgId) => {
                return dispatch(mainRequest.endpoints.getMainOrganizationProjectById.initiate({ id: String(orgId) }))
                    .then(({ data }) => data);
            }))
                .then((resp) => {
                    const newOrganizationsNames = resp.map((item) => {
                        let name = item?.name;

                        if(item?.organization?.name) {
                            name = `${item.organization.name} - ${name}`;
                        }

                        return {
                            name: name as string ?? t('components.calendar.name-empty'),
                            id  : item?.id as number
                        };
                    });

                    setOrganizationsNames(newOrganizationsNames);
                })
                .catch(console.error);
        }
    }, [JSON.stringify(props.busyPeriods)]);

    const isBusy = useCallback((value: Date) => {
        if(value && props.busyPeriods?.length) {
            const periods = props.busyPeriods
                .filter((item) => isAfter(new Date(item.dates[1]), new Date(item.dates[0])))
                .map((item) => ({
                    start : parse(item.dates[0], 'yyyy-MM-dd', new Date()),
                    end   : parse(item.dates[1], 'yyyy-MM-dd', new Date()),
                    emp_id: item.emp_id,
                    name  : organizationsNames.find((org) => org.id === item.organization_project_id)?.name
                }));

            for(const period of periods) {
                if(isWithinInterval(value, period)) {
                    return {
                        status: period.emp_id,
                        name  : period.name
                    };
                }
            }
        }

        return {
            status: null,
            name  : null
        };
    }, [props.busyPeriods, JSON.stringify(organizationsNames)]);

    const onClickArrow = useCallback((amount: number) => (e: MouseEvent) => {
        e.preventDefault();

        setFirstDate(addMonths(firstDate, amount));
        setSecondDate(addMonths(firstDate, amount + 1));
    }, [firstDate, secondDate]);

    const onClickShowMonth = () => {
        setShowMonthModal((oldState) => !oldState);
    };

    const elMonthModal = () => {
        if(showMonthModal) {
            const months = eachMonthOfInterval({
                start: startOfYear(firstDate),
                end  : lastDayOfYear(firstDate)
            });

            return (
                <ul className={cn('date-picker-calendar__months')}>
                    {months.map((month) => {
                        return (
                            <li
                                key={month.getTime()}
                                onClick={() => {
                                    setFirstDate(setMonth(firstDate, getMonth(month)));
                                    setSecondDate(setMonth(secondDate, getMonth(month) + 1));
                                }}
                                className={cn('date-picker-calendar__month', {
                                    'date-picker-calendar__month_is-current' : isThisMonth(month),
                                    'date-picker-calendar__month_is-selected': isSameMonth(month, firstDate)
                                })}
                            >
                                {format(month, 'MMM', {
                                    locale      : props.locale,
                                    weekStartsOn: props.weekStartsOn
                                })}
                            </li>
                        );
                    })}
                </ul>
            );
        }
    };

    const elMonths = () => {
        const isSameYearBoth = isSameYear(firstDate, secondDate);
        const formatString = isSameYearBoth ? 'LLLL' : 'LLLL yyyy';
        const firstMonth = format(firstDate, formatString, { locale: props.locale });
        const secondMonth = format(secondDate, formatString, { locale: props.locale });
        const year = isSameYearBoth ? format(firstDate, 'yyyy') : '';
        const value = `${firstMonth} - ${secondMonth} ${year}`.trim();

        return (
            <div onClick={onClickShowMonth} className={cn('date-picker-calendar__month-control')}>
                <IconBurger svg={{ className: cn('date-picker-calendar__icon') }} />
                {value}
            </div>
        );
    };

    const elWeekdays = (isSecond?: boolean) => {
        const days = eachDayOfInterval({
            start: startOfWeek(isSecond ? secondDate : firstDate, {
                locale      : props.locale,
                weekStartsOn: props.weekStartsOn
            }),
            end: lastDayOfWeek(isSecond ? secondDate : firstDate, {
                locale      : props.locale,
                weekStartsOn: props.weekStartsOn
            })
        });

        return (
            <ul className={cn('date-picker-calendar__weekdays')}>
                {days.map((day) => (
                    <li
                        key={day.getTime()}
                        className={cn('date-picker-calendar__weekday', {
                            'date-picker-calendar__weekday_is-end': isWeekend(day)
                        })}
                        children={format(day, 'eeeeee', {
                            locale      : props.locale,
                            weekStartsOn: props.weekStartsOn
                        })}
                    />
                ))}
            </ul>
        );
    };

    const elDays = (isSecond?: boolean) => {
        const weeks = eachWeekOfInterval({
            start: startOfMonth(isSecond ? secondDate : firstDate),
            end  : endOfMonth(isSecond ? secondDate : firstDate)
        }, {
            locale      : props.locale,
            weekStartsOn: props.weekStartsOn
        });

        return (
            <div className={cn('date-picker-calendar__days')}>
                {weeks.map((week) => {
                    const days = eachDayOfInterval({
                        start: week,
                        end  : endOfWeek(week, {
                            locale      : props.locale,
                            weekStartsOn: props.weekStartsOn
                        })
                    });

                    return days.map((day) => {
                        const dayInfo = isBusy(day);
                        const content = (
                            <span
                                key={day.getTime()}
                                className={cn('date-picker-calendar__day', `date-picker-calendar__day_${dayInfo.status}`, {
                                    'date-picker-calendar__day_is-another': !isSameMonth(isSecond ? secondDate : firstDate, day),
                                    'date-picker-calendar__day_is-select' : props.selected?.some((item) => isSameDay(item, day))
                                })}
                                onClick={() => {
                                    props.onClickDay?.(day);
                                }}
                                children={format(day, 'd', {
                                    locale      : props.locale,
                                    weekStartsOn: props.weekStartsOn
                                })}
                            />
                        );

                        if(dayInfo.name) {
                            return (
                                <Tooltip
                                    key={day.getTime()}
                                    content={dayInfo.name}
                                    theme="dark"
                                    className={cn('date-picker-calendar__day-wrapper')}
                                >
                                    {content}
                                </Tooltip>
                            );
                        }

                        return (
                            <div key={day.getTime()} className={cn('date-picker-calendar__day-wrapper')}>
                                {content}
                            </div>
                        );
                    });
                })}
            </div>
        );
    };

    return (
        <div className={cn('date-picker-calendar')}>
            <section className={cn('date-picker-calendar__calendars')}>
                <div className={cn('date-picker-calendar__item')}>
                    <header className={cn('date-picker-calendar__header')}>
                        {format(firstDate, 'LLLL yyyy', {
                            locale: props.locale
                        })}
                    </header>
                    {elWeekdays()}
                    {elDays()}
                </div>
                <div className={cn('date-picker-calendar__item')}>
                    <header className={cn('date-picker-calendar__header')}>
                        {format(secondDate, 'LLLL yyyy', {
                            locale: props.locale
                        })}
                    </header>
                    {elWeekdays(true)}
                    {elDays(true)}
                </div>
            </section>
            <div className={cn('date-picker-calendar__controls')}>
                {elMonths()}
                {elMonthModal()}
                <div className={cn('date-picker-calendar__control-arrows')}>
                    <IconArrowLeft
                        svg={{
                            className: cn('date-picker-calendar__icon'),
                            onClick  : onClickArrow(-2)
                        }}
                    />
                    <IconArrowRight
                        svg={{
                            className: cn('date-picker-calendar__icon'),
                            onClick  : onClickArrow(2)
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

DatePickerCalendar.defaultProps = defaultProps;

export default DatePickerCalendar;
