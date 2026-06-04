"use client";

import { useState } from "react";
import { ImageIcon, Smile, X } from "lucide-react";

type MainHeaderProps = {
    bannerUrl?: string;
    iconEmoji?: string;
    onBannerChange?: (url: string | undefined) => void;
    onIconChange?: (emoji: string | undefined) => void;
};

export const MainHeader = ({
    bannerUrl: initialBanner,
    iconEmoji: initialIcon,
    onBannerChange,
    onIconChange,
}: MainHeaderProps) => {
    const [bannerUrl, setBannerUrl] = useState<string | undefined>(initialBanner);
    const [iconEmoji, setIconEmoji] = useState<string | undefined>(initialIcon);
    const [hoveringBanner, setHoveringBanner] = useState(false);

    const hasBanner = !!bannerUrl;
    const hasIcon = !!iconEmoji;

    const handleBannerChange = (url: string | undefined) => {
        setBannerUrl(url);
        onBannerChange?.(url);
    };

    const handleIconChange = (emoji: string | undefined) => {
        setIconEmoji(emoji);
        onIconChange?.(emoji);
    };

    return (
        <div className="relative w-full">
            {/* Banner */}
            {hasBanner && (
                <div
                    className="relative w-full h-44 overflow-hidden bg-zinc-100 dark:bg-zinc-800"
                    onMouseEnter={() => setHoveringBanner(true)}
                    onMouseLeave={() => setHoveringBanner(false)}
                >
                    <img
                        src={bannerUrl}
                        alt="Page cover"
                        className="w-full h-full object-cover"
                    />

                    {/* Banner controls on hover */}
                    {hoveringBanner && (
                        <div className="absolute bottom-2.5 right-3 flex items-center gap-1">
                            <button
                                onClick={() => handleBannerChange("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&q=80")}
                                className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 shadow-sm backdrop-blur-sm transition-colors"
                            >
                                <ImageIcon size={11} />
                                Change cover
                            </button>
                            <button
                                onClick={() => handleBannerChange(undefined)}
                                className="cursor-pointer flex items-center justify-center w-6 h-6 rounded-md bg-white/90 dark:bg-zinc-900/90 text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 shadow-sm backdrop-blur-sm transition-colors"
                                title="Remove cover"
                            >
                                <X size={11} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Icon row — overlaps banner when present */}
            <div
                className={`max-w-4xl mx-auto px-16 ${hasBanner ? "-mt-7" : "pt-8"}`}
            >
                <div className="flex items-end justify-between">
                    {/* Page icon */}
                    {hasIcon ? (
                        <div className="relative group/icon">
                            <button
                                onClick={() => handleIconChange("📄")}
                                className="cursor-pointer text-5xl leading-none select-none hover:opacity-80 transition-opacity"
                                title="Change icon"
                            >
                                {iconEmoji}
                            </button>
                            <button
                                onClick={() => handleIconChange(undefined)}
                                className="cursor-pointer absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 items-center justify-center hidden group-hover/icon:flex transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-600"
                                title="Remove icon"
                            >
                                <X size={9} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleIconChange("📄")}
                            className="cursor-pointer flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 py-1 transition-colors"
                        >
                            <Smile size={13} />
                            Add icon
                        </button>
                    )}

                    {/* Add cover — only when no banner */}
                    {!hasBanner && (
                        <button
                            onClick={() => handleBannerChange("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&q=80")}
                            className="cursor-pointer flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 py-1 transition-colors"
                        >
                            <ImageIcon size={13} />
                            Add cover
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
