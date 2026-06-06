"use client";

import { Bold, Italic, Strikethrough } from "lucide-react";
import { useRef, useState } from "react";
import { BG_COLORS, TEXT_COLORS } from "./editor-types";
import { useTheme } from "next-themes";

type Tab = "text" | "bg";

type FormatToolbarProps = {
    position: { top: number; left: number } | null;
    activeBlockBgColor?: string;
    onBgColor: (colorKey: string) => void;
    onBgImage: (url: string) => void;
};

export const FormatToolbar = ({ position, activeBlockBgColor, onBgColor, onBgImage }: FormatToolbarProps) => {
    const [showColors, setShowColors] = useState(false);
    const [colorTab, setColorTab] = useState<Tab>("text");
    const [bgImageInput, setBgImageInput] = useState("");
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    if (!position) return null;

    const exec = (cmd: string, value?: string) => {
        document.execCommand(cmd, false, value ?? undefined);
    };

    const clampedLeft = Math.max(8, Math.min(position.left, window.innerWidth - 260));

    return (
        <div
            style={{ top: position.top, left: clampedLeft }}
            className="fixed z-50 flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden select-none"
            onMouseDown={(e) => e.preventDefault()}
        >
            {/* Action bar */}
            <div className="flex items-center gap-0.5 px-1.5 py-1">
                <Btn onClick={() => exec("bold")} title="Bold"><Bold size={12} /></Btn>
                <Btn onClick={() => exec("italic")} title="Italic"><Italic size={12} /></Btn>
                <Btn onClick={() => exec("strikeThrough")} title="Strikethrough"><Strikethrough size={12} /></Btn>
                <Sep />
                <Btn
                    onClick={() => { setColorTab("text"); setShowColors((v) => !v); }}
                    title="Text color"
                    active={showColors && colorTab === "text"}
                >
                    <span className="text-xs font-extrabold leading-none" style={{ fontFamily: "serif" }}>A</span>
                </Btn>
                <Btn
                    onClick={() => { setColorTab("bg"); setShowColors((v) => !v); }}
                    title="Background"
                    active={showColors && colorTab === "bg"}
                >
                    <span className="text-xs font-bold">BG</span>
                </Btn>
            </div>

            {/* Color picker panel */}
            {showColors && (
                <div className="border-t border-zinc-100 dark:border-zinc-800 p-2.5 w-52">
                    {/* Tab switcher */}
                    <div className="flex gap-1 mb-2.5">
                        {(["text", "bg"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onMouseDown={(e) => { e.preventDefault(); setColorTab(t); }}
                                className={`cursor-pointer flex-1 py-1 text-xs rounded-md transition-colors ${
                                    colorTab === t
                                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium"
                                        : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                                }`}
                            >
                                {t === "text" ? "Text" : "Background"}
                            </button>
                        ))}
                    </div>

                    {colorTab === "text" ? (
                        <div className="grid grid-cols-5 gap-1.5">
                            {TEXT_COLORS.map((c) => (
                                <button
                                    key={c.key}
                                    title={c.label}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        if (c.key === "default") exec("removeFormat");
                                        else exec("foreColor", c.css);
                                        setShowColors(false);
                                    }}
                                    className="cursor-pointer w-7 h-7 rounded-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 transition-transform text-xs font-extrabold"
                                    style={{
                                        color: c.css || (isDark ? "#e4e4e7" : "#27272a"),
                                        backgroundColor: c.css ? `${c.css}22` : undefined,
                                    }}
                                >
                                    A
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="grid grid-cols-5 gap-1.5">
                                {BG_COLORS.map((c) => (
                                    <button
                                        key={c.key}
                                        title={c.label}
                                        onMouseDown={(e) => { e.preventDefault(); onBgColor(c.key); setShowColors(false); }}
                                        className={`cursor-pointer w-7 h-7 rounded-md border hover:scale-110 transition-transform ${
                                            activeBlockBgColor === c.key
                                                ? "border-zinc-500 dark:border-zinc-400 ring-1 ring-zinc-500 dark:ring-zinc-400"
                                                : c.key === "none"
                                                    ? "border-zinc-300 dark:border-zinc-600 bg-[repeating-linear-gradient(45deg,#d4d4d8_0px,#d4d4d8_1px,transparent_1px,transparent_6px)]"
                                                    : "border-transparent"
                                        }`}
                                        style={{ backgroundColor: isDark ? c.dark : c.light }}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-1.5 pt-1">
                                <input
                                    placeholder="Image URL…"
                                    value={bgImageInput}
                                    onChange={(e) => setBgImageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            onBgImage(bgImageInput);
                                            setBgImageInput("");
                                            setShowColors(false);
                                        }
                                    }}
                                    className="flex-1 text-xs px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                                />
                                <button
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        onBgImage(bgImageInput);
                                        setBgImageInput("");
                                        setShowColors(false);
                                    }}
                                    className="cursor-pointer px-2 py-1 text-xs rounded-md bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
                                >
                                    Set
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const Sep = () => <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1" />;

const Btn = ({
    onClick, title, children, active,
}: {
    onClick: () => void; title: string; children: React.ReactNode; active?: boolean;
}) => (
    <button
        onClick={onClick}
        title={title}
        className={`cursor-pointer w-7 h-7 flex items-center justify-center rounded-md transition-colors text-zinc-600 dark:text-zinc-400 ${
            active
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
    >
        {children}
    </button>
);
