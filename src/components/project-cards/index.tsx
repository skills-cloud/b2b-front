import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import { useClassnames } from 'hook/use-classnames';
import { IParams } from 'helper/url-list';

import Section from 'component/section';
import IconDots from 'component/icons/dots';
import IconChecked from 'component/icons/checked';
import IconExpand from 'component/icons/expand';
import IconCollapse from 'component/icons/collapse';
import Input from 'component/form/input';
import SectionHeader from 'component/section/header';
import AddAction from 'component/section/actions/add';
import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import TreeList from 'component/tree-list';
import Button from 'component/button';
import Dropdown from 'component/dropdown';
import DropdownMenuItem from 'component/dropdown/menu-item';
import DropdownMenu from 'component/dropdown/menu';
import Select, { IValue } from 'component/form/select';
import InputDictionary from 'component/form/input-dictionary';
import Loader from 'component/loader';
import Empty from 'component/empty';
import Wrapper from 'component/section/wrapper';
import ErrorsComponent from 'component/error/errors';

import { mainRequest } from 'adapter/api/main';
import { dictionary } from 'adapter/api/dictionary';

import CardItem from './card-item';
import style from './index.module.pcss';
import useRoles from 'hook/use-roles';

const FORM_ORGANIZATION_CARD_ID = 'FORM_ORGANIZATION_CARD_ID';
const FORM_CREATE_CARD_FROM_TEMPLATE = 'FORM_CREATE_CARD_FROM_TEMPLATE';

interface IForm {
    cardName: string,
    cardNameSub: string,
    position: Array<IValue>,
    project?: IValue
}

interface IProps {
    projects?: Array<{
        label: string,
        value: string
    }>
}

