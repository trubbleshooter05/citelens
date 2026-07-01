import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { getGeneratedBlogPosts } from "@/lib/generated-blog";

export const metadata: Metadata = buildPageMetadata({
  path: "/blog",
  title: "AI Visibility & Citation Guides | CiteLens",
  description: "Practical GEO guides for researchers and SaaS founders.",
});

export default function BlogIndexPage() {
  const posts = getGeneratedBlogPosts();
  return (
    <main className="app-shell topic-page">
      <header className="topbar">
        <Link className="brand" href="/">
          <span /> CiteLens
        </Link>
      </header>
      <section className="topic-hero">
        <h1>CiteLens Blog</h1>
        <p>AI search visibility, citations, and GEO playbooks.</p>
      </section>
      <section className="topic-grid">
        {posts.map((post) => (
          <article key={post.slug} className="topic-panel">
            <Link href={`/blog/${post.slug}`}>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
