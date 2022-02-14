import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import { useClassnames } from 'hook/use-classnames';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';
import { H2, H4 } from 'component/header';
import Input from 'component/form/input';
import InputType from 'component/form/input-type';
import InputDifficulty from 'component/form/input-difficulty';
import { IValue } from 'component/form/select';
import Textarea from 'component/form/textarea';
import InputDictionary from 'component/form/input-dictionary';
import DeleteAction from 'component/section/actions/delete';
import AddAction from 'component/section/actions/add';
import IconApply from 'component/icons/apply';
import Loader from 'component/loader';

import { FunPointTypePositionLaborEstimateInline } from 'adapter/types/main/module/id/get/code-200';
import { ModuleFunPointInline } from 'adapter/types/main/module/get/code-200';
import { mainRequest } from 'adapter/api/main';

import style from './index.module.pcss';
import ErrorsComponent from 'component/error/errors';

export const FORM_FUN_POINT_CREATE_ID = 'FORM_FUN_POINT_CREATE_ID';

interface IProjectsRequestForm {
    onSuccess: (id: number) => void,
    defaultValues?: ModuleFunPointInline,
    setVisible: (visible: boolean) => void
}

interface IFunPointPositionLaborFormValue extends Omit<FunPointTypePositionLaborEstimateInline, 'position'> {
    position: IValue
}

interface IFormValues extends ModuleFunPointInline {
    fun_point_type_select?: IValue,
    difficulty_level_select?: IValue,
    positions_labor_estimates?: Array<IFunPointPositionLaborFormValue>
}

const TIMEOUT = 1000;

