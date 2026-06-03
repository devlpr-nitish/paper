import {
    Copy,
    ExternalLink,
    FilePlus,
    FolderPlus,
    MoreHorizontal,
    Pencil,
    Star,
    Trash2,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import type { PageMenuProps } from "@/types/sidebar";

export const PageMenu = ({ page, onRename, onDelete, onNewPage, onNewFolder }: PageMenuProps) => (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
            <button
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-500 dark:text-zinc-400"
                onClick={(e) => e.stopPropagation()}
                aria-label="More options"
            >
                <MoreHorizontal size={12} />
            </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
            <DropdownMenu.Content
                className="min-w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl p-1 z-50"
                sideOffset={4}
                align="start"
            >
                <DropdownMenu.Item
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer outline-none"
                    onSelect={onRename}
                >
                    <Pencil size={13} /> Rename
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer outline-none">
                    <Copy size={13} /> Duplicate
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer outline-none">
                    <ExternalLink size={13} /> Open in new tab
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer outline-none">
                    <Star size={13} /> Add to Favorites
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                <DropdownMenu.Item
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer outline-none"
                    onSelect={onNewPage}
                >
                    <FilePlus size={13} /> New page inside
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer outline-none"
                    onSelect={onNewFolder}
                >
                    <FolderPlus size={13} /> New folder inside
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                <DropdownMenu.Item
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer outline-none"
                    onSelect={onDelete}
                >
                    <Trash2 size={13} /> Delete
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Portal>
    </DropdownMenu.Root>
);
