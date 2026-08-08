import postsFile from "@/content/blog/generated-posts.json";

export type GeneratedBlogPost = {
  slug: string;
  title: string;
  description: string;
  contentMarkdown: string;
  contentHtml: string;
  keywords: string[];
  cta: string;
  audience: string;
  internalLinks: { text: string; url: string }[];
  publishedAt: string;
  url: string;
  topicKey?: string;
};

type PostsFile = { posts: GeneratedBlogPost[] };

const data = postsFile as PostsFile;

const FILLER_PREFIXES = [
  "the ultimate guide to ",
  "ultimate guide to ",
  "complete guide to ",
  "a complete guide to ",
];

function normalizeText(value: string): string {
  let text = (value || "").toLowerCase().trim();
  text = text.replace(/\b(19|20)\d{2}\b/g, "");
  text = text.replace(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/g,
    ""
  );
  text = text.replace(/[^a-z0-9\s]/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  for (const prefix of FILLER_PREFIXES) {
    if (text.startsWith(prefix)) {
      text = text.slice(prefix.length).trim();
    }
  }
  return text;
}

function slugBase(slug: string): string {
  return (slug || "").trim().toLowerCase().replace(/-\d{4}-\d{2}-\d{2}$/, "");
}

function topicKey(post: GeneratedBlogPost): string {
  if (post.topicKey) {
    return normalizeText(post.topicKey).replace(/\s+/g, "-");
  }
  const base = slugBase(post.slug);
  if (base) return base;
  const keywords = post.keywords ?? [];
  const specific = keywords[keywords.length - 1];
  if (specific) {
    return normalizeText(specific).replace(/\s+/g, "-");
  }
  return normalizeText(post.title).replace(/\s+/g, "-");
}

function dedupePosts(posts: GeneratedBlogPost[]): GeneratedBlogPost[] {
  const best = new Map<string, GeneratedBlogPost>();
  const order: string[] = [];
  for (const post of posts) {
    const key = topicKey(post) || post.slug;
    if (!best.has(key)) order.push(key);
    const prev = best.get(key);
    if (
      !prev ||
      new Date(post.publishedAt).getTime() > new Date(prev.publishedAt).getTime()
    ) {
      best.set(key, post);
    }
  }
  return order
    .map((key) => best.get(key)!)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getGeneratedBlogPosts(): GeneratedBlogPost[] {
  return dedupePosts([...(data.posts ?? [])]);
}

export function getGeneratedBlogPost(slug: string): GeneratedBlogPost | null {
  return (data.posts ?? []).find((p) => p.slug === slug) ?? null;
}

export function getGeneratedBlogSlugs(): string[] {
  return (data.posts ?? []).map((p) => p.slug);
}
