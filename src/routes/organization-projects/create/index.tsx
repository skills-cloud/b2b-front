import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import { useClassnames } from 'hook/use-classnames';

import PageCentred from 'component/layout/page-centered';
import Section from 'component/section';
import Button from 'component/button';

import OrganizationProjectCreateForm from '../form';
import style from './index.module.pcss';

export const FORM_ID = 'PROJECT_CREATE_FORM_ID';

const OrganizationProjectCreate = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams<{ organizationId: string }>();

    const onSuccess = () => {
        history.push(`/organizations/${params.organizationId}/projects/`);
    };

    return (
        <PageCentred>
            <Section title={t('routes.project.create.title')}>
                <div className={cn('project-create__form-wrapper')}>
                    <OrganizationProjectCreateForm formId={FORM_ID} onSuccess={onSuccess} />
                    <div className={cn('project-create__separator')} />
                    <div className={cn('project-create__submit-wrapper')}>
                        <Button type="submit" form={FORM_ID}>{t('routes.project.create.submit')}</Button>
                    </div>
                </div>
            </Section>
        </PageCentred>
    );
};

export default OrganizationProjectCreate;
