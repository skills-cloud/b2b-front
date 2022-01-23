import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';
import { differenceInCalendarYears, format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { IParams } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';

import IconApply from 'component/icons/apply';
import IconPencil from 'component/icons/pencil';
import IconWarning from 'component/icons/warning';
import TooltipError from 'component/tooltip';
import Modal from 'component/modal';
import Button from 'component/button';
import Textarea from 'component/form/textarea';

import { cv } from 'adapter/api/cv';

import CommonEdit from './edit';
import style from './index.module.pcss';
import { mainRequest } from 'adapter/api/main';

export interface IProps {
    id?: string
}

export const Common = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { specialistId } = useParams<IParams>();
    const context = useForm({
        mode: 'all'
    });

    const [more, setMore] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [showVerify, setShowVerify] = useState<boolean>(false);
    const { data, refetch } = cv.useGetCvByIdQuery({ id: specialistId }, { refetchOnMountOrArgChange: true });
    const { data: orgData } = mainRequest.useGetMainOrganizationContractorByIdQuery({
        id: String(data?.organization_contractor_id)
    }, {
        skip: !data?.organization_contractor_id
    });

    const onClickMore = useCallback(() => {
        setMore(true);
    }, []);

    const onClickVerify = () => {
        setShowVerify(true);
    };

    const onClickCancel = () => {
        setIsEdit(false);
    };

    const onSubmitCallback = () => {
        refetch();
        onClickCancel();
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
        if(more && orgData) {
            let name = data?.last_name;

            if(data?.first_name) {
                name = `${name} ${data.first_name}`;
            }

            return (
                <Fragment>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.base.resource-owner')}</strong>
                        <span>{orgData.name}</span>
                    </div>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.base.resource-manager')}</strong>
                        <span>{name}</span>
                    </div>
                </Fragment>
            );
        }
    }, [more, JSON.stringify(data)]);

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
        if(isEdit && data) {
            return <CommonEdit onCancel={onClickCancel} fields={data} id={specialistId} onSubmit={onSubmitCallback} />;
        }
    }, [isEdit, JSON.stringify(data)]);

    const elContacts = useMemo(() => {
        if(data?.contacts?.length) {
            return (
                <div className={cn('person__info-list')}>
                    {data.contacts.map((contact) => (
                        <div key={contact.id} className={cn('person__list-item')}>
                            <strong>{contact.contact_type?.name}</strong>
                            <span>{contact.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
    }, [JSON.stringify(data?.contacts)]);

    const elLocation = useMemo(() => {
        if(data?.city) {
            return (
                <div className={cn('person__list-item')}>
                    <strong>{t('routes.person.blocks.common.base.location')}</strong>
                    <span>{`${data.city.name || ''}, ${data.country?.name || ''}`}</span>
                </div>
            );
        }
    }, [data?.city]);

    const elUserInfo = useMemo(() => {
        if(data) {
            const dateFromBirthdate = new Date(data?.birth_date as string);
            const age = differenceInCalendarYears(new Date(), dateFromBirthdate);
            const userAges = dateFromBirthdate ? `${age} (${format(dateFromBirthdate, 'dd MMMM yyyy', { locale: ru })})` : age;

            return (
                <div className={cn('person__info-list')}>
                    <div className={cn('person__list-item')}>
                        <strong>{t('routes.person.blocks.common.base.age')}</strong>
                        <span>{userAges}</span>
                    </div>
                    {elLocation}
                    {elBaseMore}
                </div>
            );
        }
    }, [JSON.stringify(data), data, more]);

    const elUserName = useMemo(() => {
        return (
            <h1 className={cn('person__title')}>
                {`${data?.last_name || ''} ${data?.first_name || ''} ${data?.middle_name || ''}`}
            </h1>
        );
    }, [data?.first_name, data?.last_name, data?.middle_name]);

    return (
        <div id={props.id} key={specialistId} className={cn('person__block', 'person__info')}>
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
