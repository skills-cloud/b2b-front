import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useClassnames } from 'hook/use-classnames';

import Button from 'component/button';

import { ModulePositionLaborEstimateInline } from 'adapter/types/main/module/id/get/code-200';

import style from './index.module.pcss';

interface IProps {
    resources: Array<ModulePositionLaborEstimateInline>,
    actionText?: string,
    actionLoading?: boolean,
    actionClick?(): void
}

interface IDataToRender {
    count: number,
    hours: number
}

const Resources = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    const elResources = useMemo(() => {
        return (
            <div className={cn('resources__content')}>
                <div className={cn('resources__content-header')}>
                    <span className={cn('resources__content-header-text')}>
                        {t('components.resources.content.header.role')}
                    </span>
                    <span className={cn('resources__content-header-text')}>
                        {t('components.resources.content.header.count')}
                    </span>
                    <span className={cn('resources__content-header-text')}>
                        {t('components.resources.content.header.hours')}
                    </span>
                </div>
                {props.resources.map((resource) => (
                    <div key={resource.id} className={cn('resources__content-item')}>
                        <span className={cn('resources__content-item-role')}>
                            {resource.position?.name}
                        </span>
                        <span className={cn('resources__content-item-role')}>
                            {resource.count}
                        </span>
                        <span className={cn('resources__content-item-role')}>
                            {resource.hours}
                        </span>
                    </div>
                ))}
            </div>
        );
    }, [JSON.stringify(props.resources)]);

    const elButtonAction = useMemo(() => {
        if(props.actionText && props.actionClick) {
            return (
                <div className={cn('resources__button-wrap')}>
                    <Button
                        onClick={props.actionClick}
                        isSecondary={true}
                        isLoading={props.actionLoading}
                        disabled={props.actionLoading}
                    >
                        {props.actionText}
                    </Button>
                </div>
            );
        }
    }, [props.actionClick, props.actionText]);

    const elSummary = useMemo(() => {
        const dataToRender = props.resources?.reduce((acc, curr) => {
            if(curr?.hours && curr?.count) {
                acc.count += curr.count;
                acc.hours += curr.hours;
            }

            return acc;
        }, {
            count: 0,
            hours: 0
        } as IDataToRender);

        if(dataToRender) {
            return (
                <div className={cn('resources__summary')}>
                    {Object.values(dataToRender).map((item, index) => (
                        <div key={index} className={cn('resources__summary-item')}>
                            <span className={cn('resources__summary-label')}>
                                {t(`components.resources.summary.${index}.title`)}
                            </span>
                            <span className={cn('resources__summary-value')}>
                                {t(`components.resources.summary.${index}.count`, {
                                    count: item
                                })}
                            </span>
                        </div>
                    ))}
                    {elButtonAction}
                </div>
            );
        }

        return null;
    }, [JSON.stringify(props.resources)]);

    return (
        <div className={cn('resources')}>
            {elSummary}
            {elResources}
        </div>
    );
};

export default Resources;
