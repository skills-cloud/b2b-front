import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';
import { IParams } from 'helper/url-list';

import useClassnames from 'hook/use-classnames';
import FormDate from 'component/form/date';
import InputFile from 'component/form/file';
import InputDictionary from 'component/form/input-dictionary';
import InputProject from 'component/form/input-project';
import Textarea from 'component/form/textarea';
import InputSelect from 'component/form/select';
import ErrorsComponent from 'component/error/errors';

import { career } from 'adapter/api/career';
import { dictionary } from 'adapter/api/dictionary';
import { CvCareerRead, CvCareerFileRead } from 'adapter/types/cv/career/get/code-200';

import style from './index.module.pcss';

export interface IResultForm extends Omit<CvCareerRead, 'competencies_select' | 'organization' | 'position' | 'projects'> {
    competencies_select: Array<{
        value?: number,
        label: string
    }>,
    organization: {
        value?: number,
        label: string
    },
    projects: Array<{
        value?: number,
        label: string
    }>,
    position: {
        value?: number,
        label: string
    },
    filesArray?: Array<File>
}

interface IProjectForm {
    defaultValues: { defaultValues: { career: IResultForm } } | undefined,
    onSetLoading: (loading: boolean) => void,
    onSubmit?: () => void
}

const CareerForm = (props: IProjectForm) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { specialistId } = useParams<IParams>();
    const methods = useForm(props.defaultValues);
    const [postCareer, { isLoading: isPostLoading, isError, error }] = career.usePostCareerMutation();
    const [patchCareer, { isLoading: isPatchLoading, isError: isPatchError, error: patchError }] = career.usePatchCareerByIdMutation();
    const [uploadFile] = career.useUploadCareerFileByIdMutation();
    const [deleteFile] = career.useDeleteCareerFileByIdMutation();

    const [getOrganizations] = dictionary.useLazyGetOrganizationQuery(undefined);

    useEffect(() => {
        props.onSetLoading?.(isPatchLoading || isPostLoading);
    }, [isPostLoading, isPatchLoading]);

    const onDeleteFile = (file: CvCareerFileRead) => {
        if(file) {
            void deleteFile({
                id     : parseInt(specialistId, 10),
                file_id: String(file.id)
            });
        }
    };

    const onSubmit = methods.handleSubmit((formData) => {
        const submitData = {
            ...formData.career,
            date_from       : formData.career.date_from ? formData.career.date_from : undefined,
            date_to         : formData.career.date_to ? formData.career.date_to : undefined,
            cv_id           : parseInt(specialistId, 10),
            competencies_ids: formData.career?.competencies_select?.map(({ value }) => value) as Array<number>,
            organization_id : formData.career?.organization?.value as number,
            position_id     : formData.career?.position?.value,
            projects_ids    : formData.career?.projects?.map((item) => item.value as number)
        };
        const request = formData.career?.id ? patchCareer(submitData) : postCareer(submitData);

        request
            .unwrap()
            .then((resp) => {
                if(formData.career?.filesArray) {
                    const files = formData.career.filesArray;

                    files.forEach((file) => {
                        const formDataFile = new FormData();

                        formDataFile.set('file', file);

                        uploadFile({
                            data: formDataFile,
                            id  : String(resp.id)
                        })
                            .unwrap()
                            .catch(console.error);
                    });
                }

                if(!isError || !isPatchError) {
                    props.onSubmit?.();
                }
            })
            .catch(console.error);
    });

    return (
        <FormProvider {...methods}>
            <form id="career-form" onSubmit={onSubmit} className={cn('career-form')}>
                <div className={cn('career-form__item')}>
                    <label className={cn('career-form__label')}>
                        {t('routes.person.career.fields.organization')}
                    </label>
                    <InputSelect
                        loadOptions={(value, cb) => {
                            getOrganizations({
                                search   : value,
                                page_size: 1000
                            })
                                .unwrap()
                                .then(({ results }) => {
                                    cb(
                                        results.map((organization) => ({
                                            value: organization.id,
                                            label: organization.name
                                        }))
                                    );
                                })
                                .catch(console.error);
                        }}
                        isMulti={false}
                        name="career.organization"
                        placeholder={t('routes.person.career.fields.placeholder.organization')}
                        required={true}
                    />
                </div>
                <div className={cn('career-form__item')}>
                    <label className={cn('career-form__label')}>
                        {t('routes.person.career.fields.position')}
                    </label>
                    <InputDictionary
                        isMulti={false}
                        name="career.position"
                        requestType={InputDictionary.requestType.Position}
                        placeholder={t('routes.person.career.fields.placeholder.position')}
                        required={true}
                    />
                </div>
                <div className={cn('career-form__item')}>
                    <label className={cn('career-form__label')}>
                        {t('routes.person.career.fields.projects.label')}
                    </label>
                    <InputProject
                        isMulti={true}
                        name="career.projects"
                        placeholder={t('routes.person.career.fields.projects.placeholder')}
                    />
                </div>
                <div className={cn('career-form__item', 'career-form__item_dates')}>
                    <label className={cn('career-form__label')}>
                        {t('routes.person.career.fields.date')}
                    </label>
                    <FormDate name="career.date_from" />
                    &mdash;
                    <FormDate name="career.date_to" />
                </div>
                <div className={cn('career-form__item')}>
                    <label className={cn('career-form__label')}>
                        {t('routes.person.career.fields.competencies')}
                    </label>
                    <InputDictionary
                        requestType={InputDictionary.requestType.Competence}
                        name="career.competencies_select"
                        placeholder={t('routes.person.career.fields.placeholder.competencies')}
                    />
                </div>
                <Textarea
                    direction={Textarea.direction.Column}
                    name="career.description"
                    label={t('routes.person.career.fields.description')}
                />
                <div className={cn('career-form__item')}>
                    <label className={cn('career-form__label')}>
                        {t('routes.person.career.fields.files')}
                    </label>
                    <InputFile
                        name="career.filesArray"
                        multiple={true}
                        defaultValue={props.defaultValues?.defaultValues?.career?.files}
                        onDeleteFile={onDeleteFile}
                    />
                </div>
            </form>
            <ErrorsComponent error={error || patchError} isError={isError || isPatchError} isLoading={isPostLoading || isPatchLoading} />
        </FormProvider>
    );
};

export default CareerForm;
