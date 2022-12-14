import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import { IStyle, useClassnames } from 'hook/use-classnames';
import { useDispatch } from 'component/core/store';

import FormDate from 'component/form/date';
import FormInput from 'component/form/input';
import InputSelect from 'component/form/select';
import InputDictionary from 'component/form/input-dictionary';
import Textarea from 'component/form/textarea';

import { certificate } from 'adapter/api/certificate';
import { dictionary } from 'adapter/api/dictionary';
import { CvCertificateRead } from 'adapter/types/cv/certificate/get/code-200';

import style from './form.module.pcss';

export interface IProps {
    className?: string | IStyle,
    field?: CvCertificateRead,
    onCancel?(): void,
    onSubmit?(): void
}

export const CERT_EDIT_FORM = 'CERT_EDIT_FORM';

const EditForm = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { specialistId } = useParams<IParams>();

    const [postCertificate] = certificate.usePostCertificateMutation();
    const [patchCertificateById] = certificate.usePatchCertificateByIdMutation();

    const methods = useForm({
        mode         : 'all',
        defaultValues: {
            certificate: {
                ...props.field,
                id          : props.field?.id,
                competencies: props.field?.competencies?.map((item) => ({
                    value: item.id,
                    label: item.name
                })),
                education_speciality: {
                    value: props.field?.education_speciality?.id,
                    label: props.field?.education_speciality?.name
                },
                education_graduate: {
                    value: props.field?.education_graduate?.id,
                    label: props.field?.education_graduate?.name
                },
                education_place: {
                    value: props.field?.education_place?.id,
                    label: props.field?.education_place?.name
                }
            }
        }
    });

    const onLoadGraduateOptions = debounce((search_string: string, callback) => {
        dispatch(dictionary.endpoints.getEducationGraduate.initiate({
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

    const onLoadPlaceOptions = debounce((search_string: string, callback) => {
        dispatch(dictionary.endpoints.getEducationPlace.initiate({
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

    const onLoadSpecialityOptions = debounce((search_string: string, callback) => {
        dispatch(dictionary.endpoints.getEducationSpeciality.initiate({
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

    const onSubmit = methods.handleSubmit(
        (formData) => {
            if(props.field && Object.keys(props.field).length) {
                patchCertificateById({
                    ...formData.certificate,
                    cv_id                  : parseInt(specialistId, 10),
                    id                     : formData.certificate.id,
                    education_graduate_id  : formData.certificate.education_graduate.value as number,
                    education_speciality_id: formData.certificate.education_speciality.value as number,
                    education_place_id     : formData.certificate.education_place.value as number,
                    competencies_ids       : formData.certificate.competencies?.map((item) => item.value as number)
                })
                    .unwrap()
                    .then(() => {
                        props.onSubmit?.();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } else {
                postCertificate({
                    ...formData.certificate,
                    cv_id                  : parseInt(specialistId, 10),
                    education_graduate_id  : formData.certificate.education_graduate.value as number,
                    education_speciality_id: formData.certificate.education_speciality.value as number,
                    education_place_id     : formData.certificate.education_place.value as number,
                    competencies_ids       : formData.certificate.competencies?.map((item) => item.value as number)
                })
                    .unwrap()
                    .then(() => {
                        props.onSubmit?.();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        },
        (formError) => {
            console.info('FORM ERROR', formError);
        }
    );

    return (
        <form
            className={cn('edit-form')}
            onSubmit={onSubmit}
            id={CERT_EDIT_FORM}
        >
            <FormProvider {...methods}>
                <div className={cn('edit-form__career')}>
                    <div className={cn('edit-form__field')}>
                        <strong>{t('routes.person.certificates.fields.name')}</strong>
                        <FormInput name="certificate.name" type="text" />
                    </div>
                    <div className={cn('edit-form__field')}>
                        <strong>{t('routes.person.certificates.fields.date')}</strong>
                        <FormDate name="certificate.date" />
                    </div>
                    <div className={cn('edit-form__field')}>
                        <strong>{t('routes.person.certificates.fields.grade')}</strong>
                        <InputSelect
                            name="certificate.education_graduate"
                            loadOptions={onLoadGraduateOptions}
                            placeholder="?????????????? ?????????????? ??????????????"
                        />
                    </div>
                    <div className={cn('edit-form__field')}>
                        <strong>{t('routes.person.certificates.fields.place')}</strong>
                        <InputSelect
                            name="certificate.education_place"
                            loadOptions={onLoadPlaceOptions}
                            placeholder="?????????????? ?????????????? ?????????? ????????????????"
                        />
                    </div>
                    <div className={cn('edit-form__field')}>
                        <strong>{t('routes.person.certificates.fields.speciality')}</strong>
                        <InputSelect
                            name="certificate.education_speciality"
                            loadOptions={onLoadSpecialityOptions}
                            placeholder="?????????????? ?????????????? ??????????????????????????"
                        />
                    </div>
                    <div className={cn('edit-form__field')}>
                        <strong>{t('routes.person.certificates.fields.number')}</strong>
                        <FormInput name="certificate.number" type="text" />
                    </div>
                    <div className={cn('edit-form__field')}>
                        <strong>{t('routes.person.certificates.fields.competencies')}</strong>
                        <InputDictionary
                            requestType={InputDictionary.requestType.Competence}
                            name="certificate.competencies"
                            placeholder={t('routes.person.certificates.fields.competencies')}
                        />
                    </div>
                    <Textarea
                        direction={Textarea.direction.Column}
                        name="certificate.description"
                        label={t('routes.person.certificates.fields.description')}
                    />
                </div>
            </FormProvider>
        </form>
    );
};

export default EditForm;
