import React, { useEffect, useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import { IStyle, useClassnames } from 'hook/use-classnames';

import Loader from 'component/loader';
import { H2, H4 } from 'component/header';
import Modal from 'component/modal';
import IconPlus from 'component/icons/plus';
import IconApply from 'component/icons/apply';
import IconChevronRight from 'component/icons/chevron-right';
import IconWarning from 'component/icons/warning';
import DateInput from 'component/form/date';
import Tooltip from 'component/tooltip';

import { EStatus, mainRequest } from 'adapter/api/main';
import { RequestRequirementRead } from 'adapter/types/main/request-requirement/get/code-200';
import { RequestRead } from 'adapter/types/main/request/id/get/code-200';

import style from './index.module.pcss';

export interface IProps {
    requestId?: string,
    projectId?: string,
    requirementId?: string,
    className?: IStyle | string,
    specialistId?: number,
    onClickClose?(): void,
    onClickBack?(): void
}

const Request = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const context = useForm({
        mode: 'onChange'
    });

    const [expandedId, setExpandedId] = useState<number>();
    const [expandedProjectId, setExpandedProjectId] = useState<number>();
    const [currentReqId, setCurrentReqId] = useState<number>();

    const { data, isLoading } = mainRequest.useGetMainRequestQuery(undefined, { skip: !!props.requestId });
    const { data: requestData, isLoading: isLoadingRequest } = mainRequest.useGetMainRequestByIdQuery({
        id: props.requestId as string
    }, {
        skip: !props.requestId
    });
    const { data: requirementData, isLoading: loadingReqData } = mainRequest.useGetMainRequestRequirementByIdQuery({ id: String(expandedId) }, { skip: !expandedId });

    const [addSpecialist, { isLoading: isLoadingAdd, isSuccess, isError }] = mainRequest.usePostRequestRequirementLinkCvMutation();

    useEffect(() => {
        if(requestData?.requirements) {
            const requirement = requestData?.requirements.find((item) => String(item.id) === props.requirementId);

            if(requirement) {
                context.reset({
                    date_from : requirement.date_from,
                    date_to   : requirement.date_to,
                    id        : requirement.id,
                    project_id: requestData.module?.organization_project_id
                });
            }
        }
    }, [JSON.stringify(requestData?.requirements)]);

    useEffect(() => {
        if(requirementData && expandedProjectId) {
            context.reset({
                date_from : requirementData.date_from,
                date_to   : requirementData.date_to,
                id        : requirementData.id,
                project_id: expandedProjectId
            });
        }
    }, [JSON.stringify(requirementData), expandedProjectId]);

    const onClickExpand = (projectId?: number, reqId?: number) => () => {
        if(projectId) {
            setExpandedProjectId(projectId);
        }

        if(reqId) {
            setExpandedId((oldState) => {
                if(reqId !== oldState) {
                    return reqId;
                }

                return undefined;
            });
        }
    };

    const onSubmit = context.handleSubmit(
        (formData) => {
            addSpecialist({
                id       : String(formData.id),
                cv_id    : String(props.specialistId),
                date_from: formData.date_from,
                date_to  : formData.date_to,
                status   : EStatus.PreCandidate
            })
                .unwrap()
                .catch(console.error);
        },
        (formError) => {
            console.error(formError);
        }
    );

    const onClickAddSpecialist = (requirementId?: number) => (e: MouseEvent<HTMLOrSVGElement>) => {
        e.preventDefault();

        if(requirementId) {
            setCurrentReqId(requirementId);

            void onSubmit();
        }
    };

    const elIconStatus = (reqId?: number) => {
        const alreadyAdded = requirementData?.cv_list_ids?.find((item) => String(item) === String(props.specialistId));
        const wrapperClass = cn('request__icon-wrapper', {
            'request__icon-wrapper_success': isSuccess && currentReqId === reqId || alreadyAdded
        });
        let content = (
            <button
                type="submit"
                className={wrapperClass}
            >
                <IconPlus
                    svg={{
                        onClick  : onClickAddSpecialist(reqId),
                        className: cn('request__item-add-icon')
                    }}
                />
            </button>
        );

        if(isLoadingAdd && currentReqId === reqId || loadingReqData) {
            content = <Loader />;
        }

        if(isError && currentReqId === reqId) {
            content = (
                <IconWarning
                    svg={{
                        className: cn('request__item-add-icon', 'request__item-add-icon_warning')
                    }}
                />
            );
        }

        if(isSuccess && currentReqId === reqId || alreadyAdded) {
            content = (
                <Tooltip
                    className={wrapperClass}
                    content={t('routes.specialists.main.projects.success', {
                        context: isSuccess ? 'done' : 'already'
                    })}
                >
                    <IconApply
                        svg={{
                            className: cn('request__item-add-icon', 'request__item-add-icon_apply')
                        }}
                    />
                </Tooltip>
            );
        }

        return (
            <div className={cn('request__item-content')}>
                {content}
            </div>
        );
    };

    const elForm = (requirement: RequestRequirementRead) => {
        return (
            <FormProvider {...context}>
                <form className={cn('request__form')}>
                    <DateInput name="date_from" />
                    <DateInput name="date_to" />
                    {elIconStatus(requirement.id)}
                </form>
            </FormProvider>
        );
    };

    const elRequestRequirements = (projectId?: number, requirements?: Array<RequestRequirementRead>) => {
        if(requirements?.length) {
            if(props.requirementId) {
                const itemToRender = requirements.find((item) => String(item.id) === props.requirementId);

                if(itemToRender) {
                    return (
                        <li className={cn('request__item-requirement')}>
                            {itemToRender.name || itemToRender.position?.name || t('routes.specialists.main.projects.requirement-no-name')}
                            {elForm(itemToRender)}
                        </li>
                    );
                }
            }

            return requirements?.map((requirement) => {
                return (
                    <li
                        key={requirement.id}
                        className={cn('request__item-requirement', {
                            'request__item-requirement_full': expandedId !== requirement.id
                        })}
                    >
                        <div className={cn('request__item-requirement-expand')}>
                            <IconChevronRight
                                svg={{
                                    onClick  : onClickExpand(projectId, requirement.id),
                                    className: cn('request__expand-arrow', {
                                        'request__expand-arrow_down': expandedId === requirement.id
                                    })
                                }}
                            />
                            {requirement.name || requirement.position?.name || t('routes.specialists.main.projects.requirement-no-name')}
                        </div>
                        {expandedId === requirement.id && elForm(requirement)}
                    </li>
                );
            });
        }
    };

    const elModalHeader = () => {
        return (
            <H2 className={cn('request__modal-header-text')}>
                {t('routes.specialists.main.projects.add')}
            </H2>
        );
    };

    const elRequestItem = (request: RequestRead) => {
        if(request.requirements?.length) {
            return (
                <div key={request.id} className={cn('request__item')}>
                    <H4>{request.title || t('routes.specialists.main.projects.empty-name')}</H4>
                    <ul className={cn('request__item-requirements')}>
                        {elRequestRequirements(request.module?.organization_project_id, request.requirements)}
                    </ul>
                </div>
            );
        }
    };

    const elContent = () => {
        if(isLoading || isLoadingRequest) {
            return <Loader />;
        }

        if(data?.results.length) {
            return data?.results?.map((request) => elRequestItem(request));
        }

        if(requestData) {
            return elRequestItem(requestData);
        }

        return (
            <div className={cn('request__empty-list')}>
                {t('routes.specialists.main.projects.empty-list')}
            </div>
        );
    };

    return (
        <Modal header={elModalHeader()} onClose={props.onClickClose} onBack={props.onClickBack}>
            <div className={cn('request')}>
                {elContent()}
            </div>
        </Modal>
    );
};

export default Request;
