import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { useClassnames } from 'hook/use-classnames';
import { IParams } from 'helper/url-list';

import Section from 'component/section';
import SectionHeader from 'component/section/header';
import EditAction from 'component/section/actions/edit';
import Loader from 'component/loader';
import Resources from 'component/resources';
import Button from 'component/button';
import { mainRequest } from 'adapter/api/main';
import Empty from 'component/empty';

import { ModulePositionLaborEstimateInline } from 'adapter/types/main/module/id/get/code-200';

import ResourceEdit from '../resource-edit';
import style from './index.module.pcss';

interface IProps {
    id: string,
    resourceValue?: Array<ModulePositionLaborEstimateInline>,
    isLoading?: boolean,
    isUserHasPermission?: boolean
}

const ResourceValue = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const { moduleId } = useParams<IParams>();
    const [create, { isLoading }] = mainRequest.useCreateRequestForSavedLaborEstimateByModuleIdMutation();

    const onEditResources = () => {
        setIsEdit(true);
    };

    const onClickCancel = () => {
        setIsEdit(false);
    };

    const elFunPoints = () => {
        if(props.isLoading) {
            return <Loader />;
        }

        if(props.resourceValue?.length) {
            return (
                <div className={cn('resource-value__content')}>
                    <Resources resources={props.resourceValue} />
                    {props.isUserHasPermission && (
                        <div className={cn('resource-value__button-wrapper')}>
                            <Button
                                isSecondary={true}
                                onClick={() => {
                                    void create({
                                        id: moduleId
                                    });
                                }}
                                disabled={isLoading}
                                isLoading={isLoading}
                                children={t('routes.module.resource-value.create-requests')}
                            />
                        </div>
                    )}
                </div>
            );
        }

        return <Empty>{t('routes.module.resource-value.empty')}</Empty>;
    };

    const elEditResources = () => {
        if(props.isUserHasPermission) {
            return <EditAction onClick={onEditResources} />;
        }
    };

    return (
        <Section id={props.id}>
            <SectionHeader actions={elEditResources()}>
                {t('routes.module.resource-value.title')}
            </SectionHeader>
            {elFunPoints()}
            {isEdit && (
                <ResourceEdit
                    setVisible={setIsEdit}
                    onClickCancel={onClickCancel}
                    defaultValues={props.resourceValue}
                />
            )}
        </Section>
    );
};

export default ResourceValue;
