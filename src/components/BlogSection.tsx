'use client';

import { BlogPost } from "@/types";
import { BlogCard } from "./BlogCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  const displayPosts = posts.slice(0, 3);

  return (
    <motion.section
      id="insights"
      className="space-y-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-primary pl-6">
        <div className="space-y-2">
          <h2 className="text-sm font-mono tracking-widest text-primary uppercase flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> 02 / Insights
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight">
            Technical Writings & Architecture Logs
          </h3>
          <p className="text-muted-foreground font-mono text-sm uppercase max-w-xl">
            Deep dives into AI infrastructure, smart contract verifiers, real-time inference, and 0-to-1 systems engineering.
          </p>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-white/20 hover:border-secondary hover:text-secondary font-mono text-xs uppercase tracking-widest transition-all bg-transparent self-start md:self-auto shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
        >
          <span>View All Articles</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </motion.section>
  );
}
