import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';

import { useClassnames } from 'hook/use-classnames';

import CommonDictionary from './common';
import 'antd/lib/tabs/style/index.css';
import style from './index.module.pcss';

const { TabPane } = Tabs;

const Dictionary = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const dictionaryList = [
        {
            apiKey: 'country',
            name  : 'Страна'
        },
        {
            apiKey: 'city',
            name  : 'Город'
        },
        {
            apiKey: 'contact-type',
            name  : 'Способ общения'
        },
        {
            apiKey: 'education-graduate',
            name  : 'Образование'
        },
        {
            apiKey: 'education-place',
            name  : 'Образовательное учреждение'
        },
        {
            apiKey: 'education-specialty',
            name  : 'Название специализации'
        },
        {
            apiKey: 'industry-sector',
            name  : 'Industry sector'
        },
        {
            apiKey: 'organization',
            name  : 'Organization'
        },
        {
            apiKey: 'physical-limitation',
            name  : 'Physical limitation'
        },
        {
            apiKey: 'position',
            name  : 'Позиция'
        },
        {
            apiKey: 'type-of-employment',
            name  : 'Type of employment'
        }
    ];

    return (
        <div className={cn('dictionary')}>
            <Helmet
                title={t('helmet.title.dictionary')}
                meta={[{
                    name   : 'document-state',
                    content: 'static'
                }]}
            />
            <Tabs defaultActiveKey="1" tabPosition="left">
                {dictionaryList.map((dictItem) => {
                    return (
                        <TabPane tab={dictItem.name} key={dictItem.apiKey}>
                            <CommonDictionary {...dictItem} />
                        </TabPane>
                    );
                })}
            </Tabs>
        </div>
    );
};

export default Dictionary;
