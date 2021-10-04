import React from 'react';
import { useTranslation } from 'react-i18next';

import { useClassnames } from 'hook/use-classnames';

import TreeList from 'component/tree-list';
import Dropdown from 'component/dropdown/base';
import DropdownMenuItem from 'component/dropdown/menu-item';
import DropdownMenu from 'component/dropdown/menu';

import { dictionary } from 'adapter/api/dictionary';

import style from './index.module.pcss';

type TOnChangeExperience = (id: number, expirienceId: number) => void;
type TCompetenceExpirienceMap = Record<string, number>;

interface ICompetenceSelector {
    checked: Array<string>,
    setChecked: (id: Array<string>) => void,
    competenceExpirienceMap: TCompetenceExpirienceMap,
    setCompetenceExpirienceMap: (expirienceMap: TCompetenceExpirienceMap) => void
}


const experienceYears = [1, 3, 5, 100];

interface IExperienceSelector {
    id?: number,
    onChangeExperience: TOnChangeExperience,
    competenceExpirienceMap: TCompetenceExpirienceMap
}

const ExperienceSelector = ({ id, onChangeExperience, competenceExpirienceMap }: IExperienceSelector) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);

    if(!id) {
        return null;
    }

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
            <span className={cn('competence-selector__experience-activator')}>
                {t('components.checkbox-tree.experience.invariant', {
                    context: competenceExpirienceMap[id] ?? 'title'
                })}
            </span>
        </Dropdown>
    );
};

const CompetenceSelector = ({ checked, setChecked, competenceExpirienceMap, setCompetenceExpirienceMap }: ICompetenceSelector) => {
    const cn = useClassnames(style);
    const { data, isLoading } = dictionary.useGetCompetenceTreeQuery(undefined);

    const onSetRequirementExperience: TOnChangeExperience = (competenceId, experienceId) => {
        setCompetenceExpirienceMap({
            ...competenceExpirienceMap,
            [competenceId]: experienceId
        });
    };

    return (
        <TreeList
            items={data}
            onSetChecked={setChecked}
            showCheckbox={true}
            isLoading={isLoading}
            defaultChecked={checked}
            label={(props) => (
                <span className={cn('competence-selector__experience')}>
                    <span
                        className={cn('competence-selector__label', {
                            'competence-selector__label_bold': props.parent_id === null
                        })}
                    >{props.name}
                    </span>
                    <ExperienceSelector
                        id={props?.id}
                        onChangeExperience={onSetRequirementExperience}
                        competenceExpirienceMap={competenceExpirienceMap}
                    />
                </span>
            )}
        />
    );
};

export default CompetenceSelector;
