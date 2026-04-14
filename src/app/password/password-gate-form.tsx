"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { verifyPassword, type PasswordFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PasswordGateForm() {
  const [state, formAction, isPending] = useActionState<
    PasswordFormState,
    FormData
  >(verifyPassword, null);

  return (
    <section
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-navy-950/97 p-4 backdrop-blur-md"
      aria-labelledby="site-access-title"
      aria-describedby="site-access-desc"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy-700/40 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gold-600/10 via-transparent to-transparent" />

      <Card className="relative w-full max-w-md border-navy-600/50 bg-navy-900/90 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold-500/15 ring-1 ring-gold-400/30">
            <Lock className="size-7 text-gold-400" aria-hidden />
          </div>
          <CardTitle
            id="site-access-title"
            className="text-2xl font-semibold tracking-tight text-navy-50"
          >
            Site access
          </CardTitle>
          <CardDescription
            id="site-access-desc"
            className="text-navy-200/90 text-base"
          >
            This preview is password protected. Enter the password to continue
            to Help Law Group.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-navy-100">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                autoFocus
                placeholder="Enter password"
                aria-invalid={Boolean(state?.error)}
                className={cn(
                  "h-11 border-navy-600 bg-navy-950/50 text-navy-50 placeholder:text-navy-400",
                  "focus-visible:border-gold-500/60 focus-visible:ring-gold-500/25",
                  state?.error &&
                    "border-destructive/80 focus-visible:border-destructive"
                )}
              />
              {state?.error ? (
                <p className="text-destructive text-sm" role="alert">
                  {state.error}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-11 w-full bg-gold-500 text-navy-950 hover:bg-gold-400"
              disabled={isPending}
            >
              {isPending ? "Checking…" : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
