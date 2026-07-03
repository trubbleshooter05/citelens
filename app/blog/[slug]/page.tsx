import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo-metadata";
import {
  getGeneratedBlogPost,
  getGeneratedBlogSlugs,
} from "@/lib/generated-blog";
import { getSiteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getGeneratedBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getGeneratedBlogPost(slug);
  if (!post) return { title: "Not found | CiteLens" };
  return buildPageMetadata({
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getGeneratedBlogPost(slug);
  if (!post) notFound();
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: "CiteLens" },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <main className="app-shell topic-page">
      <header className="topbar">
        <Link className="brand" href="/">
          <span /> CiteLens
        </Link>
        <nav>
          <Link href="/blog">Blog</Link>
          <Link href="/#pricing">Pricing</Link>
        </nav>
      </header>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="topic-hero">
        <p className="eyebrow">CiteLens blog</p>
        <h1>{post.title}</h1>
        <p>{post.description}</p>
      </section>
      <section className="topic-panel">
        <article
          className="blog-article"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
        {post.cta ? <p className="mt-8">{post.cta}</p> : null}
      </section>
    </main>
  );
}
