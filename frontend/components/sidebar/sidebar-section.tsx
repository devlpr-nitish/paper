"use client";

import { FilePlus, FolderPlus } from "lucide-react";
import { useState } from "react";
import type { Page } from "@/types/sidebar";
import { InlineCreate } from "./inline-create";
import { PageItem } from "./page-item";
import { SectionMenu } from "./section-menu";

type SidebarSectionProps = {
    label: string;
    icon: React.ReactNode;
    pages: Page[];
};

export const SidebarSection = ({ label, icon, pages }: SidebarSectionProps) => {
    const [creating, setCreating] = useState<{ type: "page" | "folder" } | null>(null);

    return (
        <div>
            <div className="group/section flex items-center gap-1 px-2 py-1 mt-3 mb-0.5">
                {icon}
                <span className="flex-1 text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                    {label}
                </span>
                <div className="invisible group-hover/section:visible flex items-center gap-0.5">
                    <button
                        className="cursor-pointer w-5 h-5 flex items-center justify-center rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500"
                        title="New page"
                        onClick={() => setCreating({ type: "page" })}
                    >
                        <FilePlus size={12} />
                    </button>
                    <button
                        className="cursor-pointer w-5 h-5 flex items-center justify-center rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500"
                        title="New folder"
                        onClick={() => setCreating({ type: "folder" })}
                    >
                        <FolderPlus size={12} />
                    </button>
                    <SectionMenu
                        onNewPage={() => setCreating({ type: "page" })}
                        onNewFolder={() => setCreating({ type: "folder" })}
                    />
                </div>
            </div>

            {pages.map((page) => (
                <PageItem key={page.id} page={page} />
            ))}

            {creating && (
                <InlineCreate
                    type={creating.type}
                    depth={0}
                    onConfirm={() => setCreating(null)}
                    onCancel={() => setCreating(null)}
                />
            )}
        </div>
    );
};