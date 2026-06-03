"use client";

import { File as FileIcon, Folder as FolderIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { InlineCreateProps } from "@/types/sidebar";

export const InlineCreate = ({ type, depth, onConfirm, onCancel }: InlineCreateProps) => {
    const [value, setValue] = useState("");
    const doneRef = useRef(false);

    return (
        <div
            className="flex items-center gap-1.5 py-0.5"
            style={{ paddingLeft: `${20 + depth * 12}px`, paddingRight: "8px" }}
        >
            <span className="flex-shrink-0 text-zinc-500">
                {type === "folder" ? <FolderIcon size={13} /> : <FileIcon size={13} />}
            </span>
            <input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && value.trim()) {
                        doneRef.current = true;
                        onConfirm(value.trim());
                    }
                    if (e.key === "Escape") {
                        doneRef.current = true;
                        onCancel();
                    }
                }}
                onBlur={() => { if (!doneRef.current) onCancel(); }}
                className="flex-1 min-w-0 text-sm bg-white dark:bg-zinc-800 border border-blue-500 dark:border-blue-400 rounded px-1.5 py-0.5 outline-none text-zinc-900 dark:text-zinc-100"
                placeholder={type === "folder" ? "Folder name" : "Page name"}
            />
        </div>
    );
};
