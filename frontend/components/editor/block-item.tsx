"use client";

import {
    ArrowDownToLine, ArrowUpToLine, File as FileIcon, GripVertical, Image as ImageIcon, Mic, Music, Trash2, Video,
} from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { BG_COLORS, BG_COLORS as BG } from "./editor-types";
import { SlashMenu } from "./slash-menu";
import type { Block, BlockType } from "./editor-types";

type BlockItemProps = {
    block: Block;
    numberedIdx: number;  // 1-based index within consecutive numbered blocks
    focusOnMount: boolean;
    onContentChange: (content: string) => void;
    onChangeType: (type: BlockType, content: string) => void;
    onAddBefore: () => void;
    onAddAfter: () => void;
    onDelete: () => void;
    onFocusNext: () => void;
    onFocusPrev: () => void;
    onFocus: () => void;
    onBgChange: (colorKey: string, imageUrl?: string) => void;
    onPasteBlocks: (blocks: Array<{ type: BlockType; content: string }>) => void;
};

const EDITABLE_TYPES: BlockType[] = ["paragraph", "h1", "h2", "h3", "bullet", "numbered", "quote"];
const MEDIA_TYPES: BlockType[] = ["image", "video", "audio", "file", "page"];

const placeholderFor = (type: BlockType): string => {
    if (type === "h1") return "Heading 1";
    if (type === "h2") return "Heading 2";
    if (type === "h3") return "Heading 3";
    if (type === "quote") return "Empty quote — type something…";
    if (type === "bullet" || type === "numbered") return "List item";
    return "Type '/' for commands, or start writing…";
};

const editableClass = (type: BlockType): string => {
    const base = "outline-none w-full break-words whitespace-pre-wrap empty:before:content-[attr(data-placeholder)] empty:before:text-zinc-300 dark:empty:before:text-zinc-600 empty:before:pointer-events-none";
    if (type === "h1") return `${base} text-4xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight`;
    if (type === "h2") return `${base} text-2xl font-semibold text-zinc-900 dark:text-zinc-100 leading-snug`;
    if (type === "h3") return `${base} text-xl font-semibold text-zinc-800 dark:text-zinc-200`;
    if (type === "quote") return `${base} text-lg text-zinc-500 dark:text-zinc-400 italic`;
    return `${base} text-base text-zinc-800 dark:text-zinc-200 leading-relaxed`;
};

/* ── Paste helpers ─────────────────────────────────────────────── */

const INLINE_TAGS = new Set(["strong", "em", "b", "i", "u", "s", "code", "mark"]);

function sanitizeInline(el: Element): string {
    let out = "";
    for (const node of Array.from(el.childNodes)) {
        if (node.nodeType === Node.TEXT_NODE) {
            out += (node as Text).textContent ?? "";
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const child = node as Element;
            const tag = child.tagName.toLowerCase();
            if (INLINE_TAGS.has(tag)) {
                out += `<${tag}>${sanitizeInline(child)}</${tag}>`;
            } else if (tag === "a") {
                const href = child.getAttribute("href") ?? "";
                out += `<a href="${href}">${sanitizeInline(child)}</a>`;
            } else {
                out += sanitizeInline(child);
            }
        }
    }
    return out;
}

const BLOCK_LEVEL = new Set(["h1","h2","h3","h4","h5","h6","p","ul","ol","pre","blockquote","hr","div","article","section","main","header","footer"]);

