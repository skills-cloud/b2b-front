import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import useClassnames from 'hook/use-classnames';

import IconPlus from 'component/icons/plus';
import FormInput from 'component/form/input';
import UserAvatar from 'component/user/avatar';
import Loader from 'component/loader';

import { cv } from 'adapter/api/cv';

import style from './index.module.pcss';
import { CvCareerRead } from 'adapter/types/cv/cv/get/code-200';

export const Specialists = () => {
    const cn = useClassnames(style);
    const { t, i18n } = useTranslation();
    const context = useForm({
        mode         : 'onChange',
        defaultValues: {
            search: ''
        }
    });
    const search = context.watch('search');
    const { data, isLoading } = cv.useGetCvListQuery({ search });

    const elAdditionalBlock = (cvItem?: CvCareerRead) => {
        if(cvItem) {
            const experience = '';

            return (
                <div className={cn('specialists__user-info-exp')}>
                    {experience}
                </div>
            );
        }
    };

    const elUsers = useMemo(() => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.results?.length) {
            return (
                <div className={cn('specialists__users')}>
                    {data.results.map((cvItem) => {
                        const firstName = cvItem.first_name || t('routes.specialists.main.first-name');
                        const lastName = cvItem.last_name || t('routes.specialists.main.last-name');
                        const title = `${firstName} ${lastName}`.trim();

                        return (
                            <div key={cvItem.id} className={cn('specialists__user')}>
                                <div className={cn('specialists__user-info')}>
                                    <UserAvatar
                                        className={cn('specialists__user-info-avatar')}
                                        title={title}
                                        titleTo={`/specialists/${cvItem.id}`}
                                        avatar={{
                                            src: cvItem.photo
                                        }}
                                    />
                                    {elAdditionalBlock(cvItem.career?.[0])}
                                </div>
                                <div className={cn('specialists__user-competencies')}>
                                    <p className={cn('specialists__block-title')}>
                                        {t('')}
                                    </p>
                                </div>
                                <div className={cn('specialists__user-rate')}>
                                    <p className={cn('specialists__block-title')}>
                                        {t('')}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return <span className={cn('specialists__users-empty')}>{t('routes.specialists.main.users.empty')}</span>;
    }, [JSON.stringify(data?.results), i18n.language, isLoading]);

    return (
        <div className={cn('specialists')}>
            <main className={cn('specialists__main')}>
                <h2 className={cn('specialists__main-header')}>{t('routes.specialists.main.title')}</h2>
                {elUsers}
                <Link
                    to="/specialists/create"
                    className={cn('specialists__main-button')}
                >
                    <IconPlus />
                </Link>
            </main>
            <aside>
                <div className={cn('specialists__search')}>
                    <h3 className={cn('specialists__search-header')}>{t('routes.specialists.sidebar.search.title')}</h3>
                    <FormProvider {...context}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <FormInput
                                name="search"
                                type="search"
                                placeholder={t('routes.specialists.sidebar.search.form.input.placeholder')}
                            />
                        </form>
                    </FormProvider>
                </div>
            </aside>
        </div>
    );
};

export default Specialists;
