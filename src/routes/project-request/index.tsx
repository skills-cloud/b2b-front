import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router';

import SidebarLayout from 'component/layout/sidebar';
import Section from 'component/section';

import ESectionInvariants from 'route/project-request/components/section-invariants';
import MainInfo from 'route/project-request/components/main-info';
import Requirements from 'route/project-request/components/requirements';
import { mainRequest } from 'adapter/api/main';

import { useClassnames } from 'hook/use-classnames';

import style from './index.module.pcss';

const ProjectRequest = () => {
    const cn = useClassnames(style);
    const { hash } = useLocation();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const { data } = mainRequest.useGetMainRequestByIdQuery(
        { id: parseInt(id, 10) },
        { refetchOnMountOrArgChange: true }
    );

    if(!data) {
        return null;
    }

    return (
        <SidebarLayout
            sidebar={
                <Section withoutPaddings={true}>
                    <nav>
                        <ul className={cn('nav')}>
                            {Object.values(ESectionInvariants).map((nav) => (
                                <li
                                    className={cn('nav__item', {
                                        'nav__item_selected': nav === hash.slice(1)
                                    })} key={nav}
                                >
                                    <a href={`#${nav}`} className={cn('nav__item-link')}>
                                        {t(`routes.project-request.blocks.sections.${nav}`)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </Section>
            }
        >
            <div className={cn('sections')} >
                <MainInfo {...data} />
                {data.id && <Requirements requirements={data?.requirements} requestId={data.id} />}
            </div>

        </SidebarLayout>
    );
};

export default ProjectRequest;
