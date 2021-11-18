import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import { useClassnames } from 'hook/use-classnames';

import Textarea from 'component/form/textarea';
import Input from 'component/form/input';
import InputMain from 'component/form/input-main';
import InputSelect, { IValue } from 'component/form/select';
import Error from 'component/error';
import AddAction from 'component/section/actions/add';
import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';

import { ModuleFunPointInline } from 'adapter/types/main/module/get/code-200';
import { mainRequest } from 'adapter/api/main';

import style from './index.module.pcss';
import { FunPointTypeWrite } from 'adapter/types/main/fun-point-type/post/code-201';
import IconArrowLeftFull from 'component/icons/arrow-left-full';
import { H2 } from 'component/header';

const FORM_FUN_POINT_CREATE_ID = 'FORM_FUN_POINT_CREATE_ID';
const FORM_DIFFICULTY_LEVEL = 'FORM_DIFFICULTY_LEVEL';

interface IFormValues extends Omit<ModuleFunPointInline, 'difficulty_level' | 'fun_point_type'> {
    fun_point_type?: IValue,
    difficulty_level?: IValue
}

interface IProjectsRequestForm {
    onSuccess: (id: number) => void,
    defaultValues?: ModuleFunPointInline,
    setVisible: (visible: boolean) => void
}

const FunPointCreateForm = ({ onSuccess, defaultValues, setVisible }: IProjectsRequestForm) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const params = useParams<IParams>();

    const [error, setError] = useState<string | null>(null);
    const [typeId, setTypeId] = useState<string>('');
    const [addDiffLevel, setAddDiffLevel] = useState<boolean>(false);
    const [isRefetchTypes, setIsRefetchTypes] = useState<boolean>(false);
    const [newFunPoint, setNewFunPoint] = useState<FunPointTypeWrite>();

    const form = useForm<IFormValues>({
        defaultValues: {
            ...defaultValues,
            fun_point_type: defaultValues?.fun_point_type ? {
                value: String(defaultValues?.fun_point_type.id),
                label: defaultValues?.fun_point_type.name
            } : undefined,
            difficulty_level: defaultValues?.difficulty_level ? {
                value: String(defaultValues?.difficulty_level.id),
                label: defaultValues?.difficulty_level.name
            } : undefined
        }
    });
    const values = form.watch();

    const { data } = mainRequest.useGetMainFunPointTypeQuery(undefined);
    const { data: typeById, isLoading: isLoadingType } = mainRequest.useGetMainFunPointTypeByIdQuery({
        id: typeId
    }, {
        skip: !typeId
    });
    const [post] = mainRequest.usePostMainModuleFunPointMutation();
    const [postFunPointType, { isLoading: isLoadingCreateFunPoint }] = mainRequest.usePostMainFunPointTypeMutation();
    const [patch] = mainRequest.usePatchMainModuleFunPointMutation();

    const onCreateOption = (createdOption: string) => {
        postFunPointType({
            name           : createdOption,
            organization_id: parseInt(params.organizationId, 10)
        })
            .unwrap()
            .then((resp) => {
                if(resp) {
                    setIsRefetchTypes(true);
                    setNewFunPoint(resp);

                    form.setValue('fun_point_type', {
                        value: String(resp.id),
                        label: resp.name
                    });
                }
            })
            .catch(console.error);
    };

    const onClickBack = () => {
        setAddDiffLevel(false);
    };

    const onClickAdd = () => {
        setAddDiffLevel(true);
    };

    useEffect(() => {
        if(values.fun_point_type) {
            setTypeId(values.fun_point_type.value);
        }
    }, [JSON.stringify(values)]);

    const onSubmit = form.handleSubmit((formData) => {
        const method = defaultValues ? patch : post;

        console.log('FORM DATA', formData)

        const request = method({});

        request
            .unwrap()
            .then((response) => {
                const id = response.id;

                if(id) {
                    onSuccess(id);
                }
            })
            .catch((err) => {
                setError(err.data?.message);
                console.error(err);
            });
    });

    const onSubmitDiff = form.handleSubmit(
        (formData) => {
            console.log('FORM DATA', formData)
        }
    );

    const errorMessage = t('routes.fun-points.create.required-error');

    const elError = useMemo(() => {
        if(error) {
            return <Error elIcon={true}>{error}</Error>;
        }
    }, [error]);

    const elContent = () => {
        if(addDiffLevel) {
            return (
                <FormProvider {...form}>
                    <form
                        method="POST"
                        id={FORM_DIFFICULTY_LEVEL}
                        onSubmit={onSubmitDiff}
                        className={cn('fun-point__form')}
                    >
                        <Input name="123" type="text" />
                    </form>
                </FormProvider>
            );
        }

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
                    <InputMain
                        required={true}
                        direction="column"
                        name="fun_point_type"
                        isRefetch={isRefetchTypes}
                        onRefetchSuccess={setIsRefetchTypes}
                        onCreateOption={onCreateOption}
                        createable={true}
                        requestType={InputMain.requestType.FunPointType}
                        defaultValue={[defaultValues?.fun_point_type_id as number]}
                        isMulti={false}
                        label={t('routes.fun-points.create.form.fun-point-type.label')}
                        placeholder={t('routes.fun-points.create.form.fun-point-type.placeholder')}
                    />
                    <div className={cn('fun-point__fields')}>
                        <InputSelect
                            direction="column"
                            required={true}
                            disabled={!typeById || isLoadingType || isLoadingCreateFunPoint}
                            isLoading={isLoadingType}
                            name="difficulty_level"
                            options={typeById?.difficulty_levels?.map((item) => ({
                                value: String(item.id),
                                label: item.name
                            })) || []}
                            label={t('routes.fun-points.create.form.difficulty.label')}
                            placeholder={t('routes.fun-points.create.form.difficulty.placeholder')}
                        />
                        <AddAction onClick={onClickAdd} />
                    </div>
                    <Textarea
                        name="description"
                        label={t('routes.fun-points.create.description')}
                        rows={6}
                    />
                    {elError}
                </form>
            </FormProvider>
        );
    };

    const elHeader = () => {
        let contextValue = 'default';

        if(defaultValues) {
            contextValue = 'edit';
        }

        if(addDiffLevel) {
            contextValue = 'diff';
        }

        return (
            <div className={cn('fun-point__modal-header', { 'fun-point__modal-header_back': addDiffLevel })}>
                {addDiffLevel && (
                    <IconArrowLeftFull
                        svg={{
                            onClick  : onClickBack,
                            className: cn('fun-point__icon-back')
                        }}
                    />
                )}
                <H2>
                    {t('routes.fun-points.create.title', {
                        context: contextValue
                    })}
                </H2>
            </div>
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
                    <Button type="submit" form={addDiffLevel ? FORM_DIFFICULTY_LEVEL : FORM_FUN_POINT_CREATE_ID}>
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
