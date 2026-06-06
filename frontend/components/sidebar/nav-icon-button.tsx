import type { NavIconButtonProps } from "@/types/sidebar";

export const NavIconButton = ({ icon, label, onClick, active, badge }: NavIconButtonProps) => (
    <div className="relative group/tip">
        <button
            onClick={onClick}
            className={`cursor-pointer relative w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                active
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "bg-zinc-300 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
        >
            {icon}
            {badge != null && badge > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 px-0.5 flex items-center justify-center rounded-full bg-blue-500 text-white text-[9px] font-semibold leading-none">
                    {badge > 99 ? "99+" : badge}
                </span>
            )}
        </button>
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1.5 hidden group-hover/tip:block bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-2 py-1 rounded whitespace-nowrap z-50">
            {label}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full border-4 border-transparent border-b-zinc-900 dark:border-b-zinc-100" />
        </div>
    </div>
);