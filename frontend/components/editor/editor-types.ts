export type BlockType =
    | "paragraph" | "h1" | "h2" | "h3"
    | "bullet" | "numbered"
    | "quote" | "code" | "divider"
    | "image" | "video" | "audio" | "file" | "page";

export type Block = {
    id: string;
    type: BlockType;
    content: string;   // innerHTML for text blocks
    bgColor?: string;  // key from BG_COLORS
    bgImage?: string;  // image URL for section background
    url?: string;      // for media blocks
    caption?: string;
    language?: string;
};

export const TEXT_COLORS = [
    { key: "default", label: "Default", css: ""        },
    { key: "gray",    label: "Gray",    css: "#9b9a97" },
    { key: "brown",   label: "Brown",   css: "#64473a" },
    { key: "orange",  label: "Orange",  css: "#d9730d" },
    { key: "yellow",  label: "Yellow",  css: "#dfab01" },
    { key: "green",   label: "Green",   css: "#0f7b6c" },
    { key: "blue",    label: "Blue",    css: "#0b6e99" },
    { key: "purple",  label: "Purple",  css: "#6940a5" },
    { key: "pink",    label: "Pink",    css: "#ad1a72" },
    { key: "red",     label: "Red",     css: "#e03e3e" },
] as const;

export const BG_COLORS = [
    { key: "none",   label: "None",   light: "transparent", dark: "transparent" },
    { key: "gray",   label: "Gray",   light: "#f1f1ef",     dark: "#474745"     },
    { key: "brown",  label: "Brown",  light: "#f9f0ea",     dark: "#4a3228"     },
    { key: "orange", label: "Orange", light: "#fdf3ec",     dark: "#5c3b1e"     },
    { key: "yellow", label: "Yellow", light: "#fef9ed",     dark: "#534a28"     },
    { key: "green",  label: "Green",  light: "#f1faf5",     dark: "#243b2f"     },
    { key: "blue",   label: "Blue",   light: "#e8f5fc",     dark: "#143a4e"     },
    { key: "purple", label: "Purple", light: "#f7f3fc",     dark: "#3b2e4e"     },
    { key: "pink",   label: "Pink",   light: "#fdf2f8",     dark: "#4e2c3e"     },
    { key: "red",    label: "Red",    light: "#fdf2f2",     dark: "#4e2b2b"     },
] as const;

export type SlashCommand = {
    id: string;
    label: string;
    description: string;
    icon: string;
    blockType: BlockType;
    keywords: string[];
    group: "basic" | "media";
};

export const SLASH_COMMANDS: SlashCommand[] = [
    { id: "paragraph", label: "Text",          description: "Plain paragraph",          icon: "T",   blockType: "paragraph", keywords: ["text","plain","paragraph"],   group: "basic" },
    { id: "h1",        label: "Heading 1",     description: "Big section heading",      icon: "H1",  blockType: "h1",        keywords: ["h1","heading","title"],       group: "basic" },
    { id: "h2",        label: "Heading 2",     description: "Medium section heading",   icon: "H2",  blockType: "h2",        keywords: ["h2","heading"],               group: "basic" },
    { id: "h3",        label: "Heading 3",     description: "Small section heading",    icon: "H3",  blockType: "h3",        keywords: ["h3","heading"],               group: "basic" },
    { id: "bullet",    label: "Bullet List",   description: "Create a bulleted list",   icon: "•",   blockType: "bullet",    keywords: ["bullet","list","ul"],         group: "basic" },
    { id: "numbered",  label: "Numbered List", description: "Create a numbered list",   icon: "1.",  blockType: "numbered",  keywords: ["numbered","list","ol"],       group: "basic" },
    { id: "quote",     label: "Quote",         description: "Capture a blockquote",     icon: "❝",   blockType: "quote",     keywords: ["quote","blockquote"],         group: "basic" },
    { id: "code",      label: "Code",          description: "Capture a code snippet",   icon: "</>", blockType: "code",      keywords: ["code","snippet","pre"],       group: "basic" },
    { id: "divider",   label: "Divider",       description: "Horizontal separator",     icon: "—",   blockType: "divider",   keywords: ["divider","hr","separator"],   group: "basic" },
    { id: "image",     label: "Image",         description: "Upload or embed an image", icon: "🖼",  blockType: "image",     keywords: ["image","photo","picture"],    group: "media" },
    { id: "video",     label: "Video",         description: "Upload or embed a video",  icon: "▶",   blockType: "video",     keywords: ["video","embed"],              group: "media" },
    { id: "audio",     label: "Audio",         description: "Upload or embed audio",    icon: "🎵",  blockType: "audio",     keywords: ["audio","music","sound"],      group: "media" },
    { id: "file",      label: "File",          description: "Upload a file attachment", icon: "📎",  blockType: "file",      keywords: ["file","upload","attachment"], group: "media" },
    { id: "page",      label: "Page",          description: "Link to a sub-page",       icon: "📄",  blockType: "page",      keywords: ["page","document","link"],     group: "media" },
];