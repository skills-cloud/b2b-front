import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';

import FormInput from 'component/form/input';
import FormDate from 'component/form/date';
import InputDictionary from 'component/form/input-dictionary';
import Textarea from 'component/form/textarea';

import { education } from 'adapter/api/education';
import { CvEducationRead } from 'adapter/types/cv/education/get/code-200';
import { CvEducation } from 'adapter/types/cv/education/post/code-201';

import style from './index.module.pcss';

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
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { specialistId } = useParams<IParams>();
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
            cv_id                  : parseInt(specialistId, 10),
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

    return (
        <FormProvider {...methods}>
            <form id="education-form" onSubmit={onSubmit}>
                <div className={cn('education-form')}>
                    <div className={cn('education-form__item')}>
                        <label className={cn('education-form__label')}>
                            {t('routes.person.education.label.education-place')}
                        </label>
                        <InputDictionary
                            isMulti={false}
                            requestType={InputDictionary.requestType.EducationPlace}
                            name="education.education_place_select"
                        />
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
                        <InputDictionary
                            isMulti={false}
                            requestType={InputDictionary.requestType.EducationSpeciality}
                            name="education.education_speciality_select"
                        />
                    </div>

                    <div className={cn('education-form__item')}>
                        <label className={cn('education-form__label')}>
                            {t('routes.person.education.label.power')}
                        </label>
                        <InputDictionary
                            isMulti={false}
                            requestType={InputDictionary.requestType.EducationGraduate}
                            name="education.education_graduate_select"
                        />
                    </div>

                    <div className={cn('education-form__item')}>
                        <label className={cn('education-form__label')}>
                            {t('routes.person.education.label.diploma')}
                        </label>
                        <FormInput name="education.diploma_number" type="text" />
                    </div>

                    <div className={cn('education-form__item')}>
                        <label className={cn('education-form__label')}>
                            {t('routes.person.education.label.competencies')}
                        </label>
                        <InputDictionary
                            requestType={InputDictionary.requestType.Competence}
                            name="education.competencies_select"
                        />
                    </div>
                    <Textarea
                        direction={Textarea.direction.Column}
                        name="education.description"
                        label={t('routes.person.education.label.description')}
                    />
                </div>
            </form>
        </FormProvider>
    );
};

export default EducationForm;
