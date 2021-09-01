import React from 'react';
import { useTranslation } from 'react-i18next';

import SectionHeader from 'component/section/header';
import EditAction from 'component/section/actions/edit';
import DeleteAction from 'component/section/actions/delete';
import SearchAction from 'component/section/actions/search';
import SectionContentList from 'component/section/content-list';
import { H3 } from 'component/header';
import SectionContentListItem from 'component/section/content-list-item';
import Separator from 'component/separator';
import Section from 'component/section';

import ESectionInvariants from 'route/project-request/components/section-invariants';
import { RequestRequirementRead } from 'adapter/types/main/request-requirement/id/get/code-200';
import { useClassnames } from 'hook/use-classnames';

import style from './index.module.pcss';

const Requirements = ({ requirements }: {requirements: Array<RequestRequirementRead> | undefined}) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);

    return requirements?.map((requirement, index) => {
        const {
            name,
            id:requirementId,
            position,
            count,
            competencies,
            experience_years,
            max_price,
            description,
            work_location_city: location,
            work_location_address: address,
            type_of_employment
        } = requirement;
        const ancor = index === 0 ? { id: ESectionInvariants.Requirements } : {};

        let contextLocation = 'empty';

        if(location?.country.name && location?.name) {
            contextLocation = 'country_city';
        } else if(location?.country.name) {
            contextLocation = 'country';
        } else if(location?.name) {
            contextLocation = 'city';
        }

        return (
            <Section key={requirementId}>
                <div className={cn('gap-bottom')}>
                    <SectionHeader actions={
                        <div className={cn('actions')}>
                            <EditAction />
                            <DeleteAction />
                            <SearchAction />
                        </div>
                    }
                    >{name || t('routes.project-request.blocks.empty-title')}
                    </SectionHeader>
                </div>

                <div className={cn('gap-bottom')}>
                    <H3 {...ancor}>
                        {position?.name} ({count} {t('routes.project-request.blocks.people', { count })})
                    </H3>
                </div>

                {competencies && competencies?.length > 0 || experience_years !== undefined && (
                    <SectionContentList>
                        {competencies && competencies?.length > 0 && (
                            <SectionContentListItem
                                title={
                                    <div className={cn('skills-head')}>
                                        {t('routes.project-request.blocks.competencies.name')}
                                    </div>
                                }
                            >
                                {competencies?.map(({ competence, id:competenceId }) => (
                                    <div className={cn('skills-tag')} key={competenceId}>
                                        {competence?.name}
                                    </div>
                                ))}
                            </SectionContentListItem>
                        )}
                        {experience_years !== undefined && (
                            <SectionContentListItem title={t('routes.project-request.blocks.competencies.experience')}>
                                {t('routes.project-request.blocks.competencies.experience-content', {
                                    experience   : experience_years,
                                    experienceTrl: t(
                                        'routes.project-request.blocks.competencies.experience-years',
                                        { count: experience_years }
                                    )
                                })}
                            </SectionContentListItem>
                        )}
                        <Separator />
                    </SectionContentList>
                )}

                {location && (
                    <React.Fragment>
                        <H3>
                            {t('routes.project-request.blocks.location.title')}
                        </H3>
                        <SectionContentList>
                            <SectionContentListItem title={t('routes.project-request.blocks.location.point')}>
                                {t(
                                    'routes.project-request.blocks.location.point-content',
                                    {
                                        context: contextLocation,
                                        country: location.country.name,
                                        city   : location.name
                                    })}
                            </SectionContentListItem>
                            <SectionContentListItem title={t('routes.project-request.blocks.location.address')}>
                                {address}
                            </SectionContentListItem>
                            <SectionContentListItem title={t('routes.project-request.blocks.location.type-of-employment')}>
                                {type_of_employment?.name}
                            </SectionContentListItem>
                            <Separator />
                        </SectionContentList>
                    </React.Fragment>
                )}

                {max_price && (
                    <React.Fragment>
                        <H3>
                            {t('routes.project-request.blocks.price.title')}
                        </H3>
                        <SectionContentList>
                            <SectionContentListItem title={t('routes.project-request.blocks.price.per-hour')}>
                                {t('routes.project-request.blocks.price.value', { value: max_price })}
                            </SectionContentListItem>
                            <Separator />
                        </SectionContentList>
                    </React.Fragment>
                )}

                {description && (
                    <React.Fragment>

                        <H3>
                            {t('routes.project-request.blocks.other.title')}
                        </H3>
                        <SectionContentList>
                            <SectionContentListItem title={t('routes.project-request.blocks.other.description')}>
                                {description}
                            </SectionContentListItem>
                        </SectionContentList>
                    </React.Fragment>
                )}
            </Section>
        );
    });
};

export default Requirements;