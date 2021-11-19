import React, { Fragment, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames, { IStyle } from 'hook/use-classnames';
import Button from 'component/button';
import Modal from 'component/modal';
import { H2 } from 'component/header';

import { CvCareerRead } from 'adapter/types/cv/career/get/code-200';
import { career } from 'adapter/api/career';

import CareerList from '../list';
import CareerForm from '../form';
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

    const [deleteCareer] = career.useDeleteCareerByIdMutation();

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
                    projects: item.projects?.map((project) => ({
                        value: project.id,
                        label: project.name || ''
                    })) || [],
                    files: item.files
                }))[0]
        }
    } : undefined;

    const backToList = () => {
        setCareerId(null);
        setStep(ESteps.List);
    };

    const onDeleteItem = () => {
        if(careerId === null) {
            return;
        }

        deleteCareer({ id: careerId })
            .unwrap()
            .then(backToList)
            .catch((err) => {
                console.error(err);
            });
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
                {step === ESteps.DeleteForm && (
                    <div className={cn('career-edit__controls')}>
                        <Button type="button" onClick={onDeleteItem}>
                            {t('routes.person.projects.confirm.confirm')}
                        </Button>
                        <Button
                            type="button"
                            isSecondary={true}
                            className={cn('career-edit__modal-close')}
                            onClick={backToList}
                        >
                            {t('routes.person.projects.confirm.cancel')}
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

        if(step === ESteps.DeleteForm) {
            return t('routes.person.projects.confirm.title');
        }

        return (
            <H2 className={cn('career-edit__modal-header')}>
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
                    nextStep={(isDeleteAction) => {
                        if(isDeleteAction) {
                            return setStep(ESteps.DeleteForm);
                        }

                        return setStep(ESteps.DetailForm);
                    }}
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
                        props.onSubmit?.();
                    }}
                />
            );
        }
    };

    return (
        <Modal
            className={cn('career-edit')}
            header={elHeader()}
            footer={elFooter()}
            onClose={() => {
                props.onCancel?.() || props.onSubmit?.();
            }}
            onBack={step !== ESteps.List ? backToList : undefined}
        >
            {elContent()}
        </Modal>
    );
};

export default CareerEdit;
