"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle } from "lucide-react";

const HARM_TYPES = [
  "Clergy or Religious Institution Abuse",
  "Medical Abuse",
  "Online Platform Harm",
  "Social Media Addiction",
  "Juvenile Detention Abuse",
  "Foster Care Abuse",
  "Rideshare Assault",
  "Unsafe Products",
  "Other / Not Sure",
];

export function GetLegalHelpForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    harm_type: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const supabase = createClient();
      await supabase.from("lead_submissions").insert({
        lead_form_id: null as unknown as string,
        data: { ...values, source: "get-legal-help" },
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
          Your information has been submitted. A member of our team will follow
          up with you directly.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-[2px] border border-[#D1D5DB] px-4 py-3 text-sm lg:text-base text-[#122D56] placeholder:text-[#9CA3AF] outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#122D56] mb-1.5">
            First Name
          </label>
          <input
            type="text"
            placeholder="First name"
            required
            value={values.first_name}
            onChange={(e) =>
              setValues((v) => ({ ...v, first_name: e.target.value }))
            }
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#122D56] mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Last name"
            required
            value={values.last_name}
            onChange={(e) =>
              setValues((v) => ({ ...v, last_name: e.target.value }))
            }
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#122D56] mb-1.5">
          Email
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          required
          value={values.email}
          onChange={(e) =>
            setValues((v) => ({ ...v, email: e.target.value }))
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#122D56] mb-1.5">
          Phone
        </label>
        <input
          type="tel"
          placeholder="(000) 000-0000"
          required
          value={values.phone}
          onChange={(e) =>
            setValues((v) => ({ ...v, phone: e.target.value }))
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#122D56] mb-1.5">
          Type of harm
        </label>
        <select
          value={values.harm_type}
          onChange={(e) =>
            setValues((v) => ({ ...v, harm_type: e.target.value }))
          }
          className={`${inputClass} ${
            !values.harm_type ? "text-slate-warm-400" : ""
          }`}
        >
          <option value="">Select a category</option>
          {HARM_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#122D56] mb-1.5">
          Briefly describe your situation
        </label>
        <textarea
          placeholder="Share what you are comfortable sharing. There is no wrong way to start."
          rows={4}
          value={values.description}
          onChange={(e) =>
            setValues((v) => ({ ...v, description: e.target.value }))
          }
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="cursor-pointer block w-full rounded-[100px] bg-[#122D56] hover:bg-[#1A365E] px-[20px] py-[12px] text-[18px] font-semibold tracking-[-0.02em] text-white"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </span>
        ) : (
          "Submit for a Free Review"
        )}
      </button>
    </form>
  );
}
