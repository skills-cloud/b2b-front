import React, { Fragment, MouseEvent, ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import useClassnames, { IStyle } from 'hook/use-classnames';

import Button from 'component/button';
import Modal from 'component/modal';
import IconArrowLeft from 'component/icons/arrow-left-full';
import Error from 'component/error';
import InputDictionary from 'component/form/input-dictionary';
import CompetenceSelector from 'component/competence-selector';
import Dropdown from 'component/dropdown';
import EditAction from 'component/section/actions/edit';
import DeleteAction from 'component/section/actions/delete';
import DropdownMenu from 'component/dropdown/menu';
import DropdownMenuItem from 'component/dropdown/menu-item';
import DotsAction from 'component/section/actions/dots';
import SkillsTag from 'component/skills-tag';

import { position } from 'adapter/api/position';
import { CvPositionRead } from 'adapter/types/cv/position/get/code-200';

import style from './index.module.pcss';

export interface IField {
    role?: string
}

export interface IProps {
    className?: string | IStyle,
    fields?: Array<IField>,
    onSubmit?(payload: Array<IField>): void,
    onCancel?(): void
}

export interface IFormValues {
    competencies: Array<IField>,
    competence_ids: Array<string>,
    position_id: {
        label: string,
        value: string
    } | null
}

const EDIT_COMPETENCIES_FORM_ID = 'EDIT_COMPETENCIES_FORM_ID';

export const CompetenciesEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const { specialistId } = useParams<IParams>();
    const methods = useForm<IFormValues>({
        defaultValues: {
            competencies  : props.fields || [{}],
            competence_ids: [] as Array<string>,
            position_id   : null
        }
    });
    const { append } = useFieldArray({
        control: methods.control,
        name   : 'competencies'
    });
    const { data: positionData, refetch } = position.useGetPositionListQuery({
        cv_id: parseInt(specialistId, 10)
    }, {
        refetchOnMountOrArgChange: true
    });
    const [patchPosition, { isLoading }] = position.usePatchPositionByIdMutation();
    const [postPosition, { isLoading: isLoadingPost }] = position.usePostPositionMutation();
    const [deletePosition, { isLoading: isLoadingDelete }] = position.useDeletePositionMutation();
    const [postPositionCompetencies] = position.usePostPositionCompetenciesByIdMutation();

    const [activeWindow, setActiveWindow] = useState<'role' | 'competence' | 'checkbox' | null>('competence');
    const [checked, setChecked] = useState<Array<string>>([]);
    const [positionItem, setPositionItem] = useState<CvPositionRead>();
    const [error, setError] = useState<Array<string> | string | null>(null);
    const [competenceExperienceMap, setCompetenceExperienceMap] = useState({});

    const onCancel = () => {
        props.onCancel?.();
        setChecked([]);
        setPositionItem(undefined);
        setActiveWindow(null);
    };

    const requestUpdateCompetencies = useCallback((positionId: number) => {
        const dataComp = checked.map((item) => ({
            competence_id: parseInt(item, 10),
            years        : competenceExperienceMap[item]
        }));

        postPositionCompetencies({
            data: dataComp,
            id  : positionId
        })
            .then(() => {
                refetch();
                onCancel();
            })
            .catch(console.error);
    }, [checked, JSON.stringify(competenceExperienceMap)]);

    const onSubmit = useCallback((formData: IFormValues) => {
        if(activeWindow === 'checkbox') {
            if(positionItem) {
                return patchPosition({
                    id         : positionItem.id,
                    cv_id      : parseInt(specialistId, 10),
                    position_id: positionItem.position_id,
                    years      : positionItem.years
                })
                    .unwrap()
                    .then(() => {
                        requestUpdateCompetencies(positionItem.id as number);
                    })
                    .catch((err) => {
                        console.error(err);

                        if(typeof err.data?.details === 'object') {
                            setError(Object.keys(err.data?.details).map((item) => `${item}: ${err.data?.details[item]}`));
                        } else {
                            setError(err.data?.status);
                        }
                    });
            }

            postPosition({
                cv_id      : parseInt(specialistId, 10),
                position_id: parseInt(formData.position_id?.value as string, 10)
            })
                .unwrap()
                .then((resp) => {
                    requestUpdateCompetencies(resp.id as number);
                })
                .catch((err) => {
                    console.error(err);

                    if(typeof err.data?.details === 'object') {
                        setError(Object.keys(err.data?.details).map((item) => `${item}: ${err.data?.details[item]}`));
                    } else {
                        setError(err.data?.status);
                    }
                });
        }
    }, [checked, activeWindow, JSON.stringify(competenceExperienceMap)]);

    const onClickSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setActiveWindow('checkbox');
    };

    const onClickBack = () => {
        if(activeWindow === 'role') {
            setActiveWindow('competence');
        } else if(activeWindow === 'checkbox') {
            setActiveWindow('competence');
        }
    };

    const onClickEdit = (positionItemParam: CvPositionRead, onClose: () => void) => () => {
        const newChecked = positionItemParam.competencies?.map((item) => String(item.competence_id)) || [];

        setCompetenceExperienceMap(positionItemParam.competencies?.reduce((acc, item) => {
            if(item.years) {
                acc[item.competence_id] = item.years;
            }

            return acc;
        }, {}) || {});
        setPositionItem(positionItemParam);
        setChecked(newChecked);
        setActiveWindow('checkbox');
        onClose();
    };

    const onClickDelete = (positionItemParam: CvPositionRead, onClose: () => void) => () => {
        if(positionItemParam?.id) {
            deletePosition({
                id: positionItemParam.id
            })
                .unwrap()
                .then(() => {
                    refetch();
                    onClose();
                })
                .catch(console.error);
        }
    };

    const elAppend = useMemo(() => {
        if(activeWindow === 'competence') {
            return (
                <a
                    href="#append"
                    className={cn('competencies-edit__link-append')}
                    children={t('routes.person.blocks.competencies.edit.buttons.append')}
                    onClick={(e: MouseEvent) => {
                        e.preventDefault();

                        setActiveWindow('role');
                        append({});
                    }}
                />
            );
        }
    }, [activeWindow]);

    const elSubmitButton = () => {
        if(activeWindow === 'checkbox') {
            return (
                <Button
                    form={EDIT_COMPETENCIES_FORM_ID}
                    type="submit"
                    disabled={isLoadingPost || isLoading || isLoadingDelete}
                    isLoading={isLoadingPost || isLoading || isLoadingDelete}
                >
                    {t('routes.person.blocks.competencies.edit.buttons.save')}
                </Button>
            );
        }

        if(activeWindow === 'role') {
            return (
                <Button
                    type="button"
                    onClick={onClickSubmit}
                    disabled={isLoadingPost || isLoading || isLoadingDelete}
                    isLoading={isLoadingPost || isLoading || isLoadingDelete}
                >
                    {t('routes.person.blocks.competencies.edit.buttons.save')}
                </Button>
            );
        }
    };

    const elCancelButton = () => {
        if(activeWindow === 'competence') {
            return (
                <Button onClick={onCancel}>
                    {t('routes.person.blocks.competencies.edit.buttons.done')}
                </Button>
            );
        }

        return (
            <Button
                isSecondary={true}
                onClick={onCancel}
                className={cn('competencies-edit__button-secondary')}
                disabled={isLoadingPost || isLoading || isLoadingDelete}
            >
                {t('routes.person.blocks.competencies.edit.buttons.cancel')}
            </Button>
        );
    };

    const elFooter = () => {
        return (
            <div className={cn('competencies-edit__form-footer')}>
                {elAppend}
                {elCancelButton()}
                {elSubmitButton()}
            </div>
        );
    };

    const elError = useMemo(() => {
        if(error) {
            if(Array.isArray(error)) {
                return error.map((item, index) => (
                    <Error
                        key={index}
                        className={cn('competencies-edit__error')}
                        elIcon={true}
                    >
                        {item}
                    </Error>
                ));
            }

            return <Error className={cn('competencies-edit__error')} elIcon={true}>{error}</Error>;
        }
    }, [error]);

    const elCompetencies = () => {
        if(positionData?.results?.length) {
            return (
                <div className={cn('competencies-edit__info-list')}>
                    {positionData.results.map((pos) => {
                        return (
                            <div
                                className={cn('competencies-edit__info-list-item')}
                                key={pos.id}
                            >
                                <div className={cn('competencies-edit__info-list-top')}>
                                    <h5 className={cn('competencies-edit__info-list-role')}>{pos.position?.name || pos.title}</h5>
                                    <Dropdown
                                        render={({ onClose }) => (
                                            <DropdownMenu>
                                                <DropdownMenuItem selected={false} onClick={onClickEdit(pos, onClose)}>
                                                    <div className={cn('competencies-edit__info-list-control')}>
                                                        <EditAction />
                                                        {t('routes.person.blocks.competencies.controls.edit')}
                                                    </div>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem selected={false} onClick={onClickDelete(pos, onClose)}>
                                                    <div className={cn('competencies-edit__info-list-control')}>
                                                        <DeleteAction />
                                                        {t('routes.person.blocks.competencies.controls.delete')}
                                                    </div>
                                                </DropdownMenuItem>
                                            </DropdownMenu>
                                        )}
                                    >
                                        <DotsAction />
                                    </Dropdown>
                                </div>
                                <div className={cn('competencies-edit__list-item')}>
                                    <strong>{t('routes.person.blocks.competencies.skills')}</strong>
                                    <div className={cn('competencies-edit__skills')}>
                                        {pos.competencies?.map((comp) => (
                                            <SkillsTag
                                                key={comp.competence_id}
                                                tooltip={t('routes.person.blocks.competencies.experience.invariant', {
                                                    context: comp.years
                                                })}
                                                theme="dark"
                                            >
                                                {comp.competence?.name}
                                            </SkillsTag>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className={cn('competencies-edit__empty')}>
                {t('routes.person.blocks.competencies.empty')}
            </div>
        );
    };

    const elAddRole = () => {
        return (
            <div className={cn('competencies-edit__field')}>
                <InputDictionary
                    isMulti={false}
                    requestType={InputDictionary.requestType.Position}
                    name="position_id"
                    placeholder="Начните вводить, например, “PHP”"
                />
            </div>
        );
    };

    const elFormContent = () => {
        switch (activeWindow) {
            case 'checkbox': {
                return (
                    <Fragment>
                        <CompetenceSelector
                            setChecked={setChecked}
                            checked={checked}
                            competenceExperienceMap={competenceExperienceMap}
                            setCompetenceExperienceMap={setCompetenceExperienceMap}
                        />
                        {elError}
                    </Fragment>
                );
            }

            case 'competence': {
                return elCompetencies();
            }

            case 'role': {
                return elAddRole();
            }

            default: {
                return null;
            }
        }
    };

    const elHeader = () => {
        let icon!: ReactNode;

        if(activeWindow === 'checkbox' || activeWindow === 'role') {
            icon = (
                <IconArrowLeft
                    svg={{
                        className: cn('competencies-edit__header-back'),
                        onClick  : onClickBack
                    }}
                />
            );
        }

        return (
            <div className={cn('competencies-edit__header')}>
                {icon}
                {t('routes.person.blocks.competencies.edit.title', {
                    context: activeWindow,
                    value  : positionItem?.position?.name || positionItem?.title || methods.getValues().position_id?.label
                })}
            </div>
        );
    };

    return (
        <Modal onClose={props.onCancel} className={cn('competencies-edit')} footer={elFooter()} header={elHeader()}>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} id={EDIT_COMPETENCIES_FORM_ID}>
                    {elFormContent()}
                </form>
            </FormProvider>
        </Modal>
    );
};

export default CompetenciesEdit;
