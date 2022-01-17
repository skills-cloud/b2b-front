import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

import { useClassnames } from 'hook/use-classnames';
import { IParams, ORGANIZATION_PROJECT_CREATE, ORGANIZATION_PROJECT_ID } from 'helper/url-list';

import Section from 'component/section';
import IconChevronRight from 'component/icons/chevron-right';
import SectionHeader from 'component/section/header';
import SectionContentList from 'component/section/content-list';
import SectionContentListItem from 'component/section/content-list-item';
import { H4 } from 'component/header';
import Separator from 'component/separator';
import Timeframe from 'component/timeframe';
import Loader from 'component/loader';
import AddAction from 'component/section/actions/add';

import { OrganizationProjectRead } from 'adapter/types/main/organization-project/get/code-200';
import { mainRequest } from 'adapter/api/main';

import style from './index.module.pcss';
import Empty from 'component/empty';
import Error from 'component/error';
import Wrapper from 'component/section/wrapper';

enum EProjectInvariants {
    Period = 'period',
    Industry = 'industry',
    Description = 'description',
    Module = 'module'
}

interface IProps {
    isContractor?: boolean
}

const ProjectList = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { organizationId } = useParams<IParams>();
    const { data, isLoading, isError, error } = mainRequest.useGetMainOrganizationProjectListQuery({
        organization_customer_id: organizationId ? [parseInt(organizationId, 10)] : undefined
    }, {
        skip: !organizationId || props.isContractor
    });

    const renderField = (field: EProjectInvariants, project: OrganizationProjectRead) => {
        let content = null;

        switch (field) {
            case EProjectInvariants.Period:
                content = <Timeframe startDate={project.date_from} endDate={project.date_to} />;
                break;
            case EProjectInvariants.Description:
                content = project?.description;
                break;
            case EProjectInvariants.Industry:
                content = project?.industry_sector?.name;
                break;
            case EProjectInvariants.Module:
                content = project?.modules_count;
                break;
            default:
                content = null;
        }

        return (
            <SectionContentListItem title={t(`routes.organization.blocks.project.${field}`)} key={field}>
                {content}
            </SectionContentListItem>
        );
    };

    const elErrors = useMemo(() => {
        const errors = error as {
            data: {
                details: Record<string, Array<string>> | string
            }
        };

        if(errors?.data?.details && typeof errors?.data?.details !== 'string') {
            const keys = Object.keys(errors.data.details);

            return (
                <div>
                    {keys.map((key) => {
                        if(typeof errors?.data?.details?.[key] === 'string') {
                            return <Error key={key}>{`${key}: ${errors?.data?.details?.[key]}`}</Error>;
                        }

                        return (errors?.data?.details as Record<string, Array<string>>)?.[key]?.map((message, index) => (
                            <Error key={`${key}-${index}}`}>{message}</Error>
                        ));
                    })}
                </div>
            );
        }

        return <Error>{errors?.data?.details}</Error>;
    }, [isError, isLoading, error]);

    const elContent = useMemo(() => {
        if(isLoading) {
            return <Loader />;
        }

        if(!isLoading && isError && error) {
            return elErrors;
        }

        if(data?.results?.length) {
            return data.results.map((item, index) => (
                <React.Fragment key={item.id}>
                    {index > 0 && <Separator />}
                    <SectionContentList>
                        <Link to={ORGANIZATION_PROJECT_ID(organizationId, item.id)} className={cn('projects__header')}>
                            <H4>{item?.name}</H4>
                            <IconChevronRight />
                        </Link>
                        {Object.values(EProjectInvariants).map((field) => renderField(field, item))}
                    </SectionContentList>
                </React.Fragment>
            ));
        }

        return <Empty>{t('routes.organization.blocks.empty.title')}</Empty>;
    }, [JSON.stringify(data?.results), isLoading]);

    return (
        <Section>
            <Wrapper>
                <SectionHeader actions={<AddAction to={ORGANIZATION_PROJECT_CREATE(organizationId)} />}>
                    {t('routes.organization.blocks.sections.projects')}
                </SectionHeader>
                {elContent}
            </Wrapper>
        </Section>
    );
};

export default ProjectList;
