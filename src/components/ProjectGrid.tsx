
'use client';

import { Project } from "@/types";
import { useState, useMemo } from "react";
import { ProjectCard } from "./ProjectCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProjectGridProps {
    projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
    const [filter, setFilter] = useState("All");

    const categories = ["All", ...Array.from(new Set(projects.map(p => p.category || "Other"))).filter(c => c !== "Other"), "Other"];

    const filteredProjects = useMemo(() => {
        if (filter === "All") return projects;
        return projects.filter(p => (p.category || "Other") === filter);
    }, [projects, filter]);

    return (
        <section className="space-y-8">
            <div className="flex flex-wrap gap-3 justify-center">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={cn(
                            "px-5 py-2 rounded-md font-mono text-xs uppercase tracking-widest transition-all",
                            filter === category
                                ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                : "border border-white/20 text-muted-foreground hover:border-secondary hover:text-secondary hover:shadow-[0_0_15px_rgba(255,100,0,0.2)] bg-transparent"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
