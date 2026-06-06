import type { Metadata } from "next";
import { AppShell } from "./app-shell";

export const metadata: Metadata = {
  title: "Paper",
  description: "Paper — A knowledge management and documentation platform for Frappe.",
};

export default function HomePage() {
  return <AppShell />;
}