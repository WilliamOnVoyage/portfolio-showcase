
'use client';

import { motion } from "framer-motion";
import { ArrowDown, Code2, Database, Cpu, Globe } from "lucide-react";

export function Hero() {
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
                            System Online
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mt-4">
                            Engineered<br/>Elegance
                        </h1>
                        <p className="text-lg text-muted-foreground mt-4 max-w-md">
                            Hi, I&apos;m William. I specialized in highly scalable machine learning systems, generative AI, blockchain, and data analytics.
                        </p>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <a
                            href="#featured"
                            className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold font-mono text-sm tracking-wide hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] uppercase"
                        >
                            Execute_Run()
                        </a>
                        <a
                            href="https://github.com/WilliamOnVoyage"
                            target="_blank"
                            className="px-6 py-3 rounded-md border border-white/20 hover:border-secondary hover:text-secondary font-mono text-sm tracking-wide transition-all uppercase"
                        >
                            View_Source()
                        </a>
                    </div>
                </motion.div>

                {/* Tech Stack Ticker Box */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="md:col-span-1 md:row-span-1 glass-panel rounded-2xl p-6 flex flex-col justify-center items-center group relative overflow-hidden"
                >
                    <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4 absolute top-6 left-6">Vitals</h3>
                    <div className="flex gap-4 items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                        <Cpu className="w-8 h-8 opacity-80" />
                        <Database className="w-8 h-8 opacity-80" />
                        <Code2 className="w-8 h-8 opacity-80" />
                    </div>
                </motion.div>

                {/* Live Stat / Location Box */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:col-span-1 md:row-span-1 glass-panel rounded-2xl p-6 flex flex-col justify-center items-start relative overflow-hidden"
                >
                    <Globe className="absolute -bottom-4 -right-4 w-32 h-32 opacity-5 text-secondary" />
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Location</span>
                    <span className="text-xl font-bold">Earth<br/>Sector 01</span>
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
