import {
    Clock,
    Copy,
    Download,
    ExternalLink,
    Globe,
    Link,
    Lock,
    MoreHorizontal,
    Star,
    Trash2,
    UserPlus,
    Users,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";

export type AccessLevel = "private" | "team" | "public";

type DocActionsProps = {
    editedAt: string;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    access: AccessLevel;
    onAccessChange: (level: AccessLevel) => void;
    onShare: () => void;
    onDelete: () => void;
};

const ACCESS_OPTIONS: { value: AccessLevel; label: string; icon: React.ReactNode }[] = [
    { value: "private", label: "Private", icon: <Lock size={13} /> },
    { value: "team",    label: "Team",    icon: <Users size={13} /> },
    { value: "public",  label: "Public",  icon: <Globe size={13} /> },
];

const menuItem = "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer outline-none text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800";
const destructiveItem = "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer outline-none text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950";

export const DocActions = ({
    editedAt,
    isFavorite,
    onToggleFavorite,
    access,
    onAccessChange,
    onShare,
    onDelete,
}: DocActionsProps) => {
    const current = ACCESS_OPTIONS.find((o) => o.value === access)!;

    return (
        <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Last edited */}
            <span className="hidden sm:flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 mr-1">
                <Clock size={11} />
                {editedAt}
            </span>

            {/* Access dropdown */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700">
                        {current.icon}
                        <span>{current.label}</span>
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl p-1 z-50"
                        sideOffset={6}
                        align="end"
                    >
                        <p className="px-2 py-1 text-xs text-zinc-400 dark:text-zinc-500 font-medium">Access</p>
                        {ACCESS_OPTIONS.map((opt) => (
                            <DropdownMenu.Item
                                key={opt.value}
                                className={`${menuItem} ${access === opt.value ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
                                onSelect={() => onAccessChange(opt.value)}
                            >
                                {opt.icon}
                                {opt.label}
                                {access === opt.value && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                                )}
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Favorite */}
            <button
                onClick={onToggleFavorite}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
                <Star
                    size={15}
                    className={isFavorite
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-zinc-400 dark:text-zinc-500"}
                />
            </button>

            {/* Share */}
            <button
                onClick={onShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300"
            >
                <UserPlus size={13} />
                Share
            </button>

            {/* Three-dot */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <MoreHorizontal size={15} />
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl p-1 z-50"
                        sideOffset={6}
                        align="end"
                    >
                        <DropdownMenu.Item className={menuItem}>
                            <Link size={13} /> Copy link
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className={menuItem}>
                            <ExternalLink size={13} /> Open in new tab
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className={menuItem}>
                            <Copy size={13} /> Duplicate
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                        <DropdownMenu.Item className={menuItem}>
                            <Download size={13} /> Export as Markdown
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className={menuItem}>
                            <Download size={13} /> Export as PDF
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                        <DropdownMenu.Item className={destructiveItem} onSelect={onDelete}>
                            <Trash2 size={13} /> Delete
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
};
