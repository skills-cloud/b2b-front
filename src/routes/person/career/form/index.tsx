import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';
import debounce from 'lodash.debounce';

import useClassnames from 'hook/use-classnames';
import FormInput from 'component/form/input';
import FormDate from 'component/form/date';
import FormInputSkills from 'component/form/input-skills';
import InputSelect from 'component/form/select';

import { useDispatch } from 'component/core/store';
import { dictionary } from 'adapter/api/dictionary';

import style from './index.module.pcss';
import { CvCareerRead } from 'adapter/types/cv/career/get/code-200';
import { career } from 'adapter/api/career';
import { mainRequest } from 'adapter/api/main';
import Error from 'component/error';
import InputFile from 'component/form/file';


export interface IResultForm extends Omit<CvCareerRead, 'competencies_select' | 'organization' | 'position' | 'files'> {
    competencies_select: Array<{
        value?: number,
        label: string
    }>,
    organization: {
        value?: number,
        label: string
    },
    position: {
        value?: number,
        label: string
    },
    files: File
}

interface IProjectForm {
    defaultValues: { defaultValues: { career: IResultForm, files?: FileList } } | undefined,
    onSetLoading: (loading: boolean) => void,
    onSubmit?: () => void
}

const CareerForm = (props: IProjectForm) => {
    const dispatch = useDispatch();
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const methods = useForm(props.defaultValues);
    const [postCareer, { isLoading: isPostLoading }] = career.usePostCareerMutation();
    const [patchCareer, { isLoading: isPatchLoading }] = career.usePatchCareerByIdMutation();
    const [uploadFile] = career.useUploadCareerFileByIdMutation();
    const { data: dataOrganizationList } = mainRequest.useGetMainOrganizationQuery(undefined);

    const [error, setError] = useState<Array<string> | string | null>(null);

    useEffect(() => {
        props.onSetLoading?.(isPatchLoading || isPostLoading);
    }, [isPostLoading, isPatchLoading]);

    const onChangeForm = () => {
        setError(null);
    };

    const onSubmit = methods.handleSubmit((formData) => {
        const data = {
            ...formData.career,
            cv_id           : parseInt(id, 10),
            competencies_ids: formData.career?.competencies_select?.map(({ value }) => value) as Array<number>,
            organization_id : formData.career?.organization?.value as number,
            position_id     : formData.career?.position?.value
        };
        const request = formData.career.id ? patchCareer(data) : postCareer(data);

        request
            .unwrap()
            .then((resp) => {
                if(formData.career.files) {
                    const formDataFile = new FormData();

                    formDataFile.set('file', formData.career.files);

                    uploadFile({
                        data: formDataFile,
                        id  : String(resp.id)
                    })
                        .unwrap()
                        .catch(console.error);
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

    const onLoadPositionOptions = debounce((search_string: string, callback) => {
        dispatch(dictionary.endpoints.getPositionList.initiate({
            search: search_string
        }))
            .then(({ data }) => {
                if(data?.results?.length) {
                    const res = data.results.map((item) => ({
                        label: item.name,
                        value: String(item.id)
                    }));

                    callback(res);
                } else {
                    callback(null);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, 150);

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
                    <InputSelect
                        name="career.organization"
                        options={dataOrganizationList?.results.map((result) => ({ label: result.name, value: String(result.id) })) || []}
                        placeholder={t('routes.person.career.fields.placeholder.organization')}
                        required={true}
                    />
                </div>
                <div className={cn('career-form__item')}>
                    <label className={cn('career-form__label')}>
                        {t('routes.person.career.fields.position')}
                    </label>
                    <InputSelect
                        name="career.position"
                        loadOptions={onLoadPositionOptions}
                        placeholder={t('routes.person.career.fields.placeholder.position')}
                        required={true}
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
                    <FormInputSkills
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
                        {t('routes.person.career.fields.position')}
                    </label>
                    <InputSelect
                        name="career.position"
                        loadOptions={onLoadPositionOptions}
                        placeholder={t('routes.person.career.fields.placeholder.position')}
                        required={true}
                    />
                </div>
                <div className={cn('career-form__item')}>
                    <label className={cn('career-form__label')}>
                        {t('routes.person.career.fields.position')}
                    </label>
                    <InputFile name="career.files" />
                </div>
            </form>
            {elError}
        </FormProvider>
    );
};

export default CareerForm;
