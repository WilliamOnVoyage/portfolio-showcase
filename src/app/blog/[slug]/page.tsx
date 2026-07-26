import { getPostBySlug, getAllPosts } from "@/lib/blogs";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/ArticleContent";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <ArticleContent post={post} />;
}
