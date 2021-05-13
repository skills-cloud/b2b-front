import React, { useMemo, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { unstable_batchedUpdates } from 'react-dom';

import useClassnames, { IStyle } from 'hook/use-classnames';
import IconPencil from 'component/icons/pencil';
import IconApproved from 'component/icons/approved';

import RateEdit, { IField } from './edit';
import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    id?: string
}

const DEFAULT_MOCK_LIST: Array<IField> = [{
    hour : '$15',
    day  : '$200',
    month: '$3000'
}, {
    hour : '$15',
    day  : '$200',
    month: '$3000'
}];

export const Rate = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [fields, setFields] = useState<Array<IField>>(DEFAULT_MOCK_LIST);

    const elButtonEdit = useMemo(() => {
        if(fields.length) {
            return (
                <div
                    className={cn('rate__control')}
                    onClick={() => {
                        setIsEdit(true);
                    }}
                >
                    <IconPencil />
                </div>
            );
        }
    }, [fields.length]);

    const elEdit = useMemo(() => {
        if(isEdit) {
            return (
                <RateEdit
                    fields={fields}
                    onSubmit={(payload) => {
                        unstable_batchedUpdates(() => {
                            setFields(payload);
                            setIsEdit(false);
                        });
                    }}
                    onCancel={() => {
                        setIsEdit(false);
                    }}
                />
            );
        }
    }, [isEdit, fields]);

    const elRateBlock = useMemo(() => {
        return (
            <Fragment>
                {fields.map((field, index) => {
                    return (
                        <div className={cn('rate__block')} key={`block-${index}`}>
                            <h3 className={cn('rate__block-title')}>{t(`routes.person.rate.${index === 0 ? 'remote' : 'office'}`)}</h3>
                            <p className={cn('rate__block-text')}>
                                <span className={cn('rate__block-text-span')}>{t('routes.person.rate.hour')}</span>
                                <span className={cn('rate__block-text-span')}>{field.hour}</span>
                            </p>
                            <p className={cn('rate__block-text')}>
                                <span className={cn('rate__block-text-span')}>{t('routes.person.rate.day')}</span>
                                <span className={cn('rate__block-text-span')}>{field.day}</span>
                            </p>
                            <p className={cn('rate__block-text')}>
                                <span className={cn('rate__block-text-span')}>{t('routes.person.rate.month')}</span>
                                <span className={cn('rate__block-text-span')}>{field.month}</span>
                            </p>
                        </div>
                    );
                })}
            </Fragment>
        );
    }, [fields]);

    return (
        <Fragment>
            {elEdit}
            <div id={props.id} className={cn('rate')}>
                <div className={cn('rate__header-block')}>
                    <h1 className={cn('rate__header')}>{t('routes.person.rate.header')}</h1>
                    <div className={cn('rate__controls')}>
                        {elButtonEdit}
                    </div>
                </div>
                <div className={cn('rate__content')}>
                    {elRateBlock}
                    <div className={cn('rate__block', 'rate__block_control')}>
                        <IconApproved />
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Rate;
