import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';
import { differenceInCalendarYears, format } from 'date-fns';

import useClassnames from 'hook/use-classnames';
import { useCancelTokens } from 'hook/cancel-token';

import IconApply from 'component/icons/apply';
import IconPencil from 'component/icons/pencil';
import IconWarning from 'component/icons/warning';
import TooltipError from 'component/tooltip';
import Modal from 'component/modal';
import Button from 'component/button';
import Textarea from 'component/form/textarea';

import { key as keyUser } from 'component/user/reducer';
import { useSelector } from 'component/core/store';
import { getCvById, ICvId } from 'adapter/api/cv';

import CommonEdit from './edit';
import style from './index.module.pcss';
import axios from 'axios';
import { ru } from 'date-fns/locale';

export interface IProps {
    id?: string
}

export const Common = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [tokenGetCv] = useCancelTokens(1);
    const context = useForm({
        mode: 'all'
    });

    const [more, setMore] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [showVerify, setShowVerify] = useState<boolean>(false);
    const [user, setUser] = useState<ICvId>();

    const { email, first_name, last_name } = useSelector((store) => ({
        email     : store[keyUser].email,
        first_name: store[keyUser].first_name,
        last_name : store[keyUser].last_name
    }));

    useEffect(() => {
        if(id) {
            getCvById(id, {
                cancelToken: tokenGetCv.new()
            })
                .then((resp) => {
                    setUser(resp);
                })
                .catch((err) => {
                    if(!axios.isCancel(err)) {
                        console.error(err);
                    }
                });
        }
    }, [id]);

    useEffect(() => {
        return () => {
            tokenGetCv.remove();
        };
    }, []);

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
                <div className={cn('person__list-item')}>
                    <strong>{t('routes.person.blocks.common.base.resource-owner')}</strong>
                    <span>StarHr</span>
                </div>
            );
        }
    }, [more, JSON.stringify(user)]);

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
        if(isEdit && user) {
            return <CommonEdit onCancel={onClickCancel} fields={user} />;
        }
    }, [isEdit, user]);

    const elContacts = useMemo(() => {
        if(user?.contacts?.length) {
            return (
                <div className={cn('person__info-list')}>
                    {user.contacts.map((contact) => (
                        <div key={contact.id} className={cn('person__list-item')}>
                            <strong>{contact.contact_type.name}</strong>
                            <span>{contact.value}</span>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className={cn('person__info-list')}>
                <div className={cn('person__list-item')}>
                    <strong>{t('routes.person.blocks.common.contacts.email')}</strong>
                    <span>{email}</span>
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
        );
    }, [email, JSON.stringify(user?.contacts)]);

    const elUserInfo = useMemo(() => {
        if(user) {
            const dateFromBirthdate = new Date(user?.birth_date);
            const age = differenceInCalendarYears(new Date(), dateFromBirthdate);
            const userAges = dateFromBirthdate ? `${age} (${format(dateFromBirthdate, 'dd MMMM yyyy', { locale: ru })})` : age;

            return (
                <div className={cn('person__info-list')}>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.base.age')}</strong>
                        <span>{userAges}</span>
                    </div>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.base.location')}</strong>
                        <span>{`${user.city.name}, ${user.country.name}`}</span>
                    </div>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.base.resource-owner')}</strong>
                        <span>StarHr</span>
                    </div>
                    {elBaseMore}
                </div>
            );
        }
    }, [JSON.stringify(user), user]);

    const elUserName = useMemo(() => {
        let userName = `${last_name} ${first_name}`;

        if(id) {
            userName = `${user?.last_name} ${user?.first_name} ${user?.middle_name}`;
        }

        return (
            <h1 className={cn('person__title')}>{userName.trim()}</h1>
        );
    }, [last_name, first_name, user?.first_name, user?.last_name, user?.middle_name]);

    return (
        <div id={props.id} key={id} className={cn('person__block', 'person__info')}>
            <div className={cn('person__info-header')}>
                {elUserName}
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
                {elUserInfo}
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
                {elContacts}
            </div>
            {elVerifyWindow}
            {isEditWindow}
        </div>
    );
};

export default Common;
