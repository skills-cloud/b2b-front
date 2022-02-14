import React, { Fragment, useState, useMemo } from 'react';
// import { useTranslation } from 'react-i18next';

import TreeList, { IItem } from 'component/tree-list';
import IconEdit from 'component/icons/edit';
import IconDelete from 'component/icons/delete';
import Input from 'component/form/input';
import InputSelect, { IValue } from 'component/form/select';
import IconPlus from 'component/icons/plus';
import { dictionary as dictionaryApi } from 'src/adapters/api/dictionary';
import ConfirmDialog from 'component/confirm-dialog';
import Button from 'component/button';
import { useClassnames } from 'hook/use-classnames';

import EditDictionaryItem from '../edit-dialog';
import 'antd/lib/tabs/style/index.css';
import style from './index.module.pcss';
import cbTreeStyle from './cb-tree.module.pcss';

export interface IParent {
    parent: IValue | undefined
}

// @TODO Translate
const CometenceTree = () => {
    const cn = useClassnames(style);
    // const { t } = useTranslation();
    const { data: competenceList, isLoading } = dictionaryApi.useGetCompetenceTreeQuery(undefined);
    const { data: competenceListPlane } = dictionaryApi.useGetCompetenceQuery(undefined);
    const [edit, editPayload] = dictionaryApi.usePatchCompetenceMutation();
    const [remove, removePayload] = dictionaryApi.useDeleteCompetenceMutation();
    const [create, createPayload] = dictionaryApi.usePostCompetenceMutation();
    const [deletingItem, setDeletingItem] = useState<IItem>();
    const [creating, setCreating] = useState<IParent | null>(null);
    const [editingItem, setEditingItem] = useState<IItem>();

    const elCreating = useMemo(() => {
        if(creating) {
            return (
                <EditDictionaryItem
                    title="Добавление компетенции"
                    mainButtonText="Добавить"
                    onClose={() => setCreating(null)}
                    error={createPayload.error}
                    isError={createPayload.isError}
                    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                    onSubmit={(formPayload: Record<string, any>) => {
                        // @ts-ignore
                        void create({
                            ...formPayload,
                            ...(formPayload.parent ? { parent_id: formPayload.parent.value } : {})
                        })
                            .unwrap()
                            .then(() => {
                                setCreating(null);
                            });
                    }}
                    isLoading={createPayload.isLoading}
                    defaultFormValues={{
                        parent: creating.parent
                    }}
                    inputs={(
                        <Fragment>
                            {creating.parent && (
                                <InputSelect
                                    name="parent"
                                    options={competenceListPlane?.results.map((item) => ({ label: item.name, value: String(item.id) })) || []}
                                    isSearchable={true}
                                    placeholder="Родитель"
                                    clearable={true}
                                />
                            )}
                            <Input
                                name="name"
                                type="text"
                                placeholder="Значение"
                            />
                        </Fragment>
                    )}
                />
            );
        }
    }, [creating, createPayload, competenceListPlane]);

    const elEdit = useMemo(() => {
        if(editingItem) {
            const defaultParent = competenceListPlane?.results.find((item) => item.id === editingItem.parent_id);

            return (
                <EditDictionaryItem
                    title={`Редактирование элемента "${editingItem.name}"`}
                    mainButtonText="Сохранить"
                    onClose={() => setEditingItem(undefined)}
                    error={editPayload.error}
                    isError={editPayload.isError}
                    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                    onSubmit={(formPayload: Record<string, any>) => {
                        // @ts-ignore
                        void edit({
                            id: String(editingItem.id),
                            ...formPayload,
                            ...(formPayload.parent ? { parent_id: formPayload.parent.value } : {})
                        })
                            .unwrap()
                            .then(() => {
                                setEditingItem(undefined);
                            });
                    }}
                    isLoading={editPayload.isLoading}
                    defaultFormValues={{
                        name: editingItem.name,
                        ...(defaultParent ? { parent: { label: defaultParent.name, value: String(defaultParent.id) } } : {})
                    }}
                    inputs={(
                        <Fragment>
                            {editingItem.parent_id && (
                                <InputSelect
                                    name="parent"
                                    options={competenceListPlane?.results.map((item) => ({ label: item.name, value: String(item.id) })) || []}
                                    isSearchable={true}
                                    placeholder="Родитель"
                                    clearable={true}
                                />
                            )}
                            <Input
                                name="name"
                                type="text"
                                placeholder="Значение"
                            />
                        </Fragment>
                    )}
                />
            );
        }
    }, [editingItem, editPayload, competenceListPlane]);

    const elDelete = useMemo(() => {
        if(deletingItem) {
            return (
                <ConfirmDialog
                    title={`Удалить элемент "${deletingItem.name}"`}
                    mainButtonText="Удалить"
                    onClose={() => setDeletingItem(undefined)}
                    error={removePayload.error}
                    isError={removePayload.isError}
                    onSubmit={() => {
                        if(deletingItem?.id) {
                            void remove({ id: deletingItem.id })
                                .unwrap()
                                .then(() => {
                                    setDeletingItem(undefined);
                                });
                        }
                    }}
                    isLoading={removePayload.isLoading}
                />
            );
        }
    }, [deletingItem, removePayload]);

    return (
        <div className={cn('competence-tree')}>
            <Button className={cn('competence-tree__button')} onClick={() => setCreating({ parent: undefined })}>Добавить в корень</Button>
            <TreeList
                className={cbTreeStyle}
                items={competenceList}
                showCheckbox={false}
                isLoading={isLoading}
                label={(props) => (
                    <div className={cn('competence-tree__item')}>
                        <span
                            className={cn('competence-tree__label', {
                                'competence-tree__label_bold': props.parent_id === null
                            })}
                        >
                            {props.name}
                        </span>
                        <div className={cn('competence-tree__controls')}>
                            {!props.parent_id && (
                                <IconPlus
                                    svg={{
                                        className: cn('competence-tree__icon'),
                                        onClick  : () => setCreating({ parent: { label: props.name, value: String(props.id) } })
                                    }}
                                />
                            )}
                            <IconEdit
                                svg={{
                                    className: cn('competence-tree__icon'),
                                    onClick  : () => setEditingItem(props)
                                }}
                            />
                            <IconDelete
                                svg={{
                                    className: cn('competence-tree__icon'),
                                    onClick  : () => setDeletingItem(props)
                                }}
                            />
                        </div>
                    </div>
                )}
            />
            {elCreating}
            {elEdit}
            {elDelete}
        </div>
    );
};

export default CometenceTree;
