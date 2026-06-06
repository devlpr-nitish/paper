"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BlockItem } from "./block-item";
import { FormatToolbar } from "./format-toolbar";
import type { Block, BlockType } from "./editor-types";

const genId = () => Math.random().toString(36).slice(2, 9);

const INITIAL_BLOCKS: Block[] = [
    { id: genId(), type: "paragraph", content: "" },
];

export const BlockEditor = () => {
    const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
    const [focusedId, setFocusedId] = useState<string | null>(INITIAL_BLOCKS[0].id);
    const [pendingFocusId, setPendingFocusId] = useState<string | null>(INITIAL_BLOCKS[0].id);
    const [toolbar, setToolbar] = useState<{ top: number; left: number } | null>(null);
    const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);

    // Track block refs for programmatic focus
    const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // Format toolbar: show when there is a non-collapsed selection
    useEffect(() => {
        const handler = () => {
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed || !sel.rangeCount) {
                setToolbar(null);
                return;
            }
            const rect = sel.getRangeAt(0).getBoundingClientRect();
            if (!rect.width) { setToolbar(null); return; }
            setToolbar({
                top: rect.top - 50,
                left: rect.left + rect.width / 2 - 130,
            });
        };
        document.addEventListener("selectionchange", handler);
        return () => document.removeEventListener("selectionchange", handler);
    }, []);

    // Clear pending focus after one render cycle
    useEffect(() => {
        if (pendingFocusId) {
            const timer = setTimeout(() => setPendingFocusId(null), 50);
            return () => clearTimeout(timer);
        }
    }, [pendingFocusId]);

    const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    }, []);

    const addBlockAfter = useCallback((id: string, type: BlockType = "paragraph") => {
        const newBlock: Block = { id: genId(), type, content: "" };
        setBlocks((prev) => {
            const idx = prev.findIndex((b) => b.id === id);
            if (idx === -1) return [...prev, newBlock];
            return [...prev.slice(0, idx + 1), newBlock, ...prev.slice(idx + 1)];
        });
        setPendingFocusId(newBlock.id);
    }, []);

    const addBlockBefore = useCallback((id: string) => {
        const newBlock: Block = { id: genId(), type: "paragraph", content: "" };
        setBlocks((prev) => {
            const idx = prev.findIndex((b) => b.id === id);
            if (idx <= 0) return [newBlock, ...prev];
            return [...prev.slice(0, idx), newBlock, ...prev.slice(idx)];
        });
        setPendingFocusId(newBlock.id);
    }, []);

    const deleteBlock = useCallback((id: string) => {
        setBlocks((prev) => {
            if (prev.length <= 1) return [{ id: prev[0].id, type: "paragraph", content: "" }];
            const idx = prev.findIndex((b) => b.id === id);
            const newBlocks = prev.filter((b) => b.id !== id);
            // Focus the block before the deleted one
            const focusTarget = newBlocks[Math.max(0, idx - 1)]?.id ?? null;
            setPendingFocusId(focusTarget);
            return newBlocks;
        });
    }, []);

    const focusNext = useCallback((id: string) => {
        const idx = blocks.findIndex((b) => b.id === id);
        if (idx < blocks.length - 1) setPendingFocusId(blocks[idx + 1].id);
    }, [blocks]);

    const focusPrev = useCallback((id: string) => {
        const idx = blocks.findIndex((b) => b.id === id);
        if (idx > 0) setPendingFocusId(blocks[idx - 1].id);
    }, [blocks]);

    const changeType = useCallback((id: string, type: BlockType, content: string) => {
        setBlocks((prev) =>
            prev.map((b) => (b.id === id ? { ...b, type, content } : b))
        );
        setPendingFocusId(id);
    }, []);

    const insertBlocksAfter = useCallback((id: string, newBlocks: Array<{ type: BlockType; content: string }>) => {
        const created: Block[] = newBlocks.map((b) => ({ id: genId(), type: b.type, content: b.content }));
        setBlocks((prev) => {
            const idx = prev.findIndex((b) => b.id === id);
            if (idx === -1) return [...prev, ...created];
            return [...prev.slice(0, idx + 1), ...created, ...prev.slice(idx + 1)];
        });
        if (created.length > 0) setPendingFocusId(created[created.length - 1].id);
    }, []);

    const setBgChange = useCallback((id: string, colorKey: string, imageUrl?: string) => {
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === id
                    ? { ...b, bgColor: colorKey, bgImage: imageUrl !== undefined ? imageUrl : b.bgImage }
                    : b
            )
        );
    }, []);

    // Calculate numbered list indices
    const numberedIndexMap = new Map<string, number>();
    let numCounter = 0;
    for (const block of blocks) {
        if (block.type === "numbered") {
            numCounter++;
            numberedIndexMap.set(block.id, numCounter);
        } else {
            numCounter = 0;
        }
    }

    const activeBlock = focusedBlockId ? blocks.find((b) => b.id === focusedBlockId) : null;

    // Click on empty editor area → add/focus last block
    const handleEditorClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("[contenteditable], textarea, button, input")) return;
        const last = blocks[blocks.length - 1];
        if (last.type === "paragraph") {
            setPendingFocusId(last.id);
        } else {
            addBlockAfter(last.id);
        }
    };

    return (
        <div className="relative min-h-[300px]" onClick={handleEditorClick}>
            <div className="space-y-2">
                {blocks.map((block) => (
                    <BlockItem
                        key={`${block.id}-${block.type}`}
                        block={block}
                        numberedIdx={numberedIndexMap.get(block.id) ?? 1}
                        focusOnMount={pendingFocusId === block.id}
                        onContentChange={(content) => updateBlock(block.id, { content })}
                        onChangeType={(type, content) => changeType(block.id, type, content)}
                        onAddBefore={() => addBlockBefore(block.id)}
                        onAddAfter={() => addBlockAfter(block.id, block.type === "bullet" || block.type === "numbered" ? block.type : "paragraph")}
                        onDelete={() => deleteBlock(block.id)}
                        onFocusNext={() => focusNext(block.id)}
                        onFocusPrev={() => focusPrev(block.id)}
                        onFocus={() => setFocusedBlockId(block.id)}
                        onBgChange={(colorKey, imageUrl) => setBgChange(block.id, colorKey, imageUrl)}
                        onPasteBlocks={(newBlocks) => insertBlocksAfter(block.id, newBlocks)}
                    />
                ))}
            </div>

            {/* Click-to-add affordance at the bottom */}
            <div
                className="h-24 cursor-text"
                onClick={() => {
                    const last = blocks[blocks.length - 1];
                    if (last.type === "paragraph" && !last.content) {
                        setPendingFocusId(last.id);
                    } else {
                        addBlockAfter(last.id);
                    }
                }}
            />

            <FormatToolbar
                position={toolbar}
                activeBlockBgColor={activeBlock?.bgColor}
                onBgColor={(key) => { if (focusedBlockId) setBgChange(focusedBlockId, key); }}
                onBgImage={(url) => { if (focusedBlockId) setBgChange(focusedBlockId, activeBlock?.bgColor ?? "none", url); }}
            />
        </div>
    );
};
