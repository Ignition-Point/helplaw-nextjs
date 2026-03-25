"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle } from "lucide-react";

export function HomeLeadForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const supabase = createClient();
      await supabase.from("lead_submissions").insert({
        lead_form_id: null as unknown as string,
        data: { ...values, source: "homepage" },
      });
      setSubmitted(true);
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10 space-y-3">
        <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="h-7 w-7 text-green-600" />
        </div>
        <h4 className="text-xl font-semibold text-navy-900">Thank You</h4>
        <p className="text-sm text-slate-warm-500">
          Your information has been submitted. A member of our team will reach out shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name*"
          required
          value={values.first_name}
          onChange={(e) => setValues((v) => ({ ...v, first_name: e.target.value }))}
          className="w-full rounded-lg border border-navy-200 px-4 py-3 text-sm text-navy-900 placeholder:text-slate-warm-400 focus:border-navy-400 focus:ring-1 focus:ring-navy-400 outline-none transition-colors"
        />
        <input
          type="text"
          placeholder="Last Name*"
          required
          value={values.last_name}
          onChange={(e) => setValues((v) => ({ ...v, last_name: e.target.value }))}
          className="w-full rounded-lg border border-navy-200 px-4 py-3 text-sm text-navy-900 placeholder:text-slate-warm-400 focus:border-navy-400 focus:ring-1 focus:ring-navy-400 outline-none transition-colors"
        />
      </div>
      <input
        type="email"
        placeholder="Email*"
        required
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        className="w-full rounded-lg border border-navy-200 px-4 py-3 text-sm text-navy-900 placeholder:text-slate-warm-400 focus:border-navy-400 focus:ring-1 focus:ring-navy-400 outline-none transition-colors"
      />
      <input
        type="tel"
        placeholder="Phone*"
        required
        value={values.phone}
        onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
        className="w-full rounded-lg border border-navy-200 px-4 py-3 text-sm text-navy-900 placeholder:text-slate-warm-400 focus:border-navy-400 focus:ring-1 focus:ring-navy-400 outline-none transition-colors"
      />
      <textarea
        placeholder="BRIEFLY DESCRIBE YOUR CASE"
        rows={4}
        value={values.description}
        onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
        className="w-full rounded-lg border border-navy-200 px-4 py-3 text-sm text-navy-900 placeholder:text-slate-warm-400 focus:border-navy-400 focus:ring-1 focus:ring-navy-400 outline-none transition-colors resize-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-navy-800 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-navy-700 disabled:opacity-50 shadow-sm"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </span>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
