
'use client';

import dynamic from "next/dynamic";
import projectsData from "@/data/projects.json";
import { Project } from "@/types";
import { Hero } from "@/components/Hero";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProjectCard } from "@/components/ProjectCard";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { motion } from "framer-motion";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { PublicationsList } from "@/components/PublicationsList";
import { NavBar } from "@/components/NavBar";

const BlackHoleBackground = dynamic(() => import("@/components/BlackHole").then(mod => mod.BlackHoleBackground), {
  ssr: false,
});

export default function Home() {
  const allProjects = projectsData as Project[];
  const projects = allProjects.filter(p => !p.hidden);

  // Define Featured Projects explicitly via override `featured: true` or manual check
  const featured = projects.filter(p => p.featured);

  // The rest (Archive)
  const archive = projects.filter(p => !p.featured && p.category !== "Professional Collaboration" && p.category !== "Project Aegis Suite");

  return (
    <main className="min-h-screen text-foreground relative overflow-hidden pt-16">
      <NavBar />
      <BlackHoleBackground />
      <Hero />
      <ThemeSwitcher />

      <div className="container mx-auto px-4 py-16 space-y-32 z-10 relative">
        {/* Featured Section */}
        {featured.length > 0 && (
          <motion.section
            id="featured"
            className="space-y-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex flex-col gap-2 border-l-4 border-primary pl-6">
                <h2 className="text-sm font-mono tracking-widest text-primary uppercase">01 / Vanguard</h2>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight">Featured Operations</h3>
              <p className="text-muted-foreground font-mono text-sm uppercase max-w-xl">Detailed tactical breakdowns of primary architecture and deployments.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featured.map(p => (
                <div key={p.id} className="md:col-span-1">
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <PublicationsList />

        <ExperienceTimeline />

        {/* Archive Section with Filter */}
        <motion.section
          id="archive"
          className="space-y-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col gap-2 border-l-4 border-white/20 pl-6">
            <h2 className="text-sm font-mono tracking-widest text-muted-foreground uppercase">04 / Database</h2>
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight">The Archive</h3>
            <p className="text-muted-foreground font-mono text-sm uppercase max-w-xl">Comprehensive system logs of all minor projects and exercises.</p>
          </div>
          <ProjectGrid projects={archive} />
        </motion.section>
      </div>

      <footer className="py-12 text-center text-xs font-mono uppercase tracking-widest text-muted-foreground border-t border-white/10 relative z-10 glass-panel mt-32">
        <p>SYSTEM.HALT // © {new Date().getFullYear()} WILLIAM_ON_VOYAGE. ALL DATA ENCRYPTED.</p>
      </footer>
    </main>
  );
}
