import React from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames from 'hook/use-classnames';

import Button from 'component/button';
import DateInput from 'component/form/date';
import Form from 'component/form';
import Input from 'component/form/input';

import style from './index.module.pcss';

export const Main = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    return (
        <div className={cn('main')}>
            {t('routes.main.hello')}

            <Form legend="Legend">
                <Input name="test" type="text" label="test" required="error" />
                <DateInput label="label" direction="column" name="date" required="error" />
            </Form>

            <div className={cn('main__buttons')}>
                <Button isSecondary={true} disabled={true} type="submit">Button</Button>
                <Button isSecondary={true} type="submit">Button</Button>
                <Button isLoading={true} type="submit">Button</Button>
                <Button disabled={true} type="submit">Button</Button>
                <Button type="submit">Button 2</Button>
            </div>
        </div>
    );
};

export default Main;
