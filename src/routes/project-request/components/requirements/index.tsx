import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClassnames } from 'hook/use-classnames';

import SectionHeader from 'component/section/header';
import EditAction from 'component/section/actions/edit';
import DeleteAction from 'component/section/actions/delete';
import SearchAction from 'component/section/actions/search';
import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import useModalClose from 'component/modal/use-modal-close';
import SectionContentList from 'component/section/content-list';
import Header, { H3 } from 'component/header';
import SectionContentListItem from 'component/section/content-list-item';
import Separator from 'component/separator';
import Section from 'component/section';
import Button from 'component/button';
import Tabs, { Tab } from 'component/tabs';
import IconDots from 'component/icons/dots';
import Tooltip from 'component/tooltip';

import ESectionInvariants from 'route/project-request/components/section-invariants';
import AddRole from 'route/project-request/components/add-role';
import EditRoleModal from 'route/project-request/components/edit-role';
import EditLocation, { EDIT_LOCATION_FORM_ID } from 'route/project-request/components/edit-location';

import { mainRequest } from 'adapter/api/main';
import { RequestRequirementRead } from 'adapter/types/main/request-requirement/id/get/code-200';

import style from './index.module.pcss';

const MAIN_REQUIREMENTS_FORM_ID = 'MAIN_REQUIREMENTS_FORM_ID';

enum ETabs {
    Competence='competence',
    Location='location',
    Price='price',
    Other='other',
}

const getFormId = (tab: ETabs) => {
    switch (tab) {
        case ETabs.Location:
            return EDIT_LOCATION_FORM_ID;
        default:
            return MAIN_REQUIREMENTS_FORM_ID;
    }
};

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
    const [deleteMainRequestById] = mainRequest.useDeleteMainRequestRequirementByIdMutation();
    const [activeTab, setActiveTab] = useState<ETabs>(ETabs.Competence);
    const [editID, setEditID] = useState<number>();
    const editRequirements = requirements?.find(({ id }) => id === editID);
    const [step, setModalStep] = useState<EModalSteps>(EModalSteps.Close);

    useModalClose(step !== EModalSteps.Close, () => {
        setModalStep(EModalSteps.Close);
    });

    const getExpirienceTrl = (experience: number | null | undefined) => (
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
                                    <EditAction onClick={() => {
                                        setEditID(requirementId);
                                        setModalStep(EModalSteps.Base);
                                    }}
                                    />
                                    <DeleteAction onClick={() => {
                                        if(requirementId) {
                                            deleteMainRequestById({ id: requirementId })
                                                .unwrap()
                                                .catch(console.error);
                                        }
                                    }}
                                    />
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

                        {((competencies && competencies.length > 0) || experience_years !== null) && (
                            <SectionContentList>
                                {competencies && competencies.length > 0 && (
                                    <SectionContentListItem
                                        title={
                                            <div className={cn('skills-head')}>
                                                {t('routes.project-request.blocks.competencies.name')}
                                            </div>
                                        }
                                    >
                                        {competencies.map(({ competence, id:competenceId, experience_years: experienceYears }) => (
                                            <Tooltip
                                                key={competenceId}
                                                content={getExpirienceTrl(experienceYears)}
                                                theme="dark"
                                            >
                                                <div className={cn('skills-tag')} key={competenceId}>
                                                    {competence?.name}
                                                </div>
                                            </Tooltip>
                                        ))}
                                    </SectionContentListItem>
                                )}
                                <SectionContentListItem title={t('routes.project-request.blocks.competencies.experience')}>
                                    {getExpirienceTrl(experience_years)}
                                </SectionContentListItem>
                            </SectionContentList>
                        )}

                        {location && (
                            <React.Fragment>
                                <Separator />
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
                                </SectionContentList>
                            </React.Fragment>
                        )}

                        {max_price && (
                            <React.Fragment>
                                <Separator />
                                <H3>
                                    {t('routes.project-request.blocks.price.title')}
                                </H3>
                                <SectionContentList>
                                    <SectionContentListItem title={t('routes.project-request.blocks.price.per-hour')}>
                                        {t('routes.project-request.blocks.price.value', { value: max_price })}
                                    </SectionContentListItem>
                                </SectionContentList>
                            </React.Fragment>
                        )}

                        {description && (
                            <React.Fragment>
                                <Separator />
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
            })}
            {step === EModalSteps.Base && (
                <Modal
                    onClose={() => setModalStep(EModalSteps.Close)}
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
                        <ModalFooterSubmit withAction={activeTab === ETabs.Competence}>
                            {activeTab === ETabs.Competence && (
                                <span
                                    className={cn('add-role')}
                                    onClick={() => {
                                        setModalStep(EModalSteps.NewRole);
                                    }}
                                >
                                    {t('routes.project-request.requirements.edit-modal.addRole')}
                                </span>
                            )}
                            <Button
                                isSecondary={true} onClick={() => {
                                    setModalStep(EModalSteps.Close);
                                }}
                            >
                                {t('routes.project-request.requirements.edit-modal.cancel')}
                            </Button>
                            <Button type="submit" form={getFormId(activeTab)}>
                                {t('routes.project-request.requirements.edit-modal.save')}
                            </Button>
                        </ModalFooterSubmit>
                    }
                >
                    {step === EModalSteps.Base && (
                        <React.Fragment>
                            <Tabs>
                                {Object.values(ETabs).map((tab) => (
                                    <Tab
                                        active={tab === activeTab}
                                        key={tab}
                                        onClick={() => {
                                            setActiveTab(tab);
                                        }}
                                    >
                                        {t('routes.project-request.requirements.edit-modal.tab', { context: tab })}
                                    </Tab>
                                ))}
                            </Tabs>
                            {activeTab === ETabs.Competence && editRequirements && (
                                <div className={cn('position')}>
                                    <H3>
                                        {t(
                                            'routes.project-request.requirements.edit-modal.people',
                                            {
                                                people  : editRequirements.count,
                                                position: editRequirements.position?.name
                                            })}
                                    </H3>

                                    <button
                                        type="button"
                                        className={cn('position-edit')}
                                        onClick={() => {
                                            setModalStep(EModalSteps.EditRole);
                                        }}
                                    >
                                        <IconDots
                                            svg={{
                                                width    : 24,
                                                height   : 24,
                                                className: cn('icon-dots')
                                            }}
                                        />
                                    </button>
                                </div>
                            )}

                            {activeTab === ETabs.Location && editRequirements && (
                                <EditLocation
                                    requirements={editRequirements}
                                    nextStep={() => {
                                        setModalStep(EModalSteps.Close);
                                    }}
                                />
                            )}
                        </React.Fragment>
                    )}
                </Modal>
            )}

            {step === EModalSteps.NewRole && (
                <AddRole
                    requestId={requestId}
                    onBack={() => {
                        setModalStep(EModalSteps.Base);
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
                        setModalStep(EModalSteps.Close);
                    }}
                    onBack={() => {
                        setModalStep(EModalSteps.Base);
                    }}
                />
            )}
        </React.Fragment>
    );
};

export default Requirements;