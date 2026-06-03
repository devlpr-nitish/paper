import { FilePlus, FolderPlus, MoreHorizontal } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import type { SectionMenuProps } from "@/types/sidebar";

export const SectionMenu = ({ onNewPage, onNewFolder }: SectionMenuProps) => (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
            <button
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500"
                aria-label="Section options"
            >
                <MoreHorizontal size={12} />
            </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
            <DropdownMenu.Content
                className="min-w-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl p-1 z-50"
                sideOffset={4}
                align="start"
            >
                <DropdownMenu.Item
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer outline-none"
                    onSelect={onNewPage}
                >
                    <FilePlus size={13} /> New page
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer outline-none"
                    onSelect={onNewFolder}
                >
                    <FolderPlus size={13} /> New folder
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Portal>
    </DropdownMenu.Root>
);
