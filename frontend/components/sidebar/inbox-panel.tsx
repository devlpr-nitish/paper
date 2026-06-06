"use client";

import { AtSign, Bell, MessageSquare, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { NOTIFICATIONS, type Notification, type NotifType } from "../../utils/sidebar-data";

type Filter = "all" | "mentions" | "comments";

const TYPE_ICON: Record<NotifType, React.ReactNode> = {
    mention: <AtSign size={10} />,
    comment: <MessageSquare size={10} />,
    update:  <RefreshCw size={10} />,
    invite:  <Bell size={10} />,
};

export const InboxPanel = ({ onClose }: { onClose: () => void }) => {
    const [filter, setFilter] = useState<Filter>("all");
    const [items, setItems] = useState<Notification[]>(NOTIFICATIONS);

    const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    const dismiss = (id: string) => setItems((prev) => prev.filter((n) => n.id !== id));

    const filtered =
        filter === "mentions" ? items.filter((n) => n.type === "mention") :
        filter === "comments" ? items.filter((n) => n.type === "comment") :
        items;

    const unreadCount = items.filter((n) => !n.read).length;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
                <Bell size={14} className="text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                <span className="flex-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">Inbox</span>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        title="Mark all as read"
                        className="cursor-pointer text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors px-1.5 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        Mark all read
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="cursor-pointer w-5 h-5 flex items-center justify-center rounded text-zinc-400 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                >
                    <X size={12} />
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-0.5 px-2 pt-2 pb-1 flex-shrink-0">
                {(["all", "mentions", "comments"] as Filter[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`cursor-pointer px-2 py-1 text-xs rounded-md capitalize transition-colors ${
                            filter === f
                                ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium"
                                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Notification list */}
            <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-400 dark:text-zinc-500 pb-8">
                        <Bell size={28} strokeWidth={1.5} />
                        <p className="text-xs">All caught up</p>
                    </div>
                ) : (
                    filtered.map((notif) => (
                        <div
                            key={notif.id}
                            className={`flex gap-2.5 px-3 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 group transition-colors cursor-pointer border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 ${
                                !notif.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                            }`}
                        >
                            {/* Avatar */}
                            <div
                                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                                    !notif.read
                                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                                }`}
                            >
                                {notif.user[0]}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 mb-0.5">
                                    <span className={`text-xs font-medium truncate ${!notif.read ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}`}>
                                        {notif.user}
                                    </span>
                                    <span className={`flex-shrink-0 ${!notif.read ? "text-blue-500 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-500"}`}>
                                        {TYPE_ICON[notif.type]}
                                    </span>
                                    {!notif.read && (
                                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 ml-auto" />
                                    )}
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{notif.preview}</p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{notif.page} · {notif.time}</p>
                            </div>

                            {/* Dismiss */}
                            <button
                                onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                                className="cursor-pointer flex-shrink-0 w-5 h-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all self-start mt-0.5"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
