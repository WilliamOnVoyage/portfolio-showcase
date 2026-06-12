'use client';

import { motion } from "framer-motion";
import publicationsData from "@/data/publications.json";
import { BookOpen, FileBadge } from "lucide-react";

export function PublicationsList() {
    return (
        <section id="publications" className="w-full space-y-12">
            <div className="flex flex-col gap-2 border-l-4 border-primary pl-6 mb-16">
                <h2 className="text-sm font-mono tracking-widest text-primary uppercase">02 / Intel</h2>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight">Publications & Patents</h3>
                <p className="text-muted-foreground font-mono text-sm uppercase max-w-xl">Research output and registered patents.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {publicationsData.map((pub, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        viewport={{ once: true }}
                    >
                        <a 
                            href={pub.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="glass-panel p-6 rounded-xl hover:border-primary/50 transition-colors group flex gap-4 h-full block"
                        >
                        <div className="mt-1 text-primary">
                            {pub.type === "Patent" ? <FileBadge className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                                {pub.title}
                            </h3>
                            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                                <span className="bg-white/5 border border-white/10 px-2 py-1 rounded w-fit">
                                    {pub.venue}
                                </span>
                                <span className="text-primary font-bold">
                                    {pub.year}
                                </span>
                            </div>
                        </div>
                        </a>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
