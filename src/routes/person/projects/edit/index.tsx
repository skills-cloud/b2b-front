import React, { MouseEvent, useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames, { IStyle } from 'hook/use-classnames';
import Button from 'component/button';
import Modal from 'component/modal';
import IconArrowLeft from 'component/icons/arrow-left-full';
import { H2 } from 'component/header';

import { CvProjectRead } from 'adapter/types/cv/project/get/code-200';

import ProjectsList from '../list';
import ProjectsForm from '../form';
import RemoveModal from '../remove-modal';
import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    fields?: Array<CvProjectRead>,
    onSubmit?(payload: Array<CvProjectRead>): void,
    onCancel?(): void
}

enum ESteps {
    List,
    DetailForm,
    DeleteForm,
}

export const ProjectsEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();

    const [projectId, setProjectId] = useState<number | null>(null);
    const [step, setStep] = useState<ESteps>(ESteps.List);
    const [loading, setLoading] = useState<boolean>(false);

    const formValues = projectId !== null && props.fields?.find(({ id }) => id === projectId) ? {
        defaultValues: {
            project: props.fields
                ?.filter(({ id }) => id === projectId)
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
                    }
                }))[0]
        }
    } : undefined;

    const backToList = () => {
        setProjectId(null);
        setStep(ESteps.List);
    };

    const elFooter = () => {
        return (
            <Fragment>
                {step === ESteps.List && (
                    <div className={cn('projects-edit__form-footer')}>
                        <a
                            href="#append"
                            className={cn('projects-edit__link-append')}
                            children={t('routes.person.projects.edit.buttons.append')}
                            onClick={(e: MouseEvent) => {
                                e.preventDefault();
                                setStep(ESteps.DetailForm);
                                setProjectId(null);
                            }}
                        />
                        <Button onClick={props.onCancel}>{t('routes.person.projects.edit.buttons.done')}</Button>
                    </div>
                )}
                {step === ESteps.DetailForm && (
                    <div className={cn('projects-edit__form-footer-detail')}>
                        <Button
                            isSecondary={true}
                            onClick={backToList}
                            disabled={loading}
                        >
                            {t('routes.person.projects.edit.buttons.cancel')}
                        </Button>
                        <Button
                            form="projects-form"
                            type="submit"
                            disabled={loading}
                            isLoading={loading}
                        >
                            {t('routes.person.projects.edit.buttons.save')}
                        </Button>
                    </div>
                )}
            </Fragment>
        );
    };

    const elHeader = () => {
        if(projectId === null) {
            return t('routes.person.projects.header');
        }

        return (
            <H2 className={cn('projects-edit__modal-header')}>
                <button
                    type="button"
                    onClick={backToList}
                >
                    <IconArrowLeft
                        svg={{ className: cn('projects-edit__icon-back') }}
                    />
                </button>
                {props.fields?.filter((field) => field.id === projectId)[0]?.position?.name}
            </H2>
        );
    };

    const elContent = () => {
        if(step === ESteps.List) {
            return (
                <ProjectsList
                    fields={props.fields}
                    setProjectId={setProjectId}
                    nextStep={(isDeleteAction) => (isDeleteAction ? setStep(ESteps.DeleteForm) : setStep(ESteps.DetailForm))}
                />
            );
        }

        if(step === ESteps.DetailForm) {
            return (
                <ProjectsForm
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
                className={cn('projects-edit')}
                header={elHeader()}
                footer={elFooter()}
            >
                {elContent()}
            </Modal>
            {step === ESteps.DeleteForm && (
                <RemoveModal
                    projectId={projectId}
                    nextStepAfterDelete={backToList}
                />
            )}
        </Fragment>
    );
};

export default ProjectsEdit;
