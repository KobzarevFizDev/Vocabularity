import type { WordDto } from "../api";
import WordCard from "./WordCard";

import styles from "./WordBoard.module.css";


export default function WordsBoard( { wordsPage, selectedIds, onCardClick } : { wordsPage: WordDto[]; selectedIds: string[]; onCardClick?: (id: string) => void } ) {
    return(
        <div className={styles.wordsContainer}>
            <div className={styles.cardsGrid}>
                {
                    wordsPage.map((word) => (
                        <WordCard key={word.id} word={word} isSelected={selectedIds.includes(word.id)} onClick={onCardClick} />
                    ))
                }
            </div>
        </div>
    )
}
// const WORDS_PER_PAGE = 15;

// interface WordsBoardProps {
//     words: WordItem[];
//     favorites: Set<string>;
//     onToggleFavorite: (id: string) => void;
// }

// export default function WordsBoard({ words, favorites, onToggleFavorite }: WordsBoardProps) {
//     const [currentPage, setCurrentPage] = useState(1);

//     useEffect(() => {
//         setCurrentPage(1);
//     }, [words]);

//     const totalPages = Math.max(1, Math.ceil(words.length / WORDS_PER_PAGE));
//     const start = (currentPage - 1) * WORDS_PER_PAGE;
//     const end = start + WORDS_PER_PAGE;
//     const pageWords = words.slice(start, end);

//     return (
//         <div className={styles.wordsContainer}>
//             <div className={styles.cardsGrid}>
//                 {
//                     pageWords.map((word, index) => (
//                         <WordCard key={word.id} word={word} isFavorite={favorites.has(word.id)} onToggleFavorite={onToggleFavorite} />
//                     ))
//                 }
//             </div>
//             {words.length > WORDS_PER_PAGE && (
//                 <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
//             )}
//         </div>
//     )
// }