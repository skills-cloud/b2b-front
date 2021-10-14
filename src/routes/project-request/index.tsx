import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';

import { useClassnames } from 'hook/use-classnames';

import SidebarLayout from 'component/layout/sidebar';
import Section from 'component/section';
import IconArrowLeftFull from 'component/icons/arrow-left-full';
import SidebarNav, { NavItem } from 'component/nav';

import ESectionInvariants from 'route/project-request/components/section-invariants';
import MainInfo from 'route/project-request/components/main-info';
import Requirements from 'route/project-request/components/requirements';
import Customer from 'route/project-request/components/customer';
import ProjectRequestPdf from 'route/project-request/components/documents/pdf';
import ProjectRequestDocx from 'route/project-request/components/documents/docx';
import ProjectRequestCsv from 'route/project-request/components/documents/xlsx';
import { H5 } from 'component/header';
import Wrapper from 'component/section/wrapper';

import { mainRequest } from 'adapter/api/main';

import Specialists from './specialists';
import style from './index.module.pcss';

const ProjectRequest = () => {
    const cn = useClassnames(style);
    const { hash } = useLocation();
    const history = useHistory();
    const { t } = useTranslation();
    const params = useParams<{ subpage?: string, requestId: string }>();
    const { data } = mainRequest.useGetMainRequestByIdQuery(
        { id: params.requestId },
        { refetchOnMountOrArgChange: true }
    );

    const onClickBack = () => {
        history.goBack();
    };

    if(!data) {
        return null;
    }

    const elContent = () => {
        if(params.subpage === 'specialists') {
            return <Specialists />;
        }

        return (
            <Fragment>
                <MainInfo {...data} />
                {data.id && <Requirements requirements={data?.requirements} requestId={data.id} />}
                {data.id && <Customer customer={data.organization_project?.organization} requestId={data.id} />}
            </Fragment>
        );
    };

    const elDocuments = () => {
        if(!params.subpage) {
            return (
                <Section>
                    <Wrapper>
                        <H5>{t('routes.project-request.sidebar.documents')}</H5>
                        <ProjectRequestPdf />
                        <ProjectRequestDocx />
                        <ProjectRequestCsv />
                    </Wrapper>
                </Section>
            );
        }
    };

    const elSidebarContent = () => {
        let content = (
            <Fragment>
                {Object.values(ESectionInvariants).map((nav) => (
                    <NavItem
                        to={`#${nav}`}
                        selected={nav === hash.slice(1)}
                        key={nav}
                    >
                        {t(`routes.project-request.blocks.sections.${nav}`)}
                    </NavItem>
                ))}
                <NavItem
                    to={`/requests/${params.requestId}/specialists/#all`}
                    selected={hash.slice(1) === 'applicant'}
                >
                    {t('routes.project-request.blocks.sections.applicant')}
                </NavItem>
            </Fragment>
        );

        if(params.subpage === 'specialists') {
            content = (
                <Fragment>
                    <NavItem
                        to="#all" selected={hash.slice(1) === 'all'}
                    >
                        {t('routes.project-request.blocks.specialists-sections.all')}
                    </NavItem>
                    {data?.requirements?.map((req) => (
                        <NavItem
                            to={`#${req.id}`}
                            selected={String(req.id) === hash.slice(1)}
                            key={req.id}
                        >
                            {req.name || t('routes.project-request.blocks.specialists-sections.empty')}
                        </NavItem>
                    ))}
                </Fragment>
            );
        }

        const header = params.subpage === 'specialists' && (
            <div className={cn('project-request__header')}>
                <IconArrowLeftFull svg={{ className: cn('project-request__icon-back'), onClick: onClickBack }} />
                {data?.project?.name}
            </div>
        );

        return (
            <Wrapper>
                <Section withoutPaddings={true}>
                    <SidebarNav header={header}>
                        {content}
                    </SidebarNav>
                </Section>
                {elDocuments()}
            </Wrapper>
        );
    };

    return (
        <SidebarLayout sidebar={elSidebarContent()}>
            <Wrapper>
                {elContent()}
            </Wrapper>
        </SidebarLayout>
    );
};

export default ProjectRequest;
