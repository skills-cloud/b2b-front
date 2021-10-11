import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useHover } from 'react-laag';
import OutsideClickHandler from 'react-outside-click-handler';

import IconSubdirectory from 'component/icons/subdirectory';
import IconPencil from 'component/icons/pencil';
import IconDelete from 'component/icons/delete';
import Input from 'component/form/input';
import Tooltip from 'component/tooltip';
import { IItem } from 'component/tree-list';
import Button from 'component/button';

import { mainRequest } from 'adapter/api/main';
import { useClassnames } from 'hook/use-classnames';

import style from './index.module.pcss';

enum ECardActions {
    Add,
    Edit,
    Delete,
    Empty
}

interface ICardForm {
    card: string
}

interface ICardLabel extends IItem {
    forceShowActions?: boolean
}

const MAX_LEVEL_TO_VISIBLE_ADD_ACTIONS = 2;

const CardLabel = ({ name, children, id, forceShowActions = false, level }: ICardLabel) => {
    const cn = useClassnames(style);
    const [isOver, hoverProps] = useHover();
    const showActions = forceShowActions || isOver;
    const { t } = useTranslation();
    const [action, setAction] = useState(ECardActions.Empty);
    const form = useForm<ICardForm>();
    const formEdit = useForm<ICardForm>({
        defaultValues: {
            card: name
        }
    });
    const [post] = mainRequest.usePostMainOrganizationProjectCardMutation();
    const [patch] = mainRequest.usePatchMainOrganizationProjectCardMutation();
    const [remove] = mainRequest.useDeleteMainOrganizationProjectCardByIdMutation();

    const addCard = (values: ICardForm) => {
        post({
            name     : values.card,
            parent_id: id
        })
            .unwrap()
            .then(() => {
                setAction(ECardActions.Empty);
            })
            .catch(console.error);
    };

    const editCard = (values: ICardForm) => {
        patch({
            name: values.card,
            id  : id
        })
            .unwrap()
            .then(() => {
                setAction(ECardActions.Empty);
            })
            .catch(console.error);
    };

    return (
        <div>
            <span
                className={cn('organization__card-label', {
                    'organization__card-label_edit': forceShowActions || showActions && action === ECardActions.Empty
                })}
                {...hoverProps}
            >
                {action !== ECardActions.Edit && (
                    <span>
                        {name}
                        {t('routes.organization.blocks.modal.cards-count', {
                            context: children.length === 0 ? 'empty' : 'full',
                            value  : children.length
                        })}
                    </span>
                )}
                {action === ECardActions.Edit && (
                    <OutsideClickHandler onOutsideClick={() => {
                        setAction(ECardActions.Empty);
                    }}
                    >
                        <FormProvider {...formEdit}>
                            <form
                                method="PATCH"
                                className={cn('organization__card_form-edit')}
                            >
                                <Input name="card" type="text" />
                                <Button type="submit" onClick={formEdit.handleSubmit(editCard)}>
                                    {t('routes.organization.blocks.modal.save')}
                                </Button>
                            </form>
                        </FormProvider>
                    </OutsideClickHandler>
                )}
                {showActions && action === ECardActions.Empty && (
                    <div className={cn('organization__card-label-actions')}>
                        {level !== undefined && level < MAX_LEVEL_TO_VISIBLE_ADD_ACTIONS && (
                            <Tooltip content={t('routes.organization.blocks.modal.subdirectory')} theme="dark">
                                <IconSubdirectory
                                    svg={{
                                        className: cn('organization__card-label-action'),
                                        onClick  : () => {
                                            setAction(ECardActions.Add);
                                        }
                                    }}
                                />
                            </Tooltip>
                        )}
                        <Tooltip content={t('routes.organization.blocks.modal.edit')} theme="dark">
                            <IconPencil
                                svg={{
                                    className: cn('organization__card-label-action'),
                                    onClick  : () => {
                                        setAction(ECardActions.Edit);
                                    }
                                }}
                            />
                        </Tooltip>
                        <Tooltip content={t('routes.organization.blocks.modal.delete')} theme="dark">
                            <IconDelete
                                svg={{
                                    className: cn('organization__card-label-action'),
                                    onClick  : () => {
                                        if(id) {
                                            remove({ id: String(id) }).catch(console.error);
                                        }
                                    }
                                }}
                            />
                        </Tooltip>
                    </div>
                )}
            </span>
            {action === ECardActions.Add && (
                <OutsideClickHandler onOutsideClick={() => {
                    setAction(ECardActions.Empty);
                }}
                >
                    <FormProvider {...form}>
                        <form
                            method="POST"
                            onSubmit={form.handleSubmit(addCard)}
                            className={cn('organization__card_form-add')}
                        >
                            <Input name="card" type="text" />
                            <Button type="submit" onClick={form.handleSubmit(addCard)}>
                                {t('routes.organization.blocks.modal.save')}
                            </Button>
                        </form>
                    </FormProvider>
                </OutsideClickHandler>
            )}
        </div>
    );
};

export default CardLabel;
