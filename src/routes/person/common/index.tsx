import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import useClassnames from 'hook/use-classnames';
import IconApply from 'component/icons/apply';
import IconPencil from 'component/icons/pencil';
import IconWarning from 'component/icons/warning';
import TooltipError from 'component/tooltip';
import Modal from 'component/modal';
import Button from 'component/button';
import Textarea from 'component/form/textarea';

import CommonEdit from './edit';
import style from './index.module.pcss';

export interface IProps {
    id?: string
}

export const Common = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const context = useForm({
        mode: 'all'
    });

    const [more, setMore] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [showVerify, setShowVerify] = useState<boolean>(false);

    const onClickMore = useCallback(() => {
        setMore(true);
    }, []);

    const onClickVerify = () => {
        setShowVerify(true);
    };

    const onClickCancel = () => {
        setIsEdit(false);
    };

    const onSubmitVerify = context.handleSubmit(
        (formValues) => {
            setShowVerify(false);
            console.info('VALUES', formValues);
        },
        (formError) => {
            setShowVerify(false);
            console.info('ERR', formError);
        }
    );

    const elBaseMore = useMemo(() => {
        if(more) {
            return (
                <Fragment>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.base.location')}</strong>
                        <span>Москва</span>
                    </div>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.base.resource-owner')}</strong>
                        <span>StarHr</span>
                    </div>
                </Fragment>
            );
        }
    }, [more]);

    const elTooltip = useCallback((isVerify: boolean) => {
        if(isVerify) {
            return (
                <div className={cn('person__tooltip', 'person__tooltip_apply')}>
                    <div className={cn('person__tooltip-content-item')}>
                        <strong className={cn('person__tooltip-content-item-title')}>
                            {t('routes.person.blocks.common.verify.title')}
                        </strong>
                        <p className={cn('person__tooltip-content-item-text')}>
                            Михаил Петров (yandex@mail.ru)
                        </p>
                        <p className={cn('person__tooltip-content-item-text')}>
                            29.04.2022
                        </p>
                    </div>
                    <div className={cn('person__tooltip-content-item')}>
                        <strong className={cn('person__tooltip-content-item-title')}>
                            {t('routes.person.blocks.common.verify.comment')}
                        </strong>
                        <p className={cn('person__tooltip-content-item-text')}>
                            Информация
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className={cn('person__tooltip')} onClick={onClickVerify}>
                <p className={cn('person__tooltip-text')}>Данные не прошли верификацию нашими сотрудниками.</p>

                <p className={cn('person__tooltip-text', 'person__tooltip-link')}>Верифицировать данные</p>
            </div>
        );
    }, []);

    const elVerifyWindowFooter = useMemo(() => {
        return (
            <div className={cn('person__modal-footer')}>
                <Button className={cn('person__modal-close')} isSecondary={true} onClick={() => setShowVerify(false)}>
                    {t('routes.person.blocks.common.verify.modal.buttons.cancel')}
                </Button>
                <Button onClick={onSubmitVerify}>
                    {t('routes.person.blocks.common.verify.modal.buttons.save')}
                </Button>
            </div>
        );
    }, []);

    const elVerifyWindow = useMemo(() => {
        if(showVerify) {
            return (
                <Modal
                    header={t('routes.person.blocks.common.verify.modal.title')}
                    footer={elVerifyWindowFooter}
                >
                    <FormProvider {...context}>
                        <form>
                            <Textarea name="verify" />
                        </form>
                    </FormProvider>
                </Modal>
            );
        }
    }, [showVerify]);

    const isEditWindow = useMemo(() => {
        if(isEdit) {
            return <CommonEdit onCancel={onClickCancel} />;
        }
    }, [isEdit]);

    return (
        <div id={props.id} className={cn('person__block', 'person__info')}>
            <div className={cn('person__info-header')}>
                <h1 className={cn('person__title')}>Сергей Андреевич Иванов</h1>
                <div
                    className={cn('person__control')}
                    onClick={() => {
                        setIsEdit(true);
                    }}
                >
                    <IconPencil />
                </div>
            </div>
            <div className={cn('person__info-content')}>
                <div className={cn('person__info-content-header')}>
                    <h4>{t('routes.person.blocks.common.base.title')}</h4>
                    <TooltipError content={elTooltip(true)}>
                        <IconApply
                            svg={{
                                width    : 24,
                                height   : 24,
                                className: cn('person__icon-apply')
                            }}
                        />
                    </TooltipError>
                </div>
                <div className={cn('person__info-list')}>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.base.age')}</strong>
                        <span>29 лет (2 марта 1991)</span>
                    </div>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.base.location')}</strong>
                        <span>Москва</span>
                    </div>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.base.resource-owner')}</strong>
                        <span>StarHr</span>
                    </div>
                    {elBaseMore}
                </div>
                {!more && <p onClick={onClickMore} className={cn('person__more-info')}>{t('routes.person.blocks.common.base.show-more')}</p>}
            </div>
            <div className={cn('person__info-content')}>
                <div className={cn('person__info-content-header')}>
                    <h4>{t('routes.person.blocks.common.contacts.title')}</h4>
                    <TooltipError content={elTooltip(false)}>
                        <IconWarning
                            svg={{
                                width    : 24,
                                height   : 24,
                                className: cn('person__icon-warning')
                            }}
                        />
                    </TooltipError>
                </div>
                <div className={cn('person__info-list')}>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.contacts.email')}</strong>
                        <span>anton@gmail.com</span>
                    </div>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.contacts.telephone')}</strong>
                        <span>+7 922 230 33 56</span>
                    </div>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.contacts.skype')}</strong>
                        <span>anton.s13</span>
                    </div>
                </div>
            </div>
            {elVerifyWindow}
            {isEditWindow}
        </div>
    );
};

export default Common;
