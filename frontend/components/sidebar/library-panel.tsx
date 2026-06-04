"use client";

import { ArrowLeft, File as FileIcon, Folder as FolderIcon } from "lucide-react";
import { useState } from "react";
import type { Page } from "@/types/sidebar";
import { FAVORITES, PRIVATE_PAGES, RECENT_PAGES, SHARED_PAGES } from "../../utils/sidebar-data";

type Tab = "recent" | "favorites" | "shared" | "private";

const TABS: { id: Tab; label: string }[] = [
    { id: "recent",    label: "Recent"    },
    { id: "favorites", label: "Favorites" },
    { id: "shared",    label: "Shared"    },
    { id: "private",   label: "Private"   },
];

const TAB_PAGES: Record<Tab, Page[]> = {
    recent:    RECENT_PAGES,
    favorites: FAVORITES,
    shared:    SHARED_PAGES,
    private:   PRIVATE_PAGES,
};

const PageRow = ({ page }: { page: Page }) => (
    <button className="cursor-pointer flex items-center gap-2.5 w-full px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left group">
        <span className="flex-shrink-0 w-4 text-center text-sm leading-none">
            {page.icon
                ? page.icon
                : page.type === "folder"
                    ? <FolderIcon size={13} className="text-zinc-500" />
                    : <FileIcon size={13} className="text-zinc-500" />}
        </span>
        <span className="flex-1 truncate text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
            {page.title}
        </span>
    </button>
);

export const LibraryPanel = ({ onBack }: { onBack: () => void }) => {
    const [tab, setTab] = useState<Tab>("recent");
    const pages = TAB_PAGES[tab];

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
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Library</span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-100 dark:border-zinc-800 px-2 pt-1">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`cursor-pointer px-2.5 py-1.5 text-xs font-medium transition-colors rounded-t-md ${
                            tab === t.id
                                ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-800 dark:border-zinc-200 -mb-px"
                                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Page list */}
            <div className="flex-1 overflow-y-auto px-1 py-1">
                {pages.length === 0 ? (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center mt-6 px-4">
                        No pages here yet.
                    </p>
                ) : (
                    pages.map((page) => <PageRow key={page.id} page={page} />)
                )}
            </div>
        </div>
    );
};
