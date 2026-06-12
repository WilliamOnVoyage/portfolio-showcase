
'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import projectsData from "@/data/projects.json";
import profileData from "@/data/profile.json";
import { Project } from "@/types";

export function Hero() {
    const projects = projectsData as Project[];
    const totalStars = projects.reduce((acc, p) => acc + (p.stargazers_count || 0), 0);

    const [sessionTime, setSessionTime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setSessionTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <section className="min-h-[85vh] flex flex-col justify-center items-center w-full max-w-7xl mx-auto px-4 py-20 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 w-full h-full min-h-[500px]">

                {/* Main Intro Block (Large, top-left spanning) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-2 md:row-span-2 glass-panel rounded-2xl p-8 flex flex-col justify-between hud-border"
                >
                    <div className="space-y-4">
                        <div className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-mono font-bold tracking-widest rounded-full uppercase border border-primary/30">
                            {profileData.tagline}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mt-4">
                            {profileData.name}
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-lg leading-relaxed">
                            {profileData.summary}
                        </p>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <a
                            href="https://github.com/WilliamOnVoyage"
                            target="_blank"
                            className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold font-mono text-sm tracking-wide hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] uppercase"
                        >
                            View_Source()
                        </a>
                        <a
                            href={`https://${profileData.contact.linkedin}`}
                            target="_blank"
                            className="px-6 py-3 rounded-md border border-white/20 hover:border-secondary hover:text-secondary font-mono text-sm tracking-wide transition-all uppercase"
                        >
                            View_Network()
                        </a>
                    </div>
                </motion.div>

                {/* System Metrics Box */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="md:col-span-1 md:row-span-1 glass-panel rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group"
                >
                    <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest absolute top-6 left-6">System Metrics</h3>
                    <div className="mt-8 space-y-3 font-mono text-sm w-full">
                        <div className="flex justify-between items-end border-b border-white/5 pb-1">
                            <span className="text-muted-foreground text-[10px] uppercase">Deployments</span>
                            <span className="text-primary font-bold text-base leading-none">{projects.length}</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-white/5 pb-1">
                            <span className="text-muted-foreground text-[10px] uppercase">Impact (Stars)</span>
                            <span className="text-primary font-bold text-base leading-none">{totalStars}</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-white/5 pb-1">
                            <span className="text-muted-foreground text-[10px] uppercase">Session Time</span>
                            <span className="text-primary font-bold text-base leading-none">{formatTime(sessionTime)}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-muted-foreground text-[10px] uppercase">Primary Logic</span>
                            <span className="text-primary font-bold text-base leading-none">Python/TS</span>
                        </div>
                    </div>
                </motion.div>

                {/* Core Competencies Box */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:col-span-1 md:row-span-1 glass-panel rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden"
                >
                    <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest absolute top-6 left-6">Achievements</h3>
                    <div className="mt-8 space-y-4 font-mono text-xs w-full">
                        {profileData.achievements.slice(0, 4).map((ach, i) => (
                            <div key={i} className="flex gap-3 text-muted-foreground">
                                <span className="text-primary">▹</span>
                                <span>{ach.title}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Bottom Status Bar (Wide spanning bottom row) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="md:col-span-2 md:row-span-1 glass-panel rounded-2xl p-6 flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                        <span className="font-mono text-sm tracking-wide">Status: Fully Operational</span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground hidden lg:block">Sys.Uptime: 99.99%</span>
                </motion.div>

            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-6 animate-bounce"
            >
                <a href="#featured" aria-label="Scroll Down">
                    <ArrowDown className="text-muted-foreground w-6 h-6 hover:text-white transition-colors" />
                </a>
            </motion.div>
        </section>
    );
}
