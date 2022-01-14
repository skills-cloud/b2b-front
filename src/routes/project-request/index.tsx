import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import { useClassnames } from 'hook/use-classnames';

import SidebarLayout from 'component/layout/sidebar';
import Section from 'component/section';
import IconArrowLeftFull from 'component/icons/arrow-left-full';
import SidebarNav, { NavItem } from 'component/nav';
import { H5 } from 'component/header';
import Wrapper from 'component/section/wrapper';

import { mainRequest } from 'adapter/api/main';

import MainInfo from './components/main-info';
import Requirements from './components/requirements';
import Customer from './components/customer';
import ProjectRequestPdf from './components/documents/pdf';
import ProjectRequestDocx from './components/documents/docx';
import ProjectRequestCsv from './components/documents/xlsx';
import ESectionInvariants from './components/section-invariants';
import Candidates from './candidates';
import style from './index.module.pcss';

const ProjectRequest = () => {
    const cn = useClassnames(style);
    const history = useHistory();
    const location = useLocation();
    const { t } = useTranslation();
    const params = useParams<IParams>();
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
        if(params.subpage === 'candidates') {
            return <Candidates />;
        }

        return (
            <Fragment>
                <MainInfo {...data} />
                {data.id && <Requirements requirements={data?.requirements} requestId={data.id} />}
                {data.id && <Customer customer={data.module?.organization_project?.organization_customer} requestId={data.id} />}
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
                    <NavItem replace={true} to={`#${nav}`} key={nav}>
                        {t(`routes.project-request.blocks.sections.${nav}`)}
                    </NavItem>
                ))}
                <NavItem to={`${location.pathname}/candidates/#all`}>
                    {t('routes.project-request.blocks.sections.applicant')}
                </NavItem>
                <NavItem to={`${location.pathname}/timesheets`}>
                    {t('routes.project-request.blocks.sections.timesheets')}
                </NavItem>
            </Fragment>
        );

        if(params.subpage === 'candidates') {
            content = (
                <Fragment>
                    <NavItem to="#all" replace={true}>
                        {t('routes.project-request.blocks.specialists-sections.all')}
                    </NavItem>
                    {data?.requirements?.map((req) => (
                        <NavItem replace={true} to={`#${req.id}`} key={req.id}>
                            {req.name || t('routes.project-request.blocks.specialists-sections.empty')}
                        </NavItem>
                    ))}
                </Fragment>
            );
        }

        const header = params.subpage === 'candidates' && (
            <div className={cn('project-request__header')}>
                <IconArrowLeftFull svg={{ className: cn('project-request__icon-back'), onClick: onClickBack }} />
                {data?.title}
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
