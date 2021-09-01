import React from 'react';
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
import { education } from 'adapter/api/education';
import { dictionary } from 'adapter/api/dictionary';
import { CvEducationRead } from 'adapter/types/cv/education/get/code-200';

import style from './index.module.pcss';
import { CvEducation } from 'adapter/types/cv/education/post/code-201';

type TCustomFields =
    | 'education_place_select'
    | 'education_speciality_select'
    | 'education_graduate_select'
    | 'competencies_select';

export interface IResultForm extends Omit<CvEducationRead, TCustomFields> {
    education_place_select: {
        value?: number,
        label?: string
    },
    education_speciality_select: {
        value?: number,
        label?: string
    },
    education_graduate_select: {
        value?: number,
        label?: string
    },
    competencies_select: Array<{
        value?: number,
        label: string
    }>
}

interface IEducationForm {
    fields?: Array<CvEducationRead>,
    defaultValues: { defaultValues: { education: IResultForm } } | undefined,
    onSubmit?: () => void
}

const EducationForm = (props: IEducationForm) => {
    const dispatch = useDispatch();
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const methods = useForm(props.defaultValues);
    const [postEducation] = education.usePostEducationMutation();
    const [patchEducation] = education.usePatchEducationMutation();

    const onSubmit = methods.handleSubmit(({ education: educationForm }) => {
        const {
            education_place_select,
            education_speciality_select,
            education_graduate_select,
            competencies,
            competencies_select,
            ...inputs
        } = educationForm;
        const data: CvEducation = {
            ...inputs,
            cv_id                  : parseInt(id, 10),
            education_place_id     : education_place_select.value as number,
            education_speciality_id: education_speciality_select.value as number,
            education_graduate_id  : education_graduate_select.value as number,
            competencies_ids       : competencies_select?.map(({ value }) => value as number) || []
        };
        const request = educationForm.id ? patchEducation(data) : postEducation(data);

        request
            .unwrap()
            .then(() => {
                props.onSubmit?.();
            })
            .catch((err) => {
                console.error(err);
            });
    });

    const onLoadEducationSpeciality = debounce((search_string: string, callback) => {
        dispatch(dictionary.endpoints.getEducationSpeciality.initiate({ search: search_string }))
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

    const onLoadEducationPlace = debounce((search_string: string, callback) => {
        dispatch(dictionary.endpoints.getEducationPlace.initiate({ search: search_string }))
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

    const onLoadEducationGraduate = debounce((search_string: string, callback) => {
        dispatch(dictionary.endpoints.getEducationGraduate.initiate({ search: search_string }))
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

    return (
        <FormProvider {...methods}>
            <form id="education-form" onSubmit={onSubmit}>
                <div className={cn('education-form')}>
                    <div className={cn('education-form__item')}>
                        <label className={cn('education-form__label')}>
                            {t('routes.person.education.label.education-place')}
                        </label>
                        <InputSelect name="education.education_place_select" loadOptions={onLoadEducationPlace} />
                    </div>

                    <div className={cn('education-form__item', 'education-form__item_dates')}>
                        <label className={cn('education-form__label')}>
                            {t('routes.person.education.label.period')}
                        </label>
                        <FormDate name="education.date_from" />
                        &mdash;
                        <FormDate name="education.date_to" />
                    </div>

                    <div className={cn('education-form__item')}>
                        <label className={cn('education-form__label')}>
                            {t('routes.person.education.label.specialty')}
                        </label>
                        <InputSelect
                            name="education.education_speciality_select"
                            loadOptions={onLoadEducationSpeciality}
                        />
                    </div>

                    <div className={cn('education-form__item')}>
                        <label className={cn('education-form__label')}>
                            {t('routes.person.education.label.power')}
                        </label>
                        <InputSelect
                            name="education.education_graduate_select"
                            loadOptions={onLoadEducationGraduate}
                        />
                    </div>

                    <div className={cn('education-form__item')}>
                        <label className={cn('education-form__label')}>
                            {t('routes.person.education.label.diploma')}
                        </label>
                        <FormInput name="education.diploma" type="text" />
                    </div>

                    <div className={cn('education-form__item')}>
                        <label className={cn('education-form__label')}>
                            {t('routes.person.education.label.competencies')}
                        </label>
                        <FormInputSkills name="education.competencies_select" />
                    </div>

                    <div className={cn('education-form__item')}>
                        <label className={cn('education-form__label')}>
                            {t('routes.person.education.label.description')}
                        </label>
                        <FormInput name="education.description" type="text" />
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};

export default EducationForm;
