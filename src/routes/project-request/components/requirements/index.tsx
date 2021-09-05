import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

import ESectionInvariants from 'route/project-request/components/section-invariants';
import AddRole from 'route/project-request/components/add-role';
import EditRoleModal from 'route/project-request/components/edit-role';
import { RequestRequirementRead } from 'adapter/types/main/request-requirement/id/get/code-200';
import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

const MAIN_REQUIREMENTS_FORM_ID = 'MAIN_REQUIREMENTS_FORM_ID';

enum ETabs {
    Competence='competence',
    Location='location',
    Price='price',
    Other='other',
}

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
    const [activeTab, setActiveTab] = useState<ETabs>(ETabs.Competence);
    const [editID, setEditID] = useState<number>();
    const [, setEditRoleID] = useState<number>();
    const editRequirements = requirements && editID !== undefined ? requirements[editID] : null;
    const [step, setModalStep] = useState<EModalSteps>(EModalSteps.Close);

    useModalClose(step !== EModalSteps.Close, () => {
        setModalStep(EModalSteps.Close);
    });

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
                                        setEditID(index);
                                        setModalStep(EModalSteps.Base);
                                    }}
                                    />
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
                                        {competencies.map(({ competence, id:competenceId }) => (
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
                        <ModalFooterSubmit withAction={true}>
                            <span
                                className={cn('add-role')}
                                onClick={() => {
                                    setModalStep(EModalSteps.NewRole);
                                }}
                            >
                                {t('routes.project-request.requirements.edit-modal.addRole')}
                            </span>
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
                                <React.Fragment>
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
                                                setEditRoleID(editRequirements.position?.id);
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
                                    {/* {editCompetencies?.map(({ competence }) => (
                                <H3 key={competence?.id}>{competence?.name}</H3>
                            ))} */}
                                </React.Fragment>
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
                        setEditRoleID(id);
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