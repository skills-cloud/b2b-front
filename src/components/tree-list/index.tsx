import React, { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useClassnames, IStyle } from 'hook/use-classnames';

import ReactTreeList, { Node } from 'react-checkbox-tree';
import IconChevronDown from 'component/icons/chevron-down';
import IconChevronRight from 'component/icons/chevron-right';
import { InputRaw } from 'component/form/input';
import Loader from 'component/loader';

import style from './index.module.pcss';

interface IItemMap {
    [key: number]: IItem
}

export interface IItem {
    id?: number,
    parent_id?: number | string,
    name: string,
    children: Array<IItem>,
    level?: number
}

type TLable = (item: IItem) => ReactNode;

interface IProps {
    defaultChecked?: Array<string>,
    isLoading: boolean,
    onSetChecked?(checked: Array<string>): void,
    items?: Array<IItem>,
    label: TLable,
    expandOpen?: ReactNode,
    expandClose?: ReactNode,
    showCheckbox?: boolean,
    needRenderSearch?: boolean,
    className?: string | IStyle
}

const walkTree = (items: Array<IItem>, callback: (model: IItem) => void) => {
    items?.forEach((item) => {
        callback(item);

        if(item.children?.length) {
            walkTree(item.children, callback);
        }
    });
};

const getRootNode = (
    model: IItem,
    nodeById: IItemMap,
    newNodeById: IItemMap
): IItem => {
    const parent_id = model?.parent_id;
    const parentModel = parent_id ? nodeById[parent_id] : null;

    if(parentModel?.id !== undefined) {
        newNodeById[parentModel.id] = {
            ...parentModel,
            children: parentModel.children.filter(({ id }: { id: number | string }) => String(id) === String(model.id))
        };

        return getRootNode(parentModel, nodeById, newNodeById);
    }

    return model;
};

const convertDataToTreeList = (array: Array<IItem>, show: boolean, itemsMap?: IItemMap, label?: TLable, level = 1) => (
    array.map((item): Node => {
        const { id, children } = item;

        if(itemsMap && id) {
            itemsMap[id] = item;
        }

        return {
            value       : String(id),
            label       : label?.({ ...item, level: level }) || item.name,
            showCheckbox: show,
            children    : children?.length ? convertDataToTreeList(children, show, itemsMap, label, level + 1) : undefined
        };
    })
);

const TreeList = ({
    items,
    defaultChecked,
    isLoading,
    onSetChecked,
    label,
    expandOpen,
    className,
    expandClose,
    showCheckbox = false,
    needRenderSearch = true
}: IProps) => {
    const { t } = useTranslation();
    const cn = useClassnames(style, className, true);
    const nodeById = useRef({});

    const [expanded, setExpanded] = useState<Array<string>>([]);
    const [checked, setChecked] = useState<Array<string>>(defaultChecked || []);
    const [hideChecked, setHideChecked] = useState<Array<string>>([]);
    const [search, setSearch] = useState('');
    const searchString = search.trim();

    let nextItems = items;
    const newNodeById: IItemMap = {};
    const setNodes = new Set<number>();

    if(needRenderSearch && searchString && items) {
        walkTree(items, (model: IItem) => {
            const name = model.name.toLowerCase();

            if(~name.search(searchString.trim().toLowerCase())) {
                const rootNode = getRootNode(model, nodeById.current, newNodeById);

                if(rootNode.id) {
                    setNodes.add(rootNode.id);
                }
            }
        });

        nextItems = [...setNodes].map((id: number) => newNodeById[id]).filter((item) => !!item);
    }

    useEffect(() => {
        if(searchString) {
            setExpanded([...setNodes].map((id) => id.toString()));
            setHideChecked((oldState) => {
                return [...new Set([...checked, ...oldState])];
            });
        } else {
            setExpanded([]);
            setChecked((oldState) => {
                return [...new Set([...hideChecked, ...oldState])];
            });
        }
    }, [searchString]);

    return (
        <div className={cn('checkbox-tree')}>
            {needRenderSearch && (
                <div className={cn('checkbox-tree__search')}>
                    <InputRaw
                        placeholder={t('components.checkbox-tree.search')}
                        name="search"
                        type="search"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setSearch(event?.target?.value);
                        }}
                    />
                </div>
            )}
            <div className={cn('checkbox-tree__tree')}>
                {isLoading && <Loader />}
                {!!items && items.length > 0 && nextItems && (
                    <ReactTreeList
                        checked={checked}
                        expanded={expanded}
                        onCheck={(checkedValues) => {
                            const newChecked = [...new Set([...checkedValues, ...checked])];

                            setChecked(checkedValues);
                            onSetChecked?.(newChecked);
                        }}
                        onExpand={setExpanded}
                        nodes={convertDataToTreeList(
                            nextItems,
                            showCheckbox,
                            !searchString ? nodeById.current : undefined,
                            label
                        )}
                        optimisticToggle={true}
                        icons={{
                            check      : null,
                            uncheck    : null,
                            halfCheck  : null,
                            expandOpen : expandOpen || <IconChevronDown svg={{ className: cn('checkbox-tree__expand') }} />,
                            expandClose: expandClose || <IconChevronRight />,
                            parentClose: null,
                            parentOpen : null,
                            leaf       : null
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default TreeList;
