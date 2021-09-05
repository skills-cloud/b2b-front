import React from 'react';
import { useTranslation } from 'react-i18next';

import PageCentred from 'component/layout/page-centered';
import Section from 'component/section';
import Button from 'component/button';
import history from 'component/core/history';

import ProjectRequestForm from 'route/project-request/components/form';

import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

const FORM_ID = 'PROJECT_CREATE_FORM_ID';

const ProjectsCreateForm = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    return (
        <PageCentred>
            <Section title={t('routes.project-request.create.title')}>
                <div className={cn('form')}>
                    <ProjectRequestForm
                        formId={FORM_ID} onSuccess={(id) => {
                            history.push(`/project-request/${id}#main-info`);
                        }}
                    />
                    <div className={cn('separator')} />
                    <div className={cn('submit-wrapper')}>
                        <Button type="submit" form={FORM_ID}>{t('routes.project-request.create.submit')}</Button>
                    </div>
                </div>
            </Section>
        </PageCentred>
    );
};

export default ProjectsCreateForm;
