import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IStyle, useClassnames } from 'hook/use-classnames';
import useModalClose from 'component/modal/use-modal-close';

import Loader from 'component/loader';
import { H2, H3 } from 'component/header';
import IconPlus from 'component/icons/plus';
import IconApply from 'component/icons/apply';
import Modal from 'component/modal';
import IconClose from 'component/icons/close';

import { mainRequest } from 'adapter/api/main';
import { RequestRequirementRead } from 'adapter/types/main/request-requirement/get/code-200';

import style from './index.module.pcss';

export interface IProps {
    className?: IStyle | string,
    specialistId?: number,
    showModal: boolean,
    onClickClose?(): void
}

const Request = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();

    const { data, isLoading } = mainRequest.useGetRequestListQuery(undefined);

    const [addSpecialist, { isLoading: isLoadingAdd, isSuccess }] = mainRequest.usePostRequestRequirementLinkCvMutation();

    const [currentReqId, setCurrentReqId] = useState<number>();
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        setShowModal(props.showModal);
    }, [props.showModal]);

    useModalClose(showModal, setShowModal);

    const onClickClose = () => {
        setShowModal(false);
        props.onClickClose?.();
    };

    const onClickAddSpecialist = (requirementId?: number) => () => {
        if(requirementId) {
            setCurrentReqId(requirementId);

            addSpecialist({
                id   : String(requirementId),
                cv_id: String(props.specialistId),
                data : {}
            })
                .unwrap()
                .catch(console.error);
        }
    };

    const elIconStatus = (reqId?: number) => {
        let content = (
            <IconPlus
                svg={{
                    onClick  : onClickAddSpecialist(reqId),
                    className: cn('request__item-add-icon')
                }}
            />
        );

        if(isLoadingAdd && currentReqId === reqId) {
            content = <Loader />;
        }

        if(isSuccess && currentReqId === reqId) {
            content = (
                <IconApply
                    svg={{
                        className: cn('request__item-add-icon', 'request__item-add-icon_apply')
                    }}
                />
            );
        }

        return (
            <div
                className={cn('request__item-add-icon-wrapper', {
                    'request__item-add-icon-wrapper_success': isSuccess && currentReqId === reqId
                })}
            >
                {content}
            </div>
        );
    };

    const elRequestRequirements = (requirements?: Array<RequestRequirementRead>) => {
        if(requirements?.length) {
            return (
                requirements?.map((requirement) => (
                    <li key={requirement.id} className={cn('request__item-requirement')}>
                        {requirement.name || requirement.position?.name || t('routes.specialists.main.projects.requirement-no-name')}
                        {elIconStatus(requirement.id)}
                    </li>
                ))
            );
        }

        return (
            <li className={cn('request__item-requirement')}>
                {t('routes.specialists.main.projects.requirement-empty')}
            </li>
        );
    };

    const elModalHeader = () => {
        return (
            <Fragment>
                <H2 className={cn('request__modal-header-text')}>
                    {t('routes.specialists.main.projects.add')}
                </H2>
                <div className={cn('request__modal-header-close')} onClick={onClickClose}>
                    <IconClose svg={{ className: cn('request__modal-header-close-icon') }} />
                </div>
            </Fragment>
        );
    };

    const elContent = () => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.results.length) {
            return data?.results?.map((request) => (
                <div key={request.id} className={cn('request__item')}>
                    <H3>{request.project?.name || t('routes.specialists.main.projects.empty-name')}</H3>
                    <ul className={cn('request__item-requirements')}>
                        {elRequestRequirements(request.requirements)}
                    </ul>
                </div>
            ));
        }
    };

    if(showModal) {
        return (
            <Modal header={elModalHeader()}>
                <div className={cn('request')}>
                    {elContent()}
                </div>
            </Modal>
        );
    }

    return null;
};

export default Request;
