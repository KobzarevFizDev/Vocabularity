import { useState } from "react";
import WordsBoard from "../components/WordsBoard";
import Pagination from "../components/Pagination";
import ToolsBar from "../components/ToolsBar";
import { ToolId } from "../constants/toolId";
import { useWordStore } from "../stores/wordsStore";
import usePageWords from "../hooks/usePageWords";
import { DictionaryService } from "../api";

async function deleteSelectedWordsFromDictionary(onDeleted: () => void) {
    const ids = useWordStore.getState().needToDelete;
    if (ids.length === 0)
        return;

    try {
        await DictionaryService.deleteWordsFromDictionaryDictionaryWordsDelete(ids);
    }
    catch (err) {
        console.error("Failed to delete words", err);
        return;
    }

    useWordStore.getState().clearNeedToDelete();
    onDeleted();
}

export default function DictionaryPage() {
    const [pageIndex, setPageIndex] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    const pageSize = 20;
    const { words, total } = usePageWords(pageIndex, pageSize, refreshKey);
    const selectedIds = useWordStore(state => state.needToDelete);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const [lastTotalPages, setLastTotalPages] = useState(totalPages);
    if (lastTotalPages !== totalPages) {
        setLastTotalPages(totalPages);
        if (pageIndex >= totalPages)
            setPageIndex(totalPages - 1);
    }

    function onToolSelected(toolId: ToolId) {
        if (toolId === ToolId.Delete)
            deleteSelectedWordsFromDictionary(() => setRefreshKey(k => k + 1))
    }

    function onCardClick(id: string) {
        useWordStore.getState().toggleNeedToDelete(id)
    }

    return(
        <div className="page">
            <WordsBoard wordsPage={words} selectedIds={selectedIds} onCardClick={onCardClick}/>
            <Pagination currentPage={pageIndex}
                        totalPages={totalPages}
                        onPageChange={(pageIndex: number) => setPageIndex(pageIndex)} />
            <ToolsBar onSelected={onToolSelected} tools={[ToolId.Delete]} />
        </div>
    )
}