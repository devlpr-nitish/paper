import type { NavIconButtonProps } from "@/types/sidebar";

export const NavIconButton = ({ icon, label }: NavIconButtonProps) => (
    <div className="relative group/tip">
        <button className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-md bg-zinc-300 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100">
            {icon}
        </button>
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1.5 hidden group-hover/tip:block bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-2 py-1 rounded whitespace-nowrap z-50">
            {label}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full border-4 border-transparent border-b-zinc-900 dark:border-b-zinc-100" />
        </div>
    </div>
);
