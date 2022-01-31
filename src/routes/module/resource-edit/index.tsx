import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useParams } from 'react-router';

import useClassnames from 'hook/use-classnames';
import { IParams } from 'helper/url-list';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';
import InputDictionary from 'component/form/input-dictionary';
import Input from 'component/form/input';
import AddAction from 'component/section/actions/add';
import DeleteAction from 'component/section/actions/delete';
import ErrorsComponent from 'component/error/errors';
import { IValue } from 'component/form/select';

import { mainRequest } from 'adapter/api/main';
import { ModulePositionLaborEstimateInline } from 'adapter/types/main/module/get/code-200';

import style from './index.module.pcss';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    defaultValues?: Array<ModulePositionLaborEstimateInline>,
    onClickCancel?(): void
}

const RESOURCE_EDIT_FORM_ID = 'RESOURCE_EDIT_FORM_ID';

const ResourceEdit = ({ setVisible, onClickCancel, defaultValues }: IEditModal) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const { moduleId } = useParams<IParams>();
    const context = useForm<{ resources: Array<ModulePositionLaborEstimateInline & { isNew: boolean, position: IValue }> }>({
        mode         : 'onChange',
        defaultValues: {
            resources: defaultValues
        }
    });

    const [post, { error, isError, isLoading }] = mainRequest.usePostMainModulePositionLaborEstimateMutation();
    const [patch, { error: patchError, isError: isPatchError, isLoading: isPatchLoading }] = mainRequest.usePatchMainModulePositionLaborEstimateMutation();
    const [deleteMethod, { error: deleteError, isError: isDeleteError, isLoading: isDeleteLoading }] = mainRequest.useDeleteMainModulePositionLaborEstimateMutation();

    const { fields, append, remove } = useFieldArray({
        keyName: 'fieldId',
        control: context.control,
        name   : 'resources'
    });

    const onAddResource = () => {
        append({
            isNew: true
        });
    };

    const onClickDelete = (id?: number, index?: number) => () => {
        if(id) {
            deleteMethod({
                id: String(id)
            })
                .unwrap()
                .then(() => {
                    if(index) {
                        remove(index);
                    }
                })
                .catch(console.error);
        }
    };

    const onSubmit = context.handleSubmit(
        (formData) => {
            formData.resources.forEach((item) => {
                const method = item.isNew ? post : patch;

                method({
                    id         : item.id,
                    position_id: item.isNew ? parseInt(item.position?.value, 10) : item.position_id,
                    module_id  : parseInt(moduleId, 10),
                    count      : item.count,
                    hours      : item.hours
                })
                    .unwrap()
                    .then(() => {
                        onClickCancel?.();
                    })
                    // TODO обработка ошибок
                    .catch(console.error);
            });
        },
        (formError) => {
            console.error(formError);
        }
    );

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
                                    name={`resources[${index}].position`}
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
                                <DeleteAction onClick={onClickDelete(field.id, index)} />
                            </div>
                        ))}
                    </form>
                    <div className={cn('resource-edit__controls')}>
                        <AddAction onClick={onAddResource} />
                    </div>
                </div>
            </FormProvider>
            <ErrorsComponent
                error={error || patchError || deleteError}
                isError={isError || isPatchError || isDeleteError}
                isLoading={isLoading || isPatchLoading || isDeleteLoading}
            />
        </Modal>
    );
};

export default ResourceEdit;
