'use client';

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { NavBar } from "@/components/NavBar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { ShareButtons } from "@/components/ShareButtons";
import { BlogPost } from "@/types";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, List } from "lucide-react";

const BlackHoleBackground = dynamic(
  () => import("@/components/BlackHole").then((mod) => mod.BlackHoleBackground),
  { ssr: false }
);

interface ArticleContentProps {
  post: BlogPost;
}

export function ArticleContent({ post }: ArticleContentProps) {
  // Extract Table of Contents headings from Markdown content
  const headings = useMemo(() => {
    const lines = post.content.split("\n");
    return lines
      .filter((line) => line.startsWith("## ") || line.startsWith("### "))
      .map((line) => {
        const level = line.startsWith("### ") ? 3 : 2;
        const text = line.replace(/^###?\s+/, "");
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        return { level, text, id };
      });
  }, [post.content]);

  return (
    <main className="min-h-screen text-foreground relative overflow-hidden pt-16">
      <NavBar />
      <BlackHoleBackground />
      <ThemeSwitcher />

      <div className="container mx-auto px-4 py-12 space-y-12 z-10 relative max-w-6xl">
        {/* Navigation back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-md glass-panel border border-white/10 hover:border-primary/40"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Articles
          </Link>
        </motion.div>

        {/* Article Header Card */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-2xl p-8 md:p-10 space-y-6 border border-white/10 hud-border relative overflow-hidden"
        >
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-md bg-primary/20 border border-primary/40 text-primary font-mono text-xs uppercase tracking-wider font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Article Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Article Subtitle / Description */}
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {post.description}
          </p>

          {/* Meta Details Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
            {post.author && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary text-xs">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-foreground block">
                    {post.author.name}
                  </span>
                  {post.author.role && (
                    <span className="text-[11px] text-muted-foreground">
                      {post.author.role}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs font-mono uppercase">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {post.readTime}
              </span>
            </div>
          </div>
        </motion.header>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-8 glass-panel rounded-2xl p-8 md:p-10 border border-white/10 space-y-6 prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-3 prose-h3:text-xl prose-a:text-primary hover:prose-a:underline prose-code:text-secondary prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl font-sans leading-relaxed"
          >
            <ReactMarkdown
              components={{
                h2: ({ children }) => {
                  const text = String(children);
                  const id = text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-");
                  return (
                    <h2
                      id={id}
                      className="text-2xl font-bold tracking-tight border-b border-white/10 pb-3 mt-8 mb-4 text-foreground flex items-center gap-2"
                    >
                      <span className="text-primary">#</span> {children}
                    </h2>
                  );
                },
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold tracking-tight mt-6 mb-3 text-foreground">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-muted-foreground leading-relaxed my-4 text-base">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 space-y-2 my-4 text-muted-foreground text-base">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 space-y-2 my-4 text-muted-foreground text-base">
                    {children}
                  </ol>
                ),
                code: ({ children }) => (
                  <code className="font-mono text-sm bg-white/10 text-secondary px-1.5 py-0.5 rounded border border-white/10">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="font-mono text-xs md:text-sm bg-black/70 border border-white/10 p-4 rounded-xl overflow-x-auto my-6 text-foreground shadow-inner">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 py-1 my-4 italic text-muted-foreground bg-primary/5 rounded-r-lg font-mono text-sm">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </motion.article>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Share Buttons Card */}
            <ShareButtons title={post.title} />

            {/* Table of Contents Card */}
            {headings.length > 0 && (
              <div className="glass-panel rounded-xl p-5 space-y-3 font-mono border border-white/10">
                <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-widest border-b border-white/10 pb-2">
                  <List className="w-4 h-4" />
                  <span>Table of Contents</span>
                </div>
                <nav className="space-y-2 text-xs">
                  {headings.map((h, idx) => (
                    <a
                      key={idx}
                      href={`#${h.id}`}
                      className={`block text-muted-foreground hover:text-primary transition-colors py-1 ${
                        h.level === 3 ? "pl-4 text-[11px]" : "font-semibold"
                      }`}
                    >
                      • {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </aside>
        </div>
      </div>

      <footer className="py-12 text-center text-xs font-mono uppercase tracking-widest text-muted-foreground border-t border-white/10 relative z-10 glass-panel mt-32">
        <p>
          SYSTEM.HALT // © {new Date().getFullYear()} WILLIAM_ON_VOYAGE. ALL DATA ENCRYPTED.
        </p>
      </footer>
    </main>
  );
}
