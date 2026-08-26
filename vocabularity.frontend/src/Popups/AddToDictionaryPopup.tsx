import { usePopupStateStore } from "../stores/popupStore";
import { useWordStore } from "../stores/wordsStore";
import { DictionaryService } from "../api";
import styles from "./Popup.module.css";

async function addSelectedWordsToDictionary() {
    const ids = useWordStore.getState().needToAdd;
    const words = useWordStore.getState().candidateWords.filter(w => ids.includes(w.id));
    if (words.length === 0)
        return;

    try {
        await DictionaryService.addWordsToDictionaryDictionaryWordsPost(words);
        useWordStore.getState().clearNeedToAdd();
    }
    catch (err) {
        console.error("Failed to add words", err);
    }
}

export default function AddToDictionaryPopup() {
    const [state, count] = usePopupStateStore((s) => s.addNewWordsPopup);
    const hideDictPopup = usePopupStateStore((s) => s.hideAddNewWordsPopup);

    if (state === "hide") return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.title}>Добавить в словарь</div>
                <div className={styles.message}>
                    Выбрано слов: <strong>{count}</strong>
                </div>
                <div style={{ display: "flex", gap: 12, width: "100%", marginTop: 8 }}>
                    <button
                        className={`${styles.button}`}
                        style={{ background: "#333", color: "#e0e0e0", flex: 1 }}
                        onClick={hideDictPopup}
                    >
                        Отмена
                    </button>
                    <button
                        className={`${styles.button} ${styles.successButton}`}
                        style={{ flex: 1 }}
                        onClick={() => {
                            addSelectedWordsToDictionary();
                            hideDictPopup();
                        }}
                    >
                        Добавить
                    </button>
                </div>
            </div>
        </div>
    );
}
