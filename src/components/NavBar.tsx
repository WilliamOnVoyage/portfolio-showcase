'use client';

import { motion } from "framer-motion";

export function NavBar() {
    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 bg-background/80 backdrop-blur-md"
        >
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2.5 text-foreground font-bold tracking-wider font-mono text-base hover:text-primary transition-colors group">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-950 text-white font-mono text-sm font-black border border-white/10 shadow-sm group-hover:border-primary/50 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all">
                        <span className="text-blue-400">&gt;</span><span className="text-emerald-400">_</span>
                    </span>
                    <span className="tracking-tight text-lg font-bold text-foreground">Moliang</span>
                </a>
                
                <div className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    <a href="/#featured" className="hover:text-primary transition-colors">Projects</a>
                    <a href="/#insights" className="hover:text-primary transition-colors">Insights</a>
                    <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
                    <a href="/#publications" className="hover:text-primary transition-colors">Publications</a>
                    <a href="/#experience" className="hover:text-primary transition-colors">Experience</a>
                </div>

            </div>
        </motion.nav>
    );
}
