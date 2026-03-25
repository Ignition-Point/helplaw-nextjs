"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle } from "lucide-react";

interface LeadFormRendererProps {
  leadFormId: string;
  caseId?: string;
  caseSlug?: string;
}

interface FormField {
  type: string;
  key: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface LeadForm {
  id: string;
  name: string;
  fields: FormField[];
  cta_text: string;
  thank_you_message?: string;
}

export function LeadFormRenderer({ leadFormId, caseId, caseSlug }: LeadFormRendererProps) {
  const [form, setForm] = useState<LeadForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("lead_forms")
      .select("id, name, fields, cta_text, thank_you_message")
      .eq("id", leadFormId)
      .single()
      .then(({ data }) => {
        if (data) {
          const fields = (typeof data.fields === "string" ? JSON.parse(data.fields) : data.fields) as FormField[];
          setForm({ ...data, fields });
        }
        setLoading(false);
      });
  }, [leadFormId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_form_id: form.id,
          case_id: caseId || null,
          data: { ...values, case_slug: caseSlug },
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // silent fail — we don't want to scare leads
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-navy-400" />
      </div>
    );
  }

  if (!form) return null;

  if (submitted) {
    return (
      <div className="text-center py-8 space-y-3">
        <div className="mx-auto w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-navy-900">Thank You!</h3>
        <p className="text-sm text-slate-warm-500">
          {form.thank_you_message || "Your information has been submitted. A member of our team will reach out shortly."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {form.fields.map((field) => (
        <div key={field.key}>
          <Label htmlFor={field.key} className="text-sm font-medium text-navy-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          {field.type === "textarea" ? (
            <Textarea
              id={field.key}
              placeholder={field.placeholder}
              required={field.required}
              value={values[field.key] || ""}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="mt-1.5"
              rows={3}
            />
          ) : field.type === "select" && field.options ? (
            <Select
              value={values[field.key] || ""}
              onValueChange={(val) => setValues((v) => ({ ...v, [field.key]: val }))}
              required={field.required}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={field.key}
              type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
              placeholder={field.placeholder}
              required={field.required}
              value={values[field.key] || ""}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="mt-1.5"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-gold-500 px-6 py-3 text-base font-semibold text-navy-950 transition-all hover:bg-gold-400 disabled:opacity-50 shadow-sm"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </span>
        ) : (
          form.cta_text || "Get Your Free Case Review"
        )}
      </button>
      <p className="text-xs text-slate-warm-400 text-center leading-relaxed">
        By submitting, you agree to our{" "}
        <a href="/privacy" className="underline hover:text-navy-600">Privacy Policy</a>
        {" "}and{" "}
        <a href="/disclaimer" className="underline hover:text-navy-600">Disclaimer</a>.
      </p>
    </form>
  );
}
