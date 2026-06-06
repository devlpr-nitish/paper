"use client";

import { BookOpen, ChevronDown, Clock, Command, File as FileIcon, Home, Inbox, PanelLeftClose, Search, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { ActiveView } from "@/app/app-shell";
import { FAVORITES, NOTIFICATIONS, PRIVATE_PAGES, RECENT_PAGES, WORKSPACE } from "../../utils/sidebar-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { InboxPanel } from "./inbox-panel";
import { NavIconButton } from "./nav-icon-button";
import { SearchDialog } from "./search-dialog";
import { SidebarSection } from "./sidebar-section";
import { WorkspaceSwitcher } from "./workspace-switcher";

type SidebarProps = {
    onHide: () => void;
    activeView: ActiveView;
    onSetView: (view: ActiveView) => void;
};

export const Sidebar = ({ onHide, activeView, onSetView }: SidebarProps) => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [workspaceSwitcherOpen, setWorkspaceSwitcherOpen] = useState(false);
    const [inboxOpen, setInboxOpen] = useState(false);

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

    const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

    const bottomItem = (view: ActiveView) =>
        `cursor-pointer flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-sm transition-colors ${
            activeView === view
                ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200"
        }`;

    return (
        <>
            <aside className="flex flex-col w-72 h-full border-r border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                {/* Top bar: search + nav icons */}
                <section className="p-2 flex gap-1 flex-shrink-0">
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-zinc-600 bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 w-full text-left cursor-pointer"
                    >
                        <Search size={16} className="flex-shrink-0" />
                        <span className="flex-1">Search</span>
                        <kbd className="flex items-center gap-0.5 text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                            <Command size={12} />
                            <span>K</span>
                        </kbd>
                    </button>
                    <div className="flex items-center gap-0.5 px-1">
                        <NavIconButton
                            icon={<Home size={16} />}
                            label="Home"
                            active={activeView === "home" && !inboxOpen}
                            onClick={() => { setInboxOpen(false); onSetView("home"); }}
                        />
                        <NavIconButton
                            icon={<Inbox size={16} />}
                            label="Inbox"
                            active={inboxOpen}
                            badge={unreadCount}
                            onClick={() => setInboxOpen((v) => !v)}
                        />
                        <NavIconButton
                            icon={<PanelLeftClose size={16} />}
                            label="Hide sidebar"
                            onClick={onHide}
                        />
                    </div>
                </section>

                {/* Page tree OR inbox panel */}
                <section className="flex-1 overflow-y-auto px-2 pb-2 min-h-0">
                    {inboxOpen ? (
                        <InboxPanel onClose={() => setInboxOpen(false)} />
                    ) : (
                        <>
                            <SidebarSection
                                label="Recent"
                                icon={<Clock size={12} className="text-zinc-400 dark:text-zinc-500" />}
                                pages={RECENT_PAGES}
                            />
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

                            {/* Bottom links */}
                            <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-0.5">
                                <button className={bottomItem("library")} onClick={() => onSetView("library")}>
                                    <BookOpen size={14} />
                                    Library
                                </button>
                                <button className={bottomItem("trash")} onClick={() => onSetView("trash")}>
                                    <Trash2 size={14} />
                                    Trash
                                </button>
                            </div>
                        </>
                    )}
                </section>

                {/* Workspace footer */}
                <section className="border-t border-zinc-200 dark:border-zinc-800 p-2 flex-shrink-0">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setWorkspaceSwitcherOpen(true)}
                            className="cursor-pointer flex items-center gap-2 flex-1 min-w-0 px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left"
                        >
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
            <WorkspaceSwitcher
                open={workspaceSwitcherOpen}
                onOpenChange={setWorkspaceSwitcherOpen}
            />
        </>
    );
};
