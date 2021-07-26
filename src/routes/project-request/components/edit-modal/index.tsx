import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';
import Tabs, { Tab } from 'component/tabs';
import ProjectRequestForm from 'route/project-request/components/form';
import PeriodForm from 'route/project-request/components/period-form';

import { useClassnames } from 'hook/use-classnames';

import style from './index.module.pcss';

interface IEditModal {
    setVisible: (visible: boolean) => void
}

enum ETabs {
    Main,
    ProjectTiming
}

const FORM_MAIN_ID = 'FORM_MAIN_ID';
const FORM_PROJECT_TIMING_ID = 'FORM_PROJECT_TIMING_ID';

const EditModal = ({ setVisible }: IEditModal) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const [activeTab, setActiveTab] = useState<ETabs>(ETabs.Main);
    const formId = activeTab === ETabs.Main ? FORM_MAIN_ID : FORM_PROJECT_TIMING_ID;

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.project-request.blocks.edit-modal.header')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);
                        }}
                    >
                        {t('routes.project-request.blocks.edit-modal.cancel')}
                    </Button>
                    <Button type="submit" form={formId}>
                        {t('routes.project-request.blocks.edit-modal.save')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            <Tabs>
                <Tab
                    active={activeTab === ETabs.Main}
                    onClick={() => {
                        setActiveTab(ETabs.Main);
                    }}
                >
                    {t('routes.project-request.blocks.tabs.main')}
                </Tab>
                <Tab
                    active={activeTab === ETabs.ProjectTiming}
                    onClick={() => {
                        setActiveTab(ETabs.ProjectTiming);
                    }}
                >
                    {t('routes.project-request.blocks.tabs.project-timing')}
                </Tab>
            </Tabs>
            <div className={cn({ 'hide': activeTab === ETabs.ProjectTiming })}>
                <ProjectRequestForm formId={FORM_MAIN_ID} />
            </div>
            <div className={cn({ 'hide': activeTab === ETabs.Main })}>
                <PeriodForm formId={FORM_PROJECT_TIMING_ID} />
            </div>
        </Modal>
    );
};

export default EditModal;
