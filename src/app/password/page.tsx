import type { Metadata } from "next";
import { PasswordGateForm } from "./password-gate-form";

export const metadata: Metadata = {
  title: "Site access",
  robots: { index: false, follow: false },
};

export default function PasswordPage() {
  return <PasswordGateForm />;
}
