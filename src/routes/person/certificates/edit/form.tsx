import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { useParams } from 'react-router';

import { IStyle, useClassnames } from 'hook/use-classnames';

import FormDate from 'component/form/date';
import FormInput from 'component/form/input';
import Button from 'component/button';
import InputSelect from 'component/form/select';
import { useDispatch } from 'component/core/store';

import { certificate, IResultCertificate } from 'adapter/api/certificate';
import { dictionary } from 'adapter/api/dictionary';

import style from './form.module.pcss';

export interface IProps {
    className?: string | IStyle,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field?: IResultCertificate | Record<string, any>,
    onCancel?(): void,
    onSubmit?(): void
}

const EditForm = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();

    const [postCertificate] = certificate.usePostCertificateMutation();
    const [patchCertificateById] = certificate.usePatchCertificateByIdMutation();

    const methods = useForm({
        mode         : 'all',
        defaultValues: {
            certificate: {
                ...props.field,
                id                  : props.field?.id,
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
                    cv_id                  : parseInt(id, 10),
                    id                     : formData.certificate.id,
                    education_graduate_id  : formData.certificate.education_graduate.value,
                    education_speciality_id: formData.certificate.education_speciality.value,
                    education_place_id     : formData.certificate.education_place.value
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
                    cv_id                  : parseInt(id, 10),
                    education_graduate_id  : formData.certificate.education_graduate.value,
                    education_speciality_id: formData.certificate.education_speciality.value,
                    education_place_id     : formData.certificate.education_place.value
                })
                    .unwrap()
                    .then(() => {
                        props.onSubmit?.();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
            console.info('FORM DATA', formData);
        },
        (formError) => {
            console.info('FORM ERROR', formError);
        }
    );

    return (
        <form
            className={cn('edit-form')}
            onSubmit={onSubmit}
        >
            <div className={cn('edit-form__form-body')}>
                <h2 className={cn('edit-form__header')}>{t('routes.person.certificates.header')}</h2>
                <FormProvider {...methods}>
                    <div className={cn('edit-form__career')}>
                        <div className={cn('edit-form__field')}>
                            <strong>{t('routes.person.certificates.fields.date')}</strong>
                            <FormDate name="certificate.date" />
                        </div>
                        <div className={cn('edit-form__field')}>
                            <strong>{t('routes.person.certificates.fields.grade')}</strong>
                            <InputSelect
                                name="certificate.education_graduate"
                                loadOptions={onLoadGraduateOptions}
                                placeholder="Начните вводить степень"
                            />
                        </div>
                        <div className={cn('edit-form__field')}>
                            <strong>{t('routes.person.certificates.fields.place')}</strong>
                            <InputSelect
                                name="certificate.education_place"
                                loadOptions={onLoadPlaceOptions}
                                placeholder="Начните вводить место обучения"
                            />
                        </div>
                        <div className={cn('edit-form__field')}>
                            <strong>{t('routes.person.certificates.fields.speciality')}</strong>
                            <InputSelect
                                name="certificate.education_speciality"
                                loadOptions={onLoadSpecialityOptions}
                                placeholder="Начните вводить специальность"
                            />
                        </div>
                        <div className={cn('edit-form__field')}>
                            <strong>{t('routes.person.certificates.fields.description')}</strong>
                            <FormInput name="certificate.description" type="text" />
                        </div>
                    </div>
                </FormProvider>
            </div>
            <div className={cn('edit-form__form-footer')}>
                <Button isSecondary={true} onClick={props.onCancel}>{t('routes.person.certificates.edit.buttons.cancel')}</Button>
                <Button type="submit">{t('routes.person.certificates.edit.buttons.save')}</Button>
            </div>
        </form>
    );
};

export default EditForm;
