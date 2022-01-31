import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { useClassnames } from 'hook/use-classnames';
import { IParams, ORGANIZATION_PROJECT_MODULE_FUN_POINTS } from 'helper/url-list';

import Section from 'component/section';
import SectionHeader from 'component/section/header';
import EditAction from 'component/section/actions/edit';
import Loader from 'component/loader';
import SectionContentList from 'component/section/content-list';
import SectionContentListItem from 'component/section/content-list-item';
import Button from 'component/button';
import Empty from 'component/empty';

import { mainRequest } from 'adapter/api/main';
import { ModuleFunPointInline } from 'adapter/types/main/module/id/get/code-200';

import ConfirmModalRegenerate from './confirm-modal';
import style from './index.module.pcss';

interface IProps {
    isLoading?: boolean,
    isUserHasPermission?: boolean,
    funPoints?: Array<ModuleFunPointInline>,
    difficulty?: number,
    id: string
}

const FunPoints = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { organizationId, moduleId, projectId } = useParams<IParams>();
    const [update] = mainRequest.useSetExpectedLaborEstimateAsSavedByModuleIdMutation();


    const [isRegenerate, setIsRegenerate] = useState<boolean>(false);

    const onClickGenerate = () => {
        setIsRegenerate(true);
    };

    const onClickCancel = () => {
        setIsRegenerate(false);
    };

    const elFunPoints = () => {
        if(props.isLoading) {
            return <Loader />;
        }

        if(props.funPoints?.length) {
            return (
                <div className={cn('fun-points__content')}>
                    <SectionContentList>
                        <SectionContentListItem title={t('routes.module.fun-points.count')}>
                            {props.funPoints.length}
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.module.fun-points.type')}>
                            {props.funPoints.map((point, index, arr) => {
                                const typeText = point.fun_point_type?.name;

                                return index + 1 === arr.length ? typeText : `${typeText}, `;
                            })}
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.module.fun-points.difficulty')}>
                            {props.difficulty?.toFixed(2)}
                        </SectionContentListItem>
                    </SectionContentList>
                    {props.isUserHasPermission && (
                        <div className={cn('fun-points__generate')}>
                            <Button type="button" isSecondary={true} onClick={onClickGenerate}>
                                {t('routes.module.fun-points.button')}
                            </Button>
                        </div>
                    )}
                </div>
            );
        }

        return <Empty>{t('routes.module.fun-points.empty')}</Empty>;
    };

    const elEditFunPoints = () => {
        if(props.isUserHasPermission) {
            return <EditAction to={ORGANIZATION_PROJECT_MODULE_FUN_POINTS(organizationId, projectId, moduleId)} />;
        }
    };

    return (
        <Section id={props.id}>
            <SectionHeader actions={elEditFunPoints()}>
                {t('routes.module.fun-points.title')}
            </SectionHeader>
            {elFunPoints()}
            {isRegenerate && (
                <ConfirmModalRegenerate
                    setVisible={setIsRegenerate}
                    onClickCancel={onClickCancel}
                    onClickOk={() => {
                        setIsRegenerate(false);

                        void update({
                            id: moduleId
                        });
                    }}
                />
            )}
        </Section>
    );
};

export default FunPoints;
