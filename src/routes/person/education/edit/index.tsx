import React, { Fragment, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames, { IStyle } from 'hook/use-classnames';

import Button from 'component/button';
import Modal from 'component/modal';
import IconArrowLeft from 'component/icons/arrow-left-full';
import { H2 } from 'component/header';

import { CvEducationRead } from 'adapter/types/cv/education/get/code-200';

import EducationList from '../list';
import EducationForm from '../form';
import RemoveModal from '../remove-modal';
import style from './index.module.pcss';

enum ESteps {
    List,
    DetailForm,
    DeleteForm,
}

export interface IProps {
    className?: string | IStyle,
    fields?: Array<CvEducationRead>,
    onCancel?(): void,
    onSubmit?(): void
}

export const EducationEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const [step, setStep] = useState<ESteps>(ESteps.List);
    const [educationId, setEducationId] = useState<number | null>(null);

    const formValues = educationId !== null && props.fields?.find(({ id }) => id === educationId) ? {
        defaultValues: {
            education: props.fields
                ?.filter(({ id }) => id === educationId)
                .map((item) => ({
                    ...item,
                    education_place_select: {
                        value: item.education_place?.id,
                        label: item.education_place?.name
                    },
                    education_speciality_select: {
                        value: item.education_speciality?.id,
                        label: item.education_speciality?.name
                    },
                    education_graduate_select: {
                        value: item.education_graduate?.id,
                        label: item.education_graduate?.name
                    },
                    competencies_select: item.competencies?.map((competence) => ({
                        value: competence.id,
                        label: competence.name
                    })) || []
                }))[0]
        }
    } : undefined;

    const backToList = () => {
        setEducationId(null);
        setStep(ESteps.List);
    };

    return (
        <Fragment>
            <Modal
                header={
                    <Fragment>
                        {educationId === null && t('routes.person.education.header')}
                        {educationId !== null && (
                            <H2 className={cn('education__modal-header')}>
                                <button
                                    type="button"
                                    onClick={backToList}
                                >
                                    <IconArrowLeft
                                        svg={{ className: cn('education__icon-back') }}
                                    />
                                </button>
                                {props.fields?.filter((field) => field.id === educationId)[0].education_place?.name}
                            </H2>
                        )}
                    </Fragment>
                }
                className={{
                    'modal__body': cn('education__modal-body')
                }}
                footer={
                    <Fragment>
                        {step === ESteps.List && (
                            <div className={cn('education__form-footer')}>
                                <a
                                    className={cn('education__link-append')}
                                    children={t('routes.person.education.edit.buttons.append')}
                                    onClick={(e: MouseEvent) => {
                                        e.preventDefault();
                                        setStep(ESteps.DetailForm);
                                        setEducationId(null);
                                    }}
                                />
                                <Button onClick={props.onCancel}>
                                    {t('routes.person.education.edit.buttons.done')}
                                </Button>
                            </div>
                        )}
                        {step === ESteps.DetailForm && (
                            <div className={cn('education__form-footer-detail')}>
                                <Button isSecondary={true} onClick={backToList}>
                                    {t('routes.person.education.edit.buttons.cancel')}
                                </Button>
                                <Button form="education-form" type="submit">
                                    {t('routes.person.education.edit.buttons.save')}
                                </Button>
                            </div>
                        )}
                    </Fragment>
                }
            >
                <div className={cn('education__content')}>
                    {step === ESteps.List && (
                        <EducationList
                            fields={props.fields}
                            setEducationId={setEducationId}
                            nextStep={(isDeleteAction) => (isDeleteAction ? setStep(ESteps.DeleteForm) : setStep(ESteps.DetailForm))}
                        />
                    )}
                    {step === ESteps.DetailForm && (
                        <EducationForm defaultValues={formValues} onSubmit={props.onCancel} />
                    )}
                </div>
            </Modal>
            {step === ESteps.DeleteForm && (
                <RemoveModal
                    educationId={educationId}
                    nextStepAfterDelete={backToList}
                />
            )}
        </Fragment>
    );
};

export default EducationEdit;
