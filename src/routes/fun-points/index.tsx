import React, { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';

import Section from 'component/section';
import SidebarLayout from 'component/layout/sidebar';
import SidebarNav from 'component/nav';
import SectionHeader from 'component/section/header';
import EditAction from 'component/section/actions/edit';
import AddAction from 'component/section/actions/add';
import Loader from 'component/loader';
import Separator from 'component/separator';
import SectionContentList from 'component/section/content-list';
import { H4 } from 'component/header';
import IconArrowLeftFull from 'component/icons/arrow-left-full';
import Dropdown from 'component/dropdown';
import DotsAction from 'component/section/actions/dots';
import DropdownMenu from 'component/dropdown/menu';
import DropdownMenuItem from 'component/dropdown/menu-item';
import DeleteAction from 'component/section/actions/delete';

import { mainRequest } from 'adapter/api/main';

import FunPointCreateForm from './form';
import ConfirmModalDeleteFunPoint from './confirm-modal';
import style from './index.module.pcss';

enum ESectionInvariants {
    FunPoints = 'fun-points'
}

enum ESteps {
    List,
    DetailForm,
    DeleteForm,
}

const FunctionalPoints = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const history = useHistory();
    const { moduleId } = useParams<IParams>();

    const [step, setStep] = useState<ESteps>(ESteps.List);
    const [funPointId, setFunPointId] = useState<number | null>(null);
    const [funPointName, setFunPointName] = useState<string>();

    const { data, isLoading } = mainRequest.useGetMainModuleByIdQuery({ id: moduleId });

    const formValues = useMemo(() => {
        if(funPointId !== null) {
            return data?.fun_points?.find((item) => item.id === funPointId);
        }
    }, [JSON.stringify(data?.fun_points), funPointId]);

    const onClickAdd = () => {
        setStep(ESteps.DetailForm);
        setFunPointId(null);
        setFunPointName(undefined);
    };

    const backToList = () => {
        setFunPointId(null);
        setFunPointName(undefined);
        setStep(ESteps.List);
    };

    const onClickEdit = (id?: number) => () => {
        if(id) {
            setStep(ESteps.DetailForm);
            setFunPointId(id);
        }
    };

    const onClickDelete = (id?: number, name?: string) => () => {
        if(id && name) {
            setStep(ESteps.DeleteForm);
            setFunPointId(id);
            setFunPointName(name);
        }
    };

    const onClickBack = () => {
        history.goBack();
    };

    const elAddAction = () => {
        return <AddAction onClick={onClickAdd} />;
    };

    const elSidebarHeader = useMemo(() => {
        return (
            <div className={cn('fun-points__header')}>
                <IconArrowLeftFull svg={{ className: cn('fun-points__icon-back'), onClick: onClickBack }} />
                {data?.name}
            </div>
        );
    }, [data?.name]);

    const elSidebar = () => {
        return (
            <Section withoutPaddings={true}>
                <SidebarNav header={elSidebarHeader} />
            </Section>
        );
    };
    const elCreateEditModal = () => {
        if(step === ESteps.DetailForm) {
            return (
                <FunPointCreateForm
                    setVisible={backToList}
                    defaultValues={formValues}
                    onSuccess={backToList}
                />
            );
        }
    };

    const elContent = () => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.fun_points?.length) {
            return data?.fun_points.map((funPoint, index) => {
                return (
                    <Fragment key={funPoint.id}>
                        {index > 0 && <Separator />}
                        <SectionContentList>
                            <div
                                className={cn('fun-points__item-title')}
                            >
                                <H4>{funPoint.name}</H4>
                                <Dropdown
                                    render={({ onClose }) => (
                                        <DropdownMenu>
                                            <DropdownMenuItem selected={false} onClick={onClose}>
                                                <EditAction onClick={onClickEdit(funPoint.id as number)} label={t('routes.fun-points.actions.edit')} />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem selected={false} onClick={onClose}>
                                                <DeleteAction onClick={onClickDelete(funPoint.id as number, funPoint.name)} label={t('routes.fun-points.actions.delete')} />
                                            </DropdownMenuItem>
                                        </DropdownMenu>
                                    )}
                                >
                                    <DotsAction />
                                </Dropdown>
                            </div>
                            <div className={cn('fun-points__item-content')}>
                                <div className={cn('fun-points__item-content-block')}>
                                    <h5 className={cn('fun-points__item-content-block-title')}>
                                        {t('routes.fun-points.content.norma.title')}
                                    </h5>
                                    {/* TODO Не хватает данных в апи */}
                                    <p className={cn('fun-points__item-content-block-text')}>
                                        {t('routes.fun-points.content.norma.value', {
                                            count: funPoint.difficulty_level?.factor
                                        })}
                                    </p>
                                </div>
                                <div className={cn('fun-points__item-content-block')}>
                                    <h5 className={cn('fun-points__item-content-block-title')}>
                                        {t('routes.fun-points.content.difficulty')}
                                    </h5>
                                    <p className={cn('fun-points__item-content-block-text')}>
                                        {funPoint.difficulty_level?.name}
                                    </p>
                                </div>
                                <div className={cn('fun-points__item-content-block')}>
                                    <h5 className={cn('fun-points__item-content-block-title')}>
                                        {t('routes.fun-points.content.coefficient')}
                                    </h5>
                                    <p className={cn('fun-points__item-content-block-text')}>
                                        {funPoint.difficulty_level?.factor}
                                    </p>
                                </div>
                            </div>
                        </SectionContentList>
                    </Fragment>
                );
            });
        }

        return (
            <div className={cn('fun-points__empty')}>
                {t('routes.fun-points.empty')}
            </div>
        );
    };

    return (
        <Fragment>
            <SidebarLayout sidebar={elSidebar()}>
                <Section id={ESectionInvariants.FunPoints}>
                    <SectionHeader actions={elAddAction()}>
                        {t('routes.fun-points.title')}
                    </SectionHeader>
                    {elContent()}
                </Section>
            </SidebarLayout>
            {step === ESteps.DeleteForm && funPointId && (
                <ConfirmModalDeleteFunPoint
                    setVisible={backToList}
                    onSuccess={backToList}
                    funPointId={String(funPointId)}
                    funPointName={funPointName}
                />
            )}
            {elCreateEditModal()}
        </Fragment>
    );
};

export default FunctionalPoints;
