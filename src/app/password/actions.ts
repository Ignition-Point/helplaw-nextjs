"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getExpectedSiteAccessCookieValue } from "@/lib/site-access-cookie";

export type PasswordFormState = { error?: string } | null;

export async function verifyPassword(
  _prev: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
  const sitePassword = process.env.SITE_PASSWORD?.trim();
  if (!sitePassword) {
    redirect("/");
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !password.trim()) {
    return { error: "Please enter the password." };
  }

  if (password !== sitePassword) {
    return { error: "That password is incorrect. Please try again." };
  }

  const cookieStore = await cookies();
  const value = await getExpectedSiteAccessCookieValue();
  cookieStore.set("site_access", value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/");
}
