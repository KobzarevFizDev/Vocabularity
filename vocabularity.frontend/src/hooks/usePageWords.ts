import { useEffect, useState } from "react";
import { CancelError, DictionaryService } from "../api";
import type { WordDto } from "../api";

export default function usePageWords(
    pageIndex: number,
    pageSize: number,
    refreshKey: number = 0,
): { words: WordDto[]; total: number; loading: boolean; error: boolean } {
    const [words, setWords] = useState<WordDto[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        let cancelled = false;

        const request = DictionaryService.getWordsDictionaryWordsGet(pageIndex, pageSize);

        request
            .then((data) => {
                if (cancelled) return;
                setWords(data.words);
                setTotal(data.total);
                setError(false);
            })
            .catch((err) => {
                if (cancelled || err instanceof CancelError) return;
                setError(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
            request.cancel();
        };
    }, [pageIndex, pageSize, refreshKey]);

    return { words, total, loading, error };
}
