import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';

import useClassnames from 'hook/use-classnames';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';
import Error from 'component/error';

import { ModulePositionLaborEstimateInline } from 'adapter/types/main/module/get/code-200';

import style from './index.module.pcss';
import InputDictionary from 'component/form/input-dictionary';
import Input from 'component/form/input';
import AddAction from 'component/section/actions/add';
import DeleteAction from 'component/section/actions/delete';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    defaultValues?: Array<ModulePositionLaborEstimateInline>,
    onClickCancel?(): void
}

const RESOURCE_EDIT_FORM_ID = 'RESOURCE_EDIT_FORM_ID';

const ResourceEdit = ({ setVisible, onClickCancel, defaultValues }: IEditModal) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const context = useForm<{ resources: Array<ModulePositionLaborEstimateInline> }>({
        mode         : 'onChange',
        defaultValues: {
            resources: defaultValues
        }
    });

    const [error, setError] = useState<string | null>(null);

    const { fields, append, remove } = useFieldArray({
        keyName: 'fieldId',
        control: context.control,
        name   : 'resources'
    });

    const onAddResource = () => {
        append({});
    };

    const onSubmit = context.handleSubmit(
        (formData) => {
            console.info('DATA', formData);
        },
        (formError) => {
            console.error(formError);
            setError('error');
        }
    );

    const elError = useMemo(() => {
        if(error) {
            return <Error elIcon={true}>{error}</Error>;
        }
    }, [error]);

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.module.resource-edit.title')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);

                            onClickCancel?.();
                        }}
                    >
                        {t('routes.module.resource-edit.form.buttons.cancel')}
                    </Button>
                    <Button type="submit" form={RESOURCE_EDIT_FORM_ID}>
                        {t('routes.module.resource-edit.form.buttons.save')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            <FormProvider {...context}>
                <div className={cn('resource-edit__content')}>
                    <form onSubmit={onSubmit} id={RESOURCE_EDIT_FORM_ID} className={cn('resource-edit__form')}>
                        <div className={cn('resource-edit__form-header')}>
                            <div className={cn('resource-edit__form-header-item')}>
                                {t('routes.module.resource-edit.header.role')}
                            </div>
                            <div className={cn('resource-edit__form-header-item')}>
                                {t('routes.module.resource-edit.header.count')}
                            </div>
                            <div className={cn('resource-edit__form-header-item')}>
                                {t('routes.module.resource-edit.header.hours')}
                            </div>
                        </div>
                        {fields.map((field, index) => (
                            <div key={field.fieldId} className={cn('resource-edit__item')}>
                                <InputDictionary
                                    defaultValue={[field.position_id]}
                                    name={`resources[${index}].position.name`}
                                    isMulti={false}
                                    requestType={InputDictionary.requestType.Position}
                                    placeholder={t('routes.module.resource-edit.form.role.placeholder')}
                                />
                                <Input
                                    name={`resources[${index}].count`}
                                    type="number"
                                />
                                <Input
                                    name={`resources[${index}].hours`}
                                    type="number"
                                />
                                <DeleteAction onClick={() => remove(index)} />
                            </div>
                        ))}
                    </form>
                    <div className={cn('resource-edit__controls')}>
                        <AddAction onClick={onAddResource} />
                    </div>
                </div>
            </FormProvider>
            {elError}
        </Modal>
    );
};

export default ResourceEdit;
