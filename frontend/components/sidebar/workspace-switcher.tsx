"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Check, LogOut, Plus, Settings, X } from "lucide-react";
import { useState } from "react";
import { SettingsDialog } from "./settings-dialog";

type WorkspaceEntry = {
    id: string;
    name: string;
    initial: string;
    memberCount: number;
};

const ALL_WORKSPACES: WorkspaceEntry[] = [
    { id: "w1", name: "My Workspace",   initial: "M", memberCount: 1 },
    { id: "w2", name: "Team Alpha",     initial: "T", memberCount: 8 },
    { id: "w3", name: "Design Studio",  initial: "D", memberCount: 4 },
];

type WorkspaceSwitcherProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const WorkspaceSwitcher = ({ open, onOpenChange }: WorkspaceSwitcherProps) => {
    const [activeId, setActiveId] = useState("w1");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState("");

    const handleCreateWorkspace = () => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        setCreating(false);
        setNewName("");
    };

    const openSettings = () => {
        onOpenChange(false);
        setSettingsOpen(true);
    };

    return (
        <>
            <Dialog.Root open={open} onOpenChange={onOpenChange}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50" />
                    <Dialog.Content
                        className="fixed left-3 bottom-14 z-50 w-72 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl outline-none"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                        {/* Workspace list */}
                        <div className="p-2">
                            <p className="px-2 py-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                                Workspaces
                            </p>
                            {ALL_WORKSPACES.map((ws) => (
                                <button
                                    key={ws.id}
                                    onClick={() => setActiveId(ws.id)}
                                    className="cursor-pointer flex items-center gap-2.5 w-full px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-zinc-800 dark:bg-zinc-200 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-bold text-white dark:text-zinc-900">
                                            {ws.initial}
                                        </span>
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                                            {ws.name}
                                        </p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                            {ws.memberCount} {ws.memberCount === 1 ? "member" : "members"}
                                        </p>
                                    </div>
                                    {activeId === ws.id && (
                                        <Check size={14} className="text-zinc-600 dark:text-zinc-400 flex-shrink-0" />
                                    )}
                                </button>
                            ))}

                            {/* Create new workspace */}
                            {creating ? (
                                <div className="mt-1 flex items-center gap-2 px-2 py-1.5">
                                    <input
                                        autoFocus
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleCreateWorkspace();
                                            if (e.key === "Escape") { setCreating(false); setNewName(""); }
                                        }}
                                        placeholder="Workspace name"
                                        className="flex-1 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-md px-2 py-1 outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                                    />
                                    <button
                                        onClick={() => { setCreating(false); setNewName(""); }}
                                        className="cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setCreating(true)}
                                    className="cursor-pointer flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex items-center justify-center flex-shrink-0">
                                        <Plus size={13} />
                                    </div>
                                    <span className="text-sm">Create new workspace</span>
                                </button>
                            )}
                        </div>

                        <div className="border-t border-zinc-100 dark:border-zinc-800 p-2 space-y-0.5">
                            <button
                                onClick={openSettings}
                                className="cursor-pointer flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <Settings size={15} />
                                <span className="text-sm">Settings</span>
                            </button>
                            <button
                                className="cursor-pointer flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                            >
                                <LogOut size={15} />
                                <span className="text-sm">Log out</span>
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
        </>
    );
};
