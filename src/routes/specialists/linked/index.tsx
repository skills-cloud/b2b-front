import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import useClassnames from 'hook/use-classnames';

import Modal from 'component/modal';
import UserItem from 'route/specialists/user-item';
import { H2 } from 'component/header';
import Loader from 'component/loader';
import Request from 'component/request';

import { cv } from 'adapter/api/cv';

import style from './index.module.pcss';

export interface IProps {
    linkedIds: Array<number>,
    onClose?(): void
}

const Linked = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { data, isLoading } = cv.useGetCvListQuery({ id: props.linkedIds });

    const params = useParams<{ requirementId: string, requestId: string, projectId: string }>();

    const [addToRequest, setAddToRequest] = useState<number | null>();

    const onClickAddToRequest = useCallback((cvItemId?: number) => {
        setAddToRequest(cvItemId);
    }, [params.requestId]);

    const onClickBack = () => {
        setAddToRequest(null);
    };

    const elModalHeader = () => {
        return (
            <H2 className={cn('linked__modal-header-text')}>
                {t('routes.specialists.main.linked.title')}
            </H2>
        );
    };

    const elContent = () => {
        if(addToRequest) {
            return (
                <Request
                    projectId={params.projectId}
                    requirementId={params.requirementId}
                    requestId={params.requestId}
                    specialistId={addToRequest}
                    onClickClose={props.onClose}
                    onClickBack={onClickBack}
                />
            );
        }

        if(isLoading) {
            return <Loader />;
        }

        if(data?.results?.length) {
            return (
                <div className={cn('linked__users')}>
                    {data?.results.map((cvItem) => (
                        <UserItem
                            key={cvItem.id}
                            cvItem={cvItem}
                            showLinkedItems={false}
                            onClickAddToRequest={onClickAddToRequest}
                        />
                    ))}
                </div>
            );
        }
    };

    return (
        <Modal header={elModalHeader()} onClose={props.onClose}>
            <div className={cn('linked__users-modal')}>
                {elContent()}
            </div>
        </Modal>
    );
};

export default Linked;
