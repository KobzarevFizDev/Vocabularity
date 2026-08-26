import { usePopupStateStore } from "../stores/popupStore";
import styles from "./Popup.module.css"

export default function StatusPopup() {
    const [state, comment] = usePopupStateStore((s) => s.extractNewWordsPopup);
    const hidePopup = usePopupStateStore((s) => s.hideExtractNewWordsPopup);

    if (state === 'hide') return null;

    const title = {
        success: 'Успешно',
        error: 'Ошибка',
        wait: 'Ожидание',
    }[state] ?? '';

    if (state === 'wait') {
        return (
            <div className={styles.overlay}>
                <div className={`${styles.popup} ${styles.wait}`}>
                    <div className={styles.spinner} />
                    <div className={styles.title}>{title}</div>
                    <div className={styles.message}>Пожалуйста, подождите...</div>
                </div>
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div className={styles.overlay}>
                <div className={`${styles.popup} ${styles.error}`}>
                    <div className={styles.iconContainer}>
                        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.message}>{comment}</div>
                    <button className={`${styles.button} ${styles.errorButton}`} onClick={hidePopup}>OK</button>
                </div>
            </div>
        );
    }

    if (state === 'success') {
        return (
            <div className={styles.overlay}>
                <div className={`${styles.popup} ${styles.success}`}>
                    <div className={styles.iconContainer}>
                        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="8 12 11 15 16 9" />
                        </svg>
                    </div>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.message}>Найдено {comment} новых слов</div>
                    <button className={`${styles.button} ${styles.successButton}`} onClick={hidePopup}>OK</button>
                </div>
            </div>
        );
    }

    return null;
}
