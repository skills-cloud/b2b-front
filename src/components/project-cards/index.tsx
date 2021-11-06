import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';

import { useClassnames } from 'hook/use-classnames';

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

import { mainRequest } from 'adapter/api/main';
import { dictionary } from 'adapter/api/dictionary';

import CardItem from './card-item';
import style from './index.module.pcss';

const FORM_ORGANIZATION_CARD_ID = 'FORM_ORGANIZATION_CARD_ID';
const FORM_CREATE_CARD_FROM_TEMPLATE = 'FORM_CREATE_CARD_FROM_TEMPLATE';

interface IForm {
    cardName: string,
    cardNameSub: string,
    position: Array<IValue>
}

interface IProjectCards{
    projectId?: string,
    organizationId: string
}

const ProjectCards = ({ projectId, organizationId }: IProjectCards) => {
    const cn = useClassnames(style);
    const [visibleModalId, setVisibleModalId] = useState<number | null>(null);
    const [showAllTree, setShowAllTree] = useState(false);
    const [showCreateByTemplateModal, setShowCreateByTemplateModal] = useState(false);
    const [checked, setChecked] = useState<Array<string>>([]);
    const [visibleAddCard, setVisibleAddCard] = useState(false);
    const { t } = useTranslation();
    const methods = useForm();
    const formCreateByTemplate = useForm();
    const cardGetParams = projectId ? { organization_project_id: [projectId] } : { organization_id: [organizationId] };
    const { data: cards, isLoading } = mainRequest.useGetOrganizationProjectCardItemQuery(cardGetParams);
    const { data: baseProjectCards } = mainRequest.useGetBaseProjectCardTemplateQuery(undefined);
    const { data: positions } = dictionary.useGetPositionListQuery(undefined);
    const [patch] = mainRequest.usePatchMainOrganizationProjectCardMutation();
    const [post] = mainRequest.usePostMainOrganizationProjectCardMutation();
    const [remove] = mainRequest.useDeleteMainOrganizationProjectCardByIdMutation();
    const [createCardFromTemplate] = mainRequest.usePostBaseProjectCardMutation();

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
        methods.setValue('cardNameSub', '');
    }, [visibleAddCard]);

    const setVisibleModal = useCallback((state) => {
        if(!state) {
            closeModal();
        }
    }, [closeModal]);

    useEffect(() => {
        if(cards && positionMap) {
            methods.setValue('cardName', visibleModalId !== null ? cards[visibleModalId].name : '');
            methods.setValue('position', visibleModalId !== null ? cards[visibleModalId]?.positions_ids?.map((id) => ({
                value: id,
                label: positionMap[id]
            })) : undefined);
        }
    }, [cards, visibleModalId, positionMap]);

    const editCard = (values: IForm) => {
        if(visibleModalId === null) {
            if(projectId) {
                post({
                    name                   : values.cardName,
                    parent_id              : undefined,
                    organization_project_id: parseInt(projectId, 10)
                })
                    .unwrap()
                    .then(closeModal)
                    .catch(console.error);
            }
        }

        if(cards && visibleModalId !== null && values.cardNameSub) {
            post({
                name     : values.cardNameSub,
                parent_id: cards[visibleModalId].id
            })
                .unwrap()
                .then(() => setVisibleAddCard(false))
                .catch(console.error);

            return;
        }

        if(!cards || visibleModalId === null) {
            return;
        }

        patch({
            name         : values.cardName,
            id           : cards[visibleModalId].id,
            positions_ids: values?.position?.map(({ value }) => parseInt(value, 10))
        })
            .unwrap()
            .then(() => setVisibleAddCard(false))
            .catch(console.error);
    };

    const createCardFromTemplateRequest = (values: { card_id: { value: string }}) => {
        if(!projectId) {
            return;
        }
        createCardFromTemplate({
            root_card_item_id: values.card_id.value,
            project_id       : projectId
        }).unwrap()
            .then(() => {
                setShowCreateByTemplateModal(false);
            })
            .catch(console.error);
    };

    if(!cards) {
        return null;
    }

    const addAction = projectId && (
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

    return (
        <React.Fragment>
            <Section>
                <span id="cards" />
                <SectionHeader actions={addAction}>
                    {t('routes.organization.blocks.sections.cards')}
                </SectionHeader>
                <div className={cn('organization__cards')}>
                    {cards.map(({ id, name, children }, index) => (
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
                            <div className={cn('organization__card-edit')}>
                                <Dropdown
                                    render={({ onClose }) => (
                                        <DropdownMenu>
                                            <DropdownMenuItem
                                                selected={false}
                                                onClick={() => {
                                                    if(id) {
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
                        </div>
                    ))}
                </div>
            </Section>
            {(visibleModalId !== null || showAllTree) && cards !== undefined && (
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
                    <FormProvider {...methods}>
                        <form method="PATCH" onSubmit={methods.handleSubmit(editCard)} id={FORM_ORGANIZATION_CARD_ID}>
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
                            {}
                        </form>
                    </FormProvider>
                    <TreeList
                        needRenderSearch={false}
                        onSetChecked={setChecked}
                        defaultChecked={checked}
                        isLoading={isLoading}
                        items={visibleModalId === null ? [] : cards[visibleModalId].children}
                        expandOpen={<IconExpand svg={{ className: cn('organization__expand-icon') }} />}
                        expandClose={<IconCollapse svg={{ className: cn('organization__expand-icon') }} />}
                        label={(props) => (<CardItem {...props} />)}
                    />

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
                        </form>
                    </FormProvider>
                </Modal>
            )}
        </React.Fragment>
    );
};

export default ProjectCards;
