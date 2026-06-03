"use client";

import { useState } from "react";
import { DocActions, type AccessLevel } from "./doc-actions";
import { DocTitle } from "./doc-title";

export const Topbar = () => {
    const [title, setTitle] = useState("Untitled");
    const [isFavorite, setIsFavorite] = useState(false);
    const [access, setAccess] = useState<AccessLevel>("private");

    return (
        <header className="flex items-center justify-between h-12 px-4 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex-shrink-0">
            <DocTitle title={title} onRename={setTitle} />
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