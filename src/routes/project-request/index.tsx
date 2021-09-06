import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';

import SidebarLayout from 'component/layout/sidebar';
import Section from 'component/section';
import IconArrowLeftFull from 'component/icons/arrow-left-full';

import ESectionInvariants from 'route/project-request/components/section-invariants';
import MainInfo from 'route/project-request/components/main-info';
import Requirements from 'route/project-request/components/requirements';
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
        { id: parseInt(params.id, 10) },
        { refetchOnMountOrArgChange: true }
    );

    const elSpecialists = () => {
        return (
            <li
                className={cn('nav__item', {
                    'nav__item_selected': hash.slice(1) === 'applicant'
                })}
            >
                <Link to={`/project-request/${params.id}/specialists/#all`} className={cn('nav__item-link')}>
                    {t('routes.project-request.blocks.sections.applicant')}
                </Link>
            </li>
        );
    };

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
            </Fragment>
        );
    };

    const elSidebarContent = () => {
        let content = (
            <Fragment>
                {Object.values(ESectionInvariants).map((nav) => (
                    <li
                        className={cn('nav__item', {
                            'nav__item_selected': nav === hash.slice(1)
                        })}
                        key={nav}
                    >
                        <a href={`#${nav}`} className={cn('nav__item-link')}>
                            {t(`routes.project-request.blocks.sections.${nav}`)}
                        </a>
                    </li>
                ))}
                {elSpecialists()}
            </Fragment>
        );

        if(params.subpage === 'specialists') {
            content = (
                <Fragment>
                    <li
                        className={cn('nav__item', {
                            'nav__item_selected': hash.slice(1) === 'all'
                        })}
                    >
                        <a href="#all" className={cn('nav__item-link')}>
                            {t('routes.project-request.blocks.specialists-sections.all')}
                        </a>
                    </li>
                    {data?.requirements?.map((req) => (
                        <li
                            className={cn('nav__item', {
                                'nav__item_selected': String(req.id) === hash.slice(1)
                            })}
                            key={req.id}
                        >
                            <a href={`#${req.id}`} className={cn('nav__item-link')}>
                                {req.name}
                            </a>
                        </li>
                    ))}
                </Fragment>
            );
        }

        return (
            <Section withoutPaddings={true}>
                <nav className={cn('nav')}>
                    {params.subpage === 'specialists' && (
                        <div className={cn('nav__header')}>
                            <IconArrowLeftFull svg={{ className: cn('nav__icon-back'), onClick: onClickBack }} />
                            {data?.project?.name}
                        </div>
                    )}
                    <ul className={cn('nav__list')}>
                        {content}
                    </ul>
                </nav>
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