const FunPointCreateForm = ({ onSuccess, defaultValues, setVisible }: IProjectsRequestForm) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const params = useParams<IParams>();

    const [typeId, setTypeId] = useState<string>('');
    const [showLabors, setShowLabors] = useState<boolean>(false);
    const [isSuccessDiff, setIsSuccessDiff] = useState<boolean>();
    const [isSuccessLabor, setIsSuccessLabor] = useState<Array<number>>([]);
    const [isLoadingPostLabor, setIsLoadingPostLabor] = useState<Array<number>>([]);

    useEffect(() => {
        let id = 0;

        if(isSuccessDiff) {
            id = window.setTimeout(() => {
                setIsSuccessDiff(false);
            }, TIMEOUT);
        }

        return () => {
            window.clearTimeout(id);
        };
    }, [isSuccessDiff]);

    useEffect(() => {
        let ids: Array<number> = [];

        if(isSuccessLabor) {
            isSuccessLabor.forEach((successId) => {
                ids.push(window.setTimeout(() => {
                    setIsSuccessLabor((oldState) => {
                        const newState = [...oldState];

                        if(newState.includes(successId)) {
                            const indexOfItem = newState.findIndex((item) => item === successId);

                            newState.splice(indexOfItem, 1);
                        }

                        return newState;
                    });
                }, TIMEOUT));
            });
        }

        return () => {
            ids.forEach((id) => window.clearTimeout(id));
            ids = [];
        };
    }, [isSuccessLabor]);

    const defaultValuesForm = () => {
        if(defaultValues) {
            const { fun_point_type } = defaultValues;

            return {
                ...defaultValues,
                fun_point_type_select: {
                    value: String(fun_point_type?.id),
                    label: fun_point_type?.name
                },
                positions_labor_estimates: fun_point_type?.positions_labor_estimates?.map((labor) => ({
                    ...labor,
                    position: {
                        value: String(labor.position?.id),
                        label: labor.position?.name
                    }
                }))
            };
        }
    };

    const form = useForm<IFormValues>({
        defaultValues: defaultValuesForm()
    });
    const values = form.watch();

    const { fields, append, remove } = useFieldArray({
        keyName: 'fieldId',
        control: form.control,
        name   : 'positions_labor_estimates'
    });

    const { data: typeById, isLoading: isLoadingType } = mainRequest.useGetMainFunPointTypeByIdQuery({
        id: typeId
    }, {
        skip                     : !typeId,
        refetchOnMountOrArgChange: true
    });

    const [post, { error, isError, isLoading }] = mainRequest.usePostMainModuleFunPointMutation();
    const [patch, { error: patchError, isError: isPatchError, isLoading: isPatchLoading }] = mainRequest.usePatchMainModuleFunPointMutation();
    const [postFunPointType] = mainRequest.usePostMainFunPointTypeMutation();
    const [postDifficultyLevel] = mainRequest.usePostMainFunPointDifficultyLevelMutation();
    const [patchTypeDifficultyLevel, { isLoading: isLoadingPatchDiffLevel }] = mainRequest.usePatchMainFunPointDifficultyLevelMutation();
    const [postTypePositionLabor] = mainRequest.usePostMainFunPointTypePositionLaborEstimatesMutation();
    const [deleteTypePositionLabor] = mainRequest.useDeleteMainFunPointTypePositionLaborEstimatesMutation();
    const [patchTypePositionLabor] = mainRequest.usePatchMainFunPointTypePositionLaborEstimatesMutation();

    const errorMessage = t('routes.fun-points.create.required-error');

    useEffect(() => {
        if(values.fun_point_type_select) {
            setTypeId(values.fun_point_type_select.value);
        }
    }, [values.fun_point_type_select]);

    useEffect(() => {
        setShowLabors(false);

        if(typeById?.positions_labor_estimates) {
            const newLabor = typeById?.positions_labor_estimates.map((item) => ({
                ...item,
                position: {
                    value: String(item.position?.id),
                    label: item.position?.name || ''
                }
            }));

            form.setValue('positions_labor_estimates', newLabor);
        }
    }, [typeId]);

    const onChangeDifficultyLevel = (value: IValue) => {
        // @ts-ignore
        form.setValue('difficulty_level.factor', value.payload.factor);
    };

    const onCreateOptionPoint = (createdOption: string) => {
        postFunPointType({
            name                    : createdOption,
            organization_customer_id: parseInt(params.organizationId, 10)
        })
            .unwrap()
            .then((resp) => {
                if(resp) {
                    form.setValue('fun_point_type_select', {
                        value: String(resp.id),
                        label: resp.name
                    });
                }
            })
            .catch(console.error);
    };

    const onCreateOptionDiff = (createdOption: string) => {
        postDifficultyLevel({
            name             : createdOption,
            fun_point_type_id: parseInt(typeId, 10)
        })
            .unwrap()
            .then((resp) => {
                if(resp) {
                    form.setValue('difficulty_level_select', {
                        value: String(resp.id),
                        label: resp.name
                    });
                    form.setValue('difficulty_level.factor', 0);
                }
            })
            .catch(console.error);
    };

    const onClickShowLabors = () => {
        setShowLabors((oldState) => !oldState);
    };

    const onSubmit = form.handleSubmit((formData) => {
        const method = defaultValues ? patch : post;

        const request = method({
            ...formData,
            difficulty_level_id: parseInt(formData.difficulty_level_select?.value as string, 10),
            fun_point_type_id  : parseInt(formData.fun_point_type_select?.value as string, 10),
            module_id          : parseInt(params.moduleId, 10)
        });

        request
            .unwrap()
            .then((response) => {
                const id = response.id;

                if(id) {
                    onSuccess(id);
                }
            })
            .catch(console.error);
    });

    const onSubmitLabor = (labor: { position: IValue, id?: number, hours?: number }) => () => {
        void form.handleSubmit((formData) => {
            const laborById = formData?.fun_point_type?.positions_labor_estimates?.find((item) => item.id === labor.id);
            const method = laborById ? patchTypePositionLabor : postTypePositionLabor;
            const length = formData?.positions_labor_estimates?.length || 0;
            const lastElement = length >= 1 ? formData?.positions_labor_estimates?.[length - 1] : undefined;

            const data = {
                id               : laborById ? laborById.id : undefined,
                fun_point_type_id: parseInt(formData.fun_point_type_select?.value as string, 10),
                position_id      : parseInt(lastElement?.position?.value || labor.position?.value, 10),
                hours            : lastElement?.hours
            };

            setIsLoadingPostLabor((oldState) => {
                const newState = [...oldState];

                if(labor.id && !newState.includes(labor.id)) {
                    newState.push(labor.id);
                }

                return newState;
            });

            method(data)
                .unwrap()
                .then(() => {
                    setIsSuccessLabor((oldState) => {
                        const newState = [...oldState];

                        if(labor.id && !newState.includes(labor.id)) {
                            newState.push(labor.id);
                        }

                        return newState;
                    });

                    setIsLoadingPostLabor((oldState) => {
                        const newState = [...oldState];

                        if(labor.id && newState.includes(labor.id)) {
                            const findItemIndex = newState.findIndex((item) => item === labor.id);

                            newState.splice(findItemIndex, 1);
                        }

                        return newState;
                    });
                })
                .catch(console.error);
        })();
    };

    const onClickDelete = (id?: number, index?: number) => () => {
        if(id) {
            deleteTypePositionLabor({
                id: String(id)
            })
                .unwrap()
                .then(() => {
                    // TODO конфирм
                    if(index) {
                        remove(index);
                    }
                })
                .catch(console.error);
        }
    };

    const onSubmitDifficulty = form.handleSubmit((formData) => {
        const data = {
            fun_point_type_id: parseInt(formData.fun_point_type_select?.value as string, 10),
            name             : formData.difficulty_level_select?.label || '',
            id               : parseInt(formData.difficulty_level_select?.value as string, 10),
            factor           : formData.difficulty_level?.factor
        };

        patchTypeDifficultyLevel(data)
            .unwrap()
            .then(() => {
                setIsSuccessDiff(true);
            })
            .catch(console.error);
    });

    const elStatus = (isStatusLoading?: boolean, isSuccess?: boolean) => {
        if(isStatusLoading) {
            return <Loader />;
        }

        if(isSuccess) {
            return <IconApply svg={{ className: cn('fun-point__icon-success') }} />;
        }
    };

    const elContent = () => {
        return (
            <FormProvider {...form}>
                <form
                    method="POST"
                    id={FORM_FUN_POINT_CREATE_ID}
                    onSubmit={onSubmit}
                    className={cn('fun-point__form')}
                >
                    <Input
                        required={errorMessage}
                        type="text"
                        name="name"
                        label={t('routes.fun-points.create.form-title')}
                    />
                    <div className={cn('fun-point__fields')}>
                        <div className={cn('fun-point__field-wrapper')}>
                            <InputType
                                required={true}
                                direction="column"
                                name="fun_point_type_select"
                                defaultValue={defaultValues?.fun_point_type_id as number}
                                isMulti={false}
                                createable={true}
                                onCreateOption={onCreateOptionPoint}
                                label={t('routes.fun-points.create.form.fun-point-type.label')}
                                placeholder={t('routes.fun-points.create.form.fun-point-type.placeholder')}
                            />
                            {typeId && (
                                <span className={cn('fun-point__field-show')} onClick={onClickShowLabors}>
                                    {t('routes.fun-points.create.form.labors.button', {
                                        context: showLabors ? 'hide' : 'show'
                                    })}
                                </span>
                            )}
                        </div>
                        {showLabors && (
                            <div className={cn('fun-point__labors')}>
                                <div className={cn('fun-point__labors-header')}>
                                    <H4>{t('routes.fun-points.create.form.labors.title')}</H4>
                                    <AddAction onClick={() => append({})} />
                                </div>
                                {fields.map((labor, index) => (
                                    <div key={labor.fieldId} className={cn('fun-point__labor')}>
                                        <InputDictionary
                                            isMulti={false}
                                            name={`positions_labor_estimates.${index}.position`}
                                            requestType={InputDictionary.requestType.Position}
                                            defaultValue={[labor.position_id]}
                                        />
                                        <Input name={`positions_labor_estimates.${index}.fun_point_type_id`} type="hidden" />
                                        <Input name={`positions_labor_estimates.${index}.position_id`} type="hidden" />
                                        <Input name={`positions_labor_estimates.${index}.hours`} type="text" />
                                        <div className={cn('fun-point__status')}>
                                            {labor.id && elStatus(isLoadingPostLabor.includes(labor.id), isSuccessLabor.includes(labor.id))}
                                        </div>
                                        <Button
                                            onClick={onSubmitLabor(labor)}
                                            disabled={(!!labor.id && isLoadingPostLabor.includes(labor.id)) || (!!labor.id && isSuccessLabor.includes(labor.id))}
                                            isLoading={!!labor.id && isLoadingPostLabor.includes(labor.id)}
                                        >
                                            {t('routes.fun-points.create.form.labors.submit')}
                                        </Button>
                                        <DeleteAction onClick={onClickDelete(labor.id, index)} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {typeId && (
                        <Fragment>
                            <div className={cn('fun-point__fields')}>
                                <InputDifficulty
                                    direction="column"
                                    required={true}
                                    disabled={!typeById || isLoadingType}
                                    isLoading={isLoadingType}
                                    createable={true}
                                    onChange={onChangeDifficultyLevel}
                                    onCreateOption={onCreateOptionDiff}
                                    defaultValue={defaultValues?.difficulty_level_id}
                                    funTypeId={parseInt(typeId, 10)}
                                    name="difficulty_level_select"
                                    label={t('routes.fun-points.create.form.difficulty.label')}
                                    placeholder={t('routes.fun-points.create.form.difficulty.placeholder')}
                                />
                                <div className={cn('fun-point__field-controls')}>
                                    <Input
                                        disabled={!typeById || isLoadingType}
                                        name="difficulty_level.factor" type="text"
                                        label={t('routes.fun-points.create.form.difficulty.coefficient')}
                                    />
                                    <div className={cn('fun-point__status')}>
                                        {elStatus(isLoadingPatchDiffLevel, isSuccessDiff)}
                                    </div>
                                    <Button
                                        disabled={!typeById || isLoadingPatchDiffLevel || isSuccessDiff}
                                        isLoading={isLoadingPatchDiffLevel}
                                        type="button"
                                        onClick={onSubmitDifficulty}
                                    >
                                        {t('routes.fun-points.create.form.difficulty.save')}
                                    </Button>
                                </div>
                            </div>
                            <Textarea
                                name="description"
                                label={t('routes.fun-points.create.description')}
                            />
                        </Fragment>
                    )}
                    <ErrorsComponent
                        error={error || patchError}
                        isError={isError || isPatchError}
                        isLoading={isLoading || isPatchLoading}
                    />
                </form>
            </FormProvider>
        );
    };

    const elHeader = () => {
        let contextValue = 'default';

        if(defaultValues) {
            contextValue = 'edit';
        }

        return (
            <H2>
                {t('routes.fun-points.create.title', {
                    context: contextValue
                })}
            </H2>
        );
    };

    return (
        <Modal
            onClose={() => setVisible?.(false)}
            header={elHeader()}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true}
                        onClick={() => {
                            setVisible?.(false);
                        }}
                    >
                        {t('routes.fun-points.create.cancel')}
                    </Button>
                    <Button type="submit" form={FORM_FUN_POINT_CREATE_ID}>
                        {t('routes.fun-points.create.save')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            {elContent()}
        </Modal>
    );
};

export default FunPointCreateForm;
