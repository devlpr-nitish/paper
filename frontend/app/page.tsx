import { MainBody } from "@/components/main-body/main-body";
import { Sidebar } from "@/components/sidebar/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paper",
  description:
    "Paper — A knowledge management and documentation platform for Frappe.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-row bg-white dark:bg-zinc-950 text-black dark:text-white">
      <Sidebar />
      <MainBody />
    </div>
  );
}
