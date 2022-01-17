import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import useClassnames, { IStyle } from 'hook/use-classnames';

import IconPencil from 'component/icons/pencil';
import VerifyIcon from 'component/verify-icon';
import Empty from 'component/empty';

import { certificate } from 'adapter/api/certificate';

import CertificateEdit from './edit';
import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    id?: string
}

export const Certificates = (props: IProps) => {
    const { specialistId } = useParams<IParams>();
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();

    const [isEdit, setIsEdit] = useState<boolean>(false);

    const { data, refetch } = certificate.useGetCertificateListQuery({
        cv_id: specialistId
    }, {
        refetchOnMountOrArgChange: true
    });

    const onClickCancel = () => {
        setIsEdit(false);
    };

    const onSubmitCallback = () => {
        refetch();
        onClickCancel();
    };

    const isEditWindow = useMemo(() => {
        if(isEdit && data?.results) {
            return <CertificateEdit onCancel={onClickCancel} fields={data.results} onSubmit={onSubmitCallback} />;
        }
    }, [isEdit, JSON.stringify(data)]);

    const elDates = (date?: string) => {
        if(date) {
            return (
                <li className={cn('certificates__list-item')}>
                    <strong>{t('routes.person.certificates.label.issued')}</strong>
                    <span>{date}</span>
                </li>
            );
        }

        return (
            <li className={cn('certificates__list-item')}>
                <strong>{t('routes.person.certificates.label.issued')}</strong>
                <span>{t('routes.person.certificates.date.empty')}</span>
            </li>
        );
    };

    const elContent = () => {
        if(data?.results?.length) {
            return (
                <div className={cn('certificates__collection')}>
                    {data.results.map((result) => (
                        <div key={result.id} className={cn('certificates__certificate')}>
                            <strong className={cn('certificates__certificate-title')}>
                                {result.name}
                                <VerifyIcon isVerify={result.is_verified} className={cn('certificates__certificate-title-icon')} />
                            </strong>
                            <ul className={cn('certificates__list')}>
                                {elDates(result.date)}
                                <li className={cn('certificates__list-item')}>
                                    <strong>{t('routes.person.certificates.label.specialty')}</strong>
                                    <span>{result.education_speciality?.name}</span>
                                </li>
                                <li className={cn('certificates__list-item')}>
                                    <strong>{t('routes.person.certificates.label.place')}</strong>
                                    <span>{result.education_place?.name}</span>
                                </li>
                                <li className={cn('certificates__list-item')}>
                                    <strong>{t('routes.person.certificates.label.power')}</strong>
                                    <span>{result.education_graduate?.name}</span>
                                </li>
                                <li className={cn('certificates__list-item')}>
                                    <strong>{t('routes.person.certificates.label.number')}</strong>
                                    <span>{result.number}</span>
                                </li>
                                <li className={cn('certificates__list-item')}>
                                    <strong>{t('routes.person.certificates.label.competencies')}</strong>
                                    <div className={cn('certificates__tags')}>
                                        {result.competencies?.map((item) => (
                                            <span key={item.id} className={cn('certificates__tag')}>{item.name}</span>
                                        ))}
                                    </div>
                                </li>
                                <li className={cn('certificates__list-item')}>
                                    <strong>{t('routes.person.certificates.label.description')}</strong>
                                    <span>{result.description}</span>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
            );
        }

        return <Empty>{t('routes.person.certificates.empty')}</Empty>;
    };

    return (
        <div id={props.id} className={cn('certificates')}>
            <h2 className={cn('certificates__header')}>{t('routes.person.certificates.header')}</h2>
            <div className={cn('certificates__controls')}>
                <div
                    className={cn('certificates__control')}
                    onClick={() => {
                        setIsEdit(true);
                    }}
                >
                    <IconPencil />
                </div>
            </div>
            {elContent()}
            {isEditWindow}
        </div>
    );
};

export default Certificates;
