import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';

import { TimeSheetRowRead } from 'adapter/types/main/time-sheet-row/get/code-200';

import TimesheetForm from '../form';
import { IGetCvListFilters } from 'adapter/api/cv';
import { IGetRequestListParams } from 'adapter/api/main';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    fields?: TimeSheetRowRead,
    cvFilters?: IGetCvListFilters,
    requestFilters?: IGetRequestListParams
}

const FORM_TIMESHEET_ID = 'FORM_MAIN_ID';

const EditModal = ({ setVisible, cvFilters, fields, requestFilters }: IEditModal) => {
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
                requestFilters={requestFilters}
            />
        </Modal>
    );
};

export default EditModal;
