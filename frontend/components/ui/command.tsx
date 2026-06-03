"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";

import { cn } from "@/lib/utils";

// ── Standalone primitives ──────────────────────────────────────────────────

const Command = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
    <CommandPrimitive
        ref={ref}
        className={cn("flex h-full w-full flex-col overflow-hidden", className)}
        {...props}
    />
));
Command.displayName = CommandPrimitive.displayName;

// ── CommandDialog — self-contained, no dialog.tsx dependency ───────────────

type CommandDialogProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
};

const CommandDialog = ({ open, onOpenChange, children }: CommandDialogProps) => (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
            {/* backdrop */}
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
            {/* panel — centered */}
            <DialogPrimitive.Content
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl"
                aria-describedby={undefined}
            >
                <DialogPrimitive.Title className="sr-only">Search</DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">
                    Search pages, commands, and navigate quickly
                </DialogPrimitive.Description>
                <Command>{children}</Command>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
);

// ── Input ──────────────────────────────────────────────────────────────────

const CommandInput = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
    <div className="flex items-center border-b border-zinc-200 dark:border-zinc-700 px-4">
        <MagnifyingGlassIcon width={18} height={18} className="mr-2 shrink-0 text-zinc-400 dark:text-zinc-500" />
        <CommandPrimitive.Input
            ref={ref}
            className={cn(
                "flex h-11 w-full bg-transparent py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        />
    </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

// ── List ───────────────────────────────────────────────────────────────────

const CommandList = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.List
        ref={ref}
        className={cn("max-h-80 overflow-y-auto overflow-x-hidden", className)}
        {...props}
    />
));
CommandList.displayName = CommandPrimitive.List.displayName;

// ── Empty ──────────────────────────────────────────────────────────────────

const CommandEmpty = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
    <CommandPrimitive.Empty
        ref={ref}
        className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
        {...props}
    />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

// ── Group ──────────────────────────────────────────────────────────────────

const CommandGroup = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        className={cn(
            "overflow-hidden p-2 text-zinc-900 dark:text-zinc-100 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-500 dark:[&_[cmdk-group-heading]]:text-zinc-400",
            className,
        )}
        {...props}
    />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

// ── Separator ──────────────────────────────────────────────────────────────

const CommandSeparator = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 h-px bg-zinc-200 dark:bg-zinc-700", className)}
        {...props}
    />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

// ── Item ───────────────────────────────────────────────────────────────────

const CommandItem = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 outline-none data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800 data-[selected=true]:text-zinc-900 dark:data-[selected=true]:text-zinc-100 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            className,
        )}
        {...props}
    />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

// ── Shortcut ───────────────────────────────────────────────────────────────

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <kbd
        className={cn(
            "-me-1 ms-auto inline-flex h-5 items-center rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-1 font-mono text-[0.625rem] font-medium text-zinc-400 dark:text-zinc-500",
            className,
        )}
        {...props}
    />
);
CommandShortcut.displayName = "CommandShortcut";

export {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
};
