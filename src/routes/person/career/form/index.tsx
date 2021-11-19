import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';
import { IParams } from 'helper/url-list';

import useClassnames from 'hook/use-classnames';
import FormInput from 'component/form/input';
import FormDate from 'component/form/date';
import Error from 'component/error';
import InputFile from 'component/form/file';
import InputDictionary from 'component/form/input-dictionary';
import InputMain from 'component/form/input-main';
import InputProject from 'component/form/input-project';

import { career } from 'adapter/api/career';
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
    const [postCareer, { isLoading: isPostLoading }] = career.usePostCareerMutation();
    const [patchCareer, { isLoading: isPatchLoading }] = career.usePatchCareerByIdMutation();
    const [uploadFile] = career.useUploadCareerFileByIdMutation();
    const [deleteFile] = career.useDeleteCareerFileByIdMutation();

    const [error, setError] = useState<Array<string> | string | null>(null);

    useEffect(() => {
        props.onSetLoading?.(isPatchLoading || isPostLoading);
    }, [isPostLoading, isPatchLoading]);

    const onChangeForm = () => {
        setError(null);
    };

    const onDeleteFile = (file: CvCareerFileRead) => {
        if(file) {
            void deleteFile({
                id     : parseInt(specialistId, 10),
                file_id: String(file.id)
            });
        }
    };

    const onSubmit = methods.handleSubmit((formData) => {
        const data = {
            ...formData.career,
            cv_id           : parseInt(specialistId, 10),
            competencies_ids: formData.career?.competencies_select?.map(({ value }) => value) as Array<number>,
            organization_id : formData.career?.organization?.value as number,
            position_id     : formData.career?.position?.value,
            projects_ids    : formData.career?.projects?.map((item) => item.value as number)
        };
        const request = formData.career?.id ? patchCareer(data) : postCareer(data);

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

                props.onSubmit?.();
            })
            .catch((err) => {
                console.error(err);

                if(typeof err.data?.details === 'object') {
                    setError(Object.keys(err.data?.details).map((item) => `${item}: ${err.data?.details[item]}`));
                } else {
                    setError(err.data?.status);
                }
            });
    });

    const elError = useMemo(() => {
        if(error) {
            if(Array.isArray(error)) {
                return error.map((item, index) => (
                    <Error
                        key={index}
                        className={cn('competencies-edit__error')}
                        elIcon={true}
                    >
                        {item}
                    </Error>
                ));
            }

            return <Error className={cn('competencies-edit__error')} elIcon={true}>{error}</Error>;
        }
    }, [error]);

    return (
        <FormProvider {...methods}>
            <form id="career-form" onSubmit={onSubmit} onChange={onChangeForm} className={cn('career-form')}>
                <div className={cn('career-form__item')}>
                    <label className={cn('career-form__label')}>
                        {t('routes.person.career.fields.organization')}
                    </label>
                    <InputMain
                        isMulti={false}
                        requestType={InputMain.requestType.Organization}
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
                <div className={cn('career-form__item')}>
                    <label className={cn('career-form__label')}>
                        {t('routes.person.career.fields.description')}
                    </label>
                    <FormInput name="career.description" type="text" />
                </div>
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
            {elError}
        </FormProvider>
    );
};

export default CareerForm;
