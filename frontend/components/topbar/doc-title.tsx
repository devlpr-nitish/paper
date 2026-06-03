"use client";

import { FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type DocTitleProps = {
    title: string;
    onRename: (title: string) => void;
};

export const DocTitle = ({ title, onRename }: DocTitleProps) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(title);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) inputRef.current?.select();
    }, [editing]);

    const commit = () => {
        const trimmed = draft.trim();
        if (trimmed) onRename(trimmed);
        else setDraft(title);
        setEditing(false);
    };

    return (
        <div className="flex items-center gap-2 min-w-0">
            <FileText size={15} className="flex-shrink-0 text-zinc-400 dark:text-zinc-500" />

            {editing ? (
                <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={commit}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") commit();
                        if (e.key === "Escape") {
                            setDraft(title);
                            setEditing(false);
                        }
                    }}
                    className="text-sm font-medium bg-transparent border-b border-blue-500 outline-none text-zinc-900 dark:text-zinc-100 min-w-0 w-48"
                />
            ) : (
                <button
                    onClick={() => { setDraft(title); setEditing(true); }}
                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 truncate max-w-xs"
                    title="Click to rename"
                >
                    {title}
                </button>
            )}
        </div>
    );
};
