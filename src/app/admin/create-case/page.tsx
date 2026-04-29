import type { Metadata } from "next";
import CreateCasePageClient from "./CreateCasePageClient";

export const metadata: Metadata = {
  title: "Create Case Page | Help Law Group",
  description:
    "Create draft case pages from Google Docs and run internal CMS quality checks.",
  alternates: { canonical: "https://helplaw.com/admin/create-case" },
  robots: { index: false, follow: false },
};

export default function CreateCasePage() {
  return <CreateCasePageClient />;
}
