import React, { useEffect, useMemo, useState, Fragment } from 'react';
import { useHistory, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { parse, stringify } from 'query-string';
import { useForm, FormProvider } from 'react-hook-form';

import { IParams } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';
import { normalizeObject } from 'src/helper/normalize-object';
import useRoles from 'hook/use-roles';

import SectionHeader from 'component/section/header';
import { H3 } from 'component/header';
import SidebarLayout from 'component/layout/sidebar';
import Section from 'component/section';
import AddAction from 'component/section/actions/add';
import Loader from 'component/loader';
import Button from 'component/button';
import Wrapper from 'component/section/wrapper';
import { IValue } from 'component/form/select';
import Input from 'component/form/input';
import InputCv from 'component/form/input-cv';
import Dropdown from 'component/dropdown';
import DropdownMenu from 'component/dropdown/menu';
import DropdownMenuItem from 'component/dropdown/menu-item';
import IconDots from 'component/icons/dots';
import EditAction from 'component/section/actions/edit';
import DeleteAction from 'component/section/actions/delete';
import ConfirmModal from 'route/timesheet/confirm-modal';
import EditModal from 'route/timesheet/edit-modal';
import Empty from 'component/empty';

import { mainRequest } from 'adapter/api/main';
import { TimeSheetRowRead } from 'adapter/types/main/time-sheet-row/get/code-200';

import style from './index.module.pcss';

export interface IFormValues {
    task_name?: string,
    cv_id?: Array<IValue> | null
}

const Timesheets = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams<IParams>();
    const qs = useMemo(() => parse(history.location.search), [history.location.search]);
    const defaultValues = {
        task_name: '',
        cv_id    : []
    };
    const context = useForm<IFormValues>({
        mode: 'all',
        defaultValues
    });

    const [showModal, setShowModal] = useState<boolean>(false);
    const [editTimesheet, setEditTimesheet] = useState<TimeSheetRowRead | null>(null);
    const [deleteId, setDeleteId] = useState<number>();

    const { data: requestData } = mainRequest.useGetMainRequestByIdQuery(
        { id: params.requestId },
        { refetchOnMountOrArgChange: true }
    );

    const obj = normalizeObject({ organization_project_id: [requestData?.module?.organization_project_id || params.projectId] });

    const { data, isLoading, refetch } = mainRequest.useGetMainTimeSheetRowQuery({
        ...obj,
        ...qs
    }, {
        skip: !requestData?.module?.organization_project_id && !params.projectId
    });

    const { su, admin, pm, rm } = useRoles(requestData?.module?.organization_project?.organization_contractor_id);

    useEffect(() => {
        if(Object.values(qs).length) {
            const newDefaultValues = {
                ...defaultValues,
                ...qs
            };

            context.reset(newDefaultValues);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [JSON.stringify(qs)]);

    const onClickAdd = () => {
        setShowModal(true);
    };

    const onClearFilter = () => {
        history.replace({
            search: ''
        });
        context.reset(defaultValues);
    };

    const onSubmit = context.handleSubmit(
        (formData) => {
            const objectToNormalize = {
                task_name: formData.task_name,
                cv_id    : formData.cv_id?.map((item) => item?.value)
            };

            history.replace({
                search: stringify(normalizeObject(objectToNormalize))
            });
        },
        (formError) => {
            console.error(formError);
        }
    );

    const onClickEdit = (item: TimeSheetRowRead, onClose?: () => void) => () => {
        setEditTimesheet(item);
        onClose?.();
    };

    const onClickDelete = (id?: number, onClose?: () => void) => () => {
        setDeleteId(id);
        onClose?.();
    };

    const elInputCv = () => {
        const startValue = {
            id: data?.results.map((item) => item.cv_id)
        };

        if(startValue?.id?.length) {
            return (
                <InputCv
                    requestType={InputCv.requestType.Cv}
                    defaultValue={[qs.cv_id] as Array<string>}
                    filters={startValue}
                    direction="column"
                    isMulti={true}
                    placeholder={t('routes.timesheet.sidebar.form.specialist.placeholder')}
                    label={t('routes.timesheet.sidebar.form.specialist.title')}
                    name="cv_id"
                />
            );
        }
    };

    const elSidebar = () => {
        return (
            <Section>
                <Wrapper>
                    <H3>{t('routes.timesheet.sidebar.title')}</H3>
                    <FormProvider {...context}>
                        <form className={cn('timesheet__form')} onSubmit={onSubmit}>
                            {elInputCv()}
                            <Input
                                name="task_name"
                                type="text"
                                label={t('routes.timesheet.sidebar.form.task.title')}
                                placeholder={t('routes.timesheet.sidebar.form.task.placeholder')}
                            />
                            <Button type="submit">
                                {t('routes.specialists.sidebar.filters.buttons.submit')}
                            </Button>
                            <Button type="button" onClick={onClearFilter} isSecondary={true}>
                                {t('routes.specialists.sidebar.filters.buttons.clear')}
                            </Button>
                        </form>
                    </FormProvider>
                </Wrapper>
            </Section>
        );
    };

    const elContent = () => {
        if(isLoading) {
            return <Loader />;
        }

        if(!data?.results.length) {
            return <Empty>{t('routes.timesheet.content.empty')}</Empty>;
        }

        return data?.results.map((item) => {
            let name = item.cv?.last_name;
            const firstName = item.cv?.first_name;
            const middleName = item.cv?.middle_name;

            if(firstName) {
                name = `${name} ${firstName.substring(0, 1).toUpperCase()}.`;
            }

            if(middleName) {
                name = `${name} ${middleName.substring(0, 1).toUpperCase()}.`;
            }

            return (
                <div key={item.id} className={cn('timesheet__item')}>
                    <div className={cn('timesheet__item-element')}>
                        {item.request?.module?.organization_project?.name || t('routes.timesheet.content.empty-name')}
                        <span className={cn('timesheet__item-element-sub-text')}>
                            {item.request?.title || t('routes.timesheet.content.empty-name')}
                        </span>
                    </div>
                    <div className={cn('timesheet__item-element')}>
                        {name || t('routes.timesheet.content.empty-name')}
                    </div>
                    <div className={cn('timesheet__item-element')}>
                        {item.task_name || t('routes.timesheet.content.empty-name')}
                        <span className={cn('timesheet__item-element-sub-text')}>{item.task_description || t('routes.timesheet.content.empty-name')}</span>
                    </div>
                    <div className={cn('timesheet__item-element')}>
                        {item.work_time ? t('routes.timesheet.content.time', { time: item.work_time }) : t('routes.timesheet.content.empty-name')}
                    </div>
                    {(su || admin || pm || rm) && (
                        <Dropdown
                            render={({ onClose }) => (
                                <DropdownMenu>
                                    <DropdownMenuItem selected={false}>
                                        <div className={cn('timesheet__action')} onClick={onClickEdit(item, onClose)}>
                                            <EditAction />
                                            {t('routes.timesheet.content.actions.edit')}
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem selected={false}>
                                        <div className={cn('timesheet__action')} onClick={onClickDelete(item.id, onClose)}>
                                            <DeleteAction />
                                            {t('routes.timesheet.content.actions.delete')}
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenu>
                            )}
                        >
                            <IconDots svg={{ className: cn('timesheet__dots') }} />
                        </Dropdown>
                    )}
                </div>
            );
        });
    };

    const elActions = () => {
        if(su || admin || pm || rm) {
            return <AddAction onClick={onClickAdd} />;
        }
    };

    const elConfirmModal = () => {
        if(deleteId) {
            const itemToDelete = data?.results.find((item) => item.id === deleteId);
            const projectName = itemToDelete?.request.module?.organization_project?.name;

            return (
                <ConfirmModal
                    setVisible={() => setDeleteId(undefined)}
                    timeSheetId={String(deleteId)}
                    timeSheetName={projectName}
                />
            );
        }
    };

    const elEditModal = () => {
        if(editTimesheet || showModal) {
            const idsArray = requestData?.requirements?.reduce((acc, curr) => {
                let newAcc = [...acc];

                if(curr.cv_list_ids) {
                    newAcc = newAcc.concat(curr.cv_list_ids.map((item) => parseInt(item, 10)));
                }

                return newAcc;
            }, [] as Array<number>);

            const cvFilters = {
                id        : [...new Set(idsArray)],
                request_id: [requestData?.id as number]
            };

            const defaultValuesNew = {
                date_from: requestData?.start_date,
                date_to  : requestData?.deadline_date
            };

            return (
                <EditModal
                    setVisible={() => {
                        setEditTimesheet(null);
                        setShowModal(false);
                    }}
                    fields={editTimesheet || defaultValuesNew}
                    cvFilters={cvFilters}
                    requestId={params.requestId}
                    isEdit={!!editTimesheet}
                />
            );
        }
    };

    return (
        <Fragment>
            <SidebarLayout sidebar={elSidebar()}>
                <Section>
                    <SectionHeader actions={elActions()}>{t('routes.timesheet.content.title')}</SectionHeader>
                    {elContent()}
                </Section>
            </SidebarLayout>
            {elConfirmModal()}
            {elEditModal()}
        </Fragment>
    );
};

export default Timesheets;
