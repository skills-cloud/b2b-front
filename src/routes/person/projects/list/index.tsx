import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames from 'hook/use-classnames';
import { H3 } from 'component/header';
import Separator from 'component/separator';
import IconPencil from 'component/icons/pencil';
import IconDelete from 'component/icons/delete';
import useFormatDistance from 'component/dates/format-distance';

import { CvProjectRead } from 'adapter/types/cv/project/get/code-200';

import style from './index.module.pcss';

interface IProjectsList {
    fields?: Array<CvProjectRead>,
    setProjectId: (id: number) => void,
    nextStep: (isDeleteAction: boolean) => void
}

const ProjectsList = ({ fields, setProjectId, nextStep }: IProjectsList) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const formatDistance = useFormatDistance();

    if(!fields?.length) {
        return (
            <p className={cn('projects-list__empty')}>
                {t('routes.person.projects.empty')}
            </p>
        );
    }

    return (
        <Fragment>
            {fields.map((project, index) => {
                return (
                    <div key={project.id} className={cn('projects-list')}>
                        <div className={cn('projects-list__row')}>
                            <div>
                                <H3>{project.name}</H3>
                                <p className={cn('projects-list__date')}>
                                    {project.date_from}&nbsp;&mdash; {project.date_to}
                                    {' '}
                                    <span className={cn('projects-list__date-distance')}>
                                        ({project.date_from && project.date_to && formatDistance({ date: new Date(project.date_from), baseDate: new Date(project.date_to) })})
                                    </span>
                                </p>
                            </div>
                            <div className={cn('projects-list__actions')}>
                                <button
                                    type="button"
                                    className={cn('projects-list__action')}
                                    onClick={() => {
                                        project.id && setProjectId(project.id);
                                        nextStep(false);
                                    }}
                                >
                                    <IconPencil svg={{ className: cn('projects-list__icon') }} />
                                </button>
                                <button
                                    type="button"
                                    className={cn('projects-list__action')}
                                    onClick={() => {
                                        project.id && setProjectId(project.id);
                                        nextStep(true);
                                    }}
                                >
                                    <IconDelete svg={{ className: cn('projects-list__icon') }} />
                                </button>
                            </div>
                        </div>
                        {index !== fields.length - 1 && <Separator />}
                    </div>
                );
            })}
        </Fragment>
    );
};

export default ProjectsList;
