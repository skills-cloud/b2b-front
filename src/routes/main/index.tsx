import React from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames from 'hook/use-classnames';

import Button from 'component/button';
import DateInput from 'component/form/date';
import Form, { IFormData } from 'component/form';
import Input from 'component/form/input';
import InputRadio from 'component/form/radio';
import Checkbox from 'component/form/checkbox';

import style from './index.module.pcss';
import InputSelect from 'component/form/select';
import InputSkills from 'component/form/input-skills';

export const Main = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    const onSubmit = (formData: IFormData) => {
        console.info('DATA', formData);
    };

    return (
        <div className={cn('main')}>
            {t('routes.main.hello')}

            <Form legend="Legend" onSubmit={onSubmit}>
                <Input name="test" type="text" label="test" required="error" />
                <InputRadio label="radio" direction="column" required="text" name="radio" options={[{ value: 'test', label: 'test' }, { value: 'test2', label: 'test2' }]} />
                <DateInput label="label" direction="column" name="date" required="error" />
                <Checkbox name="checkbox1" label="Checkbox" direction="column" />
                <Checkbox name="checkbox2" label="Checkbox row" direction="row" />
                <Checkbox name="checkbox5" disabled={true} label="Disabled" defaultChecked={true} />
                <InputSelect label="Select" direction="row" name="select" options={[{ value: 'test', label: 'test' }, { value: 'test1', label: 'test1' }]} />
                <InputSelect label="Select column" direction="column" name="select 2" options={[{ value: 'test', label: 'test' }, { value: 'test1', label: 'test1' }]} />
                <InputSkills name="skills">Skills</InputSkills>
                <InputSkills name="skills" direction="column">Skills</InputSkills>
                <Button type="submit">Button 2</Button>
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
