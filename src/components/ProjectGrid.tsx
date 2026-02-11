
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
            <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                            filter === category
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
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