function parsePastedHtml(html: string): Array<{ type: BlockType; content: string }> {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const result: Array<{ type: BlockType; content: string }> = [];

    function walk(el: Element) {
        const tag = el.tagName.toLowerCase();
        if (tag === "ul") {
            for (const li of Array.from(el.querySelectorAll(":scope > li"))) {
                const c = sanitizeInline(li).trim();
                if (c) result.push({ type: "bullet", content: c });
            }
            return;
        }
        if (tag === "ol") {
            for (const li of Array.from(el.querySelectorAll(":scope > li"))) {
                const c = sanitizeInline(li).trim();
                if (c) result.push({ type: "numbered", content: c });
            }
            return;
        }
        if (tag === "pre") {
            const codeEl = el.querySelector("code");
            const c = ((codeEl ?? el).textContent ?? "").trim();
            if (c) result.push({ type: "code", content: c });
            return;
        }
        if (tag === "hr")       { result.push({ type: "divider", content: "" }); return; }
        if (tag === "blockquote") { const c = sanitizeInline(el).trim(); if (c) result.push({ type: "quote", content: c }); return; }
        if (tag === "h1")       { const c = sanitizeInline(el).trim(); if (c) result.push({ type: "h1", content: c }); return; }
        if (tag === "h2")       { const c = sanitizeInline(el).trim(); if (c) result.push({ type: "h2", content: c }); return; }
        if (["h3","h4","h5","h6"].includes(tag)) { const c = sanitizeInline(el).trim(); if (c) result.push({ type: "h3", content: c }); return; }
        if (tag === "p")        { const c = sanitizeInline(el).trim(); if (c) result.push({ type: "paragraph", content: c }); return; }

        // Container with block-level children → recurse
        if (Array.from(el.children).some(ch => BLOCK_LEVEL.has(ch.tagName.toLowerCase()))) {
            for (const child of Array.from(el.children)) walk(child);
            return;
        }

        // Leaf container (div, span, b used as wrapper, etc.)
        const c = sanitizeInline(el).trim();
        if (c) result.push({ type: "paragraph", content: c });
    }

    for (const child of Array.from(doc.body.children)) walk(child);
    return result;
}

/* ── BlockItem ──────────────────────────────────────────────────── */

