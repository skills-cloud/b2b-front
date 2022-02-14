import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';

import { useClassnames } from 'hook/use-classnames';

import CommonDictionary from './common';
import CompetenceTree from './competence-tree';
import 'antd/lib/tabs/style/index.css';
import style from './index.module.pcss';

const { TabPane } = Tabs;

const dictionaryList = [
    {
        apiKey: 'competence',
        name  : 'Компетенции'
    },
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
        name  : 'Отрасль'
    },
    {
        apiKey: 'organization',
        name  : 'Организация'
    },
    {
        apiKey: 'physical-limitation',
        name  : 'Физические ограничения'
    },
    {
        apiKey: 'position',
        name  : 'Позиция'
    },
    {
        apiKey: 'type-of-employment',
        name  : 'Тип занятости'
    }
];

const Dictionary = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

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
                {dictionaryList.map((dictItem) => (
                    <TabPane tab={dictItem.name} key={dictItem.apiKey}>
                        {dictItem.apiKey === 'competence' ? <CompetenceTree /> : <CommonDictionary {...dictItem} />}
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
};

export default Dictionary;
