import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import CheckboxTree from 'react-checkbox-tree';

import useClassnames, { IStyle } from 'hook/use-classnames';
import FormInput from 'component/form/input';
import Button from 'component/button';
import Modal from 'component/modal';
import IconChevronDown from 'component/icons/chevron-down';

import style from './index.module.pcss';
import { useCancelToken } from 'hook/cancel-token';
import { getCompetenceTree, ICompetence } from 'adapter/api/dictionary';
import axios from 'axios';

export interface IField {
    role?: string
}

export interface IProps {
    className?: string | IStyle,
    fields?: Array<IField>,
    onSubmit?(payload: Array<IField>): void,
    onCancel?(): void
}

export const CompetenciesEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const token = useCancelToken();
    const methods = useForm({
        defaultValues: {
            competencies: props.fields || [{}]
        }
    });
    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name   : 'competencies'
    });

    const [checked, setChecked] = useState<Array<string>>([]);
    const [expanded, setExpanded] = useState<Array<string>>([]);
    const [options, setOptions] = useState<Array<ICompetence>>();

    useEffect(() => {
        getCompetenceTree({
            cancelToken: token.new()
        })
            .then((resp) => {
                setOptions(resp);
            })
            .catch((err) => {
                if(!axios.isCancel(err)) {
                    console.error(err);
                }
            });

        return () => {
            token.remove();
        };
    }, []);

    const elAppend = useMemo(() => {
        if(true) {
            return (
                <a
                    href="#append"
                    className={cn('competencies-edit__link-append')}
                    children={t('routes.person.blocks.competencies.edit.buttons.append')}
                    onClick={(e: MouseEvent) => {
                        e.preventDefault();

                        append({});
                    }}
                />
            );
        }
    }, []);

    const elFooter = useMemo(() => {
        return (
            <div className={cn('competencies-edit__form-footer')}>
                {elAppend}
                <Button isSecondary={true} onClick={props.onCancel} className={cn('competencies-edit__button-secondary')}>
                    {t('routes.person.blocks.competencies.edit.buttons.cancel')}
                </Button>
                <Button type="submit">{t('routes.person.blocks.competencies.edit.buttons.save')}</Button>
            </div>
        );
    }, []);

    const elFormContent = () => {
        const optionsMock: Array<ICompetence> = [
            {
                value       : '3',
                label       : 'Языки программирования',
                showCheckbox: false,
                children    : [
                    {
                        value: '8',
                        label: 'CSS'
                    },
                    {
                        value: '9',
                        label: 'HTML'
                    },
                    {
                        value   : '1',
                        label   : 'JavaScript',
                        children: [
                            {
                                value: '5',
                                label: 'Node JS'
                            },
                            {
                                value: '7',
                                label: 'React JS'
                            }
                        ]
                    },
                    {
                        value   : '2',
                        label   : 'Python',
                        children: [
                            {
                                value: '4',
                                label: 'Python 2'
                            },
                            {
                                value: '11',
                                label: 'Python 3'
                            }
                        ]
                    }
                ]
            }
        ];

        return (
            <div className={cn('')}>
                <CheckboxTree
                    checked={checked}
                    expanded={expanded}
                    onCheck={setChecked}
                    onExpand={setExpanded}
                    nodes={optionsMock}
                    icons={{
                        check      : null,
                        uncheck    : null,
                        halfCheck  : null,
                        expandOpen : <IconChevronDown svg={{ className: cn('competencies-edit__expand', 'competencies-edit__expand_open') }} />,
                        expandClose: <IconChevronDown svg={{ className: cn('competencies-edit__expand') }} />,
                        expandAll  : 'expandAll',
                        collapseAll: 'collapseAll',
                        parentClose: null,
                        parentOpen : null,
                        leaf       : null
                    }}
                />
            </div>
        );
    };

    return (
        <Modal className={cn('competencies-edit')} footer={elFooter} header={t('routes.person.blocks.competencies.edit.title')}>
            <form
                onSubmit={methods.handleSubmit(({ competencies }) => {
                    if(props.onSubmit) {
                        props.onSubmit(competencies);
                    }
                })}
            >
                <FormProvider {...methods}>
                    {elFormContent()}
                </FormProvider>
            </form>
        </Modal>
    );
};

export default CompetenciesEdit;
