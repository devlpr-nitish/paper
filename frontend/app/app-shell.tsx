"use client";

import { motion } from "framer-motion";
import { MainBody } from "@/components/main-body/main-body";
import { Sidebar } from "@/components/sidebar/sidebar";
import { useState } from "react";

export type ActiveView = "home" | "doc" | "library" | "trash";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export const AppShell = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeView, setActiveView] = useState<ActiveView>("home");

    return (
        <div className="h-full flex flex-row overflow-hidden bg-white dark:bg-zinc-950 text-black dark:text-white">
            {/* Sidebar — animates width so content never squishes */}
            <motion.div
                className="flex-shrink-0 h-full overflow-hidden"
                animate={{ width: sidebarOpen ? "18rem" : "0rem" }}
                transition={{ duration: 0.28, ease }}
            >
                {/* Fixed-width inner keeps sidebar layout stable during animation */}
                <div className="w-72 h-full">
                    <Sidebar
                        onHide={() => setSidebarOpen(false)}
                        activeView={activeView}
                        onSetView={setActiveView}
                    />
                </div>
            </motion.div>

            <MainBody
                sidebarOpen={sidebarOpen}
                onShowSidebar={() => setSidebarOpen(true)}
                activeView={activeView}
                onSetView={setActiveView}
            />
        </div>
    );
};
