import { Home, Inbox, Settings } from "lucide-react";
import type { NavItem, Page, Workspace } from "@/types/sidebar";

export const NAV_ITEMS: NavItem[] = [
    { id: "home", icon: Home, label: "Home" },
    { id: "inbox", icon: Inbox, label: "Inbox" },
];

export const FAVORITES: Page[] = [
    { id: "f1", title: "Product Roadmap", icon: "🗺️", type: "page" },
    { id: "f2", title: "Meeting Notes", icon: "📝", type: "page" },
];

export const PRIVATE_PAGES: Page[] = [
    {
        id: "p1",
        title: "Getting Started",
        icon: "🚀",
        type: "folder",
        children: [
            { id: "p1a", title: "Quick Start Guide", type: "page" },
            { id: "p1b", title: "Keyboard Shortcuts", type: "page" },
        ],
    },
    {
        id: "p2",
        title: "Projects",
        icon: "📁",
        type: "folder",
        children: [
            { id: "p2a", title: "Project Alpha", type: "page" },
            { id: "p2b", title: "Project Beta", type: "page" },
        ],
    },
    { id: "p3", title: "Personal Notes", icon: "📓", type: "page" },
];

export const RECENT_PAGES: Page[] = [
    { id: "rc1", title: "Q2 Planning", icon: "📊", type: "page" },
    { id: "rc2", title: "API Spec v2", icon: "🔌", type: "page" },
    { id: "rc3", title: "Onboarding Flow", icon: "🧭", type: "page" },
];

export const SHARED_PAGES: Page[] = [
    { id: "sh1", title: "Team Handbook", icon: "📖", type: "page" },
    { id: "sh2", title: "Design System", icon: "🎨", type: "page" },
    { id: "sh3", title: "Sprint Board", icon: "🏃", type: "page" },
];

export const TRASH_PAGES: Page[] = [
    { id: "tr1", title: "Old Roadmap Draft", icon: "🗺️", type: "page" },
    { id: "tr2", title: "Archived Notes", icon: "📓", type: "page" },
    { id: "tr3", title: "Deprecated API Spec", icon: "🔌", type: "page" },
];

export const WORKSPACE: Workspace = {
    name: "My Workspace",
    initial: "M",
};
