import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';

import FormDate from 'component/form/date';
import InputCv from 'component/form/input-cv';
import InputRequest from 'component/form/input-request';
import Input from 'component/form/input';
import ErrorsComponent from 'component/error/errors';
import { IValue } from 'component/form/select';

import { useClassnames } from 'hook/use-classnames';

import { mainRequest } from 'src/adapters/api/main';
import { TimeSheetRowRead } from 'adapter/types/main/time-sheet-row/get/code-200';
import { IGetCvListFilters } from 'adapter/api/cv';

import style from './index.module.pcss';

interface IFormValues extends Omit<TimeSheetRowRead, 'request' | 'cv'> {
    request: IValue,
    cv_list: Array<IValue>
}

interface IProps {
    formId: string,
    onSuccess: (id?: number) => void,
    defaultValues?: Partial<TimeSheetRowRead>,
    cvFilters?: IGetCvListFilters,
    requestId?: string,
    isEdit?: boolean
}

const TimesheetForm = ({ formId, onSuccess, defaultValues, cvFilters, requestId, isEdit }: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    const [post, { error, isError, isLoading }] = mainRequest.usePostMainTimeSheetRowMutation();
    const [patch, { error: patchError, isError: isPatchError, isLoading: isPatchLoading }] = mainRequest.usePatchMainTimeSheetRowMutation();

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
            const requestData = {
                ...postData,
                task_name : postData.task_name,
                work_time : postData.work_time,
                request_id: postData.request?.value,
                id        : postData.id
            };

            if(!isEdit) {
                post({
                    ...requestData,
                    cv_ids: postData.cv_list?.map((cv: IValue) => cv.value)
                })
                    .unwrap()
                    .then(() => {
                        onSuccess();
                    })
                    .catch(console.error);
            } else {
                patch({
                    ...requestData,
                    cv_id: postData.cv?.value
                })
                    .unwrap()
                    .then(() => {
                        onSuccess();
                    })
                    .catch(console.error);
            }
        },
        (formError) => {
            console.error(formError);
        }
    );

    const errorMessage = t('routes.timesheet.edit-modal.required-error');

    const elInputCv = () => {
        if(isEdit) {
            return (
                <InputCv
                    required={errorMessage}
                    isMulti={false}
                    filters={cvFilters}
                    name="cv"
                    requestType={InputCv.requestType.Cv}
                    direction="column"
                    label={t('routes.timesheet.edit-modal.form.cv.label')}
                    placeholder={t('routes.timesheet.edit-modal.form.cv.placeholder')}
                />
            );
        }

        return (
            <InputCv
                required={errorMessage}
                isMulti={true}
                filters={cvFilters}
                name="cv_list"
                requestType={InputCv.requestType.Cv}
                direction="column"
                label={t('routes.timesheet.edit-modal.form.cv.label')}
                placeholder={t('routes.timesheet.edit-modal.form.cv.placeholder')}
            />
        );
    };

    return (
        <FormProvider {...form}>
            <form method="POST" id={formId} onSubmit={onSubmit}>
                <div className={cn('form')}>
                    <InputRequest
                        required={errorMessage}
                        defaultValue={requestId}
                        disabled={true}
                        name="request"
                        direction="column"
                        label={t('routes.timesheet.edit-modal.form.request.label')}
                        placeholder={t('routes.timesheet.edit-modal.form.request.placeholder')}
                    />
                    {elInputCv()}
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
                            required={errorMessage}
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
                            required={errorMessage}
                            type="text"
                            name="work_time"
                            label={t('routes.timesheet.edit-modal.form.time')}
                        />
                    </div>
                </div>
                <ErrorsComponent
                    error={error || patchError}
                    isError={isError || isPatchError}
                    isLoading={isLoading || isPatchLoading}
                />
            </form>
        </FormProvider>
    );
};

export default TimesheetForm;
