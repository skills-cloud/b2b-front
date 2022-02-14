import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { stringify } from 'query-string';
import { useHistory, useLocation } from 'react-router';

import { ORGANIZATION_PROJECT_MODULE_REQUEST_REQUIREMENT_SPECIALISTS } from 'helper/url-list';
import { useClassnames } from 'hook/use-classnames';

import SectionHeader from 'component/section/header';
import EditAction from 'component/section/actions/edit';
import DeleteAction from 'component/section/actions/delete';
import SearchAction from 'component/section/actions/search';
import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import SectionContentList from 'component/section/content-list';
import Header, { H4 } from 'component/header';
import SectionContentListItem from 'component/section/content-list-item';
import Separator from 'component/separator';
import Section from 'component/section';
import Button from 'component/button';
import Timeframe from 'component/timeframe';
import SkillsTag from 'component/skills-tag';

import ESectionInvariants from 'route/project-request/components/section-invariants';
import AddRole from 'route/project-request/components/add-role';
import EditRoleModal from 'route/project-request/components/edit-role';
import EditRequirements, { ETabs, MAIN_REQUIREMENTS_FORM_ID } from 'route/project-request/components/edit-requirements';

import { mainRequest } from 'adapter/api/main';
import { RequestRequirementRead } from 'adapter/types/main/request-requirement/id/get/code-200';

import style from './index.module.pcss';
import useRoles from 'hook/use-roles';

enum EModalSteps {
    NewRole,
    EditRole,
    Base,
    Close
}

interface IRequirements {
    requirements: Array<RequestRequirementRead> | undefined,
    requestId: number
}

