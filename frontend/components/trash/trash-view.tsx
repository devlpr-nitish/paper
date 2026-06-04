"use client";

import { File as FileIcon, PanelLeftOpen, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Page } from "@/types/sidebar";
import { TRASH_PAGES } from "../../utils/sidebar-data";

type TrashViewProps = { sidebarOpen: boolean; onShowSidebar: () => void };

export const TrashView = ({ sidebarOpen, onShowSidebar }: TrashViewProps) => {
    const [items, setItems] = useState<Page[]>(TRASH_PAGES);

    const restore = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));
    const deleteForever = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));
    const emptyTrash = () => setItems([]);

    return (
        <main className="flex flex-col flex-1 h-full min-h-0 bg-white dark:bg-zinc-950">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-16 pt-10 pb-20">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        {!sidebarOpen && (
                            <button
                                onClick={onShowSidebar}
                                title="Show sidebar"
                                className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors flex-shrink-0"
                            >
                                <PanelLeftOpen size={15} />
                            </button>
                        )}
                        <h1 className="flex-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Trash</h1>
                        {items.length > 0 && (
                            <button
                                onClick={emptyTrash}
                                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                            >
                                <Trash2 size={13} />
                                Empty trash
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 mt-24 text-zinc-300 dark:text-zinc-700">
                            <Trash2 size={48} strokeWidth={1} />
                            <p className="text-sm text-zinc-400 dark:text-zinc-500">Trash is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {items.map((page) => (
                                <div
                                    key={page.id}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 group transition-colors"
                                >
                                    <span className="text-xl leading-none flex-shrink-0">
                                        {page.icon ?? <FileIcon size={18} className="text-zinc-400" />}
                                    </span>
                                    <span className="flex-1 text-sm text-zinc-400 dark:text-zinc-500 line-through truncate">
                                        {page.title}
                                    </span>
                                    <div className="invisible group-hover:visible flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => restore(page.id)}
                                            className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                                        >
                                            <RotateCcw size={11} />
                                            Restore
                                        </button>
                                        <button
                                            onClick={() => deleteForever(page.id)}
                                            className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                        >
                                            <Trash2 size={11} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};
