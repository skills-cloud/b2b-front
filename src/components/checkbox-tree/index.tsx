import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { IStyle, useClassnames } from 'hook/use-classnames';

import ReactCheckboxTree, { Node } from 'react-checkbox-tree';
import IconChevronDown from 'component/icons/chevron-down';
import IconChevronRight from 'component/icons/chevron-right';
import Input from 'component/form/input';
import Dropdown from 'component/dropdown/base';
import DropdownMenuItem from 'component/dropdown/menu-item';
import DropdownMenu from 'component/dropdown/menu';

import { CompetenceTree } from 'adapter/types/dictionary/competence-tree/get/code-200';
import { dictionary } from 'adapter/api/dictionary';

import style from './index.module.pcss';
import Loader from 'component/loader';

interface ICompetenceMap {
    [key: number]: CompetenceTree
}

type TOnChangeExperience = (id: string, expirienceId: number) => void;
type TCompetenceExpirienceMap = Record<string, number>;


export interface IProps {
    className?: string | IStyle,
    competencies: Array<string>,
    onChangeExperience?: TOnChangeExperience,
    onSetChecked?(checked: Array<string>): void,
    competenceExpirienceMap?: TCompetenceExpirienceMap
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

const experienceYears = [1, 3, 5, 100];

interface IExperienceSelector {
    id: string,
    onChangeExperience: TOnChangeExperience,
    competenceExpirienceMap: TCompetenceExpirienceMap
}

const ExperienceSelector = ({ id, onChangeExperience, competenceExpirienceMap }: IExperienceSelector) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);

    return (
        <Dropdown
            render={({ onClose }) => (
                <DropdownMenu>
                    {experienceYears.map((item) => (
                        <DropdownMenuItem
                            key={item}
                            selected={competenceExpirienceMap[id] === item}
                            onClick={() => {
                                onChangeExperience(id, item);
                                onClose();
                            }}
                        >
                            {t('components.checkbox-tree.experience.invariant', { context: item })}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenu>
            )}
        >
            <span className={cn('checkbox-tree__set-experience')}>
                {id in competenceExpirienceMap ? t(
                    'components.checkbox-tree.experience.invariant',
                    { context: competenceExpirienceMap[id] }
                ) : t('components.checkbox-tree.experience.title')}
            </span>
        </Dropdown>
    );
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

    const elCheckboxLabel = (children: string, id: string, showExperience: boolean) => {
        if(!props?.onChangeExperience) {
            return null;
        }

        return (
            <span className={cn('checkbox-tree__label')}>
                <span>{children}</span>
                {showExperience && (
                    <ExperienceSelector
                        id={id}
                        onChangeExperience={props?.onChangeExperience}
                        competenceExpirienceMap={props.competenceExpirienceMap || {}}
                    />
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
