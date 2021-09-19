import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useClassnames } from 'hook/use-classnames';
import { useForm, FormProvider } from 'react-hook-form';

import InputMain from 'component/form/input-main';

import { Organization } from 'adapter/types/main/request/id/get/code-200';
import { mainRequest } from 'adapter/api/main';

import style from './index.module.pcss';

export const MAIN_CUSTOMER_FORM_ID = 'MAIN_CUSTOMER_FORM_ID';

interface IEditRequirements {
    customer: Organization | undefined,
    onEditCustomer?(): void,
    onClose: () => void,
    requestId: number
}

const EditCustomer = ({ customer, requestId, onEditCustomer }: IEditRequirements) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const form = useForm();

    const [patchMainRequest] = mainRequest.usePatchMainRequestMutation();

    useEffect(() => {
        form.setValue('customer.name', customer?.name);
    }, [customer]);

    const onSubmit = form.handleSubmit(
        (formData) => {
            patchMainRequest({
                id         : requestId,
                customer_id: formData.customer.value
            })
                .unwrap()
                .then(() => {
                    onEditCustomer?.();
                })
                .catch(console.error);
        },
        (formError) => {
            console.error(formError);
        }
    );

    return (
        <FormProvider {...form}>
            <form
                id={MAIN_CUSTOMER_FORM_ID}
                onSubmit={onSubmit}
            >
                <InputMain
                    defaultValue={[customer?.id as number]}
                    isMulti={false}
                    label={t('routes.project-request.customer.form.name.title')}
                    placeholder={t('routes.project-request.customer.form.name.placeholder')}
                    name="customer"
                    direction="column"
                    requestType={InputMain.requestType.Customer}
                    className={cn('edit-customer__name')}
                />
                {/* <Input */}
                {/*    name="description"*/}
                {/*    type="text"*/}
                {/*    label={t('routes.project-request.customer.form.description.title')}*/}
                {/*    placeholder={t('routes.project-request.customer.form.description.placeholder')}*/}
                {/* /> */}
            </form>
        </FormProvider>
    );
};

export default EditCustomer;
