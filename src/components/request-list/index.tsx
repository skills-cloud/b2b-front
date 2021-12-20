import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

import {
    ORGANIZATION_PROJECT_MODULE_REQUEST_EDIT,
    ORGANIZATION_PROJECT_MODULE_REQUEST_ID,
    REQUEST_EDIT,
    REQUEST_ID
} from 'helper/url-list';
import { useClassnames } from 'hook/use-classnames';

import { RequestRead } from 'adapter/types/main/request/get/code-200';

import EditAction from 'component/section/actions/edit';
import DeleteAction from 'component/section/actions/delete';
import Dropdown from 'component/dropdown';
import DropdownMenu from 'component/dropdown/menu';
import DropdownMenuItem from 'component/dropdown/menu-item';
import DotsAction from 'component/section/actions/dots';

import ConfirmModal from './confirm-modal';
import style from './index.module.pcss';

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
                    const organizationId = requestItem.module?.organization_project?.organization_id;
                    const projectId = requestItem.module?.organization_project?.id;
                    const moduleId = requestItem.module_id;
                    let requestUrl = REQUEST_ID(requestItem.id);

                    if(fromOrganization) {
                        requestUrl = ORGANIZATION_PROJECT_MODULE_REQUEST_ID(organizationId, projectId, moduleId, requestItem.id);
                    }

                    const candidatesCount = requestItem.requirements?.reduce((acc, curr) => {
                        let newAcc = 0;

                        if(curr?.cv_list) {
                            newAcc = acc + curr.cv_list.length;
                        }

                        return newAcc;
                    }, 0);

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
                                                        to={organizationId ? ORGANIZATION_PROJECT_MODULE_REQUEST_EDIT(organizationId, projectId, moduleId, requestItem.id) : REQUEST_EDIT(requestItem.id)}
                                                        label={t('routes.project-request-list.requests.actions.edit')}
                                                    />
                                                </DropdownMenuItem>
                                                <DropdownMenuItem selected={false}>
                                                    <DeleteAction
                                                        onClick={onClickConfirmDelete(String(requestItem.id), requestItem.title)}
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
                                        {t('routes.project-request-list.requests.content.candidates.title')}
                                    </h5>
                                    <p className={cn('request-list__item-content-block-text')}>
                                        {candidatesCount || t('routes.project-request-list.requests.content.empty')}
                                    </p>
                                </div>
                                <div className={cn('request-list__item-content-block')}>
                                    <h5 className={cn('request-list__item-content-block-title')}>
                                        {t('routes.project-request-list.requests.content.status.title')}
                                    </h5>
                                    <p className={cn('request-list__item-content-block-text')}>
                                        {t(`routes.project-request-list.requests.content.status.value.${requestItem.status}`)}
                                    </p>
                                </div>
                                <div className={cn('request-list__item-content-block', 'request-list__item-content-block_specs')}>
                                    <h5 className={cn('request-list__item-content-block-title')}>
                                        {t('routes.project-request-list.requests.content.rate.title')}
                                    </h5>
                                    <div className={cn('request-list__item-content-list')}>
                                        <div className={cn('request-list__item-content-table-head')}>
                                            <div>{t('routes.project-request-list.requests.content.rate.head.specialist')}</div>
                                            <div>{t('routes.project-request-list.requests.content.rate.head.rate')}</div>
                                        </div>
                                        {requestItem.requirements?.map((item) => {
                                            return (
                                                <div key={item.id} className={cn('request-list__item-content-list-item')}>
                                                    <p className={cn('request-list__item-content-block-text')}>
                                                        {item.position?.name || t('routes.project-request-list.requests.content.rate.value')}
                                                    </p>
                                                    <p className={cn('request-list__item-content-block-text')}>
                                                        {item.max_price ? t('routes.project-request-list.requests.content.rate.value', { count: item.max_price }) : t('routes.project-request-list.requests.content.empty')}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
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
