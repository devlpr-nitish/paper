import { ArrowUpRight, CircleFadingPlus, FileInput, FolderPlus } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import type { Page } from "@/types/sidebar";

type SearchDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    favorites: Page[];
};

export const SearchDialog = ({ open, onOpenChange, favorites }: SearchDialogProps) => (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Search pages, commands..." />
        <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Quick start">
                <CommandItem>
                    <FolderPlus size={16} className="opacity-60" />
                    <span>New folder</span>
                    <CommandShortcut>⌘N</CommandShortcut>
                </CommandItem>
                <CommandItem>
                    <FileInput size={16} className="opacity-60" />
                    <span>Import document</span>
                    <CommandShortcut>⌘I</CommandShortcut>
                </CommandItem>
                <CommandItem>
                    <CircleFadingPlus size={16} className="opacity-60" />
                    <span>Add block</span>
                    <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Favorites">
                {favorites.map((page) => (
                    <CommandItem key={page.id}>
                        <span className="text-base leading-none">{page.icon}</span>
                        <span>{page.title}</span>
                    </CommandItem>
                ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Navigation">
                <CommandItem>
                    <ArrowUpRight size={16} className="opacity-60" />
                    <span>Go to Home</span>
                </CommandItem>
                <CommandItem>
                    <ArrowUpRight size={16} className="opacity-60" />
                    <span>Go to Inbox</span>
                </CommandItem>
                <CommandItem>
                    <ArrowUpRight size={16} className="opacity-60" />
                    <span>Go to Settings</span>
                </CommandItem>
            </CommandGroup>
        </CommandList>
    </CommandDialog>
);