const ProjectCards = (props: IProps) => {
    const cn = useClassnames(style);
    const { organizationId, projectId } = useParams<IParams>();
    const { su, admin, pfm } = useRoles(organizationId);

    const [visibleModalId, setVisibleModalId] = useState<number | null>(null);
    const [showAllTree, setShowAllTree] = useState(false);
    const [showCreateByTemplateModal, setShowCreateByTemplateModal] = useState(false);
    const [checked, setChecked] = useState<Array<string>>([]);
    const [visibleAddCard, setVisibleAddCard] = useState(false);
    const { t } = useTranslation();
    const context = useForm();
    const formCreateByTemplate = useForm();
    // const cardGetParams = projectId ? { organization_project_id: [projectId] } : { organization_customer_id: [organizationId] };
    const { data: baseProjectCards } = mainRequest.useGetBaseProjectCardTemplateQuery(undefined);
    const { data: positions } = dictionary.useGetPositionListQuery(undefined);
    const [patch, { error: patchError, isError: isPatchError, isLoading: isPatchLoading }] = mainRequest.usePatchMainOrganizationProjectCardMutation();
    const [post, { error, isError, isLoading: isPostLoading }] = mainRequest.usePostMainOrganizationProjectCardMutation();
    const [remove] = mainRequest.useDeleteMainOrganizationProjectCardByIdMutation();
    const [createCardFromTemplate, { error: templateError, isError: isTemplateError, isLoading: isTemplateLoading }] = mainRequest.usePostBaseProjectCardMutation();

    const values = context.watch();

    const { data: cards, isLoading } = mainRequest.useGetOrganizationProjectCardItemQuery({
        organization_customer_id: [organizationId]
    });

    const { data: cardsProject } = mainRequest.useGetOrganizationProjectCardItemQuery({
        organization_project_id: [projectId || values.project?.value]
    });

    const positionMap = useMemo(() => {
        return positions?.results.reduce((acc, item) => {
            if(item.id) {
                acc[item.id] = item.name;
            }

            return acc;
        }, {});
    }, [positions?.results]);

    const closeModal = useCallback(() => {
        setVisibleModalId(null);
        setShowAllTree(false);
        setVisibleAddCard(false);
    }, [setVisibleModalId, setShowAllTree]);

    useEffect(() => {
        context.setValue('cardNameSub', '');
    }, [visibleAddCard]);

    // const setVisibleModal = useCallback((state) => {
    //     if(!state) {
    //         closeModal();
    //     }
    // }, [closeModal]);

    useEffect(() => {
        if(cardsProject && positionMap) {
            context.setValue('cardName', visibleModalId !== null ? cardsProject[visibleModalId].name : '');
            context.setValue('position', visibleModalId !== null ? cardsProject[visibleModalId]?.positions_ids?.map((id) => ({
                value: id,
                label: positionMap[id]
            })) : undefined);
        }
    }, [cardsProject, visibleModalId, positionMap]);

    const editCard = (formValues: IForm) => {
        if(visibleModalId === null) {
            if(projectId || formValues.project?.value) {
                post({
                    name                   : formValues.cardName,
                    parent_id              : undefined,
                    organization_project_id: formValues.project?.value ? parseInt(formValues.project?.value, 10) : parseInt(projectId, 10)
                })
                    .unwrap()
                    .then(closeModal)
                    .catch(console.error);
            }
        }

        if(cardsProject && visibleModalId !== null && formValues.cardNameSub) {
            post({
                name     : formValues.cardNameSub,
                parent_id: cardsProject[visibleModalId].id
            })
                .unwrap()
                .then(() => setVisibleAddCard(false))
                .catch(console.error);

            return;
        }

        if(!cardsProject || visibleModalId === null) {
            return;
        }

        patch({
            name         : formValues.cardName,
            id           : cardsProject[visibleModalId].id,
            positions_ids: formValues?.position?.map(({ value }) => parseInt(value, 10))
        })
            .unwrap()
            .then(() => setVisibleAddCard(false))
            .catch(console.error);
    };

    const createCardFromTemplateRequest = (formValues: { card_id: { value: string }, project: IValue }) => {
        if(!projectId) {
            return;
        }
        createCardFromTemplate({
            root_card_item_id: formValues.card_id.value,
            project_id       : formValues.project?.value || projectId
        }).unwrap()
            .then(() => {
                setShowCreateByTemplateModal(false);
            })
            .catch(console.error);
    };

    const addAction = () => {
        if(su || pfm || admin && (projectId || !!props.projects?.length)) {
            return (
                <Dropdown
                    render={({ onClose }) => (
                        <DropdownMenu>
                            <DropdownMenuItem
                                selected={false}
                                onClick={() => {
                                    const defaultValue = baseProjectCards?.[0]?.id ? {
                                        value: baseProjectCards[0].id.toString(),
                                        label: baseProjectCards[0].name
                                    } : undefined;

                                    if(defaultValue) {
                                        formCreateByTemplate.setValue('card_id', defaultValue);
                                    }
                                    setShowCreateByTemplateModal(true);
                                    onClose();
                                }}
                            >
                                {t('routes.organization.blocks.cards-create-by-template')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                selected={false}
                                onClick={() => {
                                    setShowAllTree(true);
                                    onClose();
                                }}
                            >
                                {t('routes.organization.blocks.cards-create')}
                            </DropdownMenuItem>
                        </DropdownMenu>
                    )}
                >
                    <AddAction />
                </Dropdown>
            );
        }
    };

    const elContent = () => {
        if(isLoading) {
            return <Loader />;
        }

        if(cards?.length) {
            return (
                <div className={cn('organization__cards')}>
                    {cards.map(({ id, name, children, organization_project_id }, index) => (
                        <div className={cn('organization__card')} key={id}>
                            <div className={cn('organization__card-icon-wrapper')}>
                                <IconChecked
                                    svg={{
                                        className: cn('organization__card-icon')
                                    }}
                                />
                            </div>
                            <div className={cn('organization__card-name')}>
                                {name}
                            </div>
                            <div className={cn('organization__card-count')}>
                                {t('routes.organization.blocks.cards-count', {
                                    count: children.length
                                })}
                            </div>
                            {su || admin || pfm && (
                                <div className={cn('organization__card-edit')}>
                                    <Dropdown
                                        render={({ onClose }) => (
                                            <DropdownMenu>
                                                <DropdownMenuItem
                                                    selected={false}
                                                    onClick={() => {
                                                        if(id) {
                                                            if(props.projects) {
                                                                context.setValue('project',
                                                                    props.projects.find((project) => {
                                                                        return parseInt(project.value, 10) === organization_project_id;
                                                                    })
                                                                );
                                                            }
                                                            setVisibleModalId(index);
                                                            onClose();
                                                        }
                                                    }}
                                                >
                                                    {t('routes.organization.blocks.cards-edit')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    selected={false}
                                                    onClick={() => {
                                                        if(id) {
                                                            remove({ id: String(id) })
                                                                .then(onClose).catch(console.error);
                                                        }
                                                    }}
                                                >
                                                    {t('routes.organization.blocks.cards-delete')}
                                                </DropdownMenuItem>
                                            </DropdownMenu>
                                        )}
                                    >
                                        <IconDots
                                            svg={{
                                                className: cn('organization__card-icon')
                                            }}
                                        />
                                    </Dropdown>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        return <Empty>{t('routes.organization.blocks.sections.empty')}</Empty>;
    };

    return (
        <React.Fragment>
            <Section id="cards">
                <Wrapper>
                    <SectionHeader actions={addAction()}>
                        {t('routes.organization.blocks.sections.cards')}
                    </SectionHeader>
                    {elContent()}
                </Wrapper>
            </Section>
            {(visibleModalId !== null || showAllTree) && cardsProject !== undefined && (
                <Modal
                    header={t('routes.organization.blocks.modal.title', {
                        context: visibleModalId === null ? 'add' : 'edit'
                    })}
                    footer={
                        <ModalFooterSubmit>
                            <Button isSecondary={true} onClick={closeModal}>
                                {t('routes.organization.blocks.modal.cancel')}
                            </Button>
                            <Button type="submit" form={FORM_ORGANIZATION_CARD_ID}>
                                {t('routes.organization.blocks.modal.save')}
                            </Button>
                        </ModalFooterSubmit>
                    }
                    onClose={() => {
                        setVisibleModalId(null);
                        setShowAllTree(false);
                        setVisibleAddCard(false);
                    }}
                >
                    <FormProvider {...context}>
                        <form
                            onSubmit={context.handleSubmit(editCard)} id={FORM_ORGANIZATION_CARD_ID}
                            className={cn('organization__cards-add-form')}
                        >
                            {props.projects?.length && (
                                <Select
                                    direction="column"
                                    name="project"
                                    options={props.projects}
                                    label={t('routes.organization.blocks.modal.project.title')}
                                    placeholder={t('routes.organization.blocks.modal.project.placeholder')}
                                />
                            )}
                            {(values.project || projectId) && (
                                <Fragment>
                                    <Input name="cardName" type="text" label={t('routes.organization.blocks.modal.card-title')} />
                                    {visibleModalId !== null && (
                                        <div className={cn('organization__cards-column')}>
                                            <InputDictionary
                                                requestType={InputDictionary.requestType.Position}
                                                name="position"
                                                direction="column"
                                                label={t('routes.organization.blocks.modal.position')}
                                            />
                                            {visibleAddCard && (
                                                <span className={cn('organization__cards-add-input')}>
                                                    <Input
                                                        name="cardNameSub"
                                                        type="text"
                                                        label={t('routes.organization.blocks.modal.card-sub')}
                                                    />
                                                </span>
                                            )}
                                            {!visibleAddCard && (
                                                <span
                                                    className={cn('organization__cards-add-subdirectory')}
                                                    onClick={() => {
                                                        setVisibleAddCard(true);
                                                    }}
                                                >
                                                    {t('routes.organization.blocks.modal.subdirectory')}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </Fragment>
                            )}
                            <ErrorsComponent
                                error={error || patchError}
                                isError={isError || isPatchError}
                                isLoading={isPostLoading || isPatchLoading}
                            />
                        </form>
                    </FormProvider>
                    {(values.project?.value || projectId) && visibleModalId !== null && (
                        <TreeList
                            needRenderSearch={true}
                            onSetChecked={setChecked}
                            defaultChecked={checked}
                            isLoading={isLoading}
                            items={cardsProject[visibleModalId].children}
                            expandOpen={<IconExpand svg={{ className: cn('organization__expand-icon') }} />}
                            expandClose={<IconCollapse svg={{ className: cn('organization__expand-icon') }} />}
                            label={(params) => (<CardItem {...params} />)}
                        />
                    )}
                </Modal>
            )}
            {showCreateByTemplateModal && (
                <Modal
                    header={t('routes.organization.blocks.modal.title_create-by-template')}
                    footer={
                        <ModalFooterSubmit>
                            <Button
                                isSecondary={true}
                                onClick={() => {
                                    setShowCreateByTemplateModal(false);
                                }}
                            >
                                {t('routes.organization.blocks.modal.cancel')}
                            </Button>
                            <Button type="submit" form={FORM_CREATE_CARD_FROM_TEMPLATE}>
                                {t('routes.organization.blocks.modal.save')}
                            </Button>
                        </ModalFooterSubmit>
                    }
                    onClose={() => {
                        setShowCreateByTemplateModal(false);
                    }}
                >
                    <FormProvider {...formCreateByTemplate}>
                        <form
                            method="POST"
                            onSubmit={formCreateByTemplate.handleSubmit(createCardFromTemplateRequest)}
                            id={FORM_CREATE_CARD_FROM_TEMPLATE}
                        >
                            <Select
                                name="card_id"
                                direction="column"
                                label={t('routes.organization.blocks.modal.cards-template')}
                                defaultValue={baseProjectCards?.[0]?.id ? [{
                                    value: baseProjectCards[0].id.toString(),
                                    label: baseProjectCards[0].name
                                }] : undefined}
                                options={baseProjectCards?.map((item) => ({
                                    label: item.name,
                                    value: String(item.id)
                                })) ?? []}
                            />
                            <ErrorsComponent
                                error={templateError}
                                isError={isTemplateError}
                                isLoading={isTemplateLoading}
                            />
                        </form>
                    </FormProvider>
                </Modal>
            )}
        </React.Fragment>
    );
};

export default ProjectCards;
