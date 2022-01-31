import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { parse, stringify } from 'query-string';

import useRoles from 'hook/use-roles';

import SidebarLayout from 'component/layout/sidebar';
import Wrapper from 'component/section/wrapper';
import Section from 'component/section';
import SectionHeader from 'component/section/header';
import AddAction from 'component/section/actions/add';
import { H3 } from 'component/header';
import useClassnames from 'hook/use-classnames';
import Loader from 'component/loader';
import Avatar from 'component/avatar';
import FormInput from 'component/form/input';
import FormSelect from 'component/form/select';
import Button from 'component/button';
import useQuery from 'hook/use-query';
import InputMain from 'component/form/input-main';
import Empty from 'component/empty';
import Dropdown from 'component/dropdown';
import DropdownMenu from 'component/dropdown/menu';
import DropdownMenuItem from 'component/dropdown/menu-item';
import DotsAction from 'component/section/actions/dots';
import EditAction from 'component/section/actions/edit';
import EditModal from 'route/system-users/edit-modal';
import DeleteAction from 'component/section/actions/delete';

import { acc } from 'adapter/api/acc';
import { Code200 as Code200UserManagePatch } from 'adapter/types/acc/user-manage/id/patch/code-200';

import ConfirmModal from './confirm-modal';
import style from './index.module.pcss';

