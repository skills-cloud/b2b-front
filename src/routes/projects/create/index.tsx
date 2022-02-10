import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import { useClassnames } from 'hook/use-classnames';
import { IParams, ORGANIZATION_PROJECTS, PROJECTS } from 'helper/url-list';

import PageCentred from 'component/layout/page-centered';
import Section from 'component/section';
import Button from 'component/button';

import ProjectCreateForm from '../form';
import style from './index.module.pcss';

export const FORM_ID = 'PROJECT_CREATE_FORM_ID';

const ProjectCreate = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams<IParams>();

    const onSuccess = () => {
        if(params.organizationId) {
            history.push(ORGANIZATION_PROJECTS(params.organizationId));
        } else {
            history.push(PROJECTS);
        }
    };

    return (
        <PageCentred>
            <Section title={t('routes.organization-project.create.title')}>
                <div className={cn('project-create__form-wrapper')}>
                    <ProjectCreateForm formId={FORM_ID} onSuccess={onSuccess} />
                    <div className={cn('project-create__separator')} />
                    <div className={cn('project-create__submit-wrapper')}>
                        <Button type="submit" form={FORM_ID}>{t('routes.organization-project.create.submit')}</Button>
                    </div>
                </div>
            </Section>
        </PageCentred>
    );
};

export default ProjectCreate;
