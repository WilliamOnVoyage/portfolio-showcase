import blogsData from "@/data/blogs.json";
import { BlogPost } from "@/types";

export function getAllPosts(): BlogPost[] {
  return (blogsData as BlogPost[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return (blogsData as BlogPost[]).find((post) => post.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  const posts = getAllPosts();
  const featured = posts.filter((p) => p.featured);
  if (featured.length > 0) return featured;
  return posts.slice(0, 2);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet);
}
