import React, { useState, useRef, useEffect } from 'react';
import { List } from 'antd';

// import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';

import ConfirmDialog from 'component/confirm-dialog';
import Button from 'component/button';
import Input from 'component/form/input';
import Loader from 'component/loader';
import { dictionary as dictionaryApi, IDictionary, IDictionaryParams } from 'src/adapters/api/dictionary';
import { useClassnames } from 'hook/use-classnames';

import EditDictionaryItem from './edit-dialog';
import 'antd/lib/list/style/index.css';
import 'antd/lib/pagination/style/index.css';
import 'antd/lib/dropdown/style/index.css';
import style from './common.module.pcss';


export interface IProps {
    name: string,
    apiKey: string,
    listParams?: IDictionaryParams
}

const PAGE_SIZE = 100;

// @TODO Translate
export const CommonDictionary = (props: IProps) => {
    // const { t } = useTranslation();
    const cn = useClassnames(style);
    const timer = useRef<ReturnType<typeof setTimeout>>();
    const searchForm = useForm();
    const searchValue = searchForm.watch('search');
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>();
    const [deletingId, setDeletingId] = useState<number>();
    const [creating, setCreating] = useState(false);
    const [editingItem, setEditingItem] = useState<IDictionary>();
    const { data, isLoading } = dictionaryApi.useGetDictionaryListQuery({
        key      : props.apiKey,
        page_size: PAGE_SIZE,
        search,
        page,
        ...props.listParams
    });
    const [deleteItem, deleteItemPayload] = dictionaryApi.useDeleteDictionaryItemMutation();
    const [patchItem, patchItemPayload] = dictionaryApi.usePatchDictionaryItemMutation();
    const [postItem, postItemPayload] = dictionaryApi.usePostDictionaryItemMutation();

    useEffect(() => {
        if(!isLoading) {
            if(timer.current) {
                clearTimeout(timer.current);
            }

            timer.current = setTimeout(() => {
                setSearch(searchValue);
            }, 300);
        }
    }, [searchValue]);

    if(isLoading) {
        return <Loader />;
    }

    return (
        <div className={cn('common-dict')}>
            <div className={cn('common-dict__header')}>
                <FormProvider {...searchForm}>
                    <form>
                        <Input
                            name="search"
                            type="text"
                            placeholder="Поиск"
                            disabled={isLoading}
                        />
                    </form>
                </FormProvider>
                <Button className={cn('common-dict__button')} onClick={() => setCreating(true)}>Добавить</Button>
            </div>
            <List
                size="default"
                loading={isLoading}
                itemLayout="horizontal"
                className={`dict-list-${props.apiKey}`}
                style={{ height: `calc(100vh - ${props.listParams?.country_id ? 254 : 208}px)`, overflowY: 'scroll' }}
                pagination={{
                    onChange: (changedPage) => {
                        setPage(changedPage);
                        window.document.getElementsByClassName(`dict-list-${props.apiKey}`)[0].scrollTop = 0;
                    },
                    pageSize        : PAGE_SIZE,
                    // @ts-ignore
                    total           : data?.total,
                    hideOnSinglePage: true,
                    showSizeChanger : false
                }}
                // loadMore={loadMore}
                dataSource={data?.results}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button key="dict-list-edit" onClick={() => setEditingItem(item)}>Редактировать</Button>,
                            <Button key="dict-list-edit" isSecondary={true} onClick={() => setDeletingId(item.id)}>Удалить</Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={item.name}
                            description={item.description}
                        />
                    </List.Item>
                )}
            />
            {deletingId && (
                <ConfirmDialog
                    title="Подтвердите удаление"
                    mainButtonText="Удалить"
                    onClose={() => setDeletingId(undefined)}
                    error={deleteItemPayload.error}
                    isError={deleteItemPayload.isError}
                    onSubmit={() => {
                        if(deletingId) {
                            void deleteItem({ id: deletingId, key: props.apiKey })
                                .unwrap()
                                .then(() => {
                                    setDeletingId(undefined);
                                });
                        }
                    }}
                    isLoading={deleteItemPayload.isLoading}
                />
            )}
            {editingItem && (
                <EditDictionaryItem
                    title={`Редактирование элемента "${editingItem.name}"`}
                    mainButtonText="Сохранить"
                    onClose={() => setEditingItem(undefined)}
                    error={patchItemPayload.error}
                    isError={patchItemPayload.isError}
                    onSubmit={(formPayload: Record<string, unknown>) => {
                        if(editingItem) {
                            void patchItem({
                                key: props.apiKey,
                                ...editingItem,
                                ...formPayload,
                                ...(props.listParams?.country_id ? { country_id: props.listParams.country_id } : {})
                            })
                                .unwrap()
                                .then(() => {
                                    setEditingItem(undefined);
                                });
                        }
                    }}
                    isLoading={patchItemPayload.isLoading}
                    defaultFormValues={{
                        name: editingItem.name
                    }}
                    inputs={(
                        <Input
                            name="name"
                            type="text"
                        />
                    )}
                />
            )}
            {creating && (
                <EditDictionaryItem
                    title={`Создание элемента в справочнике "${props.name}"`}
                    mainButtonText="Создать"
                    onClose={() => setCreating(false)}
                    error={postItemPayload.error}
                    isError={postItemPayload.isError}
                    onSubmit={(formPayload: Record<string, unknown>) => {
                        // @ts-ignore
                        void postItem({
                            ...formPayload,
                            key: props.apiKey,
                            ...(props.listParams?.country_id ? { country_id: props.listParams.country_id } : {})
                        })
                            .unwrap()
                            .then(() => {
                                setCreating(false);
                            });
                    }}
                    isLoading={postItemPayload.isLoading}
                    inputs={(
                        <Input
                            name="name"
                            type="text"
                        />
                    )}
                />
            )}
        </div>
    );
};

export default CommonDictionary;