"use client";

import { useState } from "react";
import { Clock, CornerDownRight, FileText, MessageSquare, Send, SmilePlus } from "lucide-react";

type Reaction = { emoji: string; count: number; reacted: boolean };
type Comment  = { id: string; author: string; initials: string; time: string; text: string };
type DocCard  = { id: string; title: string; icon?: string; meta: string };

const INITIAL_REACTIONS: Reaction[] = [
    { emoji: "👍", count: 3, reacted: false },
    { emoji: "❤️", count: 1, reacted: false },
    { emoji: "🎉", count: 0, reacted: false },
];

const MOCK_COMMENTS: Comment[] = [
    { id: "c1", author: "Alex Kim",   initials: "AK", time: "2h ago",  text: "This looks great! Should we add more context to the intro section?" },
    { id: "c2", author: "Sam Patel",  initials: "SP", time: "1h ago",  text: "Agreed — I'll update it tomorrow. Tagging Nitish for review." },
];

const RECENT_DOCS: DocCard[]  = [
    { id: "r1", title: "Q2 Planning",    icon: "📊", meta: "2h ago" },
    { id: "r2", title: "API Spec v2",    icon: "🔌", meta: "Yesterday" },
    { id: "r3", title: "Onboarding Flow",icon: "🧭", meta: "3d ago" },
];

const RELATED_DOCS: DocCard[] = [
    { id: "d1", title: "Product Roadmap", icon: "🗺️", meta: "In Private" },
    { id: "d2", title: "Meeting Notes",   icon: "📝", meta: "In Favorites" },
];

const DocCard = ({ doc }: { doc: DocCard }) => (
    <button className="cursor-pointer flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left transition-colors group w-full">
        <span className="text-xl leading-none">{doc.icon ?? "📄"}</span>
        <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate group-hover:text-zinc-900 dark:group-hover:text-zinc-100">{doc.title}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{doc.meta}</p>
        </div>
    </button>
);

const Avatar = ({ initials, size = "sm" }: { initials: string; size?: "sm" | "md" }) => (
    <div className={`rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center flex-shrink-0 ${size === "md" ? "w-8 h-8" : "w-6 h-6"}`}>
        <span className={`font-semibold text-white dark:text-zinc-900 ${size === "md" ? "text-[11px]" : "text-[9px]"}`}>{initials}</span>
    </div>
);

export const MainFooter = () => {
    const [reactions, setReactions] = useState<Reaction[]>(INITIAL_REACTIONS);
    const [comments,  setComments]  = useState<Comment[]>(MOCK_COMMENTS);
    const [draft,     setDraft]     = useState("");

    const toggleReaction = (i: number) =>
        setReactions((prev) =>
            prev.map((r, idx) =>
                idx !== i ? r : { ...r, reacted: !r.reacted, count: r.reacted ? r.count - 1 : r.count + 1 }
            )
        );

    const submitComment = () => {
        const text = draft.trim();
        if (!text) return;
        setComments((prev) => [
            ...prev,
            { id: `c${prev.length + 1}`, author: "You", initials: "NK", time: "Just now", text },
        ]);
        setDraft("");
    };

    return (
        <div className="max-w-4xl mx-auto px-16 pb-20 mt-16 space-y-10">
            <hr className="border-zinc-100 dark:border-zinc-800" />

            {/* Reactions */}
            <div className="flex items-center gap-2 flex-wrap">
                {reactions.map((r, i) => (
                    <button
                        key={i}
                        onClick={() => toggleReaction(i)}
                        className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm border transition-all ${
                            r.reacted
                                ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900 scale-105"
                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500"
                        }`}
                    >
                        <span className="text-base leading-none">{r.emoji}</span>
                        {r.count > 0 && <span className="text-xs font-semibold tabular-nums">{r.count}</span>}
                    </button>
                ))}
                <button className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm border border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                    <SmilePlus size={13} />
                    <span className="text-xs">React</span>
                </button>
            </div>

            {/* Comments */}
            <section>
                <h3 className="flex items-center gap-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-5">
                    <MessageSquare size={13} />
                    Comments
                    <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold text-[10px]">
                        {comments.length}
                    </span>
                </h3>

                {/* Comment list */}
                <div className="space-y-3 mb-5">
                    {comments.map((c) => (
                        <div key={c.id} className="flex gap-3 group">
                            <Avatar initials={c.initials} size="md" />
                            <div className="flex-1 min-w-0 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{c.author}</span>
                                    <span className="text-xs text-zinc-400 dark:text-zinc-500">{c.time}</span>
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{c.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply indicator */}
                <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 mb-3 ml-11">
                    <CornerDownRight size={11} />
                    <span>Reply as You</span>
                </div>

                {/* Input */}
                <div className="flex gap-3">
                    <Avatar initials="NK" size="md" />
                    <div className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 transition-colors overflow-hidden">
                        <textarea
                            rows={2}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), submitComment())}
                            placeholder="Write a comment…"
                            className="w-full px-4 pt-3 pb-1 text-sm bg-transparent outline-none text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 resize-none leading-relaxed"
                        />
                        <div className="flex items-center justify-end px-3 pb-2.5">
                            <button
                                onClick={submitComment}
                                disabled={!draft.trim()}
                                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
                            >
                                <Send size={11} />
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recently Created */}
            <section>
                <h3 className="flex items-center gap-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                    <Clock size={13} />
                    Recently Created
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {RECENT_DOCS.map((doc) => <DocCard key={doc.id} doc={doc} />)}
                </div>
            </section>

            {/* Related */}
            <section>
                <h3 className="flex items-center gap-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                    <FileText size={13} />
                    Related
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {RELATED_DOCS.map((doc) => <DocCard key={doc.id} doc={doc} />)}
                </div>
            </section>
        </div>
    );
};
