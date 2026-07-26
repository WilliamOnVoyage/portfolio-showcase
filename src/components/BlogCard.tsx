'use client';

import { BlogPost } from "@/types";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`glass-panel rounded-xl p-6 relative flex flex-col justify-between overflow-hidden group border border-border/50 dark:border-white/10 hover:border-secondary dark:hover:border-primary/50 transition-all duration-300 shadow-md ${
        featured ? "md:col-span-2 bg-secondary/5 dark:bg-primary/5 border-secondary/30 dark:border-primary/30" : ""
      }`}
    >
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/10 dark:bg-primary/10 rounded-full blur-3xl group-hover:bg-secondary/20 dark:group-hover:bg-primary/20 transition-all duration-500 pointer-events-none" />

      <div className="space-y-4 relative z-10">
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-foreground/70 dark:text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            {post.featured && (
              <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 dark:bg-primary/20 text-secondary dark:text-primary border border-secondary/30 dark:border-primary/30 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Featured Post
              </span>
            )}
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-md bg-secondary/15 dark:bg-white/5 border border-secondary/25 dark:border-white/10 text-xs font-mono uppercase tracking-wider text-secondary font-bold"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono uppercase text-foreground/70 dark:text-muted-foreground font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-secondary dark:text-primary" />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-secondary dark:text-primary" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`} className="block group">
          <h3
            className={`font-bold tracking-tight text-foreground group-hover:text-secondary dark:group-hover:text-primary transition-colors flex items-start justify-between gap-2 ${
              featured ? "text-2xl md:text-3xl" : "text-xl"
            }`}
          >
            <span>{post.title}</span>
            <ArrowUpRight className="w-5 h-5 text-foreground/50 dark:text-muted-foreground group-hover:text-secondary dark:group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0 mt-1" />
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-foreground/80 dark:text-muted-foreground leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>

      {/* Footer & Read Link */}
      <div className="pt-6 mt-6 border-t border-border/50 dark:border-white/10 flex items-center justify-end relative z-10 font-mono text-xs">
        <Link
          href={`/blog/${post.slug}`}
          className="text-secondary dark:text-primary hover:opacity-80 font-bold uppercase tracking-wider text-xs flex items-center gap-1 group-hover:underline"
        >
          Read Article →
        </Link>
      </div>
    </motion.div>
  );
}
