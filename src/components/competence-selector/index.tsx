import React from 'react';
import { useTranslation } from 'react-i18next';

import { useClassnames } from 'hook/use-classnames';

import TreeList from 'component/tree-list';
import Dropdown from 'component/dropdown';
import DropdownMenuItem from 'component/dropdown/menu-item';
import DropdownMenu from 'component/dropdown/menu';

import { dictionary } from 'adapter/api/dictionary';

import style from './index.module.pcss';

type TOnChangeExperience = (id: number, expirienceId: number) => void;
type TCompetenceExperienceMap = Record<string, number>;

interface ICompetenceSelector {
    checked: Array<string>,
    setChecked: (id: Array<string>) => void,
    competenceExperienceMap: TCompetenceExperienceMap,
    setCompetenceExperienceMap: (experienceMap: TCompetenceExperienceMap) => void
}


const experienceYears = [1, 3, 5, 100];

interface IExperienceSelector {
    id?: number,
    onChangeExperience: TOnChangeExperience,
    competenceExperienceMap: TCompetenceExperienceMap
}

const ExperienceSelector = ({ id, onChangeExperience, competenceExperienceMap }: IExperienceSelector) => {
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
                            selected={competenceExperienceMap[id] === item}
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
                    context: competenceExperienceMap[id] ?? 'title'
                })}
            </span>
        </Dropdown>
    );
};

const CompetenceSelector = ({ checked, setChecked, competenceExperienceMap, setCompetenceExperienceMap }: ICompetenceSelector) => {
    const cn = useClassnames(style);
    const { data, isLoading } = dictionary.useGetCompetenceTreeQuery(undefined);

    const onSetRequirementExperience: TOnChangeExperience = (competenceId, experienceId) => {
        setCompetenceExperienceMap({
            ...competenceExperienceMap,
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
                        competenceExperienceMap={competenceExperienceMap}
                    />
                </span>
            )}
        />
    );
};

export default CompetenceSelector;
