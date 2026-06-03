import { Topbar } from "@/components/topbar/topbar";

export const MainBody = () => {
    return (
        <main className="flex flex-col flex-1 min-h-screen">
            <Topbar />
            <div className="flex-1 px-16 py-10 max-w-4xl mx-auto w-full">
                {/* Document content goes here */}
            </div>
        </main>
    );
};
