"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Bell, BookOpen, ChevronRight, FileText, Globe, Moon, Palette, Shield, Sun, Users, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

type SettingsTab = "contents" | "userinfo" | "notifications" | "general" | "people";

const TABS: { id: SettingsTab; label: string }[] = [
    { id: "contents",      label: "Contents"      },
    { id: "userinfo",      label: "User Info"     },
    { id: "notifications", label: "Notifications" },
    { id: "general",       label: "General"       },
    { id: "people",        label: "People"        },
];


const ContentsPanel = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                Import
            </h3>
            <div className="space-y-1">
                {["Markdown & CSV", "Notion", "Confluence", "Google Docs"].map((src) => (
                    <button
                        key={src}
                        className="cursor-pointer flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <div className="flex items-center gap-2.5">
                            <FileText size={15} className="text-zinc-400 dark:text-zinc-500" />
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">Import from {src}</span>
                        </div>
                        <ChevronRight size={14} className="text-zinc-400" />
                    </button>
                ))}
            </div>
        </div>
        <div>
            <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                Export
            </h3>
            <div className="space-y-1">
                {["Export all as PDF", "Export all as Markdown"].map((opt) => (
                    <button
                        key={opt}
                        className="cursor-pointer flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <BookOpen size={15} className="text-zinc-400 dark:text-zinc-500" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{opt}</span>
                    </button>
                ))}
            </div>
        </div>
    </div>
);

