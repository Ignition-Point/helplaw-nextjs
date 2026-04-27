import type { Metadata } from "next";
import { PasswordGateForm } from "./password-gate-form";

export const metadata: Metadata = {
  title: "Site Access | Help Law Group (Internal)",
  description: "Internal access gate for the Help Law Group site. Authorized personnel only.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://helplaw.com/password" },
};

export default function PasswordPage() {
  return <PasswordGateForm />;
}
