import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ResourceGrid } from "@/components/ResourceGrid";
import { getDummyResources } from "@/lib/dummyResources";
import { shouldUseDummyResources } from "@/lib/featureFlags";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Information to help you understand your legal rights, recognize harm, and know your options.",
};

export const revalidate = 60;

async function getPosts() {
  if (shouldUseDummyResources()) {
    return getDummyResources();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, category, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  // Normalize slugs — strip any path prefix (e.g. "/resources/foo" → "foo")
  return (data ?? []).map((post) => ({
    ...post,
    slug: post.slug.replace(/^.*\//, ""),
  }));
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
      <section className="bg-[#1A365E] py-[40px] md:py-[60px] lg:py-[80px]">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-3xl">
            <h1 className="heading text-[32px] md:text-[42px] lg:text-[56px] leading-[120%] text-white tracking-tight">
              Resources
            </h1>
            <p className="mt-4 text-lg text-white leading-relaxed">
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