const ToggleRow = ({ label, description, checked, onChange }: {
    label: string; description?: string; checked: boolean; onChange: (v: boolean) => void;
}) => (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
        <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{label}</p>
            {description && <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{description}</p>}
        </div>
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`cursor-pointer relative flex-shrink-0 w-9 h-5 rounded-full transition-colors ${
                checked ? "bg-zinc-800 dark:bg-zinc-200" : "bg-zinc-200 dark:bg-zinc-700"
            }`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 shadow transition-transform ${
                    checked ? "translate-x-4" : "translate-x-0"
                }`}
            />
        </button>
    </div>
);

const UserInfoPanel = () => {
    const [name, setName] = useState("Nitish Kumar");
    const [email] = useState("nitish.kumar@nestorbird.com");
    const [bio, setBio] = useState("");

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800 dark:bg-zinc-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-white dark:text-zinc-900">N</span>
                </div>
                <button className="cursor-pointer text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline underline-offset-2">
                    Change photo
                </button>
            </div>
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Display name
                    </label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Email
                    </label>
                    <input
                        value={email}
                        readOnly
                        className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 outline-none cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Bio
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="A short bio…"
                        rows={3}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 resize-none"
                    />
                </div>
            </div>
            <button className="cursor-pointer px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors">
                Save changes
            </button>
        </div>
    );
};

const NotificationsPanel = () => {
    const [prefs, setPrefs] = useState({
        comments: true,
        mentions: true,
        sharedDocs: true,
        weeklyDigest: false,
        desktopPush: false,
    });
    const set = (k: keyof typeof prefs) => (v: boolean) => setPrefs((p) => ({ ...p, [k]: v }));

    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
                <Bell size={15} className="text-zinc-400 dark:text-zinc-500" />
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Control when and how you receive notifications.
                </p>
            </div>
            <ToggleRow label="Comments on my pages"   description="When someone comments on a doc you own." checked={prefs.comments}     onChange={set("comments")}     />
            <ToggleRow label="Mentions"               description="When someone @mentions you."              checked={prefs.mentions}     onChange={set("mentions")}     />
            <ToggleRow label="Shared documents"       description="When a page is shared with you."          checked={prefs.sharedDocs}   onChange={set("sharedDocs")}   />
            <ToggleRow label="Weekly digest"          description="A summary email every Monday."            checked={prefs.weeklyDigest} onChange={set("weeklyDigest")} />
            <ToggleRow label="Desktop push"           description="Browser push notifications."              checked={prefs.desktopPush}  onChange={set("desktopPush")}  />
        </div>
    );
};

const GeneralPanel = () => {
    const { resolvedTheme, setTheme } = useTheme();
    const [prefs, setPrefs] = useState({
        fullWidth: false,
        reducedMotion: false,
    });
    const set = (k: keyof typeof prefs) => (v: boolean) => setPrefs((p) => ({ ...p, [k]: v }));

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                    Appearance
                </p>
                <div className="flex items-center gap-2">
                    {(["light", "dark"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={`cursor-pointer flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                                resolvedTheme === t
                                    ? "border-zinc-800 dark:border-zinc-200 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                                    : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
                            }`}
                        >
                            {t === "light" ? <Sun size={14} /> : <Moon size={14} />}
                            <span className="capitalize">{t}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                    Layout
                </p>
                <ToggleRow label="Full-width pages" description="Use the full screen width for document content." checked={prefs.fullWidth} onChange={set("fullWidth")} />
            </div>
            <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                    Accessibility
                </p>
                <ToggleRow label="Reduced motion" description="Minimize animations and transitions." checked={prefs.reducedMotion} onChange={set("reducedMotion")} />
            </div>
            <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                    Language & region
                </p>
                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center gap-2.5">
                        <Globe size={15} className="text-zinc-400" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">Language</span>
                    </div>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">English (US)</span>
                </div>
            </div>
        </div>
    );
};

type Member = { id: string; name: string; email: string; role: "owner" | "editor" | "viewer"; initial: string };
const MEMBERS: Member[] = [
    { id: "m1", name: "Nitish Kumar",   email: "nitish.kumar@nestorbird.com", role: "owner",  initial: "N" },
    { id: "m2", name: "Priya Sharma",  email: "priya@nestorbird.com",        role: "editor", initial: "P" },
    { id: "m3", name: "Aakash Gupta",  email: "aakash@nestorbird.com",       role: "viewer", initial: "A" },
];

const ROLE_COLORS: Record<Member["role"], string> = {
    owner:  "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900",
    editor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    viewer: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

const PeoplePanel = () => {
    const [inviteEmail, setInviteEmail] = useState("");

    return (
        <div className="space-y-5">
            {/* Invite */}
            <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                    Invite members
                </p>
                <div className="flex gap-2">
                    <input
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="Email address"
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                    />
                    <button className="cursor-pointer px-3 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors flex-shrink-0">
                        Invite
                    </button>
                </div>
            </div>

            {/* Members list */}
            <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                    Members ({MEMBERS.length})
                </p>
                <div className="space-y-1">
                    {MEMBERS.map((m) => (
                        <div key={m.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{m.initial}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{m.name}</p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{m.email}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${ROLE_COLORS[m.role]}`}>
                                {m.role}
                            </span>
                            {m.role !== "owner" && (
                                <button className="cursor-pointer ml-1 text-xs text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0">
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Permissions */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <Shield size={14} className="text-zinc-400 flex-shrink-0" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Only owners can invite new members.
                </p>
            </div>
        </div>
    );
};

/* ── Main dialog ─────────────────────────────────────────────────── */

type SettingsDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
    const [tab, setTab] = useState<SettingsTab>("general");

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 dark:bg-black/60" />
                <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-2xl h-[560px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl flex overflow-hidden outline-none">
                        {/* Sidebar */}
                        <nav className="w-44 flex-shrink-0 border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3 flex flex-col gap-0.5">
                            <p className="px-2 py-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                                Settings
                            </p>
                            {TABS.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    className={`cursor-pointer w-full text-left px-2.5 py-2 rounded-lg text-sm transition-colors ${
                                        tab === t.id
                                            ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                                            : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </nav>

                        {/* Content */}
                        <div className="flex-1 flex flex-col min-w-0">
                            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
                                <Dialog.Title className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                    {TABS.find((t) => t.id === tab)?.label}
                                </Dialog.Title>
                                <Dialog.Close asChild>
                                    <button className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                                        <X size={15} />
                                    </button>
                                </Dialog.Close>
                            </div>
                            <div className="flex-1 overflow-y-auto px-6 py-5">
                                {tab === "contents"      && <ContentsPanel />}
                                {tab === "userinfo"      && <UserInfoPanel />}
                                {tab === "notifications" && <NotificationsPanel />}
                                {tab === "general"       && <GeneralPanel />}
                                {tab === "people"        && <PeoplePanel />}
                            </div>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