export const SystemUsers = () => {
    const { t, i18n } = useTranslation();
    const cn = useClassnames(style);
    const history = useHistory();
    const timer = useRef<ReturnType<typeof setTimeout>>();
    const query = useQuery();
    const qs = useMemo(() => parse(history.location.search), [history.location.search]);
    const context = useForm({
        mode         : 'onSubmit',
        defaultValues: qs
    });

    const { data: whoAmIData } = acc.useGetAccWhoAmIQuery(undefined);
    const { su, pfm, pm, admin } = useRoles(whoAmIData?.organizations_contractors_roles?.find((item) => item.organization_contractor_id)?.organization_contractor_id);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [userToEdit, setUserToEdit] = useState<Code200UserManagePatch>();
    const [userToDelete, setUserToDelete] = useState<Code200UserManagePatch>();

    const values = context.watch();

    const { data, requestId, isFetching, refetch } = acc.useGetUserManageQuery({
        search                    : query.get('search') || undefined,
        organization_contractor_id: query.get('organization_contractor_id') ? [query.get('organization_contractor_id') as string] : undefined,
        role                      : query.get('role') ? [query.get('role') as string] : undefined
    });

    useEffect(() => {
        if(timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            history.push({
                search: stringify(values, {
                    skipEmptyString: true
                })
            });
        }, 300);

        return () => {
            if(timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [JSON.stringify(values)]);

    const elLoading = useMemo(() => {
        if(isFetching) {
            return <Loader />;
        }
    }, [isFetching]);

    const onClickEdit = () => {
        setShowModal(true);
    };

    const elUsers = useMemo(() => {
        if(!isFetching) {
            if(!data?.results.length) {
                return <Empty>{t('routes.system-users.main.empty')}</Empty>;
            }

            return (
                <ul className={cn('system-users__users')}>
                    {data?.results.filter((userNotSelf) => userNotSelf.id !== whoAmIData?.id).map((user) => {
                        return (
                            <li
                                key={user.id}
                                className={cn('system-users__user')}
                            >
                                <Avatar />
                                <div
                                    className={cn('system-users__user-wrapper', {
                                        'system-users__user-wrapper_permissions': su || admin || pfm || pm
                                    })}
                                >
                                    <div className={cn('system-users__user-info')}>
                                        <div className={cn('system-users__name')}>
                                            {`${user.first_name} ${user.last_name}`}
                                            {!user.is_active && (
                                                <div className={cn('system-users__blocked')}>
                                                    {t('routes.system-users.blocked')}
                                                </div>
                                            )}
                                        </div>
                                        {user.organization_contractors_roles?.map((organization, index) => (
                                            <div
                                                key={index}
                                                className={cn('system-users__project')}
                                            >
                                                {organization.organization_contractor_name}
                                                <span> | </span>
                                                {t('routes.system-users.role', {
                                                    context: organization.role
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                    {(su || admin || pfm || pm) && (
                                        <div className={cn('system-users__actions')}>
                                            <Dropdown
                                                render={({ onClose }) => (
                                                    <DropdownMenu>
                                                        <DropdownMenuItem selected={false}>
                                                            <EditAction
                                                                onClick={() => {
                                                                    setUserToEdit(user);
                                                                    onClickEdit();
                                                                    onClose();
                                                                }}
                                                                label={t('routes.system-users.edit')}
                                                            />
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem selected={false}>
                                                            <DeleteAction
                                                                label={t('routes.system-users.delete')}
                                                                onClick={() => {
                                                                    setUserToDelete(user);
                                                                    onClose();
                                                                }}
                                                            />
                                                        </DropdownMenuItem>
                                                    </DropdownMenu>
                                                )}
                                            >
                                                <DotsAction />
                                            </Dropdown>
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            );
        }
    }, [JSON.stringify(data?.results), requestId, isFetching, i18n.language]);

    const onCloseModal = () => {
        setShowModal(false);
        setUserToEdit(undefined);
    };

    const onSuccess = () => {
        onCloseModal();
        refetch();
    };

    const elEditModal = () => {
        if(showModal && userToEdit) {
            return <EditModal fields={userToEdit} setVisible={onCloseModal} onSuccess={onSuccess} />;
        }
    };

    const onCloseDelete = () => {
        setUserToDelete(undefined);
    };

    const elConfirmModal = () => {
        if(userToDelete) {
            const userName = `${userToDelete.last_name || ''} ${userToDelete.first_name || ''} ${userToDelete.middle_name || ''}`.trim();

            return (
                <ConfirmModal
                    userName={userName}
                    userId={userToDelete.id}
                    setVisible={onCloseDelete}
                />
            );
        }
    };

    return (
        <SidebarLayout
            sidebar={(
                <div className={cn('system-users__sidebar')}>
                    <Section>
                        <Wrapper>
                            <H3>{t('routes.system-users.sidebar.filters.title')}</H3>
                            <FormProvider {...context}>
                                <form className={cn('system-users__form')}>
                                    <FormInput
                                        name="search"
                                        type="search"
                                        placeholder={t('routes.system-users.sidebar.filters.form.search.placeholder')}
                                    />
                                    <InputMain
                                        name="organization_contractor_id"
                                        direction="column"
                                        requestType={InputMain.requestType.Contractor}
                                        label={t('routes.system-users.sidebar.filters.form.organization_contractor_id.label')}
                                        placeholder={t('routes.system-users.sidebar.filters.form.organization_contractor_id.placeholder')}
                                        isMulti={false}
                                    />
                                    <FormSelect
                                        name="role"
                                        label={t('routes.system-users.sidebar.filters.form.role.label')}
                                        direction="column"
                                        placeholder={t('routes.system-users.sidebar.filters.form.role.placeholder')}
                                        clearable={true}
                                        options={[{
                                            label: t('routes.system-create.form.roles.admin'),
                                            value: 'admin'
                                        }, {
                                            label: t('routes.system-create.form.roles.pfm'),
                                            value: 'pfm'
                                        }, {
                                            label: t('routes.system-create.form.roles.pm'),
                                            value: 'pm'
                                        }, {
                                            label: t('routes.system-create.form.roles.rm'),
                                            value: 'rm'
                                        }]}
                                    />
                                    <Button
                                        type="reset"
                                        isSecondary={true}
                                        disabled={isFetching}
                                        children={t('routes.system-users.sidebar.filters.buttons.clear')}
                                        onClick={() => {
                                            context.setValue('organization_contractor_id', '');
                                            history.replace({
                                                search: ''
                                            });
                                        }}
                                    />
                                </form>
                            </FormProvider>
                        </Wrapper>
                    </Section>
                </div>
            )}
        >
            <Section>
                <Wrapper>
                    <SectionHeader actions={(su || admin || pfm || pm) && <AddAction to="/system-users/create" />}>
                        {t('routes.system-users.main.title')}
                    </SectionHeader>
                    {elLoading}
                    {elUsers}
                    {elEditModal()}
                    {elConfirmModal()}
                </Wrapper>
            </Section>
        </SidebarLayout>
    );
};
