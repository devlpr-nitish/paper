import type { ActiveView } from "@/app/app-shell";
import { MainFooter } from "@/components/main-footer/main-footer";
import { MainHeader } from "@/components/main-header/main-header";
import { LibraryView } from "@/components/library/library-view";
import { TrashView } from "@/components/trash/trash-view";
import { Topbar } from "@/components/topbar/topbar";

type MainBodyProps = {
    sidebarOpen: boolean;
    onShowSidebar: () => void;
    activeView: ActiveView;
};

export const MainBody = ({ sidebarOpen, onShowSidebar, activeView }: MainBodyProps) => {
    if (activeView === "library") {
        return <LibraryView sidebarOpen={sidebarOpen} onShowSidebar={onShowSidebar} />;
    }
    if (activeView === "trash") {
        return <TrashView sidebarOpen={sidebarOpen} onShowSidebar={onShowSidebar} />;
    }

    return (
        <main className="flex flex-col flex-1 h-full min-h-0">
            <Topbar sidebarOpen={sidebarOpen} onShowSidebar={onShowSidebar} />
            <div className="flex-1 overflow-y-auto">
                <MainHeader iconEmoji="📄" />
                <div className="px-16 pt-4 pb-10 max-w-4xl mx-auto w-full">
                    {/* Document content goes here */}
                </div>
                <MainFooter />
            </div>
        </main>
    );
};
