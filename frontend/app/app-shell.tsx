"use client";

import { MainBody } from "@/components/main-body/main-body";
import { Sidebar } from "@/components/sidebar/sidebar";
import { useState } from "react";

export type ActiveView = "doc" | "library" | "trash";

export const AppShell = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeView, setActiveView] = useState<ActiveView>("doc");

    return (
        <div className="h-full flex flex-row overflow-hidden bg-white dark:bg-zinc-950 text-black dark:text-white">
            <div
                className={`flex-shrink-0 h-full transition-all duration-200 ${sidebarOpen ? "w-72" : "w-0"} overflow-hidden`}
            >
                <Sidebar
                    onHide={() => setSidebarOpen(false)}
                    activeView={activeView}
                    onSetView={setActiveView}
                />
            </div>
            <MainBody
                sidebarOpen={sidebarOpen}
                onShowSidebar={() => setSidebarOpen(true)}
                activeView={activeView}
            />
        </div>
    );
};
