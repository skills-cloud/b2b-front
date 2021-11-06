import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { useClassnames } from 'hook/use-classnames';

import PageCentred from 'component/layout/page-centered';
import Section from 'component/section';
import Button from 'component/button';

import OrganizationCreateForm from '../form';
import style from './index.module.pcss';
import { mainRequest } from 'adapter/api/main';

export const ORGANIZATION_CREATE_FORM_ID = 'ORGANIZATION_CREATE_FORM_ID';

const OrganizationCreate = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const history = useHistory();

    const [, { isLoading }] = mainRequest.usePostMainOrganizationMutation();
    const [, { isLoading: isPatchLoading }] = mainRequest.usePatchMainOrganizationMutation();

    const onSuccess = (id: number) => {
        history.push(`/organizations/${id}`);
    };

    return (
        <PageCentred>
            <Section title={t('routes.organization.create.header')}>
                <div className={cn('project-create__form-wrapper')}>
                    <OrganizationCreateForm formId={ORGANIZATION_CREATE_FORM_ID} onSuccess={onSuccess} />
                    <div className={cn('project-create__separator')} />
                    <div className={cn('project-create__submit-wrapper')}>
                        <Button
                            type="submit"
                            form={ORGANIZATION_CREATE_FORM_ID}
                            disabled={isLoading || isPatchLoading}
                            isLoading={isLoading || isPatchLoading}
                        >
                            {t('routes.organization.create.submit')}
                        </Button>
                    </div>
                </div>
            </Section>
        </PageCentred>
    );
};

export default OrganizationCreate;
