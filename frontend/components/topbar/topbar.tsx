"use client";

import { PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { DocActions, type AccessLevel } from "./doc-actions";
import { DocTitle } from "./doc-title";

type TopbarProps = { sidebarOpen: boolean; onShowSidebar: () => void };

export const Topbar = ({ sidebarOpen, onShowSidebar }: TopbarProps) => {
    const [title, setTitle] = useState("Untitled");
    const [isFavorite, setIsFavorite] = useState(false);
    const [access, setAccess] = useState<AccessLevel>("private");

    return (
        <header className="flex items-center justify-between h-12 px-4 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex-shrink-0">
            <div className="flex items-center gap-1">
                {!sidebarOpen && (
                    <button
                        onClick={onShowSidebar}
                        title="Show sidebar"
                        className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    >
                        <PanelLeftOpen size={15} />
                    </button>
                )}
                <DocTitle title={title} onRename={setTitle} />
            </div>
            <DocActions
                editedAt="Edited just now"
                isFavorite={isFavorite}
                onToggleFavorite={() => setIsFavorite((v) => !v)}
                access={access}
                onAccessChange={setAccess}
                onShare={() => {}}
                onDelete={() => {}}
            />
        </header>
    );
};