"use client";

import { useState, useEffect } from "react";
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
import { shouldUseDummyCases } from "@/lib/featureFlags";

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

const DUMMY_LEAD_FORM_ID = "__dummy_case_form__";
const dummyLeadForm: LeadForm = {
  id: DUMMY_LEAD_FORM_ID,
  name: "Dummy Case Review",
  fields: [
    {
      key: "fullName",
      type: "text",
      label: "Full Name",
      required: true,
      placeholder: "Enter your full name",
    },
    {
      key: "phone",
      type: "phone",
      label: "Phone",
      required: true,
      placeholder: "Enter your phone number",
    },
    {
      key: "email",
      type: "email",
      label: "Email",
      required: true,
      placeholder: "Enter your email address",
    },
    {
      key: "state",
      type: "text",
      label: "State",
      required: true,
      placeholder: "Enter your state",
    },
  ],
  cta_text: "Get Your Free Case Review",
  thank_you_message:
    "Your demo information has been submitted. A member of our team will reach out shortly.",
};

export function LeadFormRenderer({ leadFormId, caseId, caseSlug }: LeadFormRendererProps) {
  const [form, setForm] = useState<LeadForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setLoadError(false);
    if (leadFormId === DUMMY_LEAD_FORM_ID && shouldUseDummyCases()) {
      setForm(dummyLeadForm);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadWithRetry() {
      setLoading(true);

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await fetch(`/api/lead-forms/${encodeURIComponent(leadFormId)}`, {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = (await res.json()) as { form?: LeadForm | null };
          const data = json.form;
          if (!data) throw new Error("No form");

          let fields = data.fields as unknown;
          if (typeof fields === "string") {
            try {
              fields = JSON.parse(fields) as unknown;
            } catch {
              fields = [];
            }
          }

          const normalizedFields = (Array.isArray(fields) ? fields : []) as FormField[];

          if (!cancelled) {
            setForm({ ...data, fields: normalizedFields });
            setLoading(false);
          }
          return;
        } catch (e) {
          if (attempt < 2) {
            // small backoff: 250ms, 500ms
            await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
            continue;
          }
          if (!cancelled) {
            if (process.env.NODE_ENV !== "production") {
              // eslint-disable-next-line no-console
              console.warn("[LeadFormRenderer] failed to load form", leadFormId, e);
            }
            setForm(null);
            setLoadError(true);
            setLoading(false);
          }
        }
      }
    }

    void loadWithRetry();
    return () => {
      cancelled = true;
    };
  }, [leadFormId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    if (form.id === DUMMY_LEAD_FORM_ID) {
      setSubmitted(true);
      return;
    }

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

  if (!form) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
        <p className="text-sm font-semibold text-navy-900">
          Form temporarily unavailable
        </p>
        <p className="mt-1 text-sm text-slate-warm-600">
          {loadError
            ? "Please try again in a moment. If you prefer, call our team for a confidential review."
            : "Please try again in a moment."}
        </p>
      </div>
    );
  }

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
        className="cursor-pointer leading-[100%] block w-full mx-auto rounded-[100px] bg-[#122D56] hover:bg-[#1A365E] px-[24px] py-[14px] text-[14px] md:text-[16px] lg:text-[18px] font-semibold tracking-[-0.02em] text-white"
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
      <p className="text-xs text-[#546885] text-center leading-relaxed">
        By submitting, you agree to our{" "}
        <a href="/privacy" className="underline hover:text-[#122D56]">Privacy Policy</a>
        {" "}and{" "}
        <a href="/disclaimer" className="underline hover:text-[#122D56]">Disclaimer</a>.
      </p>
    </form>
  );
}
