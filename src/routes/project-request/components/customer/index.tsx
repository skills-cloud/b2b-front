import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useClassnames } from 'hook/use-classnames';

import SectionHeader from 'component/section/header';
// import EditAction from 'component/section/actions/edit';
import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Header from 'component/header';
import Section from 'component/section';
import Button from 'component/button';
import SectionContentList from 'component/section/content-list';
import SectionContentListItem from 'component/section/content-list-item';

import { MainOrganization } from 'adapter/types/main/organization/id/get/code-200';

import EditCustomerForm, { MAIN_CUSTOMER_FORM_ID } from '../edit-customer';
import style from './index.module.pcss';

enum EModalSteps {
    EditCustomer,
    Base,
    Close
}

interface ICustomer {
    customer: MainOrganization | undefined,
    requestId: number
}

const Customer = ({ customer, requestId }: ICustomer) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const [step, setModalStep] = useState<EModalSteps>(EModalSteps.Close);
    const onClose = useCallback(() => {
        setModalStep(EModalSteps.Close);
    }, []);

    // const onEditAction = () => {
    //     setModalStep(EModalSteps.Base);
    // };

    return (
        <React.Fragment>
            <Section>
                <div className={cn('customer__section-header')} id="employer">
                    <SectionHeader>
                        {t('routes.project-request.customer.title')}
                    </SectionHeader>
                </div>
                <SectionContentList>
                    {customer?.name && (
                        <SectionContentListItem title={t('routes.project-request.customer.list.customer')}>
                            {customer?.name}
                        </SectionContentListItem>
                    )}
                    {customer?.description && (
                        <SectionContentListItem title={t('routes.project-request.customer.list.comment')}>
                            {customer?.description}
                        </SectionContentListItem>
                    )}
                </SectionContentList>
            </Section>
            {step === EModalSteps.Base && (
                <Modal
                    onClose={onClose}
                    header={
                        <Header level={1} tag="h2">
                            {t('routes.project-request.customer.title')}
                        </Header>
                    }
                    footer={
                        <ModalFooterSubmit>
                            <Button
                                isSecondary={true}
                                onClick={() => {
                                    setModalStep(EModalSteps.Close);
                                }}
                            >
                                {t('routes.project-request.requirements.edit-modal.cancel')}
                            </Button>
                            <Button type="submit" form={MAIN_CUSTOMER_FORM_ID}>
                                {t('routes.project-request.requirements.edit-modal.save')}
                            </Button>
                        </ModalFooterSubmit>
                    }
                >
                    <EditCustomerForm
                        customer={customer}
                        onClose={onClose}
                        requestId={requestId}
                        onEditCustomer={() => {
                            setModalStep(EModalSteps.EditCustomer);
                        }}
                    />
                </Modal>
            )}

        </React.Fragment>
    );
};

export default Customer;
