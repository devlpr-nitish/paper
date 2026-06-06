"use client";

import { useEffect, useRef, useState } from "react";
import { SLASH_COMMANDS } from "./editor-types";
import type { BlockType } from "./editor-types";

type SlashMenuProps = {
    query: string;
    anchorRect: DOMRect;
    onSelect: (type: BlockType) => void;
    onClose: () => void;
};

export const SlashMenu = ({ query, anchorRect, onSelect, onClose }: SlashMenuProps) => {
    const [activeIdx, setActiveIdx] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);

    const filtered = query
        ? SLASH_COMMANDS.filter((c) =>
              c.label.toLowerCase().includes(query.toLowerCase()) ||
              c.keywords.some((k) => k.includes(query.toLowerCase()))
          )
        : SLASH_COMMANDS;

    useEffect(() => { setActiveIdx(0); }, [query]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown")  { e.preventDefault(); e.stopPropagation(); setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); }
            else if (e.key === "ArrowUp")   { e.preventDefault(); e.stopPropagation(); setActiveIdx((i) => Math.max(i - 1, 0)); }
            else if (e.key === "Enter")     { e.preventDefault(); e.stopPropagation(); if (filtered[activeIdx]) onSelect(filtered[activeIdx].blockType); }
            else if (e.key === "Escape")    { e.preventDefault(); onClose(); }
        };
        window.addEventListener("keydown", handler, true);
        return () => window.removeEventListener("keydown", handler, true);
    }, [filtered, activeIdx, onSelect, onClose]);

    useEffect(() => {
        const el = menuRef.current?.querySelector(`[data-idx="${activeIdx}"]`) as HTMLElement;
        el?.scrollIntoView({ block: "nearest" });
    }, [activeIdx]);

    const top = Math.min(anchorRect.bottom + 6, window.innerHeight - 340);
    const left = Math.max(8, Math.min(anchorRect.left, window.innerWidth - 290));

    if (filtered.length === 0) {
        return (
            <div style={{ top, left }} className="fixed z-50 w-72 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl text-sm text-zinc-400 dark:text-zinc-500">
                No results for &ldquo;{query}&rdquo;
            </div>
        );
    }

    const groups = [
        { id: "basic" as const, label: "Basic blocks" },
        { id: "media" as const, label: "Media" },
    ];

    let counter = 0;

    return (
        <div
            ref={menuRef}
            style={{ top, left }}
            className="fixed z-50 w-72 max-h-80 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl py-1"
        >
            {groups.map((group) => {
                const items = filtered.filter((c) => c.group === group.id);
                if (!items.length) return null;
                return (
                    <div key={group.id}>
                        <p className="px-3 py-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                            {group.label}
                        </p>
                        {items.map((cmd) => {
                            const idx = counter++;
                            return (
                                <button
                                    key={cmd.id}
                                    data-idx={idx}
                                    onMouseDown={(e) => { e.preventDefault(); onSelect(cmd.blockType); }}
                                    onMouseEnter={() => setActiveIdx(idx)}
                                    className={`cursor-pointer flex items-center gap-3 w-full px-3 py-2 text-left transition-colors ${
                                        activeIdx === idx
                                            ? "bg-zinc-100 dark:bg-zinc-800"
                                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                                    }`}
                                >
                                    <div className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center flex-shrink-0 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                                        {cmd.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{cmd.label}</p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{cmd.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
