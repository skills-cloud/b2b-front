import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

import { useClassnames } from 'hook/use-classnames';

import { RequestRead } from 'adapter/types/main/request/get/code-200';

import EditAction from 'component/section/actions/edit';
import DeleteAction from 'component/section/actions/delete';
import Dropdown from 'component/dropdown';

import ConfirmModal from './confirm-modal';
import style from './index.module.pcss';
import DropdownMenu from 'component/dropdown/menu';
import DropdownMenuItem from 'component/dropdown/menu-item';
import DotsAction from 'component/section/actions/dots';

interface IRequestList {
    requestList: Array<RequestRead>,
    fromOrganization?: boolean
}

const RequestList = ({ requestList, fromOrganization }: IRequestList) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const [confirm, setConfirm] = useState<boolean>(false);
    const [requestId, setRequestId] = useState<string>();
    const [projectName, setProjectName] = useState<string>();

    const onClickConfirmDelete = (newRequestId?: string, newProjectName?: string) => () => {
        setConfirm(true);
        setRequestId(newRequestId);
        setProjectName(newProjectName);
    };

    const onClickCancel = () => {
        setProjectName(undefined);
        setRequestId(undefined);
    };

    return (
        <React.Fragment>
            <div className={cn('request-list')}>
                {requestList.map((requestItem) => {
                    const organizationId = requestItem.organization_project?.organization_id;
                    const projectId = requestItem.organization_project?.id;
                    let requestUrl = `/requests/${requestItem.id}#main-info`;

                    if(fromOrganization) {
                        requestUrl = `/organizations/${organizationId}/projects/${projectId}/requests/${requestItem.id}#main-info`;
                    }

                    return (
                        <div key={requestItem.id} className={cn('request-list__item')}>
                            <div className={cn('request-list__item-top')}>
                                <div className={cn('request-list__item-top-left')}>
                                    <Link to={requestUrl} className={cn('request-list__item-top-left-title')}>
                                        {requestItem.title || t('routes.project-request-list.requests.request-item.title')}
                                    </Link>
                                    <span className={cn('request-list__item-top-left-subtitle')}>
                                        {t('routes.project-request-list.requests.request-item.date', {
                                            date: format(new Date(requestItem.start_date as string), 'dd.MM.yyyy')
                                        })}
                                    </span>
                                </div>

                                <div className={cn('request-list__item-top-right')}>
                                    <div className={cn('request-list__item-top-right-status')}>
                                        {t(`routes.project-request-list.requests.request-item.status.value.${requestItem.status}`)}
                                    </div>
                                    <div
                                        className={cn('request-list__item-top-right-priority', `request-list__item-top-right-priority_${requestItem.priority}`)}
                                    >
                                        {t(`routes.project-request-list.requests.request-item.priority.value.${requestItem.priority}`)}
                                    </div>
                                    <Dropdown
                                        render={() => (
                                            <DropdownMenu>
                                                <DropdownMenuItem selected={false}>
                                                    <EditAction
                                                        to={`/requests/${requestItem.id}/edit`}
                                                        label={t('routes.project-request-list.requests.actions.edit')}
                                                    />
                                                </DropdownMenuItem>
                                                <DropdownMenuItem selected={false}>
                                                    <DeleteAction
                                                        onClick={onClickConfirmDelete(String(requestItem.id), requestItem.project?.name)}
                                                        label={t('routes.project-request-list.requests.actions.delete')}
                                                    />
                                                </DropdownMenuItem>
                                            </DropdownMenu>
                                        )}
                                    >
                                        <DotsAction className={{ 'action__content': cn('request-list__icon-dots') }} />
                                    </Dropdown>
                                </div>
                            </div>
                            <div className={cn('request-list__item-content')}>
                                <div className={cn('request-list__item-content-block')}>
                                    <h5 className={cn('request-list__item-content-block-title')}>
                                        {t('routes.project-request-list.requests.content.creator')}
                                    </h5>
                                    <p className={cn('request-list__item-content-block-text')}>
                                        {requestItem.recruiter?.last_name || t('routes.project-request-list.requests.content.empty')}
                                    </p>
                                </div>
                                <div className={cn('request-list__item-content-block')}>
                                    <h5 className={cn('request-list__item-content-block-title')}>
                                        {t('routes.project-request-list.requests.content.resource-manager')}
                                    </h5>
                                    <p className={cn('request-list__item-content-block-text')}>
                                        {requestItem.resource_manager?.last_name || t('routes.project-request-list.requests.content.empty')}
                                    </p>
                                </div>
                                <div className={cn('request-list__item-content-block')}>
                                    <h5 className={cn('request-list__item-content-block-title')}>
                                        {t('routes.project-request-list.requests.content.industry-sector')}
                                    </h5>
                                    <p className={cn('request-list__item-content-block-text')}>
                                        {requestItem.industry_sector?.name || t('routes.project-request-list.requests.content.empty')}
                                    </p>
                                </div>
                                <div className={cn('request-list__item-content-block')}>
                                    <h5 className={cn('request-list__item-content-block-title')}>
                                        {t('routes.project-request-list.requests.content.count.title')}
                                    </h5>
                                    <p className={cn('request-list__item-content-block-text')}>
                                        {requestItem.requirements_count_sum ? t('routes.project-request-list.requests.content.count.value', { count: requestItem.requirements_count_sum }) : t('routes.project-request-list.requests.content.empty')}
                                    </p>
                                </div>
                                <div className={cn('request-list__item-content-block')}>
                                    <h5 className={cn('request-list__item-content-block-title')}>
                                        {t('routes.project-request-list.requests.content.rate.title')}
                                    </h5>
                                    <p className={cn('request-list__item-content-block-text')}>
                                        {requestItem.requirements?.[0]?.max_price ? t('routes.project-request-list.requests.content.rate.value', { count: requestItem.requirements?.[0]?.max_price }) : t('routes.project-request-list.requests.content.empty')}
                                    </p>
                                </div>
                                <div className={cn('request-list__item-content-block')}>
                                    <h5 className={cn('request-list__item-content-block-title')}>
                                        {t('routes.project-request-list.requests.content.candidates.title')}
                                    </h5>
                                    <p className={cn('request-list__item-content-block-text')}>
                                        {t('routes.project-request-list.requests.content.empty')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {confirm && requestId && (
                <ConfirmModal
                    setVisible={setConfirm}
                    requestId={requestId}
                    requestName={projectName}
                    onClickCancel={onClickCancel}
                />
            )}
        </React.Fragment>
    );
};

export default RequestList;
