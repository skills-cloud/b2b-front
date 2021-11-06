import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';

import { TimeSheetRowRead } from 'adapter/types/main/time-sheet-row/get/code-200';
import { IGetCvListFilters } from 'adapter/api/cv';

import TimesheetForm from '../form';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    fields?: Partial<TimeSheetRowRead>,
    cvFilters?: IGetCvListFilters,
    requestId?: string
}

const FORM_TIMESHEET_ID = 'FORM_MAIN_ID';

const EditModal = ({ setVisible, cvFilters, fields, requestId }: IEditModal) => {
    const { t } = useTranslation();

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.timesheet.edit-modal.header')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);
                        }}
                    >
                        {t('routes.timesheet.edit-modal.cancel')}
                    </Button>
                    <Button type="submit" form={FORM_TIMESHEET_ID}>
                        {t('routes.timesheet.edit-modal.save')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            <TimesheetForm
                formId={FORM_TIMESHEET_ID}
                onSuccess={() => {
                    setVisible(false);
                }}
                defaultValues={fields}
                cvFilters={cvFilters}
                requestId={requestId}
            />
        </Modal>
    );
};

export default EditModal;
