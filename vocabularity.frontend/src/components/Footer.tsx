import styles from './Footer.module.css'

interface FooterProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Footer({ currentPage, totalPages, onPageChange }: FooterProps) {
    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className={styles.container}>
            <button 
                className={styles.pageButton} 
                onClick={handlePrev} 
                disabled={currentPage === 1}
            >
                ← Prev
            </button>
            <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
            </span>
            <button 
                className={styles.pageButton} 
                onClick={handleNext} 
                disabled={currentPage === totalPages}
            >
                Next →
            </button>
        </div>
    )
}