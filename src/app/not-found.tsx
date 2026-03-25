import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-32 text-center">
      <div className="mx-auto max-w-lg px-4">
        <h1 className="text-6xl font-bold text-navy-200">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-navy-900">Page Not Found</h2>
        <p className="mt-3 text-base text-slate-warm-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-navy-800 px-7 py-3 text-sm font-semibold text-white hover:bg-navy-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
