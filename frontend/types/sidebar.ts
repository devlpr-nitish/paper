import type { LucideIcon } from "lucide-react";

export type PageItemType = "page" | "folder";

export type Page = {
    id: string;
    title: string;
    icon?: string;
    type: PageItemType;
    children?: Page[];
};

export type NavItem = {
    id: string;
    icon: LucideIcon;
    label: string;
    shortcut?: string;
};

export type Workspace = {
    name: string;
    initial: string;
};

export type InlineCreateProps = {
    type: "page" | "folder";
    depth: number;
    onConfirm: (name: string) => void;
    onCancel: () => void;
};

export type PageMenuProps = {
    page: Page;
    onRename: () => void;
    onDelete: () => void;
    onNewPage: () => void;
    onNewFolder: () => void;
};

export type SectionMenuProps = {
    onNewPage: () => void;
    onNewFolder: () => void;
};

export type SidebarSectionProps = {
    title: string;
    initials?: string;
    pages: Page[];
    depth?: number;
    onCreate: (type: "page" | "folder") => void;
    onNewPage: () => void;
    onNewFolder: () => void;
};

export type PageItemProps = {
    page: Page;
    depth?: number;
};

export type NavIconButtonProps = {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
};
