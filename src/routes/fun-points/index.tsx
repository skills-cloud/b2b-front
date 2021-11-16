import React, { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import { IParams, ORGANIZATION_PROJECT_MODULE_ID } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';

import Section from 'component/section';
import SidebarLayout from 'component/layout/sidebar';
import SidebarNav, { NavItem } from 'component/nav';
import SectionHeader from 'component/section/header';
import Wrapper from 'component/section/wrapper';
import EditAction from 'component/section/actions/edit';

import { mainRequest } from 'adapter/api/main';

import style from './index.module.pcss';
import AddAction from 'component/section/actions/add';
import Loader from 'component/loader';
import Separator from 'component/separator';
import SectionContentList from 'component/section/content-list';
import { Link } from 'react-router-dom';
import { H4 } from 'component/header';
import IconChevronRight from 'component/icons/chevron-right';
import IconArrowLeftFull from 'component/icons/arrow-left-full';
import Dropdown from 'component/dropdown';
import DotsAction from 'component/section/actions/dots';
import DropdownMenu from 'component/dropdown/menu';
import DropdownMenuItem from 'component/dropdown/menu-item';
import DeleteAction from 'component/section/actions/delete';

enum ESectionInvariants {
    FunPoints = 'fun-points'
}

const FunctionalPoints = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const history = useHistory();
    const { moduleId } = useParams<IParams>();

    const [visible, setVisible] = useState<boolean>(false);

    const { data, isLoading } = mainRequest.useGetMainModuleByIdQuery({ id: moduleId });

    const onClickAdd = () => {
        setVisible(true);
    };

    const onClickEdit = () => {
        console.info('EDIT');
    };

    const onClickDelete = () => {
        console.info('DELETE');
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
                                                <EditAction onClick={onClickEdit} label={t('routes.fun-points.actions.edit')} />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem selected={false} onClick={onClose}>
                                                <DeleteAction onClick={onClickDelete} label={t('routes.fun-points.actions.delete')} />
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
        <SidebarLayout sidebar={elSidebar()}>
            <Section id={ESectionInvariants.FunPoints}>
                <SectionHeader actions={elAddAction()}>
                    {t('routes.fun-points.title')}
                </SectionHeader>
                {elContent()}
            </Section>
        </SidebarLayout>
    );
};

export default FunctionalPoints;