export const BlockItem = ({
    block, numberedIdx, focusOnMount,
    onContentChange, onChangeType, onAddBefore, onAddAfter, onDelete,
    onFocusNext, onFocusPrev, onFocus, onBgChange, onPasteBlocks,
}: BlockItemProps) => {
    const editableRef = useRef<HTMLDivElement>(null);
    const codeRef = useRef<HTMLTextAreaElement>(null);
    const lastSyncedHtml = useRef(block.content);
    const [slashOpen, setSlashOpen] = useState(false);
    const [slashQuery, setSlashQuery] = useState("");
    const [slashAnchorRect, setSlashAnchorRect] = useState<DOMRect | null>(null);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [showBgMenu, setShowBgMenu] = useState(false);
    const [bgMenuRect, setBgMenuRect] = useState<DOMRect | null>(null);
    const [mediaUrl, setMediaUrl] = useState(block.url ?? "");
    const [mediaCaption, setMediaCaption] = useState(block.caption ?? "");
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    // Initialize contenteditable once on mount (and on type change via parent key reset)
    useLayoutEffect(() => {
        if (editableRef.current) {
            editableRef.current.innerHTML = block.content;
            lastSyncedHtml.current = block.content;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // intentionally empty — DOM is authoritative between syncs

    // Focus on mount when requested
    useLayoutEffect(() => {
        if (!focusOnMount) return;
        const el = editableRef.current ?? codeRef.current;
        if (!el) return;
        el.focus();
        if (editableRef.current) {
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(editableRef.current);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    }, [focusOnMount]);

    const handleInput = () => {
        const el = editableRef.current;
        if (!el) return;
        const html = el.innerHTML;
        lastSyncedHtml.current = html;
        onContentChange(html);

        const text = el.textContent ?? "";
        if (text.startsWith("/")) {
            const query = text.slice(1);
            const sel = window.getSelection();
            if (sel?.rangeCount) {
                setSlashQuery(query);
                setSlashAnchorRect(sel.getRangeAt(0).getBoundingClientRect());
                setSlashOpen(true);
            }
        } else {
            setSlashOpen(false);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const html = e.clipboardData.getData("text/html");
        const plain = e.clipboardData.getData("text/plain");

        if (!html) {
            const sel = window.getSelection();
            if (sel?.rangeCount) {
                const range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(plain));
                range.collapse(false);
            }
            handleInput();
            return;
        }

        const parsed = parsePastedHtml(html);
        if (parsed.length === 0) {
            const sel = window.getSelection();
            if (sel?.rangeCount) {
                const range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(plain));
                range.collapse(false);
            }
            handleInput();
            return;
        }

        const [first, ...rest] = parsed;

        // Insert the first pasted block's content at cursor
        const sel = window.getSelection();
        if (sel?.rangeCount && first.content) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const tpl = document.createElement("template");
            tpl.innerHTML = first.content;
            const frag = tpl.content;
            const lastNode = frag.lastChild;
            range.insertNode(frag);
            if (lastNode) {
                const newRange = document.createRange();
                newRange.setStartAfter(lastNode);
                newRange.collapse(true);
                sel.removeAllRanges();
                sel.addRange(newRange);
            }
        }
        handleInput();
        if (rest.length > 0) onPasteBlocks(rest);
    };

    const handleSlashSelect = (type: BlockType) => {
        setSlashOpen(false);
        const el = editableRef.current;
        if (el) { el.innerHTML = ""; lastSyncedHtml.current = ""; }
        onChangeType(type, "");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (slashOpen) return; // slash-menu captures these keys itself

        const el = editableRef.current;
        const text = el?.textContent ?? "";

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            // Stay in list mode — add a new list item of same type
            if (block.type === "bullet" || block.type === "numbered") {
                if (text.trim() === "") {
                    // Empty list item: exit list
                    onChangeType("paragraph", "");
                } else {
                    onAddAfter();
                }
            } else {
                onAddAfter();
            }
        } else if (e.key === "Backspace" && text === "") {
            e.preventDefault();
            onDelete();
        } else if (e.key === "ArrowUp") {
            const sel = window.getSelection();
            if (sel?.rangeCount) {
                const range = sel.getRangeAt(0);
                // Only navigate if cursor is at the very start
                if (range.startOffset === 0 && range.collapsed) {
                    e.preventDefault();
                    onFocusPrev();
                }
            }
        } else if (e.key === "ArrowDown") {
            const sel = window.getSelection();
            if (sel?.rangeCount && el) {
                const range = sel.getRangeAt(0);
                // Only navigate if cursor is at the very end
                const endRange = document.createRange();
                endRange.selectNodeContents(el);
                endRange.collapse(false);
                if (range.compareBoundaryPoints(Range.END_TO_END, endRange) >= 0) {
                    e.preventDefault();
                    onFocusNext();
                }
            }
        }
    };

    const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const ta = codeRef.current!;
            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            const newVal = ta.value.slice(0, start) + "  " + ta.value.slice(end);
            ta.value = newVal;
            ta.selectionStart = ta.selectionEnd = start + 2;
            onContentChange(newVal);
        } else if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            onAddAfter();
        } else if (e.key === "Backspace" && (codeRef.current?.value ?? "") === "") {
            e.preventDefault();
            onDelete();
        }
    };

    // --- Background style ---
    const bgEntry = BG_COLORS.find((c) => c.key === block.bgColor);
    const bgStyle: React.CSSProperties = block.bgImage
        ? { backgroundImage: `url(${block.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
        : bgEntry && bgEntry.key !== "none"
            ? { backgroundColor: isDark ? bgEntry.dark : bgEntry.light }
            : {};

    const hasBg = !!block.bgImage || (!!block.bgColor && block.bgColor !== "none");

    // --- Render divider ---
    if (block.type === "divider") {
        return (
            <div
                className="relative group/block py-2"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <BlockHandle hovered={hovered} onAddBefore={onAddBefore} onAdd={onAddAfter} onDelete={onDelete} />
                <hr className="border-zinc-200 dark:border-zinc-700" />
            </div>
        );
    }

    // --- Render code block ---
    if (block.type === "code") {
        return (
            <div
                className="relative group/block"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <BlockHandle hovered={hovered} onAddBefore={onAddBefore} onAdd={onAddAfter} onDelete={onDelete} />
                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-1.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/60">
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">Code</span>
                    </div>
                    <textarea
                        ref={codeRef}
                        defaultValue={block.content}
                        onFocus={onFocus}
                        onChange={(e) => onContentChange(e.target.value)}
                        onKeyDown={handleCodeKeyDown}
                        placeholder="// Start typing…"
                        spellCheck={false}
                        className="w-full px-4 py-3 font-mono text-sm text-zinc-800 dark:text-zinc-200 bg-transparent outline-none resize-none min-h-[80px] placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                        rows={Math.max(3, (block.content.match(/\n/g)?.length ?? 0) + 2)}
                    />
                </div>
            </div>
        );
    }

    // --- Render media blocks ---
    if (MEDIA_TYPES.includes(block.type)) {
        return (
            <div
                className="relative group/block"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <BlockHandle hovered={hovered} onAddBefore={onAddBefore} onAdd={onAddAfter} onDelete={onDelete} />
                <div>
                    <MediaBlock
                        block={block}
                        mediaUrl={mediaUrl}
                        mediaCaption={mediaCaption}
                        onUrlChange={setMediaUrl}
                        onCaptionChange={setMediaCaption}
                        onConfirm={() => {
                            onContentChange(mediaCaption);
                        }}
                        onFocus={onFocus}
                    />
                </div>
            </div>
        );
    }

    // --- Render editable text blocks ---
    const isListItem = block.type === "bullet" || block.type === "numbered";

    return (
        <div
            className="relative group/block"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <BlockHandle
                hovered={hovered}
                onAddBefore={onAddBefore}
                onAdd={onAddAfter}
                onDelete={onDelete}
                showBgMenu={showBgMenu}
                onToggleBg={(rect) => { if (showBgMenu) { setShowBgMenu(false); } else { setBgMenuRect(rect); setShowBgMenu(true); } }}
            />

            {/* BG menu popover — fixed position anchored to the paint button, never overlaps content */}
            {showBgMenu && bgMenuRect && (
                <>
                    <div className="fixed inset-0 z-[39]" onMouseDown={() => setShowBgMenu(false)} />
                    <BgMenu
                        anchor={bgMenuRect}
                        currentBg={block.bgColor}
                        currentImage={block.bgImage}
                        isDark={isDark}
                        onChange={(key) => onBgChange(key)}
                        onImage={(url) => onBgChange(block.bgColor ?? "none", url)}
                        onClose={() => setShowBgMenu(false)}
                    />
                </>
            )}

            <div
                className={`${hasBg ? "rounded-lg overflow-hidden" : ""}`}
                style={bgStyle}
            >
                <div className={`flex items-start gap-1 ${hasBg ? "px-3 py-3" : "py-2 px-2"}`}>
                    {/* Bullet / number indicator */}
                    {block.type === "bullet" && (
                        <span className="flex-shrink-0 mt-1.5 text-zinc-400 dark:text-zinc-500 text-base leading-none select-none">•</span>
                    )}
                    {block.type === "numbered" && (
                        <span className="flex-shrink-0 mt-0.5 text-zinc-500 dark:text-zinc-400 text-base font-medium select-none min-w-[1.5rem] text-right">{numberedIdx}.</span>
                    )}
                    {block.type === "quote" && (
                        <div className="flex-shrink-0 w-1 self-stretch bg-zinc-300 dark:bg-zinc-600 rounded-full mr-2" />
                    )}

                    <div
                        ref={editableRef}
                        contentEditable
                        suppressContentEditableWarning
                        data-placeholder={(hovered || focused) ? placeholderFor(block.type) : ""}
                        className={`${editableClass(block.type)} ${isListItem ? "ml-2" : ""}`}
                        onInput={handleInput}
                        onPaste={handlePaste}
                        onKeyDown={handleKeyDown}
                        onFocus={() => { setFocused(true); onFocus(); }}
                        onBlur={() => setFocused(false)}
                    />
                </div>
            </div>

            {/* Slash menu */}
            {slashOpen && slashAnchorRect && (
                <SlashMenu
                    query={slashQuery}
                    anchorRect={slashAnchorRect}
                    onSelect={handleSlashSelect}
                    onClose={() => setSlashOpen(false)}
                />
            )}
        </div>
    );
};

/* ── Block handle ─────────────────────────────────────────────── */

const BlockHandle = ({
    hovered, onAddBefore, onAdd, onDelete, showBgMenu, onToggleBg,
}: {
    hovered: boolean; onAddBefore: () => void; onAdd: () => void; onDelete: () => void;
    showBgMenu?: boolean; onToggleBg?: (rect: DOMRect) => void;
}) => (
    <div
        className={`absolute -left-27 top-2.5 z-50 w-27 flex items-center justify-end gap-0.5 transition-opacity ${
            hovered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
        <button
            onMouseDown={(e) => { e.preventDefault(); onAddBefore(); }}
            title="Add block above"
            className="cursor-pointer w-5 h-5 flex items-center justify-center rounded text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
            <ArrowUpToLine size={12} />
        </button>
        <button
            onMouseDown={(e) => { e.preventDefault(); onAdd(); }}
            title="Add block below"
            className="cursor-pointer w-5 h-5 flex items-center justify-center rounded text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
            <ArrowDownToLine size={12} />
        </button>
        
        {onToggleBg && (
            <button
                onMouseDown={(e) => { e.preventDefault(); onToggleBg(e.currentTarget.getBoundingClientRect()); }}
                title="Section background"
                className={`cursor-pointer w-5 h-5 flex items-center justify-center rounded text-xs transition-colors ${
                    showBgMenu
                        ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                        : "text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
            >
                🎨
            </button>
        )}
        <button
            onMouseDown={(e) => { e.preventDefault(); onDelete(); }}
            title="Delete block"
            className="cursor-pointer w-5 h-5 flex items-center justify-center rounded text-zinc-300 dark:text-zinc-600 hover:text-red-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
        >
            <Trash2 size={11} />
        </button>

        <button
            onMouseDown={(e) => { e.preventDefault(); }}
            title="Drag to reorder"
            className="cursor-grab w-5 h-5 flex items-center justify-center rounded text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
            <GripVertical size={12} />
        </button>
    </div>
);

/* ── Background colour / image menu ──────────────────────────── */

const BgMenu = ({
    anchor, currentBg, currentImage, isDark, onChange, onImage, onClose,
}: {
    anchor: DOMRect; currentBg?: string; currentImage?: string; isDark: boolean;
    onChange: (key: string) => void; onImage: (url: string) => void; onClose: () => void;
}) => {
    const [imgInput, setImgInput] = useState(currentImage ?? "");

    return (
        <div
            style={{ position: "fixed", top: anchor.bottom + 6, left: anchor.left }}
            className="z-40 w-56 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl p-3 space-y-2"
            onMouseDown={(e) => e.stopPropagation()}
        >
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Background color</p>
            <div className="grid grid-cols-5 gap-1.5">
                {BG_COLORS.map((c) => (
                    <button
                        key={c.key}
                        title={c.label}
                        onClick={() => { onChange(c.key); onClose(); }}
                        className={`cursor-pointer w-8 h-8 rounded-md border hover:scale-110 transition-transform ${
                            currentBg === c.key
                                ? "border-zinc-500 dark:border-zinc-400 ring-1 ring-zinc-500 dark:ring-zinc-400"
                                : c.key === "none"
                                    ? "border-zinc-300 dark:border-zinc-600 bg-[repeating-linear-gradient(45deg,#d4d4d8_0px,#d4d4d8_1px,transparent_1px,transparent_6px)]"
                                    : "border-transparent"
                        }`}
                        style={{ backgroundColor: isDark ? c.dark : c.light }}
                    />
                ))}
            </div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pt-1">Background image</p>
            <div className="flex gap-1.5">
                <input
                    value={imgInput}
                    onChange={(e) => setImgInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") { onImage(imgInput); onClose(); }
                        if (e.key === "Escape") onClose();
                    }}
                    placeholder="Paste image URL…"
                    className="flex-1 text-xs px-2 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 outline-none focus:ring-1 focus:ring-zinc-400"
                />
                <button
                    onClick={() => { onImage(imgInput); onClose(); }}
                    className="cursor-pointer px-2.5 py-1 text-xs rounded-md bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
                >
                    Set
                </button>
            </div>
            {currentImage && (
                <button
                    onClick={() => { onImage(""); onClose(); }}
                    className="cursor-pointer text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                    Remove image
                </button>
            )}
        </div>
    );
};

/* ── Media block ─────────────────────────────────────────────── */

const MediaBlock = ({
    block, mediaUrl, mediaCaption, onUrlChange, onCaptionChange, onConfirm, onFocus,
}: {
    block: Block; mediaUrl: string; mediaCaption: string;
    onUrlChange: (v: string) => void; onCaptionChange: (v: string) => void;
    onConfirm: () => void; onFocus: () => void;
}) => {
    const type = block.type;

    const icon =
        type === "image" ? <ImageIcon size={28} className="text-zinc-400" /> :
        type === "video" ? <Video size={28} className="text-zinc-400" /> :
        type === "audio" ? <Music size={28} className="text-zinc-400" /> :
        type === "page"  ? <span className="text-3xl">📄</span> :
                           <FileIcon size={28} className="text-zinc-400" />;

    const label =
        type === "image" ? "Add image" :
        type === "video" ? "Add video" :
        type === "audio" ? "Add audio" :
        type === "file"  ? "Attach file" :
                           "Link page";

    const urlLabel =
        type === "image" ? "Image URL" :
        type === "video" ? "Video URL" :
        type === "audio" ? "Audio URL" :
        type === "page"  ? "Page URL" :
                           "File URL";

    // Once URL is set, show the actual media
    if (block.url) {
        return (
            <div className="space-y-1">
                {type === "image" && (
                    <img src={block.url} alt={block.caption ?? ""} className="w-full rounded-lg object-cover max-h-96" />
                )}
                {type === "video" && (
                    <video src={block.url} controls className="w-full rounded-lg max-h-96" />
                )}
                {type === "audio" && (
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
                        <Mic size={16} className="text-zinc-400 flex-shrink-0" />
                        <audio src={block.url} controls className="flex-1 h-8" />
                    </div>
                )}
                {(type === "file" || type === "page") && (
                    <a
                        href={block.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
                    >
                        {icon}
                        <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{block.caption || block.url}</span>
                    </a>
                )}
                {block.caption && type !== "file" && type !== "page" && (
                    <p className="text-xs text-center text-zinc-400 dark:text-zinc-500">{block.caption}</p>
                )}
            </div>
        );
    }

    // Placeholder: URL input
    return (
        <div
            onFocus={onFocus}
            className="flex flex-col items-center gap-4 px-6 py-8 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
        >
            {icon}
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
            <div className="flex gap-2 w-full max-w-sm">
                <input
                    value={mediaUrl}
                    onChange={(e) => onUrlChange(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") onConfirm(); }}
                    placeholder={`${urlLabel}…`}
                    className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                />
                <button
                    onClick={onConfirm}
                    className="cursor-pointer px-3 py-1.5 rounded-lg bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
                >
                    Embed
                </button>
            </div>
            {(type === "image" || type === "file" || type === "audio" || type === "video") && (
                <div className="flex items-center gap-2">
                    <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-700" />
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">or</span>
                    <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-700" />
                </div>
            )}
            {(type === "image" || type === "file" || type === "audio" || type === "video") && (
                <label className="cursor-pointer text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors">
                    Upload from device
                    <input type="file" className="hidden" />
                </label>
            )}
        </div>
    );
};