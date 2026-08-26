import styles from "./Pagination.module.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const handlePrev = () => {
        if (currentPage > 0) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
    };

    return (
        <div className={styles.pagination}>
            <button
                className={styles.pageButton}
                onClick={handlePrev}
                disabled={currentPage === 0}
            >
                ← Prev
            </button>
            <span className={styles.pageInfo}>
                Page {currentPage + 1} of {totalPages}
            </span>
            <button
                className={styles.pageButton}
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
            >
                Next →
            </button>
        </div>
    );
}
