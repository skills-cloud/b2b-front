import React, { MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import CheckboxTree from 'react-checkbox-tree';
import { useParams } from 'react-router';
import debounce from 'lodash.debounce';

import { useDispatch } from 'component/core/store';
import useClassnames, { IStyle } from 'hook/use-classnames';
import Button from 'component/button';
import Modal from 'component/modal';
import IconChevronDown from 'component/icons/chevron-down';
import InputSelect from 'component/form/select';
import Tooltip from 'component/tooltip';
import IconDots from 'component/icons/dots';
import IconArrowLeft from 'component/icons/arrow-left-full';

import { dictionary, ICompetence } from 'adapter/api/dictionary';
import { IResultPosition, position } from 'adapter/api/position';

import style from './index.module.pcss';
import Error from 'component/error';

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
    const dispatch = useDispatch();
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
    const { data: positionData, refetch } = position.useGetPositionListQuery({ id }, { refetchOnMountOrArgChange: true });
    const { data } = dictionary.useGetCompetenceTreeQuery(undefined);
    const [patchPosition, { isLoading }] = position.usePatchPositionByIdMutation();
    const [postPosition, { isLoading: isLoadingPost }] = position.usePostPositionMutation();

    const [activeWindow, setActiveWindow] = useState<'role' | 'competence' | 'checkbox' | null>('competence');
    const [checked, setChecked] = useState<Array<string>>([]);
    const [expanded, setExpanded] = useState<Array<string>>([]);
    const [options, setOptions] = useState<Array<INodeCheckboxTree>>([]);
    const [positionItem, setPositionItem] = useState<IResultPosition>();
    const [error, setError] = useState<Array<string> | string | null>(null);

    const reMap = (array: Array<ICompetence>) => {
        return array.map((item) => {
            const params = {
                value: item.id,
                label: item.name
            };
            const obj: INodeCheckboxTree = {
                label: '',
                value: ''
            };

            for(const param in params) {
                if(params[param]) {
                    obj[param] = params[param];
                }
            }

            if(item.children?.length) {
                obj.children = reMap(item.children);
            }

            return obj;
        });
    };

    const getCheckedNodes = (nodes: Array<INodeCheckboxTree>, checkedItems: Array<string>, isChildren = false) => {
        let ids: Array<string> = [];

        nodes?.forEach(({ value, children }) => {
            const childrenNodes = checkedItems.includes(String(value)) && children ? getCheckedNodes(children, checkedItems, true) : '';
            const includedValue = checkedItems.includes(String(value)) || isChildren ? value : '';
            const childrenChecked = children?.filter((item) => checkedItems.includes(String(item.value)));

            ids = [...ids];

            if(childrenChecked?.length && children) {
                ids = [...ids, ...childrenChecked.map((item) => item.value)];
            }

            if(childrenNodes) {
                ids = [...ids, ...childrenNodes];
            }

            if(includedValue) {
                ids = [...ids, includedValue];
            }
        });

        return [...new Set([...ids])];
    };

    const onClickDots = (positionItemParam: IResultPosition) => () => {
        const newChecked = positionItemParam.competencies.map((item) => String(item.id));
        const newOptions = options.reduce((acc, curr) => {
            if(curr.children) {
                acc.push(...curr.children);
            }

            return acc;
        }, [] as Array<INodeCheckboxTree>);
        const nodes = getCheckedNodes(newOptions, newChecked);

        setPositionItem(positionItemParam);
        setChecked(nodes);
        setExpanded((oldState) => ([
            ...oldState,
            ...nodes
        ]));
        setActiveWindow('checkbox');
    };

    const onCancel = () => {
        props.onCancel?.();
        setChecked([]);
        setPositionItem(undefined);
        setExpanded([]);
        setActiveWindow(null);
    };

    const onSubmit = methods.handleSubmit(
        (formData) => {
            if(positionItem) {
                return patchPosition({
                    id              : positionItem.id,
                    cv_id           : parseInt(id, 10),
                    position_id     : positionItem.position_id,
                    competencies_ids: formData.competence_ids.map((item) => parseInt(item, 10))
                })
                    .unwrap()
                    .then(() => {
                        refetch();
                        onCancel();
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
                cv_id           : parseInt(id, 10),
                position_id     : parseInt(formData.position_id?.value as string, 10),
                competencies_ids: checked.map((item) => parseInt(item, 10))
            })
                .unwrap()
                .then(() => {
                    refetch();
                    onCancel();
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

    const onClickSubmit = () => {
        if(activeWindow === 'role') {
            setActiveWindow('checkbox');
        } else {
            return onSubmit();
        }
    };

    useEffect(() => {
        if(data) {
            const newOptions = data.map((item) => {
                return {
                    label       : item.name,
                    value       : item.id,
                    showCheckbox: false,
                    children    : item.children ? reMap(item.children) : undefined
                };
            });

            setOptions(newOptions);
        }
    }, [JSON.stringify(data)]);

    const onClickBack = () => {
        if(activeWindow === 'role') {
            setActiveWindow('competence');
        } else if(activeWindow === 'checkbox') {
            setActiveWindow('competence');
        }
    };

    const onLoadOptions = debounce((search_string: string, callback) => {
        dispatch(dictionary.endpoints.getPositionList.initiate({
            search: search_string
        }))
            .then(({ data: loadData }) => {
                if(loadData?.results?.length) {
                    const res = loadData.results.map((item) => ({
                        label: item.name,
                        value: String(item.id)
                    }));

                    callback(res);
                } else {
                    callback(null);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, 150);

    const getNodeIds = (nodes: Array<INodeCheckboxTree>) => {
        let ids: Array<string> = [];

        nodes.forEach(({ value, children }) => {
            const childNodes = children ? getNodeIds(children) : [];

            ids = [...ids, value, ...childNodes];
        });

        return ids;
    };

    const onClickExpand = (action: 'expand' | 'close') => () => {
        const newExpanded = action === 'expand' ? getNodeIds(options) : [];

        setExpanded(newExpanded);
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

        if(activeWindow === 'checkbox') {
            return (
                <div className={cn('competencies-edit__checkbox-controls')}>
                    <span className={cn('competencies-edit__checkbox-control')} onClick={onClickExpand('expand')}>
                        {t('routes.person.blocks.competencies.edit.buttons.expand')}
                    </span>
                    <span className={cn('competencies-edit__checkbox-control')} onClick={onClickExpand('close')}>
                        {t('routes.person.blocks.competencies.edit.buttons.close')}
                    </span>
                </div>
            );
        }
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

    const elCompetenciesCheckbox = () => {
        return (
            <div className={cn('')}>
                <CheckboxTree
                    checked={checked}
                    expanded={expanded}
                    onCheck={(checkedValues) => {
                        setChecked(checkedValues);

                        methods.setValue('competence_ids', checkedValues);
                    }}
                    onExpand={setExpanded}
                    nodes={options}
                    optimisticToggle={true}
                    icons={{
                        check      : null,
                        uncheck    : null,
                        halfCheck  : null,
                        expandOpen : <IconChevronDown svg={{ className: cn('competencies-edit__expand', 'competencies-edit__expand_open') }} />,
                        expandClose: <IconChevronDown svg={{ className: cn('competencies-edit__expand') }} />,
                        expandAll  : 'Развернуть все',
                        collapseAll: 'Свернуть все',
                        parentClose: null,
                        parentOpen : null,
                        leaf       : null
                    }}
                />
                {elError}
            </div>
        );
    };

    const elCompetencies = () => {
        return (
            <div className={cn('competencies-edit__info-list')}>
                {positionData?.results?.map((pos) => {
                    return (
                        <div className={cn('competencies-edit__info-list-item')} key={pos.id}>
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
                                    {pos.competencies.map((comp) => (
                                        <Tooltip key={comp.id} content={comp.name} theme="dark">
                                            <span className={cn('competencies-edit__skills-tag')}>{comp.name}</span>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const elAddRole = () => {
        return (
            <div className={cn('competencies-edit__field')}>
                <InputSelect
                    name="level"
                    options={[{
                        value: 'junior',
                        label: 'Junior'
                    }, {
                        value: 'middle',
                        label: 'Middle'
                    }, {
                        value: 'senior',
                        label: 'Senior'
                    }]}
                    placeholder="Ваш уровень владения"
                />
                <InputSelect
                    name="position_id"
                    loadOptions={onLoadOptions}
                    placeholder="Начните вводить, например, “PHP”"
                />
            </div>
        );
    };

    const elFormContent = () => {
        switch (activeWindow) {
            case 'checkbox': {
                return elCompetenciesCheckbox();
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
            <form>
                <FormProvider {...methods}>
                    {elFormContent()}
                </FormProvider>
            </form>
        </Modal>
    );
};

export default CompetenciesEdit;
