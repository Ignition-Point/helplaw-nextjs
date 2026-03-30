import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ResourceGrid } from "@/components/ResourceGrid";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Information to help you understand your legal rights, recognize harm, and know your options.",
};

export const revalidate = 60;

async function getPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, category, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data ?? [];
}

export default async function ResourcesPage() {
  const posts = await getPosts();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Resources" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Resources
            </h1>
            <p className="mt-4 text-lg text-navy-200 leading-relaxed">
              Information to help you understand your legal rights, recognize
              harm, and know your options — before you decide anything.
            </p>
          </div>
        </div>
      </section>

      {/* Blog post feed with search + filters */}
      <ResourceGrid posts={posts} />
    </>
  );
}
