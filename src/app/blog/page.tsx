'use client';

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { NavBar } from "@/components/NavBar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { BlogCard } from "@/components/BlogCard";
import { getAllPosts, getAllTags } from "@/lib/blogs";
import { motion } from "framer-motion";
import { Search, BookOpen, Sparkles, Filter } from "lucide-react";

const BlackHoleBackground = dynamic(
  () => import("@/components/BlackHole").then((mod) => mod.BlackHoleBackground),
  { ssr: false }
);

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag =
        selectedTag === "All" || post.tags.includes(selectedTag);
      const matchesQuery =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesTag && matchesQuery;
    });
  }, [posts, selectedTag, searchQuery]);

  const featuredPost = posts.find((p) => p.featured) || posts[0];

  return (
    <main className="min-h-screen text-foreground relative overflow-hidden pt-16">
      <NavBar />
      <BlackHoleBackground />
      <ThemeSwitcher />

      <div className="container mx-auto px-4 py-16 space-y-16 z-10 relative max-w-7xl">
        {/* Header Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary text-xs font-mono font-bold tracking-widest rounded-full uppercase border border-primary/30">
            <BookOpen className="w-3.5 h-3.5" /> Engineering & Architecture Logs
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Technical Insights & Thought Leadership
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Deep dives into AI infrastructure, scalable model serving, smart contract verifiers, and pragmatic software engineering lessons from 10+ years in technology.
          </p>
        </motion.div>

        {/* Featured Article Spotlight */}
        {featuredPost && selectedTag === "All" && searchQuery === "" && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary font-bold">
              <Sparkles className="w-4 h-4" /> Spotlight Article
            </div>
            <BlogCard post={featuredPost} featured={true} />
          </motion.section>
        )}

        {/* Search & Tag Filter Bar */}
        <div className="space-y-6 glass-panel rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles by keyword or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background/50 border border-white/10 text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
              />
            </div>

            {/* Total Results Count */}
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-primary" />
              Showing {filteredPosts.length} of {posts.length} Articles
            </div>
          </div>

          {/* Tags Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => setSelectedTag("All")}
              className={`px-4 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all ${
                selectedTag === "All"
                  ? "bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  : "border border-white/10 text-muted-foreground hover:border-secondary hover:text-secondary bg-transparent"
              }`}
            >
              All Topics
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all ${
                  selectedTag === tag
                    ? "bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    : "border border-white/10 text-muted-foreground hover:border-secondary hover:text-secondary bg-transparent"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <section className="space-y-6">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass-panel rounded-2xl border border-white/10 space-y-4">
              <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
                No matching articles found for &quot;{searchQuery || selectedTag}&quot;
              </p>
              <button
                onClick={() => {
                  setSelectedTag("All");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-xs uppercase font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </div>

      <footer className="py-12 text-center text-xs font-mono uppercase tracking-widest text-muted-foreground border-t border-white/10 relative z-10 glass-panel mt-32">
        <p>
          SYSTEM.HALT // © {new Date().getFullYear()} WILLIAM_ON_VOYAGE. ALL DATA ENCRYPTED.
        </p>
      </footer>
    </main>
  );
}
