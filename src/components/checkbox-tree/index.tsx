import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { IStyle, useClassnames } from 'hook/use-classnames';

import ReactCheckboxTree, { Node } from 'react-checkbox-tree';
import IconChevronDown from 'component/icons/chevron-down';
import IconChevronRight from 'component/icons/chevron-right';
import Input from 'component/form/input';

import { CompetenceTree } from 'adapter/types/dictionary/competence-tree/get/code-200';
import { dictionary } from 'adapter/api/dictionary';

import style from './index.module.pcss';
import Loader from 'component/loader';

interface ICompetenceMap {
    [key: number]: CompetenceTree
}

export interface IProps {
    className?: string | IStyle,
    competencies: Array<string>,
    onClickExperience?(id: string): void,
    onSetChecked?(checked: Array<string>): void
}

const walkTree = (items: Array<CompetenceTree>, callback: (model: CompetenceTree) => void) => {
    items?.forEach((item) => {
        callback(item);

        if(item.children?.length) {
            walkTree(item.children, callback);
        }
    });
};

const getRootNode = (
    model: CompetenceTree,
    nodeById: ICompetenceMap,
    newNodeById: ICompetenceMap
): CompetenceTree => {
    const parent_id = model?.parent_id;
    const parentModel = parent_id ? nodeById[parent_id] : null;

    if(parentModel) {
        newNodeById[parentModel.id] = {
            ...parentModel,
            children: parentModel?.children?.filter(({ id }: {id: number}) => id === model.id)
        };

        return getRootNode(parentModel, nodeById, newNodeById);
    }

    return model;
};

const CheckboxTree = (props: IProps) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const nodeById = useRef({});
    const { getValues } = useFormContext();

    const { data, isLoading } = dictionary.useGetCompetenceTreeQuery(undefined);

    const [expanded, setExpanded] = useState<Array<string>>([]);
    const [checked, setChecked] = useState<Array<string>>(props.competencies);
    const searchString = getValues('search')?.trim();

    let nextData = data;
    const newNodeById: ICompetenceMap = {};
    const setNodes = new Set<number>();

    if(searchString && data) {
        walkTree(data, (model: CompetenceTree) => {
            const name = model.name.toLowerCase();

            if(~name.search(searchString.trim().toLowerCase())) {
                const rootNode = getRootNode(model, nodeById.current, newNodeById);

                setNodes.add(rootNode.id as number);
            }
        });

        nextData = [...setNodes].map((id: number) => newNodeById[id]).filter((item) => !!item);
    }

    useEffect(() => {
        if(searchString) {
            setExpanded([...setNodes].map((id) => id.toString()));
        } else {
            setExpanded([]);
        }
    }, [searchString]);

    const onClickExperience = (id: string) => (e: MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        e.preventDefault();

        props.onClickExperience?.(id);
    };

    const elCheckboxLabel = (children: string, id: string, showExperience: boolean) => {
        return (
            <span className={cn('checkbox-tree__label')}>
                <span>{children}</span>
                {showExperience && (
                    <span className={cn('checkbox-tree__set-experience')} onClick={onClickExperience(id)}>
                        {t('components.checkbox-tree.experience')}
                    </span>
                )}
            </span>
        );
    };

    const convertDataToCheckboxTree = (array: Array<CompetenceTree>, mapCompetence?: ICompetenceMap) => (
        array.map((item): Node => {
            const { id, name, children } = item;

            if(mapCompetence && id) {
                mapCompetence[id] = item;
            }

            const label = elCheckboxLabel(name, String(id), children.length === 0);

            return {
                value       : String(id),
                label       : label,
                showCheckbox: true,
                children    : children?.length ? convertDataToCheckboxTree(children, mapCompetence) : undefined
            };
        })
    );

    const elContent = () => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.length && nextData) {
            return (
                <ReactCheckboxTree
                    checked={checked}
                    expanded={expanded}
                    onCheck={(checkedValues) => {
                        setChecked(checkedValues);
                        props.onSetChecked?.(checkedValues);
                    }}
                    onExpand={setExpanded}
                    nodes={convertDataToCheckboxTree(
                        nextData,
                        !searchString ? nodeById.current : undefined
                    )}
                    optimisticToggle={true}
                    icons={{
                        check      : null,
                        uncheck    : null,
                        halfCheck  : null,
                        expandOpen : <IconChevronDown svg={{ className: cn('checkbox-tree__expand') }} />,
                        expandClose: <IconChevronRight />,
                        parentClose: null,
                        parentOpen : null,
                        leaf       : null
                    }}
                />
            );
        }
    };

    return (
        <div className={cn('checkbox-tree')}>
            <div className={cn('checkbox-tree__search')}>
                <Input
                    placeholder={t('components.checkbox-tree.search')}
                    name="search"
                    type="text"
                />
            </div>
            <div className={cn('checkbox-tree__tree')}>
                {elContent()}
            </div>
        </div>
    );
};

export default CheckboxTree;
