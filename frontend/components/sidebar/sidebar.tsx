"use client";

import { ChevronDown, Command, File as FileIcon, Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { FAVORITES, NAV_ITEMS, PRIVATE_PAGES, WORKSPACE } from "../../utils/sidebar-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavIconButton } from "./nav-icon-button";
import { SearchDialog } from "./search-dialog";
import { SidebarSection } from "./sidebar-section";

export const Sidebar = () => {
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setSearchOpen((v) => !v);
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    return (
        <>
            <aside className="flex flex-col w-72 min-h-screen border-r border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950">
                {/* Top bar: nav icons + search */}
                <section className="p-2 flex gap-1">
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-zinc-600 bg-zinc-300 dark:bg-zinc-900 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 w-full text-left cursor-pointer"
                    >
                        <Search size={16} className="flex-shrink-0" />
                        <span className="flex-1">Search</span>
                        <kbd className="flex items-center gap-0.5 text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                            <Command size={12} />
                            <span>K</span>
                        </kbd>
                    </button>

                    <div className="flex items-center gap-0.5 px-1">
                        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
                            <NavIconButton key={id} icon={<Icon size={16} />} label={label} />
                        ))}
                    </div>
                    
                </section>

                {/* Page tree */}
                <section className="flex-1 overflow-y-auto px-2 pb-2">
                    <SidebarSection
                        label="Favorites"
                        icon={<Star size={12} className="text-zinc-400 dark:text-zinc-500" />}
                        pages={FAVORITES}
                    />
                    <SidebarSection
                        label="Private"
                        icon={<FileIcon size={12} className="text-zinc-400 dark:text-zinc-500" />}
                        pages={PRIVATE_PAGES}
                    />
                </section>

                {/* Workspace footer */}
                <section className="border-t border-zinc-100 dark:border-zinc-900 p-2">
                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-2 flex-1 min-w-0 px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left">
                            <div className="w-5 h-5 rounded bg-zinc-800 dark:bg-zinc-200 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-semibold text-white dark:text-zinc-900">
                                    {WORKSPACE.initial}
                                </span>
                            </div>
                            <span className="flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                                {WORKSPACE.name}
                            </span>
                            <ChevronDown size={14} className="text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                        </button>
                        <ThemeToggle />
                    </div>
                </section>
            </aside>

            <SearchDialog
                open={searchOpen}
                onOpenChange={setSearchOpen}
                favorites={FAVORITES}
            />
        </>
    );
};
