import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';

import SidebarLayout from 'component/layout/sidebar';
import Section from 'component/section';
import IconArrowLeftFull from 'component/icons/arrow-left-full';
import SidebarNav, { NavItem } from 'component/nav';

import ESectionInvariants from 'route/project-request/components/section-invariants';
import MainInfo from 'route/project-request/components/main-info';
import Requirements from 'route/project-request/components/requirements';
import Customer from 'route/project-request/components/customer';
import ProjectRequestPdf from 'route/project-request/components/pdf';

import { mainRequest } from 'adapter/api/main';

import { useClassnames } from 'hook/use-classnames';

import Specialists from './specialists';
import style from './index.module.pcss';

const ProjectRequest = () => {
    const cn = useClassnames(style);
    const { hash } = useLocation();
    const history = useHistory();
    const { t } = useTranslation();
    const params = useParams<{ subpage?: string, id: string }>();
    const { data } = mainRequest.useGetMainRequestByIdQuery(
        { id: params.id },
        { refetchOnMountOrArgChange: true }
    );

    const onClickBack = () => {
        history.push(`/project-request/${params.id}#main-info`);
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
                {data.id && <Customer customer={data.customer} requestId={data.id} />}
            </Fragment>
        );
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
                    to={`/project-request/${params.id}/specialists/#all`}
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
                            {req.name}
                        </NavItem>
                    ))}
                </Fragment>
            );
        }

        const header = params.subpage === 'specialists' && (
            <div className={cn('nav__header')}>
                <IconArrowLeftFull svg={{ className: cn('nav__icon-back'), onClick: onClickBack }} />
                {data?.project?.name}
            </div>
        );

        return (
            <Section withoutPaddings={true}>
                <SidebarNav
                    header={header}
                    footer={<ProjectRequestPdf />}
                >
                    {content}
                </SidebarNav>
            </Section>
        );
    };

    return (
        <SidebarLayout sidebar={elSidebarContent()}>
            <div className={cn('sections')} >
                {elContent()}
            </div>
        </SidebarLayout>
    );
};

export default ProjectRequest;
