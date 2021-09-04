import React, { Fragment, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames, { IStyle } from 'hook/use-classnames';
import Button from 'component/button';
import Modal from 'component/modal';
import IconArrowLeft from 'component/icons/arrow-left-full';
import { H2 } from 'component/header';

import { CvCareerRead } from 'adapter/types/cv/career/get/code-200';

import CareerList from '../list';
import CareerForm from '../form';
import RemoveModal from '../remove-modal';
import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    fields?: Array<CvCareerRead>,
    onCancel?(): void,
    onSubmit?(): void
}

enum ESteps {
    List,
    DetailForm,
    DeleteForm,
}

export const CareerEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();

    const [careerId, setCareerId] = useState<number | null>(null);
    const [step, setStep] = useState<ESteps>(ESteps.List);
    const [loading, setLoading] = useState<boolean>(false);

    const formValues = careerId !== null && props.fields?.find((item) => item.id === careerId) ? {
        defaultValues: {
            career: props.fields
                ?.filter((item) => item.id === careerId)
                .map((item) => ({
                    ...item,
                    competencies_select: item.competencies?.map((competence) => ({
                        value: competence.id,
                        label: competence.name
                    })) || [],
                    position: {
                        value: item.position?.id,
                        label: item.position?.name || ''
                    },
                    organization: {
                        value: item.organization?.id,
                        label: item.organization?.name || ''
                    },
                    files: item.files
                }))[0]
        }
    } : undefined;

    const backToList = () => {
        setCareerId(null);
        setStep(ESteps.List);
    };

    const elFooter = () => {
        return (
            <Fragment>
                {step === ESteps.List && (
                    <div className={cn('career-edit__form-footer')}>
                        <a
                            href="#append"
                            className={cn('career-edit__link-append')}
                            children={t('routes.person.career.edit.buttons.append')}
                            onClick={(e: MouseEvent) => {
                                e.preventDefault();
                                setStep(ESteps.DetailForm);
                                setCareerId(null);
                            }}
                        />
                        <Button onClick={props.onCancel}>{t('routes.person.career.edit.buttons.done')}</Button>
                    </div>
                )}
                {step === ESteps.DetailForm && (
                    <div className={cn('career-edit__form-footer-detail')}>
                        <Button
                            isSecondary={true}
                            onClick={backToList}
                            disabled={loading}
                        >
                            {t('routes.person.career.edit.buttons.cancel')}
                        </Button>
                        <Button
                            form="career-form"
                            type="submit"
                            disabled={loading}
                            isLoading={loading}
                        >
                            {t('routes.person.career.edit.buttons.save')}
                        </Button>
                    </div>
                )}
            </Fragment>
        );
    };

    const elHeader = () => {
        if(careerId === null) {
            return t('routes.person.career.header');
        }

        return (
            <H2 className={cn('career-edit__modal-header')}>
                <button
                    type="button"
                    onClick={backToList}
                >
                    <IconArrowLeft
                        svg={{ className: cn('career-edit__icon-back') }}
                    />
                </button>
                {props.fields?.filter((field) => field.id === careerId)[0]?.organization?.name}
            </H2>
        );
    };

    const elContent = () => {
        if(step === ESteps.List) {
            return (
                <CareerList
                    fields={props.fields}
                    setCareerId={setCareerId}
                    nextStep={(isDeleteAction) => (isDeleteAction ? setStep(ESteps.DeleteForm) : setStep(ESteps.DetailForm))}
                />
            );
        }

        if(step === ESteps.DetailForm) {
            return (
                <CareerForm
                    defaultValues={formValues}
                    onSetLoading={setLoading}
                    onSubmit={() => {
                        setLoading(false);
                        setStep(ESteps.List);
                    }}
                />
            );
        }
    };

    return (
        <Fragment>
            <Modal
                className={cn('career-edit')}
                header={elHeader()}
                footer={elFooter()}
            >
                {elContent()}
            </Modal>
            {step === ESteps.DeleteForm && (
                <RemoveModal
                    careerId={careerId}
                    nextStepAfterDelete={backToList}
                />
            )}
        </Fragment>
    );
};

export default CareerEdit;
