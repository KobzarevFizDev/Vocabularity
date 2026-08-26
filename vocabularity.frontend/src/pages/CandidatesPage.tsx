import { useState } from "react";
import WordsBoard from "../components/WordsBoard";
import { useWordStore } from "../stores/wordsStore";
import Pagination from "../components/Pagination";
import ToolsBar from "../components/ToolsBar";
import { ToolId } from "../constants/toolId";
import { DictionaryService } from "../api";

async function addSelectedWords(onAdded: () => void) {
    const ids = useWordStore.getState().needToAdd;
    const words = useWordStore.getState().candidateWords.filter(w => ids.includes(w.id));
    if (words.length === 0)
        return;

    try {
        await DictionaryService.addWordsToDictionaryDictionaryWordsPost(words);
    }
    catch (err) {
        console.error("Failed to add words", err);
        return;
    }

    useWordStore.getState().clearNeedToAdd();
    onAdded();
}

export default function CandidatesPage() {
    const [pageIndex, setPageIndex] = useState(0);

    const words = useWordStore(state => state.candidateWords);
    const selectedIds = useWordStore(state => state.needToAdd);

    const pageSize = 20;
    const totalPages = Math.max(1, Math.ceil(words.length / pageSize));
    const pageWords = words.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

    const [lastTotalPages, setLastTotalPages] = useState(totalPages);
    if (lastTotalPages !== totalPages) {
        setLastTotalPages(totalPages);
        if (pageIndex >= totalPages)
            setPageIndex(totalPages - 1);
    }

    function onToolSelected(toolId: ToolId) {
        if (toolId === ToolId.Add) {
            const ids = useWordStore.getState().needToAdd;
            addSelectedWords(() => useWordStore.getState().removeCandidates(ids));
        }
    }

    function onCardClick(id: string) {
        useWordStore.getState().toggleNeedToAdd(id)
    }

    return (
        <div className="page">
            <WordsBoard wordsPage={pageWords} selectedIds={selectedIds} onCardClick={onCardClick} />
            <Pagination currentPage={pageIndex}
                        totalPages={totalPages}
                        onPageChange={(pageIndex: number) => setPageIndex(pageIndex)}/>
            <ToolsBar onSelected={onToolSelected} tools={[ToolId.Add]}/>
        </div>
    )
}
