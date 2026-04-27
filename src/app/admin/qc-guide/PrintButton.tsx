"use client";

// Small client component just for the print trigger so the rest of the
// guide can stay as a server component.

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full bg-navy-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-navy-800 transition-colors shadow-sm"
    >
      Save as PDF
    </button>
  );
}
