import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import useClassnames from 'hook/use-classnames';

import IconPencil from 'component/icons/pencil';
import IconApply from 'component/icons/apply';
import Tooltip from 'component/tooltip';
import Loader from 'component/loader';

import { position } from 'adapter/api/position';

import CompetenciesEdit from './edit';
import style from './index.module.pcss';

export interface IProps {
    id: string
}

const Competencies = (props: IProps) => {
    const cn = useClassnames(style);
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const { data, isLoading } = position.useGetPositionListQuery({ id }, { refetchOnMountOrArgChange: true });

    const onClose = () => {
        setIsEdit(false);
    };

    const elModalEdit = useMemo(() => {
        if(isEdit) {
            return <CompetenciesEdit onCancel={onClose} />;
        }
    }, [isEdit]);

    const elContent = () => {
        if(isLoading && !data?.results.length) {
            return <Loader />;
        }

        return (
            <div className={cn('competencies__info-list')}>
                {data?.results?.map((pos) => {
                    if(pos.position || pos.title) {
                        return (
                            <div className={cn('competencies__info-list-item')} key={pos.id}>
                                <div className={cn('competencies__info-list-top')}>
                                    <h5 className={cn('competencies__info-list-role')}>{pos.position?.name || pos.title}</h5>
                                    <IconApply
                                        svg={{
                                            width    : 24,
                                            height   : 24,
                                            className: cn('competencies__icon-apply')
                                        }}
                                    />
                                </div>
                                <div className={cn('competencies__list-item')}>
                                    <strong>{t('routes.person.blocks.competencies.skills')}</strong>
                                    <div className={cn('competencies__skills')}>
                                        {pos.competencies.map((comp) => (
                                            <Tooltip key={comp.id} content={comp.name} theme="dark">
                                                <span className={cn('competencies__skills-tag')}>{comp.name}</span>
                                            </Tooltip>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return null;
                })}
            </div>
        );
    };

    return (
        <div id={props.id} className={cn('competencies')}>
            <div className={cn('competencies__info-content-header')}>
                <h2>{t('routes.person.blocks.competencies.title')}</h2>
                <div
                    className={cn('competencies__control')}
                    onClick={() => {
                        setIsEdit(true);
                    }}
                >
                    <IconPencil />
                </div>
            </div>
            {elContent()}
            {elModalEdit}
        </div>
    );
};

export default Competencies;
