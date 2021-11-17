import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

import { IParams, ORGANIZATION_PROJECT_MODULE_CREATE, ORGANIZATION_PROJECT_MODULE_ID } from 'helper/url-list';
import { useClassnames } from 'hook/use-classnames';

import SectionContentListItem from 'component/section/content-list-item';
import SectionHeader from 'component/section/header';
import AddAction from 'component/section/actions/add';
import Section from 'component/section';
import { H4 } from 'component/header';
import IconChevronRight from 'component/icons/chevron-right';
import Separator from 'component/separator';
import SectionContentList from 'component/section/content-list';
import Loader from 'component/loader';

import { ModuleRead } from 'adapter/types/main/module/get/code-200';

import style from './index.module.pcss';

enum EModuleInvariants {
    Start = 'start',
    Deadline = 'deadline',
    Description = 'description',
    FunPoints = 'fun-points',
    FunType = 'fun-type',
    Difficulty = 'difficulty',
    Estimate = 'estimate'
}

interface IProps {
    id?: string,
    modules?: Array<ModuleRead>,
    isLoading?: boolean
}

const ModulesList = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { projectId, organizationId } = useParams<IParams>();

    const renderField = (field: EModuleInvariants, module: ModuleRead) => {
        let content = null;

        switch (field) {
            case EModuleInvariants.Start:
                content = module.start_date;
                break;
            case EModuleInvariants.Deadline:
                content = module.deadline_date;
                break;
            case EModuleInvariants.Description:
                content = module?.description;
                break;
            case EModuleInvariants.FunPoints:
                content = module.fun_points?.length;
                break;
            case EModuleInvariants.FunType:
                content = module?.fun_points?.map((point, index, arr) => {
                    return index + 1 !== arr.length ? `${point.fun_point_type?.name}, ` : point.fun_point_type?.name;
                }).join('');
                break;
            case EModuleInvariants.Difficulty:
                content = module?.difficulty?.toFixed(2);
                break;
            case EModuleInvariants.Estimate:
                content = module?.positions_labor_estimates?.map((estimate, index, arr) => {
                    const estimateCount = t('routes.modules-list.module.estimate-count', {
                        count: estimate.count
                    });
                    const estimateHours = t('routes.modules-list.module.estimate-hours', {
                        count: estimate.hours
                    });

                    return (
                        <div key={index} className={cn('')}>
                            {index + 1 !== arr.length ? `${estimateCount}, ${estimateHours};\n` : `${estimateCount}, ${estimateHours}`}
                        </div>
                    );
                });
                break;
            default:
                content = null;
        }

        return (
            <SectionContentListItem title={t(`routes.modules-list.module.${field}`)} key={field}>
                {content}
            </SectionContentListItem>
        );
    };

    const elCreateModule = () => {
        return <AddAction to={ORGANIZATION_PROJECT_MODULE_CREATE(organizationId, projectId)} />;
    };

    const elContent = () => {
        if(props.isLoading) {
            return <Loader />;
        }

        if(props.modules?.length) {
            return props.modules?.map((moduleItem, index) => {
                return (
                    <Fragment key={moduleItem.id}>
                        {index > 0 && <Separator />}
                        <SectionContentList>
                            <Link
                                to={ORGANIZATION_PROJECT_MODULE_ID(organizationId, projectId, moduleItem.id)}
                                className={cn('modules-list__item-title')}
                            >
                                <H4>{moduleItem.name}</H4>
                                <IconChevronRight />
                            </Link>
                            {Object.values(EModuleInvariants).map((field) => renderField(field, moduleItem))}
                        </SectionContentList>
                    </Fragment>
                );
            });
        }

        return (
            <div className={cn('modules-list__empty')}>
                {t('routes.modules-list.empty')}
            </div>
        );
    };

    return (
        <Section id={props.id}>
            <SectionHeader actions={elCreateModule()}>
                {t('routes.modules-list.title')}
            </SectionHeader>
            {elContent()}
        </Section>
    );
};

export default ModulesList;
