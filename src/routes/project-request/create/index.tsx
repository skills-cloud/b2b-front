import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import { IParams, ORGANIZATION_PROJECT_MODULE_REQUEST_ID } from 'helper/url-list';
import { useClassnames } from 'hook/use-classnames';

import PageCentred from 'component/layout/page-centered';
import Section from 'component/section';
import Button from 'component/button';

import ProjectRequestForm from '../components/form';
import style from './index.module.pcss';

const FORM_ID = 'PROJECT_REQUEST_CREATE_FORM_ID';

const ProjectRequestCreateForm = () => {
    const cn = useClassnames(style);
    const history = useHistory();
    const { t } = useTranslation();
    const params = useParams<IParams>();

    // TODO обработка ошибок и лоадер
    return (
        <PageCentred>
            <Section title={t('routes.project-request.create.title')}>
                <div className={cn('form')}>
                    <ProjectRequestForm
                        formId={FORM_ID}
                        onSuccess={(id) => {
                            if(params.projectId && params.organizationId) {
                                history.push(ORGANIZATION_PROJECT_MODULE_REQUEST_ID(params.organizationId, params.projectId, params.moduleId, id));
                            }
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

export default ProjectRequestCreateForm;
