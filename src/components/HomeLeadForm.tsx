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
      <div className="grid lg:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name*"
          required
          value={values.first_name}
          onChange={(e) => setValues((v) => ({ ...v, first_name: e.target.value }))}
          className="w-full rounded-[2px] border border-[#D1D5DB] px-4 py-3 text-base text-[#122D56] placeholder:text-[#9CA3AF] outline-none transition-colors"
        />
        <input
          type="text"
          placeholder="Last Name*"
          required
          value={values.last_name}
          onChange={(e) => setValues((v) => ({ ...v, last_name: e.target.value }))}
          className="w-full rounded-[2px] border border-[#D1D5DB] px-4 py-3 text-base text-[#122D56] placeholder:text-[#9CA3AF] outline-none transition-colors"
        />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
      <input
        type="email"
        placeholder="Email Address *"
        required
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        className="w-full rounded-[2px] border border-[#D1D5DB] px-4 py-3 text-base text-[#122D56] placeholder:text-[#9CA3AF] outline-none transition-colors"
      />
      <input
        type="tel"
        placeholder="Phone Number *"
        required
        value={values.phone}
        onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
        className="w-full rounded-[2px] border border-[#D1D5DB] px-4 py-3 text-base text-[#122D56] placeholder:text-[#9CA3AF] outline-none transition-colors"
      />
      </div>
      <textarea
        placeholder="Briefly Describe Your Case"
        rows={4}
        value={values.description}
        onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
        className="w-full rounded-[2px] border border-[#D1D5DB] px-4 py-3 text-base text-[#122D56] placeholder:text-[#9CA3AF] outline-none transition-colors resize-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="cursor-pointer block w-full max-w-[300px] mx-auto rounded-[100px] bg-[#122D56] hover:bg-[#1A365E] px-[20px] py-[12px] text-[18px] font-semibold tracking-[-0.02em] text-white"
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
