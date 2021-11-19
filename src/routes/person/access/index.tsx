import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { format, isWithinInterval, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';

import DatePickerCalendar from 'component/calendar';
import IconPencil from 'component/icons/pencil';
import Modal from 'component/modal';
import Button from 'component/button';
import Input from 'component/form/input';
import InputRadio from 'component/form/radio';
import DateInput from 'component/form/date';

import { timeslot } from 'adapter/api/timeslot';
import { dictionary } from 'adapter/api/dictionary';
import { CvTimeSlotRead } from 'adapter/types/cv/cv/id/get/code-200';

import style from './index.module.pcss';

export interface IProps {
    id: string
}

const Access = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { specialistId } = useParams<IParams>();
    const { data: timeSlotData } = timeslot.useGetTimeSlotQuery({ cv_id: parseInt(specialistId, 10) });
    const { data: typeOfEmployment } = dictionary.useGetTypeOfEmploymentQuery(undefined);
    const [setTimeSlot, { isLoading }] = timeslot.useSetTimeSlotMutation();
    const [patchTimeSlot, { isLoading: isPatchLoading }] = timeslot.usePatchTimeSlotByIdMutation();

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [dayToEdit, setDayToEdit] = useState<Date>(new Date());
    const [activeTimeSlotId, setActiveTimeSlotId] = useState<number | null>(null);

    const methods = useForm({
        defaultValues: {
            date_from         : format(dayToEdit, 'yyyy-MM-dd', { locale: ru }),
            date_to           : format(dayToEdit, 'yyyy-MM-dd', { locale: ru }),
            price             : 0,
            type_of_employment: {
                value: 0,
                label: ''
            }
        }
    });

    const busyPeriodsWithId = useMemo(() => {
        if(timeSlotData?.results) {
            const periods = timeSlotData.results.filter((item) => item.date_to && item.date_from);

            return periods.map((item) => ({
                dates                  : [item.date_from || '', item.date_to || ''],
                id                     : item.id || '',
                emp                    : item.type_of_employment,
                organization_project_id: item.organization_project_id
            }));
        }
    }, [timeSlotData?.results]);

    const onClickDay = (date: Date) => {
        const periods = busyPeriodsWithId?.map((item) => ({
            start: item.dates[0] ? parse(item.dates[0], 'yyyy-MM-dd', new Date()) : 0,
            end  : item.dates[1] ? parse(item.dates[1], 'yyyy-MM-dd', new Date()) : 0,
            id   : item.id,
            emp  : item.emp
        })) || [];

        let currentPeriod: CvTimeSlotRead | undefined;

        for(const period of periods) {
            if(isWithinInterval(date, period)) {
                setActiveTimeSlotId(period.id as number);
                currentPeriod = timeSlotData?.results.find((item) => period.id === item.id);
            }
        }

        setIsEdit(true);
        setDayToEdit(date);

        if(currentPeriod) {
            const newTypeOfEmployment = {
                value: currentPeriod.type_of_employment?.id as number,
                label: currentPeriod.type_of_employment?.name as string
            };

            methods.setValue('date_from', currentPeriod.date_from || '');
            methods.setValue('date_to', currentPeriod.date_to || '');
            methods.setValue('price', currentPeriod.price as number);
            methods.setValue('type_of_employment', newTypeOfEmployment);
        } else {
            const value = format(date, 'yyyy-MM-dd', { locale: ru });

            methods.setValue('date_from', value);
            methods.setValue('date_to', value);
        }
    };

    const onCloseEdit = () => {
        setIsEdit(false);
        setActiveTimeSlotId(null);
        setDayToEdit(new Date());
    };

    const onSubmit = methods.handleSubmit(
        (formData) => {
            if(activeTimeSlotId) {
                return patchTimeSlot({
                    id                   : activeTimeSlotId,
                    cv_id                : parseInt(specialistId, 10),
                    date_from            : formData.date_from,
                    date_to              : formData.date_to,
                    type_of_employment_id: formData.type_of_employment.value,
                    price                : formData.price
                })
                    .unwrap()
                    .then(() => {
                        setIsEdit(false);
                        setActiveTimeSlotId(null);
                        methods.reset();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }

            return setTimeSlot({
                cv_id                : parseInt(specialistId, 10),
                date_from            : formData.date_from,
                date_to              : formData.date_to,
                type_of_employment_id: formData.type_of_employment.value,
                price                : formData.price
            })
                .unwrap()
                .then(() => {
                    setIsEdit(false);
                    setActiveTimeSlotId(null);
                    methods.reset();
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        (formError) => {
            console.info('FORM ERROR', formError);
        }
    );

    const elFooter = () => {
        return (
            <div className={cn('access__modal-footer')}>
                <Button
                    className={cn('access__modal-close')}
                    isSecondary={true}
                    onClick={onCloseEdit}
                    disabled={isLoading || isPatchLoading}
                >
                    {t('routes.person.common.access.buttons.cancel')}
                </Button>
                <Button onClick={onSubmit} disabled={isLoading || isPatchLoading} isLoading={isLoading || isPatchLoading}>
                    {t('routes.person.common.access.buttons.save')}
                </Button>
            </div>
        );
    };

    const elEditWindow = () => {
        if(isEdit) {
            return (
                <Modal
                    footer={elFooter()}
                    header={t('routes.person.common.access.title')}
                    onClose={() => setIsEdit(false)}
                >
                    <FormProvider {...methods}>
                        <form className={cn('access__form')}>
                            <div className={cn('access__field-set')}>
                                <DateInput
                                    name="date_from"
                                    direction="column"
                                    label={t('routes.person.common.access.form.start')}
                                    defaultValue={format(dayToEdit, 'yyyy-MM-dd', { locale: ru })}
                                />
                                <DateInput
                                    name="date_to"
                                    direction="column"
                                    label={t('routes.person.common.access.form.end')}
                                    defaultValue={format(dayToEdit, 'yyyy-MM-dd', { locale: ru })}
                                />
                            </div>
                            <InputRadio
                                name="type_of_employment"
                                direction="column"
                                optionsDirection="column"
                                label={t('routes.person.common.access.form.access.title')}
                                options={typeOfEmployment?.results.map((item) => ({ value: String(item.id), label: item.name })) || []}
                            />
                            <div className={cn('access__field-rate')}>
                                <h3 className={cn('access__rate-title')}>
                                    {t('routes.person.common.access.form.rate.title')}
                                </h3>
                                <div className={cn('access__field-set')}>
                                    <Input
                                        type="text"
                                        name="price"
                                        label={t('routes.person.common.access.form.rate.hour')}
                                    />
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </Modal>
            );
        }
    };

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
                busyPeriods={busyPeriodsWithId}
            />
            {elEditWindow()}
        </div>
    );
};

export default Access;
