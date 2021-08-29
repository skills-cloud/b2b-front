import { useEffect } from 'react';

const ESC = 27;

export const JS_CLASS = 'js-modal-content';

const useModalClose = (visible: boolean, setVisible: (visible: boolean) => void) => {
    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const node = event.target as HTMLElement;

            if(visible && node.closest(`.${JS_CLASS}`) === null && node.closest('body') !== null) {
                setVisible(false);
            }
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if(visible && event.keyCode === ESC) {
                setVisible(false);
            }
        };

        if(visible) {
            requestAnimationFrame(() => {
                document.addEventListener('click', onClick);
                document.addEventListener('keydown', onKeyDown);
            });
        }


        return () => {
            document.removeEventListener('click', onClick);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [visible, setVisible]);
};

export default useModalClose;
