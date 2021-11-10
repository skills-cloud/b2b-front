import React, { useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import useClassnames, { IStyle } from 'hook/use-classnames';
import UserHeaderBar from 'component/user/header-bar';
import { HELP, ORGANIZATIONS, REQUESTS, SPECIALISTS, TEAMS } from 'helper/url-list';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle
}

export const Header = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t, i18n } = useTranslation();

    const elLanguages = useMemo(() => {
        if(__DEVELOPMENT__) {
            if(Array.isArray(i18n.options.supportedLngs) && i18n.options.supportedLngs.length) {
                return (
                    <ul className={cn('header__languages')}>
                        {i18n.options.supportedLngs.map((lang) => (
                            <li
                                key={lang}
                                children={lang}
                                className={cn('header__language', {
                                    'header__language_active': lang === i18n.language
                                })}
                                onClick={() => {
                                    void i18n.changeLanguage(lang);
                                }}
                            />
                        ))}
                    </ul>
                );
            }
        }
    }, [i18n.options.supportedLngs, i18n.language]);

    return (
        <header className={cn('header')}>
            {elLanguages}
            <div className={cn('header__main')}>
                <Link
                    to="/"
                    className={cn('header__logo')}
                    children={t('components.header.logo')}
                />
                <nav className={cn('header__nav')}>
                    <NavLink
                        to={SPECIALISTS}
                        className={cn('header__nav-link')}
                        activeClassName={cn('header__nav-link_active')}
                        children={t('components.header.nav.specialists')}
                    />
                    <NavLink
                        to={ORGANIZATIONS}
                        className={cn('header__nav-link')}
                        activeClassName={cn('header__nav-link_active')}
                        children={t('components.header.nav.organizations')}
                    />
                    <NavLink
                        to={REQUESTS}
                        className={cn('header__nav-link')}
                        activeClassName={cn('header__nav-link_active')}
                        children={t('components.header.nav.requests')}
                    />
                    <NavLink
                        to={TEAMS}
                        className={cn('header__nav-link')}
                        activeClassName={cn('header__nav-link_active')}
                        children={t('components.header.nav.teams')}
                    />
                    <NavLink
                        to={HELP}
                        className={cn('header__nav-link')}
                        activeClassName={cn('header__nav-link_active')}
                        children={t('components.header.nav.help')}
                    />
                </nav>
                <UserHeaderBar />
            </div>
        </header>
    );
};

export default Header;
