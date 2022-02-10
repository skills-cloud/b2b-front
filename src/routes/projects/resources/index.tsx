import React from 'react';
import { useTranslation } from 'react-i18next';

import Section from 'component/section';
import SectionHeader from 'component/section/header';
import Loader from 'component/loader';
import Resources from 'component/resources';
import Wrapper from 'component/section/wrapper';
import Empty from 'component/empty';

import { ModulePositionLaborEstimateInline } from 'adapter/types/main/module/get/code-200';

interface IProps {
    isLoading?: boolean,
    resources?: Array<ModulePositionLaborEstimateInline>
}

const OrganizationProjectResources = (props: IProps) => {
    const { t } = useTranslation();

    const elContent = () => {
        if(props.isLoading) {
            return <Loader />;
        }

        if(props.resources?.length) {
            return <Resources resources={props.resources} />;
        }

        return <Empty>{t('routes.organization-projects.resources.empty')}</Empty>;
    };

    return (
        <Section id="resources">
            <Wrapper>
                <SectionHeader>
                    {t('routes.organization-projects.resources.title')}
                </SectionHeader>
                {elContent()}
            </Wrapper>
        </Section>
    );
};

export default OrganizationProjectResources;
