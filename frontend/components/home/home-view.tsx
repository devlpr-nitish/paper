"use client";
import { motion } from "framer-motion";
import {
    Bell, BookOpen, Clock, Code2, Command, FileText, FilePlus,
    Flame, Lock, Moon, PanelLeftOpen, Pencil, Search,
    Sparkles, Star, Trash2, Type,
} from "lucide-react";
import type { ActiveView } from "@/app/app-shell";
import { FAVORITES, NOTIFICATIONS, PRIVATE_PAGES, RECENT_PAGES } from "../../utils/sidebar-data";

type HomeViewProps = {
    sidebarOpen: boolean;
    onShowSidebar: () => void;
    onSetView: (view: ActiveView) => void;
};

function getGreeting() {
    const h = new Date().getHours();
    if (h < 5) return "Working late";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

function getDateLabel() {
    return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

const STATS = [
    { label: "Total pages",   value: 12, icon: FileText, sub: "+2 this week" },
    { label: "Edited today",  value: 3,  icon: Pencil,   sub: "Active"       },
    { label: "Favorites",     value: 2,  icon: Star,     sub: "Starred"      },
    { label: "Notifications", value: 3,  icon: Bell,     sub: "unread"       },
];

const QUICK_ACTIONS = [
    { icon: FilePlus, label: "New Page",  desc: "Start from scratch", view: "doc"     as ActiveView },
    { icon: BookOpen, label: "Library",   desc: "Browse all pages",   view: "library" as ActiveView },
    { icon: Trash2,   label: "Trash",     desc: "Recover deleted",    view: "trash"   as ActiveView },
];

const FEATURES = [
    { icon: Type,     title: "Block Editor",    desc: "Write with rich blocks — headings, lists, quotes, code, and more." },
    { icon: Search,   title: "Smart Search",    desc: "Find any page or doc instantly with Cmd+K search." },
    { icon: Star,     title: "Favorites",       desc: "Pin your most-used pages for one-click access." },
    { icon: Lock,     title: "Private Pages",   desc: "Keep personal notes private with dedicated private pages." },
    { icon: Code2,    title: "Code Blocks",     desc: "Write and share code with formatted code blocks." },
    { icon: Moon,     title: "Dark Mode",       desc: "Full dark mode support — easy on the eyes, day or night." },
];

const RECENT_TIMES = ["Just now", "2h ago", "Yesterday"];

// ── Animation variants ────────────────────────────────────
const ease = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show:   { opacity: 1, y: 0,  transition: { duration: 0.45, ease } },
};

const stagger = (delay = 0) => ({
    hidden: {},
    show:   { transition: { staggerChildren: 0.07, delayChildren: delay } },
});

const heroVariant = {
    hidden: { opacity: 0, y: -10 },
    show:   { opacity: 1, y: 0,   transition: { duration: 0.5, ease } },
};

export const HomeView = ({ sidebarOpen, onShowSidebar, onSetView }: HomeViewProps) => {
    const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

    return (
        <motion.main
            className="flex flex-col flex-1 h-full min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
        >
            <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">

                {/* ── Hero (dark panel) ── */}
                <motion.div
                    className="bg-zinc-900 dark:bg-black"
                    variants={heroVariant}
                    initial="hidden"
                    animate="show"
                >
                    <div className="max-w-4xl mx-auto px-8 pt-6 pb-10 w-full">

                        {/* Toggle always rendered — only opacity changes, no layout shift */}
                        <motion.button
                            onClick={onShowSidebar}
                            animate={{ opacity: sidebarOpen ? 0 : 1 }}
                            transition={{ duration: 0.2 }}
                            className={`mb-5 w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-white hover:bg-white/10 transition-colors ${sidebarOpen ? "pointer-events-none" : "cursor-pointer"}`}
                        >
                            <PanelLeftOpen size={15} />
                        </motion.button>

                        <div className="flex items-start justify-between gap-4 mb-6">
                            <motion.div
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.45, delay: 0.1, ease }}
                            >
                                <p className="text-zinc-500 text-sm font-medium mb-2">{getDateLabel()}</p>
                                <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                                    {getGreeting()} 👋
                                </h1>
                                <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                                    You have{" "}
                                    <span className="text-white font-semibold">{unreadCount} unread notifications</span>{" "}
                                    and <span className="text-white font-semibold">3 pages</span> edited today.
                                </p>
                            </motion.div>

                            {/* Streak */}
                            <motion.div
                                className="flex-shrink-0 flex flex-col items-center gap-1 border border-zinc-700 hover:border-zinc-500 rounded-2xl px-5 py-3.5 min-w-[90px] cursor-default transition-colors"
                                initial={{ opacity: 0, scale: 0.88 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.2, ease }}
                                whileHover={{ scale: 1.04 }}
                            >
                                <Flame size={22} className="text-zinc-400" />
                                <span className="text-2xl font-bold text-white leading-none">3</span>
                                <span className="text-xs text-zinc-500 whitespace-nowrap">day streak</span>
                            </motion.div>
                        </div>

                        {/* Search */}
                        <motion.button
                            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 text-sm transition-colors cursor-pointer"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.25, ease }}
                            whileHover={{ scale: 1.005 }}
                            whileTap={{ scale: 0.995 }}
                        >
                            <Search size={15} className="text-zinc-500 flex-shrink-0" />
                            <span className="flex-1 text-left">Search pages, docs, or templates…</span>
                            <kbd className="flex items-center gap-0.5 text-xs text-zinc-600 font-mono border border-zinc-600 px-1.5 py-0.5 rounded-md">
                                <Command size={12} />K
                            </kbd>
                        </motion.button>
                    </div>
                </motion.div>

                {/* ── Content ── */}
                <div className="max-w-4xl mx-auto px-8 pt-8 pb-16 w-full">

                    {/* Stat cards */}
                    <motion.div
                        className="grid grid-cols-4 gap-3 mb-8"
                        variants={stagger(0.15)}
                        initial="hidden"
                        animate="show"
                    >
                        {STATS.map((s) => (
                            <motion.div
                                key={s.label}
                                variants={fadeUp}
                                className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 px-4 py-3 shadow-sm cursor-default"
                                whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.09)" }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <s.icon size={15} className="text-zinc-400 dark:text-zinc-500" />
                                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full">
                                        {s.sub}
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{s.value}</div>
                                <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{s.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Quick actions */}
                    <motion.section
                        className="mb-8"
                        variants={stagger(0.25)}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.h2 variants={fadeUp} className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                            Quick actions
                        </motion.h2>
                        <div className="grid grid-cols-3 gap-3">
                            {QUICK_ACTIONS.map((a) => (
                                <motion.button
                                    key={a.label}
                                    variants={fadeUp}
                                    onClick={() => onSetView(a.view)}
                                    className="cursor-pointer group relative overflow-hidden rounded-xl p-5 bg-zinc-900 dark:bg-zinc-800 text-white text-left border border-zinc-800 dark:border-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors duration-200"
                                    whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.18)" }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/5 group-hover:scale-125 transition-transform duration-300 pointer-events-none" />
                                    <a.icon size={22} className="mb-3 relative z-10 text-zinc-400 group-hover:text-zinc-300 transition-colors" />
                                    <div className="text-sm font-semibold relative z-10">{a.label}</div>
                                    <div className="text-xs text-zinc-500 mt-0.5 relative z-10">{a.desc}</div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.section>

                    {/* Features */}
                    <motion.section
                        className="mb-8"
                        variants={stagger(0.35)}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.h2 variants={fadeUp} className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                            Features
                        </motion.h2>
                        <div className="grid grid-cols-3 gap-3">
                            {FEATURES.map((f) => (
                                <motion.div
                                    key={f.title}
                                    variants={fadeUp}
                                    className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 p-4 shadow-sm cursor-default"
                                    whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.07)" }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                                        <f.icon size={15} className="text-zinc-500 dark:text-zinc-400" />
                                    </div>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{f.title}</p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">{f.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Jump back in */}
                    <motion.section
                        className="mb-8"
                        variants={stagger(0.45)}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.div variants={fadeUp} className="flex items-center gap-2 mb-3">
                            <Clock size={13} className="text-zinc-400 dark:text-zinc-500" />
                            <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Jump back in</h2>
                        </motion.div>
                        <div className="grid grid-cols-3 gap-3">
                            {RECENT_PAGES.map((page, i) => (
                                <motion.button
                                    key={page.id}
                                    variants={fadeUp}
                                    onClick={() => onSetView("doc")}
                                    className="cursor-pointer group text-left bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 p-5 shadow-sm"
                                    whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.09)" }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span className="text-3xl block mb-3">{page.icon}</span>
                                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 truncate mb-1">
                                        {page.title}
                                    </p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                                        <Clock size={9} />
                                        {RECENT_TIMES[i]}
                                    </p>
                                </motion.button>
                            ))}
                        </div>
                    </motion.section>

                    {/* Two-column: Favorites + Activity */}
                    <motion.div
                        className="grid grid-cols-5 gap-5 mb-8"
                        variants={stagger(0.5)}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.section variants={fadeUp} className="col-span-3">
                            <div className="flex items-center gap-2 mb-3">
                                <Star size={13} className="text-zinc-400 dark:text-zinc-500" />
                                <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Favorites</h2>
                            </div>
                            <div className="space-y-2">
                                {FAVORITES.map((page) => (
                                    <motion.button
                                        key={page.id}
                                        onClick={() => onSetView("doc")}
                                        className="cursor-pointer group w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm text-left"
                                        whileHover={{ y: -1, boxShadow: "0 4px 14px rgba(0,0,0,0.07)" }}
                                        whileTap={{ scale: 0.99 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <span className="text-xl flex-shrink-0">{page.icon}</span>
                                        <span className="flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 truncate">
                                            {page.title}
                                        </span>
                                        <Star size={11} className="flex-shrink-0 text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.section>

                        <motion.section variants={fadeUp} className="col-span-2">
                            <div className="flex items-center gap-2 mb-3">
                                <Bell size={13} className="text-zinc-400 dark:text-zinc-500" />
                                <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex-1">Activity</h2>
                                {unreadCount > 0 && (
                                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-full font-semibold">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
                                {NOTIFICATIONS.slice(0, 3).map((notif) => (
                                    <motion.div
                                        key={notif.id}
                                        className={`flex items-start gap-2.5 px-3 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer ${!notif.read ? "bg-zinc-50 dark:bg-zinc-800/30" : ""}`}
                                        whileHover={{ x: 2 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold mt-0.5 text-zinc-500 dark:text-zinc-400">
                                            {notif.user[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-medium truncate ${!notif.read ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-500 dark:text-zinc-400"}`}>
                                                {notif.user}
                                            </p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{notif.page} · {notif.time}</p>
                                        </div>
                                        {!notif.read && (
                                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 mt-1.5" />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    </motion.div>

                    {/* Private pages */}
                    <motion.section
                        className="mb-8"
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.55 }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Lock size={13} className="text-zinc-400 dark:text-zinc-500" />
                            <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Private</h2>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
                            {PRIVATE_PAGES.map((page) => (
                                <motion.button
                                    key={page.id}
                                    onClick={() => onSetView("doc")}
                                    className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-left transition-colors group"
                                    whileHover={{ x: 2 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <span className="text-base flex-shrink-0">{page.icon ?? "📄"}</span>
                                    <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 truncate">
                                        {page.title}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded capitalize">
                                        {page.type}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.section>

                    {/* Quote footer */}
                    <motion.div
                        className="rounded-2xl bg-zinc-900 dark:bg-zinc-800 px-6 py-5"
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.005 }}
                    >
                        <div className="flex items-start gap-4">
                            <Sparkles size={16} className="text-zinc-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-zinc-300 italic leading-relaxed">
                                    "The secret of getting ahead is getting started."
                                </p>
                                <p className="text-xs text-zinc-600 mt-1.5">— Mark Twain · Daily inspiration</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </motion.main>
    );
};
