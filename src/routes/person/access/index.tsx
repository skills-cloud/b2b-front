import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { cv } from 'adapter/api/cv';
import useClassnames from 'hook/use-classnames';
import DatePickerCalendar from 'component/calendar';
import IconPencil from 'component/icons/pencil';
import Modal from 'component/modal';
import Button from 'component/button';
import Input from 'component/form/input';
import InputRadio from 'component/form/radio';
import DateInput from 'component/form/date';

import style from './index.module.pcss';

export interface IProps {
    id: string
}

const Access = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { data } = cv.useGetTimeSlotQuery({
        cv_id: 1
    });
    const [setTimeSlot] = cv.useSetTimeSlotMutation();

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [dayToEdit, setDayToEdit] = useState<Date>(new Date());

    const methods = useForm({
        defaultValues: {
            date_start: format(dayToEdit, 'yyyy-MM-dd', { locale: ru }),
            date_end  : format(dayToEdit, 'yyyy-MM-dd', { locale: ru }),
            rate_day  : ''
        }
    });

    const onClickDay = (date: Date) => {
        setIsEdit(true);
        setDayToEdit(date);
    };

    const onCloseEdit = () => {
        setIsEdit(false);
        setDayToEdit(new Date());
    };

    const onSubmit = methods.handleSubmit(
        (formData) => {
            void setTimeSlot({
                cv_id                : 1,
                date_from            : formData.date_start,
                date_to              : formData.date_end,
                type_of_employment_id: 1,
                price                : parseInt(formData.rate_day, 10)
            })
                .unwrap()
                .then(() => {
                    setIsEdit(false);
                    methods.reset();
                });

            console.info('FORM DATA', formData);
        },
        (formError) => {
            console.info('FORM ERROR', formError);
        }
    );

    const elFooter = () => {
        return (
            <div className={cn('access__modal-footer')}>
                <Button className={cn('access__modal-close')} isSecondary={true} onClick={onCloseEdit}>
                    {t('routes.person.common.access.buttons.cancel')}
                </Button>
                <Button onClick={onSubmit}>
                    {t('routes.person.common.access.buttons.save')}
                </Button>
            </div>
        );
    };

    const elEditWindow = () => {
        if(isEdit) {
            return (
                <Modal className={cn('')} footer={elFooter()} header={t('routes.person.common.access.title')}>
                    <FormProvider {...methods}>
                        <form className={cn('access__form')}>
                            <div className={cn('access__field-set')}>
                                <DateInput
                                    name="date_start"
                                    direction="column"
                                    label={t('routes.person.common.access.form.start')}
                                    defaultValue={format(dayToEdit, 'yyyy-MM-dd', { locale: ru })}
                                />
                                <DateInput
                                    name="date_end"
                                    direction="column"
                                    label={t('routes.person.common.access.form.end')}
                                    defaultValue={format(dayToEdit, 'yyyy-MM-dd', { locale: ru })}
                                />
                            </div>
                            <InputRadio
                                name="access"
                                direction="column"
                                optionsDirection="column"
                                label={t('routes.person.common.access.form.access.title')}
                                options={[{
                                    value: 'no',
                                    label: 'Недоступен'
                                }, {
                                    value: 'part',
                                    label: 'Частично доступен'
                                }, {
                                    value: 'full',
                                    label: 'Доступен'
                                }]}
                            />
                            <div className={cn('access__field-rate')}>
                                <h3 className={cn('access__rate-title')}>
                                    {t('routes.person.common.access.form.rate.title')}
                                </h3>
                                <div className={cn('access__field-set')}>
                                    <Input
                                        type="text"
                                        name="rate_day"
                                        label={t('routes.person.common.access.form.rate.hour')}
                                    />
                                    <Input
                                        type="text"
                                        name="rate_month"
                                        label={t('routes.person.common.access.form.rate.month')}
                                    />
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </Modal>
            );
        }
    };

    const busyPeriods = useMemo(() => {
        if(data?.results) {
            const periods = data.results.filter((item) => item.date_to && item.date_from);

            return periods.map((item) => [item.date_from, item.date_to]) as Array<[string, string]>;
        }
    }, [data?.results]);

    return (
        <div id={props.id} className={cn('access')}>
            <div className={cn('access__info-content-header')}>
                <h2>{t('routes.person.common.access.title')}</h2>
                <div
                    className={cn('access__control')}
                    onClick={() => {
                        setIsEdit(true);
                    }}
                >
                    <IconPencil />
                </div>
            </div>
            <DatePickerCalendar
                onClickDay={onClickDay}
                busyPeriods={busyPeriods}
            />
            {elEditWindow()}
        </div>
    );
};

export default Access;
