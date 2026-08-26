import { useState } from "react"
import styles from "./ToolsBar.module.css"
import type { ToolId } from "../constants/toolId"

export default function ToolsBar({ onSelected, tools }:{ onSelected:(toolId: ToolId) => void, tools: ToolId[] }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={`${styles.container} ${isOpen ? styles.open : ""}`}>
            {isOpen && (
                <div className={styles.options}>
                    {
                        tools.map((toolId: ToolId, index: number) => (
                            <button onClick={() => onSelected(toolId)}
                                    key={index}
                                    className={styles.option}>
                                {toolId}
                            </button>
                        ))
                    }
                </div>
            )}
            <button
                className={styles.toggle}
                onClick={() => setIsOpen((v) => !v)}
            >
                {isOpen ? "×" : "+"}
            </button>
        </div>
    )
}
