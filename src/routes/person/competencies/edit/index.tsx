import React, { Fragment, MouseEvent, ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';

import useClassnames, { IStyle } from 'hook/use-classnames';
import Button from 'component/button';
import Modal from 'component/modal';
import Tooltip from 'component/tooltip';
import IconDots from 'component/icons/dots';
import IconArrowLeft from 'component/icons/arrow-left-full';
import Error from 'component/error';
import InputDictionary from 'component/form/input-dictionary';
import CheckboxTree from 'component/checkbox-tree';

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

export interface INodeCheckboxTree {
    label: React.ReactNode,
    value: string,
    children?: Array<INodeCheckboxTree>,
    className?: string,
    disabled?: boolean,
    icon?: React.ReactNode,
    showCheckbox?: boolean,
    title?: string
}

export interface IFormValues {
    competencies: Array<IField>,
    competence_ids: Array<string>,
    position_id: {
        label: string,
        value: string
    } | null
}

export const CompetenciesEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
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
    const { data: positionData, refetch } = position.useGetPositionListQuery({ cv_id: parseInt(id, 10) }, { refetchOnMountOrArgChange: true });
    const [patchPosition, { isLoading }] = position.usePatchPositionByIdMutation();
    const [postPosition, { isLoading: isLoadingPost }] = position.usePostPositionMutation();
    const [postPositionCompetencies] = position.usePostPositionCompetenciesByIdMutation();

    const [activeWindow, setActiveWindow] = useState<'role' | 'competence' | 'checkbox' | null>('competence');
    const [checked, setChecked] = useState<Array<string>>([]);
    const [positionItem, setPositionItem] = useState<CvPositionRead>();
    const [error, setError] = useState<Array<string> | string | null>(null);

    const onClickDots = (positionItemParam: CvPositionRead) => () => {
        const newChecked = positionItemParam.competencies?.map((item) => String(item.competence_id)) || [];

        setPositionItem(positionItemParam);
        setChecked(newChecked);
        setActiveWindow('checkbox');
    };

    const onCancel = () => {
        props.onCancel?.();
        setChecked([]);
        setPositionItem(undefined);
        setActiveWindow(null);
    };

    const requestUpdateCompetencies = (competenciesArr: Array<string>, positionId: number) => {
        const dataComp = competenciesArr.map((item) => ({
            competence_id: parseInt(item, 10)
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
    };

    const onSubmit = methods.handleSubmit(
        (formData) => {
            if(positionItem) {
                return patchPosition({
                    id         : positionItem.id,
                    cv_id      : parseInt(id, 10),
                    position_id: positionItem.position_id
                })
                    .unwrap()
                    .then(() => {
                        requestUpdateCompetencies(formData.competence_ids, positionItem.id as number);
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

            return postPosition({
                cv_id      : parseInt(id, 10),
                position_id: parseInt(formData.position_id?.value as string, 10)
            })
                .unwrap()
                .then((resp) => {
                    requestUpdateCompetencies(formData.competence_ids, resp.id as number);
                })
                .catch((err) => {
                    console.error(err);

                    if(typeof err.data?.details === 'object') {
                        setError(Object.keys(err.data?.details).map((item) => `${item}: ${err.data?.details[item]}`));
                    } else {
                        setError(err.data?.status);
                    }
                });
        },
        (formError) => {
            console.info('ERR', formError);
        }
    );

    const onClickSetExperience = (competenceId: string) => {
        console.info('SET', competenceId);
    };

    const onClickSubmit = () => {
        if(activeWindow === 'role') {
            setActiveWindow('checkbox');
        } else {
            return onSubmit();
        }
    };

    const onClickBack = () => {
        if(activeWindow === 'role') {
            setActiveWindow('competence');
        } else if(activeWindow === 'checkbox') {
            setActiveWindow('competence');
        }
    };

    // const getNodeIds = (nodes: Array<INodeCheckboxTree>) => {
    //     let ids: Array<string> = [];
    //
    //     nodes.forEach(({ value, children }) => {
    //         const childNodes = children ? getNodeIds(children) : [];
    //
    //         ids = [...ids, value, ...childNodes];
    //     });
    //
    //     return ids;
    // };

    // const onClickExpand = (action: 'expand' | 'close') => () => {
    //     const newExpanded = action === 'expand' ? getNodeIds(options) : [];
    //
    //     setExpanded(newExpanded);
    // };

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
        // if(activeWindow === 'checkbox') {
        //     return (
        //         <div className={cn('competencies-edit__checkbox-controls')}>
        //             <span className={cn('competencies-edit__checkbox-control')} onClick={onClickExpand('expand')}>
        //                 {t('routes.person.blocks.competencies.edit.buttons.expand')}
        //             </span>
        //             <span className={cn('competencies-edit__checkbox-control')} onClick={onClickExpand('close')}>
        //                 {t('routes.person.blocks.competencies.edit.buttons.close')}
        //             </span>
        //         </div>
        //     );
        // }
    }, [activeWindow]);

    const elFooter = useMemo(() => {
        return (
            <div className={cn('competencies-edit__form-footer')}>
                {elAppend}
                <Button
                    isSecondary={true}
                    onClick={onCancel}
                    className={cn('competencies-edit__button-secondary')}
                    disabled={isLoadingPost || isLoading}
                >
                    {t('routes.person.blocks.competencies.edit.buttons.cancel')}
                </Button>
                <Button
                    onClick={onClickSubmit}
                    disabled={isLoadingPost || isLoading}
                    isLoading={isLoadingPost || isLoading}
                >
                    {t('routes.person.blocks.competencies.edit.buttons.save')}
                </Button>
            </div>
        );
    }, [activeWindow]);

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
                                    <IconDots
                                        svg={{
                                            width    : 24,
                                            height   : 24,
                                            className: cn('competencies-edit__icon-dots'),
                                            onClick  : onClickDots(pos)
                                        }}
                                    />
                                </div>
                                <div className={cn('competencies-edit__list-item')}>
                                    <strong>{t('routes.person.blocks.competencies.skills')}</strong>
                                    <div className={cn('competencies-edit__skills')}>
                                        {pos.competencies?.map((comp) => (
                                            <Tooltip
                                                key={comp.competence_id}
                                                content={comp.competence?.name}
                                                theme="dark"
                                            >
                                                <span className={cn('competencies-edit__skills-tag')}>{comp.competence?.name}</span>
                                            </Tooltip>
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
                        <CheckboxTree
                            competencies={checked}
                            onClickExperience={onClickSetExperience}
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

    const elHeader = useMemo(() => {
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
    }, [activeWindow]);

    return (
        <Modal className={cn('competencies-edit')} footer={elFooter} header={elHeader}>
            <FormProvider {...methods}>
                <form>
                    {elFormContent()}
                </form>
            </FormProvider>
        </Modal>
    );
};

export default CompetenciesEdit;
