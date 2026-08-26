import { useState } from 'react';
import type { WordDto } from '../api';
import styles from './WordCard.module.css';

function speak(text: string) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}


export default function WordCard({ word, isSelected, onClick }: { word: WordDto; isSelected: boolean; onClick?: (id: string) => void }) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeak = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSpeaking(true);
        speak(word.word);
        setTimeout(() => setIsSpeaking(false), 1500);
    };


    return (
        <div className={`${styles.card} ${isSelected ? styles.favorited : ''}`} onClick={() => onClick?.(word.id)}>
            <div className={styles.levelBar}>
                <div className={styles.levelIndicator}>{word.level}</div>
            </div>
            <div className={styles.cardContent}>
            <div className={styles.wordSection}>
                <div className={styles.wordRow}>
                    <h2 className={styles.word}>{word.word}</h2>
                    <button
                        className={`${styles.speakButton} ${isSpeaking ? styles.speaking : ''}`}
                        onClick={handleSpeak}
                        aria-label="Прослушать"
                    >
                        {isSpeaking ? '🔊' : '🔈'}
                    </button>
                </div>
                <span className={styles.transcription}>[{word.transcription}]</span>
            </div>

            <p className={styles.translation}>{word.translation}</p>

            {word.examples.length > 0 && (
                <div className={styles.examples}>
                    <h3 className={styles.examplesTitle}>Примеры:</h3>
                    <ul>
                        {word.examples.map((example, index) => (
                            <li key={index} className={styles.exampleItem}>{example}</li>
                        ))}
                    </ul>
                </div>
            )}
            </div>
        </div>
    );
}
