import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';

import FormDate from 'component/form/date';
import InputCv from 'component/form/input-cv';
import InputRequest from 'component/form/input-request';
import Input from 'component/form/input';

import { useClassnames } from 'hook/use-classnames';

import { mainRequest } from 'src/adapters/api/main';
import { TimeSheetRowRead } from 'adapter/types/main/time-sheet-row/get/code-200';
import { IGetCvListFilters } from 'adapter/api/cv';

import style from './index.module.pcss';

interface IFormValues extends Omit<TimeSheetRowRead, 'request' | 'cv'> {
    request: {
        value: string,
        label: string
    },
    cv: {
        value: string,
        label: string
    }
}

interface IProps {
    formId: string,
    onSuccess: (id?: number) => void,
    defaultValues?: Partial<TimeSheetRowRead>,
    cvFilters?: IGetCvListFilters,
    requestId?: string
}

const TimesheetForm = ({ formId, onSuccess, defaultValues, cvFilters, requestId }: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    const [post] = mainRequest.usePostMainTimeSheetRowMutation();
    const [patch] = mainRequest.usePatchMainTimeSheetRowMutation();

    const form = useForm({
        defaultValues: {
            ...defaultValues,
            request: defaultValues?.request ? {
                value: defaultValues.request.id,
                label: defaultValues.request.title
            } : '',
            cv: defaultValues?.cv ? {
                value: defaultValues.cv.id,
                label: `${defaultValues?.cv?.last_name} ${defaultValues?.cv?.first_name ?? ''}`.trim()
            } : ''
        }
    });

    const onSubmit = form.handleSubmit(
        (formData: SubmitHandler<IFormValues>) => {
            const postData = Object.fromEntries(Object.entries(formData).filter(([, value]) => (!!value)));
            const method = defaultValues ? patch : post;

            method({
                ...postData,
                task_name : postData.task_name,
                work_time : postData.work_time,
                cv_id     : postData.cv?.value,
                request_id: postData.request?.value,
                id        : postData.id
            })
                .unwrap()
                .then(() => {
                    onSuccess();
                })
                .catch(console.error);
        },
        (formError) => {
            console.error(formError);
        }
    );

    return (
        <FormProvider {...form}>
            <form method="POST" id={formId} onSubmit={onSubmit}>
                <div className={cn('form')}>
                    <InputRequest
                        defaultValue={[requestId as string]}
                        disabled={true}
                        isMulti={false}
                        requestType={InputRequest.requestType.Request}
                        name="request"
                        direction="column"
                        label={t('routes.timesheet.edit-modal.form.request.label')}
                        placeholder={t('routes.timesheet.edit-modal.form.request.placeholder')}
                    />
                    <InputCv
                        isMulti={false}
                        filters={cvFilters}
                        name="cv"
                        requestType={InputCv.requestType.Cv}
                        direction="column"
                        label={t('routes.timesheet.edit-modal.form.cv.label')}
                        placeholder={t('routes.timesheet.edit-modal.form.cv.placeholder')}
                    />
                    <div className={cn('field-group')}>
                        <FormDate
                            name="date_from"
                            direction="column"
                            label={t('routes.timesheet.edit-modal.form.date.start')}
                        />
                        <FormDate
                            name="date_to"
                            direction="column"
                            label={t('routes.timesheet.edit-modal.form.date.end')}
                        />
                    </div>
                    <div className={cn('field-group')}>
                        <Input
                            type="text"
                            name="task_name"
                            label={t('routes.timesheet.edit-modal.form.task.name')}
                        />
                        <Input
                            type="text"
                            name="task_description"
                            label={t('routes.timesheet.edit-modal.form.task.desc')}
                        />
                    </div>
                    <div className={cn('field-group')}>
                        <Input
                            type="text"
                            name="work_time"
                            label={t('routes.timesheet.edit-modal.form.time')}
                        />
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};

export default TimesheetForm;
