'use client';

import { motion } from "framer-motion";
import experienceData from "@/data/experience.json";
import { Terminal } from "lucide-react";

export function ExperienceTimeline() {
    return (
        <section id="experience" className="w-full space-y-12">
            <div className="flex flex-col gap-2 border-l-4 border-primary pl-6 mb-16">
                <h2 className="text-sm font-mono tracking-widest text-primary uppercase">03 / Timeline</h2>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight">Professional Experience</h3>
                <p className="text-muted-foreground font-mono text-sm uppercase max-w-xl">Career trajectory and primary directives.</p>
            </div>

            <div className="space-y-12 border-l border-white/10 ml-4 md:ml-8 pl-8 md:pl-12 relative">
                {/* Timeline line glow */}
                <div className="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-gradient-to-b from-primary/50 via-primary/10 to-transparent" />

                {experienceData.map((job, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative group"
                    >
                        {/* Timeline Node */}
                        <div className="absolute -left-[41px] md:-left-[57px] top-1 w-4 h-4 rounded-full border-2 border-background bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] group-hover:scale-125 transition-transform" />

                        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {job.role}
                                </h3>
                                <div className="text-base font-mono text-muted-foreground mt-1 uppercase tracking-widest flex items-center gap-2">
                                    <Terminal className="w-4 h-4" />
                                    {job.company} <span className="text-white/20">|</span> {job.group}
                                </div>
                            </div>
                            <div className="text-sm font-mono text-primary/80 mt-2 md:mt-0 uppercase tracking-widest bg-primary/10 px-3 py-1 rounded border border-primary/20 inline-block w-fit">
                                {job.startDate} — {job.endDate}
                            </div>
                        </div>

                        <ul className="space-y-3 text-muted-foreground font-sans leading-relaxed text-sm md:text-base list-none pl-0">
                            {job.bullets.map((bullet, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="text-primary mt-1">▹</span>
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
