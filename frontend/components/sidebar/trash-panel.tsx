"use client";

import { ArrowLeft, File as FileIcon, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Page } from "@/types/sidebar";
import { TRASH_PAGES } from "../../utils/sidebar-data";

export const TrashPanel = ({ onBack }: { onBack: () => void }) => {
    const [items, setItems] = useState<Page[]>(TRASH_PAGES);

    const restore = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));
    const deleteForever = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));
    const emptyTrash = () => setItems([]);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                <button
                    onClick={onBack}
                    className="cursor-pointer w-6 h-6 flex items-center justify-center rounded-md text-zinc-400 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors flex-shrink-0"
                >
                    <ArrowLeft size={14} />
                </button>
                <span className="flex-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">Trash</span>
                {items.length > 0 && (
                    <button
                        onClick={emptyTrash}
                        className="cursor-pointer text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                    >
                        Empty
                    </button>
                )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-1 py-1">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-400 dark:text-zinc-500 pb-8">
                        <Trash2 size={28} strokeWidth={1.5} />
                        <p className="text-xs">Trash is empty</p>
                    </div>
                ) : (
                    items.map((page) => (
                        <div
                            key={page.id}
                            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 group"
                        >
                            <span className="flex-shrink-0 w-4 text-center text-sm leading-none">
                                {page.icon ?? <FileIcon size={13} className="text-zinc-500" />}
                            </span>
                            <span className="flex-1 truncate text-sm text-zinc-500 dark:text-zinc-400 line-through">
                                {page.title}
                            </span>
                            <div className="invisible group-hover:visible flex items-center gap-0.5 flex-shrink-0">
                                <button
                                    onClick={() => restore(page.id)}
                                    title="Restore"
                                    className="cursor-pointer w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                                >
                                    <RotateCcw size={12} />
                                </button>
                                <button
                                    onClick={() => deleteForever(page.id)}
                                    title="Delete forever"
                                    className="cursor-pointer w-6 h-6 flex items-center justify-center rounded hover:bg-red-100 dark:hover:bg-red-950 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
