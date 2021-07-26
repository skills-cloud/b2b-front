import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import SidebarLayout from 'component/layout/sidebar';
import Section from 'component/section';

import ESectionInvariants from 'route/project-request/components/section-invariants';
import MainInfo from 'route/project-request/components/main-info';

import { useClassnames } from 'hook/use-classnames';

import style from './index.module.pcss';

const ProjectRequest = () => {
    const cn = useClassnames(style);
    const { hash } = useLocation();
    const { t } = useTranslation();

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
            <MainInfo />
        </SidebarLayout>
    );
};

export default ProjectRequest;
