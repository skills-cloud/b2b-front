import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import { useClassnames } from 'hook/use-classnames';

import PageCentred from 'component/layout/page-centered';
import Section from 'component/section';
import Button from 'component/button';

import ModuleCreateForm from '../form';
import style from './index.module.pcss';
import { ORGANIZATION_PROJECT_MODULE_ID } from 'helper/url-list';

const FORM_ID = 'MODULE_CREATE_FORM_ID';

const ModuleCreate = () => {
    const cn = useClassnames(style);
    const history = useHistory();
    const { t } = useTranslation();
    const params = useParams<{ organizationId: string, projectId: string }>();

    return (
        <PageCentred>
            <Section title={t('routes.module.create.title')}>
                <div className={cn('form')}>
                    <ModuleCreateForm
                        formId={FORM_ID}
                        onSuccess={(id) => {
                            history.push(ORGANIZATION_PROJECT_MODULE_ID(params.organizationId, params.projectId, id));
                        }}
                    />
                    <div className={cn('separator')} />
                    <div className={cn('submit-wrapper')}>
                        <Button type="submit" form={FORM_ID}>{t('routes.module.create.submit')}</Button>
                    </div>
                </div>
            </Section>
        </PageCentred>
    );
};

export default ModuleCreate;
