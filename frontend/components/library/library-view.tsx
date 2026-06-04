"use client";

import { File as FileIcon, Folder as FolderIcon, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import type { Page } from "@/types/sidebar";
import { FAVORITES, PRIVATE_PAGES, RECENT_PAGES, SHARED_PAGES } from "../../utils/sidebar-data";

type Tab = "recent" | "favorites" | "shared" | "private";

const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "recent",    label: "Recent",    count: RECENT_PAGES.length    },
    { id: "favorites", label: "Favorites", count: FAVORITES.length       },
    { id: "shared",    label: "Shared",    count: SHARED_PAGES.length    },
    { id: "private",   label: "Private",   count: PRIVATE_PAGES.length   },
];

const TAB_PAGES: Record<Tab, Page[]> = {
    recent:    RECENT_PAGES,
    favorites: FAVORITES,
    shared:    SHARED_PAGES,
    private:   PRIVATE_PAGES,
};

const PageCard = ({ page }: { page: Page }) => (
    <button className="cursor-pointer flex items-start gap-3 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left transition-colors group w-full">
        <span className="text-2xl leading-none mt-0.5 flex-shrink-0">
            {page.icon
                ? page.icon
                : page.type === "folder"
                    ? <FolderIcon size={22} className="text-zinc-400" />
                    : <FileIcon size={22} className="text-zinc-400" />}
        </span>
        <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                {page.title}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 capitalize">{page.type}</p>
        </div>
    </button>
);

type LibraryViewProps = { sidebarOpen: boolean; onShowSidebar: () => void };

export const LibraryView = ({ sidebarOpen, onShowSidebar }: LibraryViewProps) => {
    const [tab, setTab] = useState<Tab>("recent");
    const pages = TAB_PAGES[tab];

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
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Library</h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 mb-6 border-b border-zinc-100 dark:border-zinc-800">
                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`cursor-pointer flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors -mb-px border-b-2 ${
                                    tab === t.id
                                        ? "text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-100"
                                        : "text-zinc-400 dark:text-zinc-500 border-transparent hover:text-zinc-700 dark:hover:text-zinc-300"
                                }`}
                            >
                                {t.label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    tab === t.id
                                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600"
                                }`}>
                                    {t.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {pages.length === 0 ? (
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center mt-16">No pages here yet.</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {pages.map((page) => <PageCard key={page.id} page={page} />)}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};
