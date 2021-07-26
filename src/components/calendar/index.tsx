import React, { useCallback, useState, MouseEvent } from 'react';
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
    Locale
} from 'date-fns';
import { ru } from 'date-fns/locale';

import useClassnames, { IStyle } from 'hook/use-classnames';

import IconArrowLeft from 'component/icons/arrow-left';
import IconArrowRight from 'component/icons/arrow-right';
import IconBurger from 'component/icons/burger';

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
    busyPeriods?: Array<[string, string]>
}

export const defaultProps = {
    initialDate : new Date(),
    weekStartsOn: 1,
    hidePastDate: false,
    locale      : ru
};

export const DatePickerCalendar = (props: IProps & typeof defaultProps) => {
    const cn = useClassnames(style, props.className, true);
    const [firstDate, setFirstDate] = useState(props.initialDate);
    const [secondDate, setSecondDate] = useState(addMonths(props.initialDate, 1));
    const [showMonthModal, setShowMonthModal] = useState<boolean>(false);

    const isBusy = useCallback((value: Date) => {
        if(value && props.busyPeriods?.length) {
            const periods = props.busyPeriods.map((item) => ({
                start: parse(item[0], 'yyyy-MM-dd', new Date()),
                end  : parse(item[1], 'yyyy-MM-dd', new Date())
            }));

            for(const period of periods) {
                if(isWithinInterval(value, period)) {
                    return true;
                }
            }
        }

        return false;
    }, [props.busyPeriods]);

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
                        return (
                            <span
                                key={day.getTime()}
                                className={cn('date-picker-calendar__day', {
                                    'date-picker-calendar__day_is-another'  : !isSameMonth(isSecond ? secondDate : firstDate, day),
                                    // 'date-picker-calendar__day_is-half-busy': Math.random() > 0.5,
                                    'date-picker-calendar__day_is-full-busy': isBusy(day),
                                    'date-picker-calendar__day_is-select'   : props.selected?.some((item) => isSameDay(item, day))
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
