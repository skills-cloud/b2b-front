import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import Section from 'component/section';
import IconChevronRight from 'component/icons/chevron-right';
import SectionHeader from 'component/section/header';
import SectionContentList from 'component/section/content-list';
import SectionContentListItem from 'component/section/content-list-item';
import { H3 } from 'component/header';
import Separator from 'component/separator';

import { OrganizationProjectRead } from 'adapter/types/main/organization-project/get/code-200';
import { useClassnames } from 'hook/use-classnames';

import style from './index.module.pcss';

enum EProjectInvariants {
    Period = 'period',
    Industry = 'industry',
    Description = 'description',
    Request = 'request'
}

const FORMAT_DATE = 'dd.MM.yyyy';

const ProjectList = ({ list }: { list: Array<OrganizationProjectRead>}) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    const renderField = (field: EProjectInvariants, project: OrganizationProjectRead) => {
        let content = null;

        switch (field) {
            case EProjectInvariants.Period:
                if(project.date_from !== undefined && project.date_to !== undefined) {
                    const startDate = format(new Date(project.date_from), FORMAT_DATE);
                    const endDate = format(new Date(project.date_to), FORMAT_DATE);

                    content = <React.Fragment>{startDate}&nbsp;&mdash; {endDate}</React.Fragment>;
                }
                break;
            case EProjectInvariants.Description:
                content = project?.description;
                break;
            case EProjectInvariants.Industry:
                content = project?.industry_sector?.name;
                break;
            case EProjectInvariants.Request:
                content = project?.requests_count;
                break;
            default:
                content = null;
        }

        return (
            <SectionContentListItem title={t(`routes.organization.blocks.project.${field}`)} key={field}>
                {content}
            </SectionContentListItem>
        );
    };

    return (
        <Section>
            <SectionHeader>{t('routes.organization.blocks.sections.projects')}</SectionHeader>
            {list.map((item, index) => (
                <React.Fragment key={item.id}>
                    {index > 0 && <Separator />}
                    <SectionContentList>
                        <div className={cn('project-header')}>
                            <H3>{item?.name}</H3>
                            <Link to={`/organization/project/${item.id}`}>
                                <IconChevronRight />
                            </Link>
                        </div>
                        {Object.values(EProjectInvariants).map((field) => renderField(field, item))}
                    </SectionContentList>
                </React.Fragment>
            ))}
        </Section>
    );
};

export default ProjectList;