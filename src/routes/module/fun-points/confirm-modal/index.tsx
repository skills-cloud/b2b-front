import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';
import Error from 'component/error';

interface IRegenerateModal {
    setVisible: (visible: boolean) => void,
    onClickCancel?(): void
}

const ConfirmModalRegenerate = ({ setVisible, onClickCancel }: IRegenerateModal) => {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);

    const onClickOk = () => {
        console.info('OK CLICKED');
        setError('OK CLICKED');
    };

    const elError = useMemo(() => {
        if(error) {
            return <Error elIcon={true}>{error}</Error>;
        }
    }, [error]);

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.module.modal-regenerate.header')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);

                            onClickCancel?.();
                        }}
                    >
                        {t('routes.module.modal-regenerate.cancel')}
                    </Button>
                    <Button onClick={onClickOk}>
                        {t('routes.module.modal-regenerate.ok')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            {t('routes.module.modal-regenerate.text')}
            {elError}
        </Modal>
    );
};

export default ConfirmModalRegenerate;
