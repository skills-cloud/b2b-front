import React, { MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';
import debounce from 'lodash.debounce';

import useClassnames, { IStyle } from 'hook/use-classnames';
import FormInput from 'component/form/input';
import FormDate from 'component/form/date';
import FormInputSkills from 'component/form/input-skills';
import IconClose from 'component/icons/close';
import Button from 'component/button';
import Modal from 'component/modal';
import InputSelect from 'component/form/select';

import { useDispatch } from 'component/core/store';
import { IResultCareer, career } from 'adapter/api/career';
import { organization } from 'adapter/api/organization';
import { dictionary } from 'adapter/api/dictionary';

import style from './index.module.pcss';

export interface IResultForm extends Omit<IResultCareer, 'organization' | 'position'> {
    organization: {
        value: number,
        label: string
    },
    position: {
        value: number,
        label: string
    }
}

export interface IProps {
    className?: string | IStyle,
    fields?: Array<IResultCareer>,
    onCancel?(): void,
    onSubmit?(): void
}

export const CareerEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const methods = useForm({
        defaultValues: {
            career: props.fields?.map((item) => ({
                ...item,
                organization: {
                    value: item.organization?.id,
                    label: item.organization?.name
                },
                position: {
                    value: item.position?.id,
                    label: item.position?.name
                }
            })) || []
        }
    });
    const { formState: { dirtyFields } } = methods;
    const [itemToRemove, setItemToRemove] = useState<IResultForm | null>(null);
    const { fields, append, remove } = useFieldArray({
        keyName: 'fieldId',
        control: methods.control,
        name   : 'career'
    });
    const dispatch = useDispatch();
    const [postCareer] = career.usePostCareerMutation();
    const [patchCareerById] = career.usePatchCareerByIdMutation();
    const [deleteCareer] = career.useDeleteCareerByIdMutation();

    const onLoadOrganizationOptions = debounce((search_string: string, callback) => {
        dispatch(organization.endpoints.getOrganizationList.initiate({
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

    const onRemove = (index: number, item: IResultForm) => () => {
        setItemToRemove(item);
    };

    const onSubmit = methods.handleSubmit((formData) => {
        formData.career.forEach((item) => {
            if(!item.cv_id || !item.organization_id || !item.position_id) {
                postCareer({
                    ...item,
                    cv_id          : parseInt(id, 10),
                    organization_id: item.organization.value,
                    position_id    : item.position?.value
                })
                    .unwrap()
                    .then(() => {
                        props.onSubmit?.();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        });

        const findChangedIndex = dirtyFields?.career?.findIndex((elem) => elem && Object.values(elem).some((val) => Boolean(val)));

        if(findChangedIndex && formData.career[findChangedIndex]) {
            patchCareerById({
                ...formData.career[findChangedIndex],
                cv_id          : parseInt(id, 10),
                organization_id: formData.career[findChangedIndex].organization?.value,
                position_id    : formData.career[findChangedIndex].position?.value
            })
                .unwrap()
                .then(() => {
                    props.onSubmit?.();
                })
                .catch((err) => {
                    console.error(err);
                });
        }

        if(!findChangedIndex || !formData.career.length) {
            props.onSubmit?.();
        }
    });

    const onDeleteItem = () => {
        if(itemToRemove) {
            const indexOfItemToRemove = props.fields?.findIndex((item) => item.id === itemToRemove.id);

            if(indexOfItemToRemove && itemToRemove.id) {
                deleteCareer({
                    id: itemToRemove.id
                })
                    .unwrap()
                    .then(() => {
                        remove(indexOfItemToRemove);
                        setItemToRemove(null);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } else {
                remove(indexOfItemToRemove);
                setItemToRemove(null);
            }
        }
    };

    const onCloseModal = () => {
        setItemToRemove(null);
    };

    const elControls = useMemo(() => {
        return (
            <div className={cn('career-edit__controls')}>
                <Button
                    type="button"
                    onClick={onDeleteItem}
                >
                    {t('routes.person.career.confirm.confirm')}
                </Button>
                <Button
                    type="button"
                    isSecondary={true}
                    className={cn('career-edit__modal-close')}
                    onClick={onCloseModal}
                >
                    {t('routes.person.career.confirm.cancel')}
                </Button>
            </div>
        );
    }, [itemToRemove]);

    const elModalConfirm = useMemo(() => {
        if(itemToRemove) {
            return (
                <Modal
                    header={t('routes.person.career.confirm.title')}
                    className={cn('career-edit__confirm')}
                    footer={elControls}
                >
                    {null}
                </Modal>
            );
        }
    }, [itemToRemove]);

    return (
        <div className={cn('career-edit')}>
            <form
                className={cn('career-edit__form')}
                onSubmit={onSubmit}
            >
                <div className={cn('career-edit__form-body')}>
                    <h2 className={cn('career-edit__header')}>{t('routes.person.career.header')}</h2>
                    <FormProvider {...methods}>
                        {fields.map((field, index) => (
                            <div
                                key={field.fieldId}
                                className={cn('career-edit__career')}
                            >
                                <IconClose
                                    svg={{
                                        width    : 14,
                                        height   : 14,
                                        className: cn('career-edit__career-icon-remove'),
                                        onClick  : onRemove(index, field)
                                    }}
                                />
                                <div className={cn('career-edit__field')}>
                                    <strong>{t('routes.person.career.fields.company')}</strong>
                                    <InputSelect
                                        name={`career.${index}.organization`}
                                        loadOptions={onLoadOrganizationOptions}
                                    />
                                </div>
                                <div className={cn('career-edit__field', 'career-edit__field_dates')}>
                                    <strong>{t('routes.person.career.fields.date')}</strong>
                                    <FormDate name={`career.${index}.date_from`} />
                                    &mdash;
                                    <FormDate name={`career.${index}.date_to`} />
                                </div>
                                <div className={cn('career-edit__field')}>
                                    <strong>{t('routes.person.career.fields.role')}</strong>
                                    <InputSelect
                                        name={`career.${index}.position`}
                                        loadOptions={onLoadPositionOptions}
                                    />
                                </div>
                                <div className={cn('career-edit__field')}>
                                    <strong>{t('routes.person.career.fields.skills')}</strong>
                                    <FormInputSkills name={`career.${index}.skills`} />
                                </div>
                                <div className={cn('career-edit__field')}>
                                    <strong>{t('routes.person.career.fields.description')}</strong>
                                    <FormInput name={`career.${index}.description`} type="text" />
                                </div>
                            </div>
                        ))}
                    </FormProvider>
                </div>
                <div className={cn('career-edit__form-footer')}>
                    <a
                        href="#append"
                        className={cn('career-edit__link-append')}
                        children={t('routes.person.career.edit.buttons.append')}
                        onClick={(e: MouseEvent) => {
                            e.preventDefault();

                            append({});
                        }}
                    />
                    <Button isSecondary={true} onClick={props.onCancel}>{t('routes.person.career.edit.buttons.cancel')}</Button>
                    <Button type="submit">{t('routes.person.career.edit.buttons.save')}</Button>
                </div>
            </form>
            {elModalConfirm}
        </div>
    );
};

export default CareerEdit;
