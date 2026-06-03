"use client";

import {
    ChevronDown,
    ChevronRight,
    File as FileIcon,
    Folder as FolderIcon,
    Plus,
} from "lucide-react";
import { useState } from "react";
import type { PageItemProps } from "@/types/sidebar";
import { InlineCreate } from "./inline-create";
import { PageMenu } from "./page-menu";

export const PageItem = ({ page, depth = 0 }: PageItemProps) => {
    const [expanded, setExpanded] = useState(false);
    const [creating, setCreating] = useState<{ type: "page" | "folder" } | null>(null);

    const hasChildren = (page.children && page.children.length > 0) || page.type === "folder";

    const startCreate = (type: "page" | "folder") => {
        setExpanded(true);
        setCreating({ type });
    };

    return (
        <div>
            <div
                className="group/page flex items-center gap-1 py-1 rounded-md text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer select-none"
                style={{ paddingLeft: `${8 + depth * 12}px`, paddingRight: "6px" }}
            >
                <button
                    className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-zinc-400 dark:text-zinc-500 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (hasChildren) setExpanded((v) => !v);
                    }}
                >
                    {hasChildren
                        ? expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
                        : null}
                </button>

                <span className="flex-shrink-0 w-4 text-center text-xs leading-none">
                    {page.icon
                        ? page.icon
                        : page.type === "folder"
                            ? <FolderIcon size={13} className="text-zinc-500" />
                            : <FileIcon size={13} className="text-zinc-500" />}
                </span>

                <span className="flex-1 truncate">{page.title}</span>

                <div className="invisible group-hover/page:visible flex items-center gap-0.5">
                    <button
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500"
                        title="New page inside"
                        onClick={(e) => { e.stopPropagation(); startCreate("page"); }}
                    >
                        <Plus size={12} />
                    </button>
                    <PageMenu
                        page={page}
                        onRename={() => {}}
                        onDelete={() => {}}
                        onNewPage={() => startCreate("page")}
                        onNewFolder={() => startCreate("folder")}
                    />
                </div>
            </div>

            {hasChildren && expanded && (
                <div>
                    {page.children?.map((child) => (
                        <PageItem key={child.id} page={child} depth={depth + 1} />
                    ))}
                </div>
            )}

            {creating && (
                <InlineCreate
                    type={creating.type}
                    depth={depth + 1}
                    onConfirm={() => setCreating(null)}
                    onCancel={() => setCreating(null)}
                />
            )}
        </div>
    );
};