const Requirements = ({ requirements, requestId }: IRequirements) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const history = useHistory();
    const { pathname } = useLocation();
    const [deleteMainRequestById] = mainRequest.useDeleteMainRequestRequirementByIdMutation();
    const [activeTab, setActiveTab] = useState<ETabs>(ETabs.Competence);
    const [editID, setEditID] = useState<number>();
    const editRequirements = requirements?.find(({ id }) => id === editID);
    const [step, setModalStep] = useState<EModalSteps>(EModalSteps.Close);

    const { data } = mainRequest.useGetMainRequestByIdQuery(
        { id: String(requestId) },
        { refetchOnMountOrArgChange: true }
    );

    const { su, pfm, pm, admin } = useRoles(data?.module?.organization_project?.organization_contractor_id);

    const onClose = useCallback(() => {
        setModalStep(EModalSteps.Close);
    }, []);

    const onClickSearch = (requirementId?: number) => () => {
        if(requirementId) {
            const req = requirements?.find((item) => item.id === requirementId);

            if(req) {
                const params = {
                    positions_ids_any   : [req.position_id],
                    years               : req.experience_years,
                    competencies_ids_any: req.competencies?.map((comp) => comp.competence_id)
                };

                history.push(`${ORGANIZATION_PROJECT_MODULE_REQUEST_REQUIREMENT_SPECIALISTS(pathname, requirementId)}?${stringify(params, { skipEmptyString: true, skipNull: true })}`);
            }
        }
    };

    const onDeleteAction = (requirementId?: number) => () => {
        if(requirementId) {
            deleteMainRequestById({ id: requirementId })
                .unwrap()
                .catch(console.error);
        }
    };

    const onEditAction = (requirementId?: number) => () => {
        setEditID(requirementId);
        setModalStep(EModalSteps.Base);
    };

    const getExperienceTrl = (experience: number | null | undefined) => (
        typeof experience === 'number' ? t(
            'routes.project-request.blocks.competencies.experience-content',
            {
                experience   : experience,
                experienceTrl: t(
                    'routes.project-request.blocks.competencies.experience-years',
                    { count: experience }
                )
            }) : t('routes.project-request.blocks.competencies.experience-empty')
    );

    return (
        <React.Fragment>
            {requirements?.map((requirement, index) => {
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
                    type_of_employment,
                    date_from,
                    date_to,
                    status
                } = requirement;
                const ancor = index === 0 ? { id: ESectionInvariants.Requirements } : {};
                let contextLocation = 'empty';

                if(location?.country?.name && location?.name) {
                    contextLocation = 'country_city';
                } else if(location?.country?.name) {
                    contextLocation = 'country';
                } else if(location?.name) {
                    contextLocation = 'city';
                }

                const actions = [
                    <SearchAction
                        key="search"
                        label={t('routes.project-request-list.dropdown.search')}
                        onClick={onClickSearch(requirementId)}
                    />
                ];

                if(su || admin || pfm || pm) {
                    actions.unshift(
                        <EditAction
                            key="edit"
                            label={t('routes.project-request-list.dropdown.edit')}
                            onClick={onEditAction(requirementId)}
                        />,
                        <DeleteAction
                            key="delete"
                            label={t('routes.project-request-list.dropdown.delete')}
                            onClick={onDeleteAction(requirementId)}
                        />
                    );
                }

                return (
                    <Section key={requirementId}>
                        <div className={cn('requirements__gap-bottom')}>
                            <SectionHeader
                                dropdownActions={actions}
                            >
                                {name || t('routes.project-request.blocks.empty-title-requirement')}
                            </SectionHeader>
                        </div>

                        {position?.name && (
                            <div className={cn('requirements__gap-bottom')}>
                                <H4 {...ancor}>
                                    {position?.name} ({count} {t('routes.project-request.blocks.people', { count })})
                                </H4>
                            </div>
                        )}

                        {((competencies && competencies.length > 0) || experience_years !== null) && (
                            <SectionContentList>
                                {competencies && competencies.length > 0 && (
                                    <SectionContentListItem title={t('routes.project-request.blocks.competencies.name')}>
                                        <div className={cn('requirements__skills')}>
                                            {competencies.map(({ competence, id:competenceId, experience_years: experienceYears }) => (
                                                <SkillsTag
                                                    key={competenceId}
                                                    tooltip={t(
                                                        'components.checkbox-tree.experience.invariant',
                                                        { context: experienceYears }
                                                    )}
                                                    theme="dark"
                                                >
                                                    {competence?.name}
                                                </SkillsTag>
                                            ))}
                                        </div>
                                    </SectionContentListItem>
                                )}
                                <SectionContentListItem title={t('routes.project-request.blocks.competencies.experience')}>
                                    {getExperienceTrl(experience_years)}
                                </SectionContentListItem>
                                <SectionContentListItem title={t('routes.person.blocks.competencies.status.title')}>
                                    {t(`routes.person.blocks.competencies.status.value.${status}`)}
                                </SectionContentListItem>
                            </SectionContentList>
                        )}

                        {location && (
                            <React.Fragment>
                                <Separator />
                                <H4>
                                    {t('routes.project-request.blocks.location.title')}
                                </H4>
                                <SectionContentList>
                                    <SectionContentListItem title={t('routes.project-request.blocks.location.point')}>
                                        {t(
                                            'routes.project-request.blocks.location.point-content',
                                            {
                                                context: contextLocation,
                                                country: location.country?.name,
                                                city   : location.name
                                            })}
                                    </SectionContentListItem>
                                    <SectionContentListItem title={t('routes.project-request.blocks.location.address')}>
                                        {address}
                                    </SectionContentListItem>
                                    <SectionContentListItem title={t('routes.project-request.blocks.location.type-of-employment')}>
                                        {type_of_employment?.name}
                                    </SectionContentListItem>
                                </SectionContentList>
                            </React.Fragment>
                        )}

                        {max_price && (
                            <React.Fragment>
                                <Separator />
                                <H4>
                                    {t('routes.project-request.blocks.price.title')}
                                </H4>
                                <SectionContentList>
                                    <SectionContentListItem title={t('routes.project-request.blocks.price.per-hour')}>
                                        {t('routes.project-request.blocks.price.value', { value: max_price })}
                                    </SectionContentListItem>
                                </SectionContentList>
                            </React.Fragment>
                        )}

                        {!!(description || (date_from && date_to)) && (
                            <React.Fragment>
                                <Separator />
                                <H4>
                                    {t('routes.project-request.blocks.other.title')}
                                </H4>
                                <SectionContentList>
                                    <SectionContentListItem title={t('routes.project-request.blocks.other.description')}>
                                        {description}
                                    </SectionContentListItem>
                                    <SectionContentListItem title={t('routes.project-request.blocks.other.deadline')}>
                                        {!!(date_from && date_to) && <Timeframe startDate={date_from} endDate={date_to} />}
                                    </SectionContentListItem>
                                </SectionContentList>
                            </React.Fragment>
                        )}
                    </Section>
                );
            })}
            {step === EModalSteps.Base && (
                <Modal
                    onClose={onClose}
                    header={
                        <Header level={1} tag="h2">
                            {activeTab === ETabs.Competence && t(
                                'routes.project-request.requirements.edit-modal.header',
                                { context: 'competence' }
                            )}
                            {activeTab !== ETabs.Competence && t(
                                'routes.project-request.requirements.edit-modal.header',
                                { context: 'not_competence' }
                            )}
                        </Header>
                    }
                    footer={
                        <ModalFooterSubmit>
                            <Button
                                isSecondary={true} onClick={() => {
                                    setModalStep(EModalSteps.Close);
                                }}
                            >
                                {t('routes.project-request.requirements.edit-modal.cancel')}
                            </Button>
                            <Button type="submit" form={MAIN_REQUIREMENTS_FORM_ID}>
                                {t('routes.project-request.requirements.edit-modal.save')}
                            </Button>
                        </ModalFooterSubmit>
                    }
                >
                    <EditRequirements
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        editRequirements={editRequirements}
                        onClose={onClose}
                        requestId={requestId}
                        onEditRole={() => {
                            setModalStep(EModalSteps.EditRole);
                        }}
                    />
                </Modal>
            )}

            {step === EModalSteps.NewRole && (
                <AddRole
                    requestId={requestId}
                    onClose={() => {
                        setModalStep(EModalSteps.Close);
                    }}
                    nextStep={(id) => {
                        setEditID(id);
                        setModalStep(EModalSteps.EditRole);
                    }}
                />
            )}

            {step === EModalSteps.EditRole && editRequirements && (
                <EditRoleModal
                    requirements={editRequirements}
                    onClose={() => {
                        setModalStep(EModalSteps.Base);
                    }}
                    onBack={() => {
                        setModalStep(EModalSteps.Base);
                    }}
                />
            )}
            {(su || admin || pfm || pm) && (
                <Section>
                    <div
                        className={cn('requirements__add-request')} onClick={() => {
                            setEditID(undefined);
                            setModalStep(EModalSteps.NewRole);
                        }}
                    >
                        {t('routes.project-request.requirements.edit-modal.add-request')}
                    </div>
                </Section>
            )}
        </React.Fragment>
    );
};

export default Requirements;
